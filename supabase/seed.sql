-- ============================================================
-- LUMORA GROUP — Seed de développement local
-- Appliqué par `supabase start` (premier démarrage) et `supabase db reset`.
-- Dates des créneaux relatives à now() : toujours dans le futur.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ARTICLES PILATES (contenu repris des anciens mocks)
-- ------------------------------------------------------------
insert into public.articles (activity, title, slug, excerpt, body, status, published_at)
values
  (
    'pilates',
    'Nouveau : cours de Pilates prénatal le samedi matin',
    'cours-pilates-prenatal-samedi',
    'À partir de ce mois-ci, Lumora Pilates ouvre un créneau dédié aux futures mamans, chaque samedi à 10h.',
    E'Nous sommes heureux d''annoncer l''ouverture d''un cours de **Pilates prénatal**, spécialement conçu pour accompagner les futures mamans à chaque étape de la grossesse.\n\nLe cours se déroule chaque **samedi à 10h**, en petit groupe de 6 personnes maximum, dans une ambiance douce et bienveillante.\n\nAu programme : respiration, renforcement en douceur du dos et du plancher pelvien, mobilité et relaxation.\n\nRéservez votre place depuis la page Lumora Pilates — les places partent vite !',
    'published',
    '2026-07-05T09:00:00Z'
  ),
  (
    'pilates',
    '5 bienfaits du Pilates que vous ressentirez dès le premier mois',
    '5-bienfaits-du-pilates',
    'Posture, souplesse, sommeil… découvrez ce que quelques séances régulières peuvent changer dans votre quotidien.',
    E'Le Pilates est bien plus qu''une simple gymnastique douce. Pratiqué régulièrement, il transforme la relation que vous entretenez avec votre corps.\n\n1. **Une meilleure posture** — le travail du centre corrige les déséquilibres du quotidien.\n2. **Moins de douleurs de dos** — le renforcement profond soulage la colonne.\n3. **Plus de souplesse** — les étirements actifs allongent les muscles.\n4. **Un meilleur sommeil** — la respiration contrôlée apaise le système nerveux.\n5. **Plus d''énergie** — un corps aligné se fatigue moins.\n\nEnvie d''essayer ? Votre première séance découverte vous attend chez Lumora Pilates.',
    'published',
    '2026-06-20T09:00:00Z'
  ),
  (
    'pilates',
    'Offre de lancement : -20% sur le pack 10 séances',
    'offre-lancement-pack-10-seances',
    'Pour fêter l''ouverture du studio, profitez de 20% de réduction sur le pack de 10 séances jusqu''à la fin du mois.',
    E'Pour célébrer l''ouverture de notre studio à Conakry, **Lumora Pilates** vous offre **20% de réduction** sur le pack de 10 séances.\n\nL''offre est valable jusqu''à la fin du mois, pour toute première inscription.\n\nRenseignez-vous au studio ou via le formulaire de réservation — notre équipe vous recontacte sous 24h.',
    'published',
    '2026-06-01T09:00:00Z'
  )
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- 2. CRÉNEAUX PILATES — 2 semaines à venir
-- Reformer : petits groupes (6 places). Mat/Yoga : 8-10 places.
-- ------------------------------------------------------------
with base as (select date_trunc('day', now()) as d)
insert into public.class_slots (title, format, starts_at, duration_min, capacity)
select title, format, d + offset_days * interval '1 day' + start_hour * interval '1 hour', duration_min, capacity
from base, (values
  -- Semaine 1
  ('Reformer — Débutant',        'reformer',  1, 8,  60,  6),
  ('Mat / Yoga — Débutant',      'mat',       1, 18, 60,  8),
  ('Reformer — Intermédiaire',   'reformer',  2, 18, 60,  6),
  ('Mat / Yoga — Stretch & Relax', 'mat',     3, 18, 45, 10),
  ('Reformer — Débutant',        'reformer',  4, 8,  60,  6),
  ('Mat / Yoga — Prénatal',      'mat',       5, 10, 45,  6),
  ('Reformer — Intermédiaire',   'reformer',  5, 17, 60,  6),
  -- Semaine 2
  ('Reformer — Débutant',        'reformer',  8, 8,  60,  6),
  ('Mat / Yoga — Débutant',      'mat',       8, 18, 60,  8),
  ('Reformer — Intermédiaire',   'reformer',  9, 18, 60,  6),
  ('Mat / Yoga — Stretch & Relax', 'mat',    10, 18, 45, 10),
  ('Reformer — Débutant',        'reformer', 11, 8,  60,  6),
  ('Mat / Yoga — Prénatal',      'mat',      12, 10, 45,  6),
  ('Reformer — Intermédiaire',   'reformer', 12, 17, 60,  6)
) as slots(title, format, offset_days, start_hour, duration_min, capacity);

-- ------------------------------------------------------------
-- 3. COMPTES ADMIN DE TEST (local uniquement — ne jamais seeder en prod)
-- Le trigger handle_new_user crée automatiquement les lignes `profiles`.
--   cliente@lumora.test / LumoraCliente1!
--   employe@lumora.test / LumoraEmploye1!
--   dev@lumora.test     / LumoraDev1!
-- ------------------------------------------------------------
do $$
declare
  u record;
  uid uuid;
begin
  for u in
    select * from (values
      ('cliente@lumora.test', 'LumoraCliente1!', 'Cliente Lumora'),
      ('employe@lumora.test', 'LumoraEmploye1!', 'Employé Lumora'),
      ('dev@lumora.test',     'LumoraDev1!',     'Dev Test')
    ) as t(email, password, full_name)
  loop
    uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    )
    values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated',
      'authenticated', u.email,
      extensions.crypt(u.password, extensions.gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', u.full_name), now(), now()
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    )
    values (
      gen_random_uuid(), uid, uid::text,
      jsonb_build_object('sub', uid::text, 'email', u.email, 'email_verified', true),
      'email', now(), now(), now()
    );
  end loop;
end $$;

-- ------------------------------------------------------------
-- 4. QUELQUES RÉSERVATIONS pour rendre `remaining` réaliste
-- ------------------------------------------------------------
insert into public.bookings (activity, slot_id, service, customer_name, phone, status)
select 'pilates', s.id, 'Session unique', 'Client Démo ' || gs, '+224 6' || (10 + gs) || '0 00 00 0' || gs, 'confirmed'
from (
  select id, row_number() over (order by starts_at) as rn
  from public.class_slots
  where format = 'reformer'
) s
cross join generate_series(1, 3) gs
where s.rn = 1;
