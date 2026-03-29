-- Run on existing projects (Supabase SQL editor or migrate).
alter table public.properties add column if not exists area_sqft integer;
alter table public.properties add column if not exists map_link text;

alter table public.properties alter column location drop not null;
