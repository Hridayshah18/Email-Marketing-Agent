"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_CTA_URL } from "@/lib/branding";
import { requireSupabaseAdmin } from "@/lib/supabase";
import { promotionSchema } from "@/lib/validation";

export async function savePromotion(formData: FormData) {
  await requireAdmin();
  const payload = Object.fromEntries(formData);
  const parsed = promotionSchema.parse(payload);
  const promotion = {
    ...parsed,
    cta_url: parsed.cta_url || DEFAULT_CTA_URL,
  };
  const supabase = requireSupabaseAdmin();
  const id = String(formData.get("id") || "");
  const result = id
    ? await supabase.from("promotions").update(promotion).eq("id", id)
    : await supabase.from("promotions").insert(promotion);
  if (result.error) throw new Error(result.error.message);
  redirect("/promotions");
}
