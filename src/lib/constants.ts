export const APP_NAME = "Digital Terrene Email Agent";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "digitalterrene06@gmail.com";
export const ADMIN_EMAILS = process.env.ADMIN_EMAILS || ADMIN_EMAIL;

export const SERVICE_TYPES = [
  "Website Development",
  "Social Media Marketing",
  "Logo Design",
  "Branding",
  "AI Ads",
  "Software Development",
  "Automation",
  "SEO",
  "Complete Digital Growth Package",
] as const;

export const TONES = [
  "Premium",
  "Friendly",
  "Bold",
  "Professional",
  "Urgent",
  "Luxury",
  "Startup-style",
  "Local business friendly",
] as const;

export const CAMPAIGN_STATUSES = [
  "draft",
  "ready",
  "sending",
  "sent",
  "scheduled",
  "failed",
  "cancelled",
] as const;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/digital_terrene/",
  minds: "https://www.minds.com/digitalterrene/",
  linkedin: "https://www.linkedin.com/in/digital-terrene-b724232b3",
  facebook: "https://www.facebook.com/DIGITALTERRENE786",
  tumblr: "https://www.tumblr.com/blog/digitalterrene1",
  x: "https://x.com/DTerrene7072",
  mewe: "https://mewe.com/digitalterrene06.51/posts",
  pinterest: "https://in.pinterest.com/digitalterrene/",
  spoutible: "https://spoutible.com/digitalterrene",
};
