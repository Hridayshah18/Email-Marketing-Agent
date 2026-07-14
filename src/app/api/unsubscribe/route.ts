import { NextResponse } from "next/server";
import { blockDemoRequest } from "@/lib/demo-guard";
import { getSupabaseAdmin } from "@/lib/supabase";

async function unsubscribe(token: string | null) {
  const supabase = getSupabaseAdmin();
  if (!token || !supabase) return false;
  const { data: recipient } = await supabase.from("campaign_recipients").select("*").eq("tracking_token", token).single();
  if (!recipient) return false;
  const now = new Date().toISOString();
  await supabase.from("contacts").update({ unsubscribed: true, unsubscribed_at: now }).eq("id", recipient.contact_id);
  await supabase.from("campaign_recipients").update({ unsubscribed_at: now, status: "unsubscribed" }).eq("id", recipient.id);
  await supabase.from("events").insert({ campaign_id: recipient.campaign_id, contact_id: recipient.contact_id, campaign_recipient_id: recipient.id, event_type: "unsubscribe" });
  return true;
}

export async function GET(request: Request) {
  const demoBlock = blockDemoRequest(request);
  if (demoBlock) return demoBlock;

  await unsubscribe(new URL(request.url).searchParams.get("token"));
  return new NextResponse(
    "<main style='font-family:Arial;padding:48px;max-width:680px;margin:auto'><h1>You have been unsubscribed from Digital Terrene emails.</h1><p>You will not receive future marketing campaigns from this list.</p></main>",
    { headers: { "Content-Type": "text/html" } },
  );
}

export async function POST(request: Request) {
  const demoBlock = blockDemoRequest(request);
  if (demoBlock) return demoBlock;

  const body = await request.formData().catch(() => null);
  await unsubscribe(body?.get("token")?.toString() || new URL(request.url).searchParams.get("token"));
  return NextResponse.json({ ok: true });
}
