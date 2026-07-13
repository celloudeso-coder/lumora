-- Autorise les ajouts créés depuis le CMS, tout en distinguant clairement
-- les entrées de référence définies dans le code.

alter table public.page_sections
  add column if not exists is_custom boolean not null default false,
  add column if not exists position integer not null default 0;

alter table public.pricing_overrides
  add column if not exists is_custom boolean not null default false,
  add column if not exists group_name text,
  add column if not exists mode text check (mode is null or mode in ('single', 'sizes'));

create index if not exists page_sections_custom_idx
  on public.page_sections (page_slug, is_custom, position, created_at);

create index if not exists pricing_overrides_custom_idx
  on public.pricing_overrides (activity, is_custom, group_name, created_at);
