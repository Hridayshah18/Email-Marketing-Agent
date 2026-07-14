import { Resend } from "resend";
import { NextResponse } from "next/server";
import { isApiAdminAuthenticated } from "@/lib/auth";
import { addEmailInstrumentation, createTrackingToken, personalize } from "@/lib/email";
import { COMPANY_WEBSITE, DEFAULT_CTA_URL, DEFAULT_FROM_EMAIL, DEFAULT_REPLY_EMAIL } from "@/lib/branding";
import { blockDemoRequest } from "@/lib/demo-guard";
import { requireSupabaseAdmin } from "@/lib/supabase";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const demoBlock = blockDemoRequest(_request);
  if (demoBlock) return demoBlock;
  if (!(await isApiAdminAuthenticated())) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const supabase = requireSupabaseAdmin();
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "RESEND_API_KEY is missing" }, { status: 500 });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const logoUrl = process.env.BRAND_LOGO_URL || `${appUrl.replace(/\/$/, "")}/dt-logo.png`;
  const { data: settings } = await supabase.from("settings").select("*").limit(1).single();
  const { data: campaign, error } = await supabase.from("campaigns").select("*, promotions(cta_url)").eq("id", id).single();
  if (error || !campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  if (!campaign.subject || !campaign.html_body || !campaign.plain_text_body) {
    return NextResponse.json({ error: "Campaign is missing subject or body" }, { status: 400 });
  }

  await supabase.from("campaigns").update({ status: "sending" }).eq("id", id);
  const { data: contacts } = await supabase.from("contacts").select("*").eq("unsubscribed", false).limit(1000);
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const contact of contacts || []) {
    const token = createTrackingToken();
    const { data: recipient, error: recipientError } = await supabase
      .from("campaign_recipients")
      .insert({ campaign_id: id, contact_id: contact.id, tracking_token: token, status: "pending" })
      .select("*")
      .single();

    if (recipientError || !recipient) {
      failed += 1;
      errors.push(`Could not create recipient for ${contact.email}: ${recipientError?.message || "unknown error"}`);
      continue;
    }

    const personalizedHtml = personalize(campaign.html_body, contact);
    const personalizedText = personalize(campaign.plain_text_body, contact);
    const promotion = Array.isArray(campaign.promotions) ? campaign.promotions[0] : campaign.promotions;
    const settingsCtaUrl = settings?.default_cta_url?.includes("social-vape") ? DEFAULT_CTA_URL : settings?.default_cta_url;
    const settingsWebsiteUrl = settings?.website_url?.includes("social-vape") ? COMPANY_WEBSITE : settings?.website_url;
    const fallbackUrl = promotion?.cta_url || settingsCtaUrl || settingsWebsiteUrl || DEFAULT_CTA_URL;
    const instrumented = addEmailInstrumentation({
      html: personalizedHtml,
      plain: personalizedText,
      token,
      appUrl,
      fallbackUrl,
      logoUrl,
      replyEmail: settings?.reply_to_email || process.env.DEFAULT_REPLY_TO_EMAIL || DEFAULT_REPLY_EMAIL,
      websiteUrl: settingsWebsiteUrl || COMPANY_WEBSITE,
      addressLine: settings?.address_line,
      emailStyle: campaign.email_style || "marketing_template",
    });

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.DEFAULT_FROM_EMAIL || DEFAULT_FROM_EMAIL,
        to: [contact.email],
        replyTo: process.env.DEFAULT_REPLY_TO_EMAIL || DEFAULT_REPLY_EMAIL,
        subject: campaign.subject || "Digital Terrene Update",
        html: instrumented.html,
        text: instrumented.plain,
      });

      if (error) {
        console.error("Resend send error:", error);
        await supabase.from("campaign_recipients").update({ status: "failed" }).eq("id", recipient.id);
        await supabase.from("events").insert({
          campaign_id: id,
          contact_id: contact.id,
          campaign_recipient_id: recipient.id,
          event_type: "failed",
          metadata: { resend_error: error },
        });
        failed += 1;
        errors.push(`${contact.email}: ${error.message || "Resend send failed"}`);
        continue;
      }

      if (!data?.id) {
        console.error("Resend returned no id");
        await supabase.from("campaign_recipients").update({ status: "failed" }).eq("id", recipient.id);
        await supabase.from("events").insert({
          campaign_id: id,
          contact_id: contact.id,
          campaign_recipient_id: recipient.id,
          event_type: "failed",
          metadata: { error: "Resend returned no id", resend_data: data },
        });
        failed += 1;
        errors.push(`${contact.email}: Resend returned no id`);
        continue;
      }

      const sentAt = new Date().toISOString();
      await supabase.from("campaign_recipients").update({ status: "sent", resend_email_id: data.id, sent_at: sentAt }).eq("id", recipient.id);
      await supabase.from("events").insert({
        campaign_id: id,
        contact_id: contact.id,
        campaign_recipient_id: recipient.id,
        event_type: "sent",
        metadata: { resend_email_id: data.id },
      });
      sent += 1;
    } catch (sendError) {
      await supabase.from("campaign_recipients").update({ status: "failed" }).eq("id", recipient.id);
      await supabase.from("events").insert({
        campaign_id: id,
        contact_id: contact.id,
        campaign_recipient_id: recipient.id,
        event_type: "failed",
        metadata: { error: sendError instanceof Error ? sendError.message : String(sendError) },
      });
      failed += 1;
      errors.push(`${contact.email}: ${sendError instanceof Error ? sendError.message : String(sendError)}`);
    }
  }

  await supabase
    .from("campaigns")
    .update({ status: failed && !sent ? "failed" : "sent", sent_at: sent ? new Date().toISOString() : null })
    .eq("id", id);

  return NextResponse.json({ sent, failed, errors });
}
