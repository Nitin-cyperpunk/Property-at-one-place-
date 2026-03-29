-- Run AFTER create-listing-bucket.sql (or after creating the same bucket in the Dashboard).
-- Bucket id must match: default is "property-images" (or your NEXT_PUBLIC_STORAGE_BUCKET value).

-- Public read (listing images).
drop policy if exists "property_images_public_read" on storage.objects;
create policy "property_images_public_read"
  on storage.objects for select
  using (bucket_id = 'property-images');

-- Authenticated uploads (when not using the service role key on the server).
drop policy if exists "property_images_authenticated_insert" on storage.objects;
create policy "property_images_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "property_images_authenticated_delete" on storage.objects;
create policy "property_images_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');

-- Service role uploads bypass RLS; no policy needed for the service role key.
