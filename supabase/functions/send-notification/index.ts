import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

const RECIPIENT_EMAILS = [
  "Shubh@caremattershub.com.au",
  "sunil@caremattershub.com.au"
];

// Rate limiting: In-memory store (resets on function cold start, but provides protection)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per hour per IP

const checkRateLimit = (clientIp: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
};

interface NotificationRequest {
  type: 'registration' | 'feedback' | 'contact' | 'job_application';
  data: Record<string, unknown>;
}

// HTML escape function to prevent HTML injection
const escapeHtml = (text: unknown): string => {
  const str = String(text ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Input validation helper
const validateInput = (value: unknown, maxLength: number = 1000): string => {
  const str = String(value ?? '').trim();
  if (str.length > maxLength) {
    return str.substring(0, maxLength);
  }
  return str;
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate notification type
const isValidType = (type: string): type is NotificationRequest['type'] => {
  return ['registration', 'feedback', 'contact', 'job_application'].includes(type);
};

// Email content for admin notifications
const getAdminEmailContent = (type: string, data: Record<string, unknown>) => {
  switch (type) {
    case 'registration':
      return {
        subject: `New Service Registration - ${escapeHtml(validateInput(data.fullName, 100))}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Care Matters Hub</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0e7490; margin-top: 0;">New Service Registration</h2>
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
              <p style="color: white; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Care Matters Hub. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case 'feedback':
      return {
        subject: `Customer Feedback - ${escapeHtml(validateInput(data.customerName, 100))} (Rating: ${escapeHtml(validateInput(data.rating, 1))}/5)`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Care Matters Hub</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0e7490; margin-top: 0;">Customer Feedback Received</h2>
              <p style="color: #334155;">A customer has submitted feedback:</p>
              <table style="border-collapse: collapse; width: 100%; background: white; border-radius: 8px; overflow: hidden;">
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Customer Name:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.customerName, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Service Received:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.serviceTaken, 100))}</td></tr>
                <tr><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Rating:</strong></td><td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(validateInput(data.rating, 1))}/5 ⭐</td></tr>
                <tr><td style="padding: 12px;"><strong>Feedback:</strong></td><td style="padding: 12px;">${escapeHtml(validateInput(data.feedback, 2000))}</td></tr>
              </table>
            </div>
            <div style="background: #0e7490; padding: 15px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Care Matters Hub. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case 'contact':
      return {
        subject: `Contact Form Inquiry - ${escapeHtml(validateInput(data.name, 100))}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Care Matters Hub</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0e7490; margin-top: 0;">New Contact Form Submission</h2>
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
              <p style="color: white; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Care Matters Hub. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case 'job_application':
      return {
        subject: `Job Application - ${escapeHtml(validateInput(data.fullName, 100))} (${escapeHtml(validateInput(data.position, 100))})`,
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
              <p style="color: white; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Care Matters Hub. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    default:
      return {
        subject: 'New Form Submission - Care Matters Hub',
        html: `<h2>New Form Submission</h2><pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`,
      };
  }
};

// Email content for user confirmation (registration only)
const getUserConfirmationEmail = (data: Record<string, unknown>) => {
  return {
    subject: 'Registration Successful – Care Matters Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Care Matters Hub</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Quality Care, Every Day</p>
        </div>
        <div style="padding: 40px 30px; background: #ffffff;">
          <h2 style="color: #0e7490; margin-top: 0;">Registration Successful!</h2>
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Dear ${escapeHtml(validateInput(data.fullName, 100))},
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Thank you for registering with Care Matters Hub. We have received your registration for <strong>${escapeHtml(validateInput(data.service, 100))}</strong>.
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Our team will contact you shortly to discuss your care needs and answer any questions you may have.
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
            If you have any urgent questions, please don't hesitate to contact us at <a href="tel:0493457047" style="color: #0e7490;">0493 457 047</a> or reply to this email.
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
            © ${new Date().getFullYear()} Care Matters Hub. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";

  // Check rate limit
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

  // Verify origin is allowed (additional check beyond CORS)
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`Blocked request from unauthorized origin: ${origin}`);
    return new Response(
      JSON.stringify({ error: "Unauthorized origin" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { type, data } = body as NotificationRequest;

    // Validate notification type
    if (!type || !isValidType(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing notification type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate data object exists
    if (!data || typeof data !== 'object') {
      return new Response(
        JSON.stringify({ error: "Invalid or missing data object" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email if present
    if (data.email && !isValidEmail(String(data.email))) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing ${type} notification from IP: ${clientIp} (${rateLimit.remaining} requests remaining)`);

    const { subject, html } = getAdminEmailContent(type, data);

    // Send admin notification email using Resend API
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Care Matters Hub <onboarding@resend.dev>",
        to: RECIPIENT_EMAILS,
        subject: subject,
        html: html,
      }),
    });

    const adminEmailResult = await adminEmailResponse.json();

    if (!adminEmailResponse.ok) {
      console.error("Admin notification email error:", adminEmailResult);
      throw new Error(adminEmailResult.message || "Failed to send admin notification");
    }

    console.log("Admin notification email sent successfully");

    // Send user confirmation email for registration type
    if (type === 'registration' && data.email && isValidEmail(String(data.email))) {
      const userEmail = getUserConfirmationEmail(data);
      
      const userEmailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Care Matters Hub <onboarding@resend.dev>",
          to: [String(data.email)],
          subject: userEmail.subject,
          html: userEmail.html,
        }),
      });

      const userEmailResult = await userEmailResponse.json();

      if (!userEmailResponse.ok) {
        console.error("User confirmation email error:", userEmailResult);
        // Don't fail the whole request if user email fails, admin was already notified
      } else {
        console.log("User confirmation email sent successfully");
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
