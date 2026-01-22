import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// SMTP Configuration from environment variables
const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USER = Deno.env.get("SMTP_USER");
const SMTP_PASS = Deno.env.get("SMTP_PASS");

// Primary sender email
const PRIMARY_EMAIL = "caremattershub@gmail.com";

// Owner emails - always CC'd on all emails
const OWNER_EMAILS = [
  "shubh@caremattershub.com.au",
  "sunil@caremattershub.com.au"
];

// All recipient emails for internal notifications
const RECIPIENT_EMAILS = [PRIMARY_EMAIL, ...OWNER_EMAILS];

// Allowed origins for CORS - production domains only (no localhost)
const ALLOWED_ORIGINS = [
  "https://caremattershub.com.au",
  "https://www.caremattershub.com.au",
  "https://caremattershub.lovable.app",
  "https://id-preview--d09202c5-b5db-4cde-ba44-328959322614.lovable.app"
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

// Rate limiting: In-memory store (resets on function cold start, but provides protection)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per hour per IP

const checkRateLimit = (clientIp: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp);

  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
};

interface Attachment {
  base64: string;
  mimeType: string;
  filename: string;
}

interface NotificationRequest {
  type: 'registration' | 'feedback' | 'contact' | 'job_application';
  data: Record<string, unknown>;
  attachment?: Attachment;
}

const escapeHtml = (text: unknown): string => {
  const str = String(text ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const validateInput = (value: unknown, maxLength: number = 1000): string => {
  const str = String(value ?? '').trim();
  if (str.length > maxLength) {
    return str.substring(0, maxLength);
  }
  return str;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidType = (type: string): type is NotificationRequest['type'] => {
  return ['registration', 'feedback', 'contact', 'job_application'].includes(type);
};

// Base64 encode for SMTP AUTH
const base64Encode = (str: string): string => {
  return btoa(str);
};

// Send email using raw SMTP with STARTTLS (with optional attachment)
const sendEmail = async (to: string[], subject: string, html: string, cc: string[] = [], attachment?: Attachment): Promise<void> => {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP credentials not configured");
  }

  console.log(`Connecting to ${SMTP_HOST}:${SMTP_PORT}...`);
  
  // Connect to SMTP server
  const tcpConn = await Deno.connect({
    hostname: SMTP_HOST,
    port: SMTP_PORT,
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Use a mutable reference that can switch between TCP and TLS
  let conn: Deno.Conn = tcpConn;

  const read = async (): Promise<string> => {
    const buffer = new Uint8Array(1024);
    const n = await conn.read(buffer);
    if (n === null) throw new Error("Connection closed");
    const response = decoder.decode(buffer.subarray(0, n));
    console.log("S:", response.trim());
    return response;
  };

  const write = async (cmd: string): Promise<void> => {
    console.log("C:", cmd.trim());
    await conn.write(encoder.encode(cmd));
  };

  try {
    // Read greeting
    await read();

    // Send EHLO
    await write(`EHLO ${SMTP_HOST}\r\n`);
    await read();

    // Start TLS
    await write("STARTTLS\r\n");
    const tlsResponse = await read();
    if (!tlsResponse.startsWith("220")) {
      throw new Error("STARTTLS failed: " + tlsResponse);
    }

    // Upgrade connection to TLS
    const tlsConn = await Deno.startTls(tcpConn, { hostname: SMTP_HOST });
    conn = tlsConn;
    console.log("TLS connection established");

    // Send EHLO again after TLS
    await write(`EHLO ${SMTP_HOST}\r\n`);
    await read();

    // Authenticate with AUTH LOGIN
    await write("AUTH LOGIN\r\n");
    const authResponse = await read();
    if (!authResponse.startsWith("334")) {
      throw new Error("AUTH LOGIN failed: " + authResponse);
    }

    // Send username (base64)
    await write(base64Encode(SMTP_USER) + "\r\n");
    const userResponse = await read();
    if (!userResponse.startsWith("334")) {
      throw new Error("Username rejected: " + userResponse);
    }

    // Send password (base64)
    await write(base64Encode(SMTP_PASS) + "\r\n");
    const passResponse = await read();
    if (!passResponse.startsWith("235")) {
      throw new Error("Authentication failed: " + passResponse);
    }

    console.log("SMTP authenticated successfully");

    // MAIL FROM - always send from primary email
    await write(`MAIL FROM:<${SMTP_USER}>\r\n`);
    const fromResponse = await read();
    if (!fromResponse.startsWith("250")) {
      throw new Error("MAIL FROM failed: " + fromResponse);
    }

    // RCPT TO for each recipient (to + cc)
    const allRecipients = [...to, ...cc];
    for (const recipient of allRecipients) {
      await write(`RCPT TO:<${recipient}>\r\n`);
      const rcptResponse = await read();
      if (!rcptResponse.startsWith("250")) {
        console.error(`RCPT TO failed for ${recipient}: ${rcptResponse}`);
      }
    }

    // DATA
    await write("DATA\r\n");
    const dataResponse = await read();
    if (!dataResponse.startsWith("354")) {
      throw new Error("DATA failed: " + dataResponse);
    }

    // Email headers and body - use mixed for attachments, alternative for text/html only
    const boundary = "----=_Part_" + Date.now();
    const altBoundary = "----=_Alt_" + Date.now();
    
    const emailHeaders = [
      `From: Care Matters Hub <${PRIMARY_EMAIL}>`,
      `To: ${to.join(", ")}`,
    ];
    
    // Add CC header if there are CC recipients
    if (cc.length > 0) {
      emailHeaders.push(`Cc: ${cc.join(", ")}`);
    }
    
    emailHeaders.push(
      `Subject: ${subject}`,
      "MIME-Version: 1.0"
    );

    let emailContent: string;

    if (attachment) {
      // Multipart/mixed with attachment
      emailHeaders.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
      
      // Break base64 into 76-char lines for MIME compliance
      const formattedBase64 = attachment.base64.match(/.{1,76}/g)?.join("\r\n") || attachment.base64;
      
      emailContent = [
        ...emailHeaders,
        "",
        `--${boundary}`,
        `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
        "",
        `--${altBoundary}`,
        "Content-Type: text/plain; charset=utf-8",
        "Content-Transfer-Encoding: 7bit",
        "",
        "Please view this email in an HTML-compatible email client.",
        "",
        `--${altBoundary}`,
        "Content-Type: text/html; charset=utf-8",
        "Content-Transfer-Encoding: 7bit",
        "",
        html,
        "",
        `--${altBoundary}--`,
        "",
        `--${boundary}`,
        `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"`,
        "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${attachment.filename}"`,
        "",
        formattedBase64,
        "",
        `--${boundary}--`,
        "",
        ".\r\n"
      ].join("\r\n");
    } else {
      // No attachment - simple multipart/alternative
      emailHeaders.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
      
      emailContent = [
        ...emailHeaders,
        "",
        `--${boundary}`,
        "Content-Type: text/plain; charset=utf-8",
        "Content-Transfer-Encoding: 7bit",
        "",
        "Please view this email in an HTML-compatible email client.",
        "",
        `--${boundary}`,
        "Content-Type: text/html; charset=utf-8",
        "Content-Transfer-Encoding: 7bit",
        "",
        html,
        "",
        `--${boundary}--`,
        "",
        ".\r\n"
      ].join("\r\n");
    }

    await write(emailContent);
    const sendResponse = await read();
    if (!sendResponse.startsWith("250")) {
      throw new Error("Send failed: " + sendResponse);
    }

    // QUIT
    await write("QUIT\r\n");
    try { await read(); } catch { /* ignore quit response */ }

    console.log(`Email sent successfully to: ${to.join(', ')}${cc.length > 0 ? ` (CC: ${cc.join(', ')})` : ''}`);
  } finally {
    try { conn.close(); } catch { /* ignore close errors */ }
  }
};

// Get admin notification email subject based on form type
const getAdminEmailSubject = (type: string): string => {
  switch (type) {
    case 'registration':
      return 'New User Registration – Care Matters Hub';
    case 'feedback':
      return 'New Feedback Received – Care Matters Hub';
    case 'contact':
      return 'New Contact Query – Care Matters Hub';
    case 'job_application':
      return 'New Job Application – Care Matters Hub';
    default:
      return 'New Form Submission – Care Matters Hub';
  }
};

const getAdminEmailContent = (type: string, data: Record<string, unknown>) => {
  const subject = getAdminEmailSubject(type);
  
  switch (type) {
    case 'registration':
      return {
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Care Matters Hub</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0e7490; margin-top: 0;">New User Registration</h2>
              <p style="color: #334155;">A new service registration has been submitted:</p>
              <table style="border-collapse: collapse; width: 100%; background: white; border-radius: 8px; overflow: hidden;">
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.fullName, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.email, 255))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.phone, 20))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Service:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.service, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Address:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.address, 500))}</td></tr>
                ${data.intakeSource ? `<tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>How they found us:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.intakeSource, 100))}</td></tr>` : ''}
                ${data.notes ? `<tr><td style="padding: 12px;"><strong>Notes:</strong></td><td style="padding: 12px;">${escapeHtml(validateInput(data.notes, 1000))}</td></tr>` : ''}
              </table>
              <p style="margin-top: 20px; color: #334155;">Please follow up with the client within 1-2 business days.</p>
            </div>
            <div style="background: #0e7490; padding: 15px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Care Matters Hub. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case 'feedback':
      return {
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Care Matters Hub</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0e7490; margin-top: 0;">New Feedback Received</h2>
              <p style="color: #334155;">A customer has submitted feedback:</p>
              <table style="border-collapse: collapse; width: 100%; background: white; border-radius: 8px; overflow: hidden;">
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Customer Name:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.customerName, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Service Received:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.serviceTaken, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Rating:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.rating, 1))}/5 ⭐</td></tr>
                <tr><td style="padding: 12px;"><strong>Feedback:</strong></td><td style="padding: 12px;">${escapeHtml(validateInput(data.feedback, 2000))}</td></tr>
              </table>
            </div>
            <div style="background: #0e7490; padding: 15px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Care Matters Hub. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case 'contact':
      return {
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Care Matters Hub</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0e7490; margin-top: 0;">New Contact Query</h2>
              <p style="color: #334155;">Someone has reached out through the contact form:</p>
              <table style="border-collapse: collapse; width: 100%; background: white; border-radius: 8px; overflow: hidden;">
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.name, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.email, 255))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.phone, 20)) || 'Not provided'}</td></tr>
                <tr><td style="padding: 12px;"><strong>Message:</strong></td><td style="padding: 12px;">${escapeHtml(validateInput(data.message, 2000))}</td></tr>
              </table>
              <p style="margin-top: 20px; color: #334155;">Please respond to this inquiry promptly.</p>
            </div>
            <div style="background: #0e7490; padding: 15px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Care Matters Hub. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case 'job_application':
      return {
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Care Matters Hub</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0e7490; margin-top: 0;">New Job Application</h2>
              <p style="color: #334155;">A job application has been submitted:</p>
              <table style="border-collapse: collapse; width: 100%; background: white; border-radius: 8px; overflow: hidden;">
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.fullName, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.email, 255))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.phone, 20))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Position:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.position, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top;"><strong>Work Experience:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.workExperience, 2000))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Resume:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.resumeFileName, 255))}</td></tr>
                ${data.message ? `<tr><td style="padding: 12px;"><strong>Message:</strong></td><td style="padding: 12px;">${escapeHtml(validateInput(data.message, 2000))}</td></tr>` : ''}
              </table>
              <p style="margin-top: 20px; color: #334155;">Review the application and resume, then follow up within 5-7 business days.</p>
            </div>
            <div style="background: #0e7490; padding: 15px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Care Matters Hub. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    default:
      return {
        subject,
        html: `<h2>New Form Submission</h2><pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`,
      };
  }
};

const getUserConfirmationEmail = (type: string, data: Record<string, unknown>) => {
  switch (type) {
    case 'registration':
      return {
        subject: 'Welcome to Care Matters Hub – Your Service Registration is Successful',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Care Matters Hub</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Quality Care, Every Day</p>
            </div>
            <div style="padding: 40px 30px; background: #ffffff;">
              <h2 style="color: #0e7490; margin-top: 0;">Welcome to Care Matters Hub!</h2>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Dear ${escapeHtml(validateInput(data.fullName, 100))},
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Thank you for registering with Care Matters Hub. We're delighted to have you join our community of care.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Your registration for <strong>${escapeHtml(validateInput(data.service, 100))}</strong> has been successfully received. Our team will review your request and contact you shortly to discuss the next steps.
              </p>
              <div style="background: #f0fdfa; border-left: 4px solid #0e7490; padding: 15px 20px; margin: 25px 0;">
                <p style="color: #0e7490; margin: 0; font-weight: 600;">What happens next?</p>
                <ul style="color: #334155; margin: 10px 0 0 0; padding-left: 20px;">
                  <li>A member of our team will call you within 1-2 business days</li>
                  <li>We'll discuss your specific care requirements</li>
                  <li>We'll match you with the right support services</li>
                </ul>
              </div>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Rest assured, your personal details are kept safe and confidential. We take your privacy seriously.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                If you have any questions in the meantime, please contact us:
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                📞 <a href="tel:0493457047" style="color: #0e7490;">0493 457 047</a><br>
                ✉️ <a href="mailto:caremattershub@gmail.com" style="color: #0e7490;">caremattershub@gmail.com</a>
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Warm regards,<br>
                <strong>The Care Matters Hub Team</strong>
              </p>
            </div>
            <div style="background: #0e7490; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px;">
                <a href="https://caremattershub.com.au" style="color: white;">caremattershub.com.au</a>
              </p>
              <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Care Matters Hub. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

    case 'feedback':
      return {
        subject: 'Thank You for Your Feedback – Care Matters Hub',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Care Matters Hub</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Quality Care, Every Day</p>
            </div>
            <div style="padding: 40px 30px; background: #ffffff;">
              <h2 style="color: #0e7490; margin-top: 0;">Thank You for Your Feedback!</h2>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Dear ${escapeHtml(validateInput(data.customerName, 100))},
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Thank you sincerely for taking the time to share your feedback with us. Your thoughts and opinions are invaluable to our team.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                We want you to know that your message has been successfully received. Your feedback helps us understand how we can continue to improve our services and provide the best possible care for our clients.
              </p>
              <div style="background: #f0fdfa; border-left: 4px solid #0e7490; padding: 15px 20px; margin: 25px 0;">
                <p style="color: #334155; margin: 0;">
                  <strong style="color: #0e7490;">Your feedback matters:</strong> All feedback is reviewed by our management team to ensure we're constantly improving our services.
                </p>
              </div>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                The Care Matters Hub team will be in touch if we need any additional information.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                We truly appreciate your support and trust in Care Matters Hub.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                With gratitude,<br>
                <strong>The Care Matters Hub Team</strong>
              </p>
            </div>
            <div style="background: #0e7490; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px;">
                <a href="https://caremattershub.com.au" style="color: white;">caremattershub.com.au</a>
              </p>
              <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Care Matters Hub. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

    case 'contact':
      return {
        subject: 'We Received Your Message – Care Matters Hub',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Care Matters Hub</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Quality Care, Every Day</p>
            </div>
            <div style="padding: 40px 30px; background: #ffffff;">
              <h2 style="color: #0e7490; margin-top: 0;">Thank You for Contacting Us!</h2>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Dear ${escapeHtml(validateInput(data.name, 100))},
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Thank you for reaching out to Care Matters Hub. We have received your message and appreciate you taking the time to contact us.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Our team is reviewing your inquiry and will get back to you as soon as possible. We strive to respond to all messages within 1-2 business days.
              </p>
              <div style="background: #f0fdfa; border-left: 4px solid #0e7490; padding: 15px 20px; margin: 25px 0;">
                <p style="color: #0e7490; margin: 0; font-weight: 600;">Need urgent assistance?</p>
                <p style="color: #334155; margin: 10px 0 0 0;">
                  Call us directly at <a href="tel:0493457047" style="color: #0e7490; font-weight: 600;">0493 457 047</a>
                </p>
              </div>
              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Kind regards,<br>
                <strong>The Care Matters Hub Team</strong>
              </p>
            </div>
            <div style="background: #0e7490; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px;">
                <a href="https://caremattershub.com.au" style="color: white;">caremattershub.com.au</a>
              </p>
              <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Care Matters Hub. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

    case 'job_application':
      return {
        subject: 'Application Received – Care Matters Hub Careers',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Care Matters Hub</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Careers</p>
            </div>
            <div style="padding: 40px 30px; background: #ffffff;">
              <h2 style="color: #0e7490; margin-top: 0;">Application Received</h2>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Dear ${escapeHtml(validateInput(data.fullName, 100))},
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Thank you for applying to join the Care Matters Hub team. We appreciate your interest in becoming part of our dedicated care community.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                We are pleased to confirm that your application for the <strong>${escapeHtml(validateInput(data.position, 100))}</strong> position has been successfully received, along with all supporting documents.
              </p>
              <div style="background: #f0fdfa; border-left: 4px solid #0e7490; padding: 15px 20px; margin: 25px 0;">
                <p style="color: #0e7490; margin: 0; font-weight: 600;">What happens next?</p>
                <ul style="color: #334155; margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Our hiring team will carefully review your application</li>
                  <li>Shortlisted candidates will be contacted for the next steps</li>
                  <li>Please keep an eye on your email for updates</li>
                </ul>
              </div>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                The Care Matters Hub team will contact you shortly to discuss the next steps.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                We wish you the best of luck with your application. Thank you for considering Care Matters Hub as your potential employer.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Best regards,<br>
                <strong>Care Matters Hub Hiring Team</strong>
              </p>
            </div>
            <div style="background: #0e7490; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px;">
                <a href="https://caremattershub.com.au" style="color: white;">caremattershub.com.au</a>
              </p>
              <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Care Matters Hub. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

    default:
      return {
        subject: 'Thank You – Care Matters Hub',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Care Matters Hub</h1>
            </div>
            <div style="padding: 40px 30px; background: #ffffff;">
              <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                Thank you for your submission. We have received your information and the Care Matters Hub team will be in touch shortly.
              </p>
              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Best regards,<br>
                <strong>The Care Matters Hub Team</strong>
              </p>
            </div>
          </div>
        `,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";

  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { 
        status: 429, 
        headers: { 
          "Content-Type": "application/json",
          "Retry-After": "3600",
          ...corsHeaders 
        } 
      }
    );
  }

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`Blocked request from unauthorized origin: ${origin}`);
    return new Response(
      JSON.stringify({ error: "Unauthorized origin" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { type, data, attachment } = body as NotificationRequest;

    if (!type || !isValidType(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing notification type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!data || typeof data !== 'object') {
      return new Response(
        JSON.stringify({ error: "Invalid or missing data object" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.email && !isValidEmail(String(data.email))) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing ${type} notification from IP: ${clientIp} (${rateLimit.remaining} requests remaining)`);

    const { subject, html } = getAdminEmailContent(type, data);

    // For job applications, include the resume attachment
    const emailAttachment = type === 'job_application' && attachment ? attachment : undefined;

    // Send admin notification email to primary email with CC to owners
    // All emails go to caremattershub@gmail.com with CC to both owner emails
    await sendEmail([PRIMARY_EMAIL], subject, html, OWNER_EMAILS, emailAttachment);
    console.log("Admin notification email sent successfully" + (emailAttachment ? " (with attachment)" : ""));

    // Send user confirmation email
    // Get user email based on form type
    const userEmailAddress = type === 'registration' ? data.email :
                             type === 'feedback' ? data.email :
                             type === 'contact' ? data.email :
                             type === 'job_application' ? data.email : null;
    
    if (userEmailAddress && isValidEmail(String(userEmailAddress))) {
      const userConfirmation = getUserConfirmationEmail(type, data);
      
      try {
        // Send confirmation to user from primary email, CC owners
        await sendEmail([String(userEmailAddress)], userConfirmation.subject, userConfirmation.html, OWNER_EMAILS);
        console.log(`User confirmation email sent successfully for ${type}`);
      } catch (userEmailError) {
        console.error("User confirmation email error:", userEmailError);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error in send-notification function:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Failed to process notification" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
