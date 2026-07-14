"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { requireSupabaseAdmin } from "@/lib/supabase";
import { contactSchema } from "@/lib/validation";

export async function saveContact(formData: FormData) {
  await requireAdmin();
  const payload = Object.fromEntries(formData);
  const parsed = contactSchema.parse(payload);
  const supabase = requireSupabaseAdmin();
  const id = String(formData.get("id") || "");
  const result = id
    ? await supabase.from("contacts").update(parsed).eq("id", id)
    : await supabase.from("contacts").insert(parsed);
  if (result.error) {
    console.error("Supabase saveContact error", result.error);
    throw new Error(`Could not save contact: ${result.error.message}`);
  }
  redirect("/contacts");
}

export async function deleteContact(formData: FormData) {
  await requireAdmin();
  const supabase = requireSupabaseAdmin();
  await supabase.from("contacts").delete().eq("id", String(formData.get("id")));
  redirect("/contacts");
}
