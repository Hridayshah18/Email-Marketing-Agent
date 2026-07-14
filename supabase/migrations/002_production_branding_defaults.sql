alter table settings alter column from_email set default 'promotions@digitalterrene.online';
alter table settings alter column reply_to_email set default 'promotions@digitalterrene.online';
alter table settings alter column website_url set default 'https://digitalterrene.online';
alter table settings alter column default_cta_url set default 'https://digitalterrene.online';

update settings
set
  company_name = coalesce(nullif(company_name, ''), 'Digital Terrene'),
  from_name = coalesce(nullif(from_name, ''), 'Digital Terrene'),
  from_email = case
    when from_email is null or from_email = '' or from_email = 'hello@yourdomain.com' then 'promotions@digitalterrene.online'
    else from_email
  end,
  reply_to_email = case
    when reply_to_email is null or reply_to_email = '' or reply_to_email = 'digitalterrene06@gmail.com' then 'promotions@digitalterrene.online'
    else reply_to_email
  end,
  website_url = case
    when website_url is null or website_url = '' or website_url like '%social-vape.com%' then 'https://digitalterrene.online'
    else website_url
  end,
  default_cta_url = case
    when default_cta_url is null or default_cta_url = '' or default_cta_url like '%social-vape.com%' then 'https://digitalterrene.online'
    else default_cta_url
  end;

