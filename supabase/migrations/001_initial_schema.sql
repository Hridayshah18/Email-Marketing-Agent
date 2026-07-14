create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text unique not null,
  company_name text,
  city text,
  business_type text,
  service_interest text,
  source text,
  unsubscribed boolean default false,
  unsubscribed_at timestamp nullable,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  service_type text not null,
  offer_details text not null,
  target_audience text,
  bonus text,
  urgency text,
  cta_text text,
  cta_url text,
  tone text,
  status text default 'draft',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid references promotions(id) on delete set null,
  name text not null,
  email_style text default 'marketing_template' check (email_style in ('marketing_template', 'plain_outreach')),
  subject text,
  preview_text text,
  plain_text_body text,
  html_body text,
  selected_subject_index int,
  status text default 'draft',
  scheduled_at timestamp nullable,
  sent_at timestamp nullable,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  resend_email_id text nullable,
  tracking_token text unique not null,
  status text default 'pending',
  sent_at timestamp nullable,
  delivered_at timestamp nullable,
  opened_at timestamp nullable,
  clicked_at timestamp nullable,
  bounced_at timestamp nullable,
  complained_at timestamp nullable,
  unsubscribed_at timestamp nullable,
  created_at timestamp default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  campaign_recipient_id uuid references campaign_recipients(id) on delete set null,
  event_type text not null,
  metadata jsonb default '{}',
  created_at timestamp default now()
);

create table if not exists ai_generations (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid references promotions(id) on delete cascade,
  campaign_id uuid nullable references campaigns(id) on delete set null,
  input jsonb not null,
  output jsonb not null,
  created_at timestamp default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  company_name text default 'Digital Terrene',
  from_name text default 'Digital Terrene',
  from_email text default 'promotions@digitalterrene.online',
  reply_to_email text default 'promotions@digitalterrene.online',
  website_url text default 'https://digitalterrene.online',
  address_line text default 'Digital Terrene contact address placeholder',
  default_cta_url text default 'https://digitalterrene.online',
  brand_primary_color text default '#2563eb',
  social_links jsonb default '{
    "instagram": "https://www.instagram.com/digital_terrene/",
    "minds": "https://www.minds.com/digitalterrene/",
    "linkedin": "https://www.linkedin.com/in/digital-terrene-b724232b3",
    "facebook": "https://www.facebook.com/DIGITALTERRENE786",
    "tumblr": "https://www.tumblr.com/blog/digitalterrene1",
    "x": "https://x.com/DTerrene7072",
    "mewe": "https://mewe.com/digitalterrene06.51/posts",
    "pinterest": "https://in.pinterest.com/digitalterrene/",
    "spoutible": "https://spoutible.com/digitalterrene"
  }'::jsonb,
  consent_note text default 'Only upload contacts who have consented to receive marketing emails.',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

insert into settings (company_name)
select 'Digital Terrene'
where not exists (select 1 from settings);

create trigger contacts_updated_at before update on contacts for each row execute function set_updated_at();
create trigger promotions_updated_at before update on promotions for each row execute function set_updated_at();
create trigger campaigns_updated_at before update on campaigns for each row execute function set_updated_at();
create trigger settings_updated_at before update on settings for each row execute function set_updated_at();

create index if not exists contacts_email_idx on contacts (lower(email));
create index if not exists contacts_unsubscribed_idx on contacts (unsubscribed);
create index if not exists campaign_recipients_campaign_idx on campaign_recipients (campaign_id);
create index if not exists campaign_recipients_resend_idx on campaign_recipients (resend_email_id);
create index if not exists events_campaign_created_idx on events (campaign_id, created_at);
create index if not exists events_type_idx on events (event_type);
