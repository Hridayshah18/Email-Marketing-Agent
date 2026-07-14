import crypto from "crypto";
import { isSafeRedirectUrl } from "@/lib/utils";
import { COMPANY_NAME, COMPANY_WEBSITE, DEFAULT_ADDRESS, DEFAULT_CTA_URL, DEFAULT_REPLY_EMAIL } from "@/lib/branding";

export function createTrackingToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function personalize(value: string, contact: { first_name?: string | null }) {
  return value.replaceAll("{{first_name}}", contact.first_name?.trim() || "there");
}

export function addEmailInstrumentation(params: {
  html: string;
  plain: string;
  token: string;
  appUrl: string;
  fallbackUrl: string;
  logoUrl?: string | null;
  replyEmail?: string | null;
  websiteUrl?: string | null;
  addressLine?: string | null;
  emailStyle?: "marketing_template" | "plain_outreach";
}) {
  const { token, appUrl, fallbackUrl } = params;
  const emailStyle = params.emailStyle || "marketing_template";
  const openPixel = `<img src="${appUrl}/api/track/open?token=${token}" width="1" height="1" alt="" style="display:none;border:0;" />`;
  const unsubscribe = `${appUrl}/api/unsubscribe?token=${token}`;
  const websiteUrl = params.websiteUrl || COMPANY_WEBSITE;
  const replyEmail = params.replyEmail || DEFAULT_REPLY_EMAIL;
  const addressLine = params.addressLine || DEFAULT_ADDRESS;
  const safeFallbackUrl = isSafeRedirectUrl(fallbackUrl) ? fallbackUrl : DEFAULT_CTA_URL;
  const clickUrl = (targetUrl: string) =>
    `${appUrl}/api/track/click?token=${token}&url=${encodeURIComponent(
      isSafeRedirectUrl(targetUrl) ? targetUrl : safeFallbackUrl,
    )}`;
  const logoHeader = params.logoUrl && emailStyle === "marketing_template"
    ? `<img
  src="${params.logoUrl}"
  alt="Digital Terrene Logo"
  width="150"
  style="display:block;margin:0 auto 24px auto;max-width:150px;height:auto;border:0;outline:none;text-decoration:none;"
/>`
    : "";
  const footerStyle =
    emailStyle === "plain_outreach"
      ? "font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:#64748b;margin-top:18px;"
      : "font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#64748b;margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;";
  const footer = `<div style="${footerStyle}">
  <strong style="color:#0f172a;">${COMPANY_NAME}</strong><br />
  <a href="mailto:${replyEmail}" style="color:#2563eb;">${replyEmail}</a><br />
  Website: <a href="${websiteUrl}" style="color:#2563eb;">${websiteUrl}</a><br />
  ${addressLine ? `${addressLine}<br />` : ""}
  <a href="${unsubscribe}" style="color:#2563eb;">Unsubscribe</a>
</div>`;

  const htmlWithTrackedLinks = params.html
    .replaceAll("{{cta_url}}", safeFallbackUrl)
    .replace(/href=(["'])(.*?)\1/gi, (match, quote: string, url: string) => {
      if (!isSafeRedirectUrl(url) || url.includes("/api/track/click")) return match;
      return `href=${quote}${clickUrl(url)}${quote}`;
    });

  const htmlWithLogo = htmlWithTrackedLinks.includes("<body")
    ? htmlWithTrackedLinks.replace(/<body([^>]*)>/i, `<body$1>${logoHeader}`)
    : `${logoHeader}${htmlWithTrackedLinks}`;
  const htmlWithFooter = htmlWithLogo.includes("</body>")
    ? htmlWithLogo.replace("</body>", `${footer}${openPixel}</body>`)
    : `${htmlWithLogo}${footer}${openPixel}`;

  const plain = `${params.plain.replaceAll("{{cta_url}}", clickUrl(safeFallbackUrl))}

--
${COMPANY_NAME}
${replyEmail}
Website: ${websiteUrl}
${addressLine}
Unsubscribe: ${unsubscribe}`;

  return { html: htmlWithFooter, plain };
}
