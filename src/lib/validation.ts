import { z } from "zod";

export const emailSchema = z.string().email().transform((value) => value.toLowerCase().trim());

export const contactSchema = z.object({
  first_name: z.string().trim().optional().nullable(),
  last_name: z.string().trim().optional().nullable(),
  email: emailSchema,
  company_name: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  business_type: z.string().trim().optional().nullable(),
  service_interest: z.string().trim().optional().nullable(),
  source: z.string().trim().optional().nullable(),
});

export const promotionSchema = z.object({
  title: z.string().trim().min(2),
  service_type: z.string().trim().min(2),
  offer_details: z.string().trim().min(10),
  target_audience: z.string().trim().optional().nullable(),
  bonus: z.string().trim().optional().nullable(),
  urgency: z.string().trim().optional().nullable(),
  cta_text: z.string().trim().optional().nullable(),
  cta_url: z.string().url().optional().or(z.literal("")).nullable(),
  tone: z.string().trim().optional().nullable(),
});

export const aiCampaignSchema = promotionSchema.extend({
  promotion_id: z.string().uuid(),
});

export const campaignUpdateSchema = z.object({
  promotion_id: z.string().uuid().optional().nullable(),
  name: z.string().trim().min(2),
  subject: z.string().trim().optional().nullable(),
  preview_text: z.string().trim().optional().nullable(),
  plain_text_body: z.string().trim().optional().nullable(),
  html_body: z.string().trim().optional().nullable(),
  selected_subject_index: z.coerce.number().int().optional().nullable(),
  status: z.string().optional(),
  scheduled_at: z.string().optional().nullable(),
});

export const aiOutputSchema = z.object({
  subject_lines: z.array(z.string().max(60)).length(10),
  preview_text: z.string(),
  plain_text_body: z.string(),
  html_body: z.string(),
  cta_text: z.string(),
  spam_warnings: z.array(z.string()),
});

