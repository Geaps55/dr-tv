-- DR TV — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) before seeding.

create extension if not exists "pgcrypto";

create table if not exists channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null check (category in ('national-news', 'sports', 'entertainment', 'regional', 'christian')),
  province text,
  logo_url text,
  channel_description text not null,
  embed_type text not null check (embed_type in ('youtube', 'hls', 'facebook', 'iframe', 'link_only')),
  embed_source text not null,
  fallback_url text,
  seo_title text not null,
  seo_description text not null,
  status text not null default 'active' check (status in ('active', 'broken', 'needs_review')),
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists channels_category_idx on channels (category);
create index if not exists channels_status_idx on channels (status);
create index if not exists channels_featured_idx on channels (featured);

-- Keep updated_at fresh on every write.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists channels_set_updated_at on channels;
create trigger channels_set_updated_at
  before update on channels
  for each row execute function set_updated_at();

create table if not exists site_settings (
  key text primary key,
  value text
);

insert into site_settings (key, value) values
  ('site_title', 'DR TV — Canales Dominicanos en Vivo'),
  ('site_tagline', 'Todos los canales de televisión dominicanos, en un solo lugar.'),
  ('default_seo_description', 'Mira los canales de televisión dominicanos en vivo online gratis. Noticias, deportes, entretenimiento y canales regionales de República Dominicana.'),
  ('adsense_client_id', ''),
  ('ads_zone_a_enabled', 'true'),
  ('ads_zone_b_enabled', 'true'),
  ('ads_zone_c_enabled', 'true'),
  ('ads_zone_d_enabled', 'true')
on conflict (key) do nothing;

-- Row-Level Security
-- Public site reads channels + site_settings via the anon key.
-- Writes go through the service role (seed script + admin server actions).
alter table channels enable row level security;
alter table site_settings enable row level security;

drop policy if exists "channels are public read" on channels;
create policy "channels are public read"
  on channels for select
  using (true);

drop policy if exists "settings are public read" on site_settings;
create policy "settings are public read"
  on site_settings for select
  using (true);
