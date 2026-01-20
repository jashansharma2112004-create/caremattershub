import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ModerationResult {
  isApproved: boolean;
  reason?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts } = await req.json();

    if (!texts || !Array.isArray(texts)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: 'texts' array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a content moderation assistant for a professional healthcare services website called "Care Matters Hub". Your job is to evaluate testimonials and determine if they are appropriate for display.

A testimonial should be REJECTED if it contains any of the following:
- Inappropriate, vulgar, or abusive language
- Hate speech, discrimination, or offensive content
- Adult, sexual, or explicit content
- Spam, promotional links, or misleading statements
- Unprofessional or aggressive wording
- False medical claims or dangerous health advice
- Personal attacks or defamatory content

A testimonial should be APPROVED if it is:
- Respectful and professional in tone
- Relevant to healthcare or support services
- Clean and brand-safe for a family-friendly website
- Genuine feedback (positive or constructive)

For each testimonial text provided, return a JSON array with your assessment.`;

    const userPrompt = `Please moderate the following testimonials and return a JSON array with your assessment for each one. Each object should have "index" (number), "isApproved" (boolean), and "reason" (string, only if rejected).

Testimonials to moderate:
${texts.map((text: string, i: number) => `${i + 1}. "${text}"`).join('\n')}

Return ONLY a valid JSON array, no other text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required for AI services." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse the AI response
    let results: ModerationResult[];
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      const parsed = JSON.parse(cleanContent);
      results = parsed.map((item: any) => ({
        isApproved: Boolean(item.isApproved),
        reason: item.reason || undefined,
      }));
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Default to approved if parsing fails (fail-open for user experience)
      results = texts.map(() => ({ isApproved: true }));
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Moderation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
