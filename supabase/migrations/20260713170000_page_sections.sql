-- Contenus éditables des sections de pages publiques.
-- Une ligne représente une surcharge CMS ; en son absence, le site conserve
-- le contenu par défaut défini dans le code.

create table if not exists public.page_sections (
  id          uuid primary key default gen_random_uuid(),
  page_slug   text not null,
  section_key text not null,
  title       text,
  intro       text,
  body        text,
  is_visible  boolean not null default true,
  updated_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (page_slug, section_key)
);

create index if not exists page_sections_page_idx
  on public.page_sections (page_slug, section_key);

drop trigger if exists page_sections_set_updated_at on public.page_sections;
create trigger page_sections_set_updated_at
  before update on public.page_sections
  for each row execute function public.set_updated_at();

alter table public.page_sections enable row level security;

-- Ces contenus sont destinés au site public et ne contiennent aucune donnée
-- privée. Lire aussi les sections masquées permet au rendu public de savoir
-- qu'il ne doit pas utiliser son contenu de repli.
drop policy if exists "page_sections_public_read" on public.page_sections;
create policy "page_sections_public_read" on public.page_sections
  for select to anon, authenticated
  using (true);

drop policy if exists "page_sections_admin_all" on public.page_sections;
create policy "page_sections_admin_all" on public.page_sections
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
