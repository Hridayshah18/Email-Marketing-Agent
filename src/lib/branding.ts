import fs from "fs";
import path from "path";

export const COMPANY_NAME = "Digital Terrene";
export const COMPANY_WEBSITE = "https://digitalterrene.online";
export const DEFAULT_CTA_URL = COMPANY_WEBSITE;
export const DEFAULT_REPLY_EMAIL = "promotions@digitalterrene.online";
export const DEFAULT_FROM_EMAIL = "Digital Terrene <promotions@digitalterrene.online>";
export const DEFAULT_ADDRESS = "Digital Terrene contact address placeholder";

const logoCandidates = [
  "/logo.png",
  "/logo.jpg",
  "/logo.jpeg",
  "/logo.webp",
  "/logo/logo.png",
  "/logo/logo.jpg",
  "/logo/logo.webp",
  "/dt-logo.png",
];

export function getLogoPath() {
  for (const candidate of logoCandidates) {
    const filePath = path.join(process.cwd(), "public", candidate.replace(/^\//, ""));
    if (fs.existsSync(filePath)) {
      return candidate;
    }
  }

  return null;
}

export function getAbsoluteLogoUrl(appUrl = process.env.APP_URL || "http://localhost:3000") {
  return process.env.BRAND_LOGO_URL || `${appUrl.replace(/\/$/, "")}/dt-logo.png`;
}
