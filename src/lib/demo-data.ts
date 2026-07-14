export const demoSummary = {
  totalContacts: 250,
  activeContacts: 238,
  unsubscribedContacts: 12,
  totalCampaigns: 8,
  sent: 1940,
  delivered: 1735,
  opens: 782,
  clicks: 231,
  bounces: 18,
  unsubscribes: 26,
};

export const demoContacts = [
  { id: "c1", first_name: "Asha", last_name: "Sharma", email: "asha@example.com", company_name: "Blue Peak Studio", city: "Mumbai", service_interest: "Website Development", status: "active" },
  { id: "c2", first_name: "Rahul", last_name: "Mehta", email: "rahul@example.com", company_name: "Mehta Foods", city: "Delhi", service_interest: "SEO", status: "active" },
  { id: "c3", first_name: "Priya", last_name: "Kapoor", email: "priya@example.com", company_name: "Kapoor Retail", city: "Bengaluru", service_interest: "Social Media Marketing", status: "active" },
  { id: "c4", first_name: "Neha", last_name: "Iyer", email: "neha@example.com", company_name: "Iyer Wellness", city: "Chennai", service_interest: "Branding", status: "active" },
  { id: "c5", first_name: "Arjun", last_name: "Rao", email: "arjun@example.com", company_name: "Rao Logistics", city: "Hyderabad", service_interest: "Automation", status: "unsubscribed" },
];

export const demoPromotions = [
  { id: "p1", title: "AI Website Launch Offer", service_type: "Website Development", tone: "Premium", cta_url: "https://digitalterrene.online", offer_details: "Launch a conversion-focused business website with AI-assisted content and analytics setup." },
  { id: "p2", title: "Logo Design Growth Campaign", service_type: "Logo Design", tone: "Friendly", cta_url: "https://digitalterrene.online", offer_details: "Refresh brand identity with a polished logo system and social-ready assets." },
  { id: "p3", title: "Social Media Marketing Push", service_type: "Social Media Marketing", tone: "Bold", cta_url: "https://digitalterrene.online", offer_details: "Build a practical content engine for consistent posting, engagement, and lead capture." },
  { id: "p4", title: "SEO Audit Week", service_type: "SEO", tone: "Professional", cta_url: "https://digitalterrene.online", offer_details: "Identify high-impact SEO issues and quick wins for local business growth." },
  { id: "p5", title: "AI Ads Starter Package", service_type: "AI Ads", tone: "Startup-style", cta_url: "https://digitalterrene.online", offer_details: "Create AI-assisted ad concepts, copy variants, and campaign-ready creative directions." },
];

export const demoCampaigns = [
  { id: "dc1", name: "AI Website Launch Offer", subject: "Launch a sharper website this month", status: "sent", sent: 520, delivered: 488, opened: 226, clicked: 74, bounced: 5, unsubscribed: 7 },
  { id: "dc2", name: "Logo Design Growth Campaign", subject: "Give your brand a cleaner first impression", status: "sent", sent: 310, delivered: 286, opened: 119, clicked: 35, bounced: 3, unsubscribed: 4 },
  { id: "dc3", name: "Social Media Marketing Push", subject: "Make your socials work harder", status: "scheduled", sent: 450, delivered: 408, opened: 183, clicked: 57, bounced: 4, unsubscribed: 6 },
  { id: "dc4", name: "SEO Audit Week", subject: "Find the SEO gaps costing you leads", status: "sent", sent: 275, delivered: 248, opened: 104, clicked: 28, bounced: 2, unsubscribed: 3 },
  { id: "dc5", name: "AI Ads Starter Package", subject: "Test better ads before you spend more", status: "draft", sent: 385, delivered: 305, opened: 150, clicked: 37, bounced: 4, unsubscribed: 6 },
];

export const demoLineChart = [
  { date: "Jul 01", sent: 210, opens: 82, clicks: 21 },
  { date: "Jul 02", sent: 280, opens: 117, clicks: 36 },
  { date: "Jul 03", sent: 320, opens: 141, clicks: 43 },
  { date: "Jul 04", sent: 260, opens: 112, clicks: 31 },
  { date: "Jul 05", sent: 390, opens: 169, clicks: 54 },
  { date: "Jul 06", sent: 480, opens: 161, clicks: 46 },
];

export const demoGeneratedCampaign = {
  subject_lines: [
    "Launch a sharper website this month",
    "Your next website can work harder",
    "A better first impression online",
    "Turn website visitors into leads",
    "Modern websites for growing teams",
    "Ready for a cleaner digital presence?",
    "Build trust before the first call",
    "Upgrade your online growth system",
    "Make your website easier to choose",
    "Digital Terrene can help you grow",
  ],
  preview_text: "A concise demo campaign generated with safe mock content.",
  plain_text_body:
    "Hi {{first_name}},\n\nDigital Terrene helps businesses improve their online presence with websites, branding, SEO, social marketing, AI ads, software, and automation.\n\nThis demo email shows how a campaign preview would look before approval.\n\nBook a quick discovery call: {{cta_url}}\n\nUnsubscribe link included below.",
  html_body:
    "<html><body style=\"font-family:Arial,sans-serif;color:#0f172a;line-height:1.6;\"><h1 style=\"font-size:24px;\">Grow with Digital Terrene</h1><p>Hi {{first_name}},</p><p>This demo campaign shows how Digital Terrene can present a clear, polished promotional email.</p><p><a href=\"{{cta_url}}\" style=\"display:inline-block;background:#2563eb;color:white;padding:12px 18px;border-radius:6px;text-decoration:none;\">Book a discovery call</a></p><p style=\"font-size:12px;color:#64748b;\">Unsubscribe link included in every campaign.</p></body></html>",
  cta_text: "Book a discovery call",
  spam_warnings: ["Demo copy avoids fake guarantees and excessive urgency."],
};

export function getDemoCampaign(id: string) {
  return demoCampaigns.find((campaign) => campaign.id === id) || demoCampaigns[0];
}

