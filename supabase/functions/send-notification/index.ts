import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Allowed origins for CORS - restrict to your domain
const ALLOWED_ORIGINS = [
  "https://caremattershub.com.au",
  "https://caremattershub.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080"
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

const getEmailContent = (type: string, data: Record<string, unknown>) => {
  switch (type) {
    case 'registration':
      return {
        subject: `New Service Registration - ${escapeHtml(validateInput(data.fullName, 100))}`,
        html: `
          <h2>New Service Registration</h2>
          <p>A new service registration has been submitted:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.fullName, 100))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.email, 255))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.phone, 20))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Service:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.service, 100))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.address, 500))}</td></tr>
            ${data.notes ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Notes:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.notes, 1000))}</td></tr>` : ''}
          </table>
          <p style="margin-top: 20px;">Please follow up with the client within 1-2 business days.</p>
        `,
      };

    case 'feedback':
      return {
        subject: `Customer Feedback - ${escapeHtml(validateInput(data.customerName, 100))} (Rating: ${escapeHtml(validateInput(data.rating, 1))}/5)`,
        html: `
          <h2>Customer Feedback Received</h2>
          <p>A customer has submitted feedback:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.customerName, 100))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Service Received:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.serviceTaken, 100))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Rating:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.rating, 1))}/5 ⭐</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Feedback:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.feedback, 2000))}</td></tr>
          </table>
          <p style="margin-top: 20px;">Your feedback helps us improve our services.</p>
        `,
      };

    case 'contact':
      return {
        subject: `Contact Form Inquiry - ${escapeHtml(validateInput(data.name, 100))}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p>Someone has reached out through the contact form:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.name, 100))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.email, 255))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.phone, 20)) || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.message, 2000))}</td></tr>
          </table>
          <p style="margin-top: 20px;">Please respond to this inquiry promptly.</p>
        `,
      };

    case 'job_application':
      return {
        subject: `Job Application - ${escapeHtml(validateInput(data.fullName, 100))} (${escapeHtml(validateInput(data.position, 100))})`,
        html: `
          <h2>New Job Application</h2>
          <p>A job application has been submitted:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.fullName, 100))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.email, 255))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.phone, 20))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Position:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.position, 100))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; vertical-align: top;"><strong>Work Experience:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.workExperience, 2000))}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Resume:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.resumeFileName, 255))}</td></tr>
            ${data.message ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(validateInput(data.message, 2000))}</td></tr>` : ''}
          </table>
          <p style="margin-top: 20px;">Review the application and resume, then follow up within 5-7 business days.</p>
        `,
      };

    default:
      return {
        subject: 'New Form Submission - Care Matters Hub',
        html: `<h2>New Form Submission</h2><pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    console.log(`Processing ${type} notification`);

    const { subject, html } = getEmailContent(type, data);

    // Send email using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
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

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(emailResult.message || "Failed to send email");
    }

    console.log("Email sent successfully");

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
