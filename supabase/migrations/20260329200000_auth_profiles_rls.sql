-- Profiles (1:1 with auth.users). Trigger creates row on signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- New user → profile row (role defaults to 'user'; promote to 'owner' in SQL when needed)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'user'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Properties: reference auth.users (drop legacy FK to public.users if present)
alter table public.properties drop constraint if exists properties_owner_id_fkey;
alter table public.properties
  add constraint properties_owner_id_fkey
  foreign key (owner_id) references auth.users (id) on delete cascade;

alter table public.properties enable row level security;
alter table public.property_images enable row level security;

drop policy if exists "properties_select_public" on public.properties;
create policy "properties_select_public"
  on public.properties for select
  to anon, authenticated
  using (true);

drop policy if exists "properties_insert_owner" on public.properties;
create policy "properties_insert_owner"
  on public.properties for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "properties_update_owner" on public.properties;
create policy "properties_update_owner"
  on public.properties for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "properties_delete_owner" on public.properties;
create policy "properties_delete_owner"
  on public.properties for delete
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "property_images_select_public" on public.property_images;
create policy "property_images_select_public"
  on public.property_images for select
  to anon, authenticated
  using (true);

drop policy if exists "property_images_insert_owner" on public.property_images;
create policy "property_images_insert_owner"
  on public.property_images for insert
  to authenticated
  with check (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.owner_id = auth.uid()
    )
  );

drop policy if exists "property_images_delete_owner" on public.property_images;
create policy "property_images_delete_owner"
  on public.property_images for delete
  to authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.owner_id = auth.uid()
    )
  );
