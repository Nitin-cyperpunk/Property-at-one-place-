-- Run ONCE in Supabase → SQL Editor (fixes "Bucket not found").
-- Or create the same bucket manually: Storage → New bucket → name "property-images" → Public.

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update
set public = excluded.public;
