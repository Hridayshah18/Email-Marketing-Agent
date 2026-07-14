"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { COMPANY_NAME, COMPANY_WEBSITE, DEFAULT_CTA_URL, DEFAULT_FROM_EMAIL, DEFAULT_REPLY_EMAIL } from "@/lib/branding";
import { requireSupabaseAdmin } from "@/lib/supabase";

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const supabase = requireSupabaseAdmin();
  const id = String(formData.get("id"));
  const payload = {
    company_name: String(formData.get("company_name") || COMPANY_NAME),
    from_name: String(formData.get("from_name") || COMPANY_NAME),
    from_email: String(formData.get("from_email") || DEFAULT_FROM_EMAIL),
    reply_to_email: String(formData.get("reply_to_email") || DEFAULT_REPLY_EMAIL),
    website_url: String(formData.get("website_url") || COMPANY_WEBSITE),
    address_line: String(formData.get("address_line") || ""),
    default_cta_url: String(formData.get("default_cta_url") || DEFAULT_CTA_URL),
    brand_primary_color: String(formData.get("brand_primary_color") || "#2563eb"),
  };
  const result = id
    ? await supabase.from("settings").update(payload).eq("id", id)
    : await supabase.from("settings").insert(payload);
  if (result.error) throw new Error(result.error.message);
  redirect("/settings");
}
