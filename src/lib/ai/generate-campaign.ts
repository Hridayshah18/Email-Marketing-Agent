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
};

const systemPrompt =
  "You are the AI email marketing agent for Digital Terrene, a modern digital agency helping businesses grow through websites, social media marketing, logo design, branding, AI-generated ads, software development, automation, SEO, and complete digital growth systems. You write clear, high-converting promotional emails. You are persuasive but honest. You never make fake guarantees. You avoid spammy language. You write short, premium, conversion-focused emails.";

function buildPrompt(input: GenerateCampaignInput) {
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
- plain_text_body under 250 words
- html_body must be responsive email-safe HTML
- use {{first_name}} personalization
- include CTA
- use {{cta_url}} for CTA links
- include unsubscribe footer
- no markdown code fences
- no explanation outside JSON
- avoid spammy words, fake promises, and misleading urgency

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

