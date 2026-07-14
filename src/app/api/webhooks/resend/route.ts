import crypto from "crypto";
import { NextResponse } from "next/server";
import { blockDemoRequest } from "@/lib/demo-guard";
import { requireSupabaseAdmin } from "@/lib/supabase";

function verifySignature(raw: string, signature: string | null) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || !signature) return true;
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(request: Request) {
  const demoBlock = blockDemoRequest(request);
  if (demoBlock) return demoBlock;

  const raw = await request.text();
  if (!verifySignature(raw, request.headers.get("resend-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const payload = JSON.parse(raw);
  const resendId = payload?.data?.email_id || payload?.data?.id;
  const typeMap: Record<string, string> = {
    "email.sent": "sent",
    "email.delivered": "delivered",
    "email.delivery_delayed": "delivery_delayed",
    "email.complained": "complaint",
    "email.bounced": "bounce",
    "email.opened": "open",
    "email.clicked": "click",
  };
  const eventType = typeMap[payload.type] || payload.type || "unknown";
  const supabase = requireSupabaseAdmin();
  const { data: recipient } = resendId
    ? await supabase.from("campaign_recipients").select("*").eq("resend_email_id", resendId).maybeSingle()
    : { data: null };
  if (recipient) {
    const patch: Record<string, string> = { status: eventType };
    if (eventType === "delivered") patch.delivered_at = new Date().toISOString();
    if (eventType === "open") patch.opened_at = recipient.opened_at || new Date().toISOString();
    if (eventType === "click") patch.clicked_at = recipient.clicked_at || new Date().toISOString();
    if (eventType === "bounce") patch.bounced_at = new Date().toISOString();
    if (eventType === "complaint") patch.complained_at = new Date().toISOString();
    await supabase.from("campaign_recipients").update(patch).eq("id", recipient.id);
    await supabase.from("events").insert({ campaign_id: recipient.campaign_id, contact_id: recipient.contact_id, campaign_recipient_id: recipient.id, event_type: eventType, metadata: payload });
  }
  return NextResponse.json({ ok: true });
}
