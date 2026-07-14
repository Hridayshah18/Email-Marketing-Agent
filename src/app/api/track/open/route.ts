import { NextResponse } from "next/server";
import { blockDemoRequest } from "@/lib/demo-guard";
import { getSupabaseAdmin } from "@/lib/supabase";

const pixel = Buffer.from("R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==", "base64");

export async function GET(request: Request) {
  const demoBlock = blockDemoRequest(request);
  if (demoBlock) return demoBlock;

  const token = new URL(request.url).searchParams.get("token");
  const supabase = getSupabaseAdmin();
  if (token && supabase) {
    const { data: recipient } = await supabase.from("campaign_recipients").select("*").eq("tracking_token", token).single();
    if (recipient) {
      await supabase.from("campaign_recipients").update({ opened_at: recipient.opened_at || new Date().toISOString() }).eq("id", recipient.id);
      await supabase.from("events").insert({ campaign_id: recipient.campaign_id, contact_id: recipient.contact_id, campaign_recipient_id: recipient.id, event_type: "open" });
    }
  }
  return new NextResponse(pixel, { headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" } });
}
