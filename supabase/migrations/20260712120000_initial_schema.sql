-- ============================================================
-- LUMORA GROUP — Migration initiale
-- Reprend l'ancien supabase/schema.sql, avec en plus :
--   * class_slots.format ('reformer' | 'mat') pour distinguer les
--     deux offres du studio (voir src/lib/data/pilates-pricing.ts) ;
--   * la fonction open_slots() qui expose les créneaux ouverts avec
--     les places restantes sans donner d'accès public aux bookings.
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILS ADMIN (miroir de auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- Crée automatiquement un profil à l'inscription d'un utilisateur.
-- Les comptes sont créés à la main dans le dashboard Supabase (2-3 admins),
-- il n'y a pas d'inscription publique.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper : l'utilisateur courant est-il un admin ?
create or replace function public.is_admin()
returns boolean
language sql
stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- 2. ARTICLES (blog Pilates, extensible aux autres activités)
-- ------------------------------------------------------------
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  activity        text not null default 'pilates'
                  check (activity in ('pilates', 'construction', 'cafe', 'pressing', 'beleza', 'boutique', 'showroom', 'group')),
  title           text not null,
  slug            text not null unique,
  excerpt         text,
  body            text not null default '',        -- markdown simple
  cover_image_url text,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists articles_activity_status_idx
  on public.articles (activity, status, published_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 3. CRÉNEAUX DE COURS PILATES
-- ------------------------------------------------------------
create table if not exists public.class_slots (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,                       -- ex. « Reformer — Débutant »
  format       text not null check (format in ('reformer', 'mat')),
  starts_at    timestamptz not null,
  duration_min integer not null default 60 check (duration_min between 15 and 240),
  capacity     integer not null default 8 check (capacity between 1 and 50),
  status       text not null default 'open' check (status in ('open', 'closed', 'cancelled')),
  created_at   timestamptz not null default now()
);

create index if not exists class_slots_starts_at_idx
  on public.class_slots (status, starts_at);

-- ------------------------------------------------------------
-- 4. RÉSERVATIONS (Pilates : liées à un créneau ; Beleza : date souhaitée)
-- ------------------------------------------------------------
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  activity      text not null check (activity in ('pilates', 'beleza')),
  slot_id       uuid references public.class_slots (id) on delete set null,
  service       text,                               -- Beleza : soin ; Pilates : formule choisie
  preferred_at  timestamptz,                        -- Beleza : date/heure souhaitée
  customer_name text not null,
  phone         text not null,                      -- contact principal (WhatsApp)
  email         text,
  notes         text,
  status        text not null default 'pending'
                check (status in ('pending', 'confirmed', 'cancelled', 'done')),
  created_at    timestamptz not null default now(),
  -- Cohérence : un créneau pour Pilates, un soin pour Beleza.
  constraint bookings_activity_shape check (
    (activity = 'pilates' and slot_id is not null)
    or
    (activity = 'beleza' and service is not null)
  )
);

create index if not exists bookings_status_idx on public.bookings (status, created_at desc);
create index if not exists bookings_slot_idx   on public.bookings (slot_id);

-- ------------------------------------------------------------
-- 5. DEMANDES DE CONTACT / DEVIS
-- ------------------------------------------------------------
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  activity   text not null
             check (activity in ('construction', 'pressing', 'boutique', 'showroom', 'general')),
  name       text not null,
  phone      text not null,
  email      text,
  subject    text,
  message    text not null,
  status     text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (activity, status, created_at desc);

-- ------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- Principe : le public ne lit que les articles publiés et les créneaux
-- ouverts. Les insertions de bookings/leads passent exclusivement par les
-- Server Actions Next.js (clé service role, qui contourne la RLS) — aucune
-- policy d'insertion anonyme n'est donc définie. Les admins authentifiés
-- gèrent tout.
-- ------------------------------------------------------------
alter table public.profiles    enable row level security;
alter table public.articles    enable row level security;
alter table public.class_slots enable row level security;
alter table public.bookings    enable row level security;
alter table public.leads       enable row level security;

-- profiles : chacun lit son propre profil
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid());

-- articles : lecture publique des publiés, CRUD admin
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "articles_admin_all" on public.articles;
create policy "articles_admin_all" on public.articles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- class_slots : lecture publique des créneaux ouverts à venir, CRUD admin
drop policy if exists "class_slots_public_read" on public.class_slots;
create policy "class_slots_public_read" on public.class_slots
  for select to anon, authenticated
  using (status = 'open' and starts_at > now());

drop policy if exists "class_slots_admin_all" on public.class_slots;
create policy "class_slots_admin_all" on public.class_slots
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- bookings : admins uniquement (insertion publique via service role)
drop policy if exists "bookings_admin_all" on public.bookings;
create policy "bookings_admin_all" on public.bookings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- leads : admins uniquement (insertion publique via service role)
drop policy if exists "leads_admin_all" on public.leads;
create policy "leads_admin_all" on public.leads
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- 7. CRÉNEAUX OUVERTS AVEC PLACES RESTANTES
-- Les bookings ne sont pas lisibles publiquement : cette fonction
-- (security definer) expose uniquement l'agrégat « places restantes »
-- des créneaux ouverts à venir, consommée par getOpenSlots().
-- ------------------------------------------------------------
create or replace function public.open_slots()
returns table (
  id           uuid,
  title        text,
  format       text,
  starts_at    timestamptz,
  duration_min integer,
  capacity     integer,
  remaining    integer
)
language sql
stable security definer set search_path = public
as $$
  select
    s.id, s.title, s.format, s.starts_at, s.duration_min, s.capacity,
    greatest(
      s.capacity - count(b.id) filter (where b.status in ('pending', 'confirmed')),
      0
    )::integer as remaining
  from public.class_slots s
  left join public.bookings b on b.slot_id = s.id
  where s.status = 'open' and s.starts_at > now()
  group by s.id
  order by s.starts_at;
$$;

grant execute on function public.open_slots() to anon, authenticated;

-- ------------------------------------------------------------
-- 8. STORAGE : images de couverture des articles
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

drop policy if exists "article_images_public_read" on storage.objects;
create policy "article_images_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'article-images');

drop policy if exists "article_images_admin_write" on storage.objects;
create policy "article_images_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'article-images' and public.is_admin());

drop policy if exists "article_images_admin_update" on storage.objects;
create policy "article_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'article-images' and public.is_admin());

drop policy if exists "article_images_admin_delete" on storage.objects;
create policy "article_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'article-images' and public.is_admin());
