-- Réalisations présentées sur la page Lumora Construction.

create table if not exists public.construction_projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  description  text not null default '',
  location     text,
  category     text not null default 'construction'
               check (category in ('construction', 'renovation', 'amenagement')),
  image_url    text not null,
  completed_at date,
  is_visible   boolean not null default true,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists construction_projects_public_idx
  on public.construction_projects (is_visible, position, completed_at desc);

drop trigger if exists construction_projects_set_updated_at on public.construction_projects;
create trigger construction_projects_set_updated_at
  before update on public.construction_projects
  for each row execute function public.set_updated_at();

alter table public.construction_projects enable row level security;

drop policy if exists "construction_projects_public_read" on public.construction_projects;
create policy "construction_projects_public_read" on public.construction_projects
  for select to anon, authenticated
  using (is_visible or public.is_admin());

drop policy if exists "construction_projects_admin_all" on public.construction_projects;
create policy "construction_projects_admin_all" on public.construction_projects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "project_images_public_read" on storage.objects;
create policy "project_images_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "project_images_admin_insert" on storage.objects;
create policy "project_images_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_admin_update" on storage.objects;
create policy "project_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_admin_delete" on storage.objects;
create policy "project_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
