-- Agar schema.sql pehle chala chuke ho, to sirf ye chalao.
create table if not exists site_settings (
  key text primary key,
  value text
);
alter table site_settings enable row level security;
drop policy if exists "public read settings" on site_settings;
drop policy if exists "admin write settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
create policy "admin write settings" on site_settings for all to authenticated using (true) with check (true);
