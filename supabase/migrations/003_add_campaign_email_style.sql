alter table campaigns
add column if not exists email_style text default 'marketing_template';

update campaigns
set email_style = 'marketing_template'
where email_style is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'campaigns_email_style_check'
  ) then
    alter table campaigns
    add constraint campaigns_email_style_check
    check (email_style in ('marketing_template', 'plain_outreach'));
  end if;
end $$;
