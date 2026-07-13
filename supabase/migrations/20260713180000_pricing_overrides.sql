-- Surcharges tarifaires administrées depuis le back-office.
-- Les lignes absentes continuent d'utiliser les valeurs définies dans le code.

create table if not exists public.pricing_overrides (
  id           uuid primary key default gen_random_uuid(),
  activity     text not null check (activity in ('cafe', 'pilates', 'pressing')),
  item_key     text not null,
  label        text,
  price        bigint check (price is null or price >= 0),
  price_small  bigint check (price_small is null or price_small >= 0),
  price_medium bigint check (price_medium is null or price_medium >= 0),
  price_large  bigint check (price_large is null or price_large >= 0),
  note         text,
  is_visible   boolean not null default true,
  updated_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (activity, item_key)
);

create index if not exists pricing_overrides_activity_idx
  on public.pricing_overrides (activity, item_key);

drop trigger if exists pricing_overrides_set_updated_at on public.pricing_overrides;
create trigger pricing_overrides_set_updated_at
  before update on public.pricing_overrides
  for each row execute function public.set_updated_at();

alter table public.pricing_overrides enable row level security;

drop policy if exists "pricing_overrides_public_read" on public.pricing_overrides;
create policy "pricing_overrides_public_read" on public.pricing_overrides
  for select to anon, authenticated
  using (true);

drop policy if exists "pricing_overrides_admin_all" on public.pricing_overrides;
create policy "pricing_overrides_admin_all" on public.pricing_overrides
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
