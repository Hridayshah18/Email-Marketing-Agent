export type Contact = {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  company_name?: string | null;
  city?: string | null;
  business_type?: string | null;
  service_interest?: string | null;
  source?: string | null;
  unsubscribed?: boolean | null;
};

export type Promotion = {
  id: string;
  title: string;
  service_type: string;
  offer_details: string;
  target_audience?: string | null;
  bonus?: string | null;
  urgency?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  tone?: string | null;
};

export type Campaign = {
  id?: string;
  promotion_id?: string | null;
  name?: string | null;
  email_style?: "marketing_template" | "plain_outreach" | null;
  subject?: string | null;
  preview_text?: string | null;
  plain_text_body?: string | null;
  html_body?: string | null;
  selected_subject_index?: number | null;
};
