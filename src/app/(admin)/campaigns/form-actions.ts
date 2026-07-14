"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { requireSupabaseAdmin } from "@/lib/supabase";
import { campaignUpdateSchema } from "@/lib/validation";

export async function saveCampaign(formData: FormData) {
  await requireAdmin();
  const payload = Object.fromEntries(formData);
  const parsed = campaignUpdateSchema.parse(payload);
  const supabase = requireSupabaseAdmin();
  const id = String(formData.get("id") || "");
  const result = id
    ? await supabase.from("campaigns").update(parsed).eq("id", id)
    : await supabase.from("campaigns").insert(parsed);
  if (result.error) throw new Error(result.error.message);
  redirect("/campaigns");
}
