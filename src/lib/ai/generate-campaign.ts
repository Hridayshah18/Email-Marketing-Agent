import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { aiOutputSchema } from "@/lib/validation";

export type GenerateCampaignInput = {
  promotion_id: string;
  title: string;
  service_type: string;
  offer_details: string;
  target_audience?: string | null;
  bonus?: string | null;
  urgency?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  tone?: string | null;
  email_style?: "marketing_template" | "plain_outreach";
};

const systemPrompt =
  "You are the AI email marketing agent for Digital Terrene, a modern digital agency helping businesses grow through websites, social media marketing, logo design, branding, AI-generated ads, software development, automation, SEO, and complete digital growth systems. You write clear, high-converting promotional emails. You are persuasive but honest. You never make fake guarantees. You avoid spammy language. You write short, premium, conversion-focused emails.";

function buildPrompt(input: GenerateCampaignInput) {
  const emailStyle = input.email_style || "marketing_template";
  const styleRules =
    emailStyle === "plain_outreach"
      ? `Email style: plain_outreach.
- Write this like a short personal business email, not a newsletter or promotional flyer. Avoid hype, discounts, emojis, big claims, and salesy language.
- Keep the plain_text_body under 150 words.
- Keep html_body minimal: simple paragraphs only, no hero banner, no offer box, no large logo image, no big CTA button.
- Include at most 1 main link using {{cta_url}}.
- Include a simple text CTA similar to: "You can visit us here: {{cta_url}}".
- Use natural, human-written subject lines.`
      : `Email style: marketing_template.
- Keep the current responsive HTML email template approach.
- Include a header/logo area, a clear hero section, a CTA button, an offer/details box, and an email-safe footer.
- Use inline styles and responsive, email-safe HTML.`;

  return `${systemPrompt}

Generate valid JSON matching this exact shape:
{
  "subject_lines": ["string"],
  "preview_text": "string",
  "plain_text_body": "string",
  "html_body": "string",
  "cta_text": "string",
  "spam_warnings": ["string"]
}

Rules:
- exactly 10 subject lines
- each subject under 60 characters
- plain_text_body under 250 words unless plain_outreach is selected
- html_body must be responsive email-safe HTML
- use {{first_name}} personalization
- include CTA
- use {{cta_url}} for CTA links
- include unsubscribe footer
- no markdown code fences
- no explanation outside JSON
- avoid spammy words, fake promises, and misleading urgency
${styleRules}

Promotion:
${JSON.stringify(input)}`;
}

function parseGeneratedJson(raw: string, provider: string) {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error(`${provider} returned text instead of JSON.`);
    }
    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  }
}

export async function generateCampaignWithGemini(input: GenerateCampaignInput) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(input),
    config: {
      responseMimeType: "application/json",
    },
  });

  const raw = response.text;
  if (!raw) {
    throw new Error("Gemini returned an empty response.");
  }

  return aiOutputSchema.parse(parseGeneratedJson(raw, "Gemini"));
}

export async function generateCampaignWithOpenAI(input: GenerateCampaignInput) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildPrompt(input) },
    ],
  });

  const raw = response.choices[0]?.message.content;
  if (!raw) {
    throw new Error("OpenAI returned an empty response.");
  }

  return aiOutputSchema.parse(parseGeneratedJson(raw, "OpenAI"));
}

export async function generateCampaign(input: GenerateCampaignInput) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  if (provider === "openai") {
    return generateCampaignWithOpenAI(input);
  }

  if (provider === "gemini") {
    return generateCampaignWithGemini(input);
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}
