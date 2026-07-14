import { NextResponse } from "next/server";
import { blockDemoRequest } from "@/lib/demo-guard";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isSafeRedirectUrl } from "@/lib/utils";

export async function GET(request: Request) {
  const demoBlock = blockDemoRequest(request);
  if (demoBlock) return demoBlock;

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const target = url.searchParams.get("url");
  const fallback = "https://digitalterrene.online";
  const supabase = getSupabaseAdmin();
  if (token && supabase) {
    const { data: recipient } = await supabase.from("campaign_recipients").select("*").eq("tracking_token", token).single();
    if (recipient) {
      await supabase.from("campaign_recipients").update({ clicked_at: recipient.clicked_at || new Date().toISOString() }).eq("id", recipient.id);
      await supabase.from("events").insert({ campaign_id: recipient.campaign_id, contact_id: recipient.contact_id, campaign_recipient_id: recipient.id, event_type: "click", metadata: { url: target } });
    }
  }
  return NextResponse.redirect(isSafeRedirectUrl(target) ? target! : fallback);
}
