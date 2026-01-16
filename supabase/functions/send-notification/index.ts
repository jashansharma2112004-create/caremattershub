import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RECIPIENT_EMAILS = [
  "Shubh@caremattershub.com.au",
  "sunil@caremattershub.com.au"
];

interface NotificationRequest {
  type: 'registration' | 'feedback' | 'contact' | 'job_application';
  data: Record<string, unknown>;
}

const getEmailContent = (type: string, data: Record<string, unknown>) => {
  switch (type) {
    case 'registration':
      return {
        subject: `New Service Registration - ${data.fullName}`,
        html: `
          <h2>New Service Registration</h2>
          <p>A new service registration has been submitted:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Service:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.service}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.address}</td></tr>
            ${data.notes ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Notes:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.notes}</td></tr>` : ''}
          </table>
          <p style="margin-top: 20px;">Please follow up with the client within 1-2 business days.</p>
        `,
      };

    case 'feedback':
      return {
        subject: `Customer Feedback - ${data.customerName} (Rating: ${data.rating}/5)`,
        html: `
          <h2>Customer Feedback Received</h2>
          <p>A customer has submitted feedback:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.customerName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Service Received:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.serviceTaken}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Rating:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.rating}/5 ⭐</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Feedback:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.feedback}</td></tr>
          </table>
          <p style="margin-top: 20px;">Your feedback helps us improve our services.</p>
        `,
      };

    case 'contact':
      return {
        subject: `Contact Form Inquiry - ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p>Someone has reached out through the contact form:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.message}</td></tr>
          </table>
          <p style="margin-top: 20px;">Please respond to this inquiry promptly.</p>
        `,
      };

    case 'job_application':
      return {
        subject: `Job Application - ${data.fullName} (${data.position})`,
        html: `
          <h2>New Job Application</h2>
          <p>A job application has been submitted:</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Position:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.position}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Resume:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.resumeFileName}</td></tr>
            ${data.message ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.message}</td></tr>` : ''}
          </table>
          <p style="margin-top: 20px;">Review the application and resume, then follow up within 5-7 business days.</p>
        `,
      };

    default:
      return {
        subject: 'New Form Submission - Care Matters Hub',
        html: `<h2>New Form Submission</h2><pre>${JSON.stringify(data, null, 2)}</pre>`,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    console.log(`Processing ${type} notification:`, data);

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

    console.log("Email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResult }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
