# LUMORA GROUP — Architecture technique

> Site vitrine multi-activités + back-office mobile-first — Conakry, Guinée.
> Slogan : *Elevating Everyday Living*

## 1. Décision structurante : statique vs backend

**Décision : application avec backend — Next.js (App Router) + Supabase, déployée sur Vercel.**

Un site statique pur est éliminé d'office par trois besoins :

1. **Module articles Pilates** : la cliente publie elle-même sans intervention technique → il faut une base de données, un back-office authentifié et un stockage d'images.
2. **Réservations Pilates/Beleza avec gestion de créneaux** : il faut persister les créneaux et les réservations, et les consulter depuis le back-office.
3. **Suivi des demandes de devis** : les formulaires ne doivent pas seulement envoyer un e-mail, ils alimentent un tableau de suivi (statut nouveau / en cours / traité).

### Pourquoi Next.js plutôt que React + Vite (SPA)

| Critère | Next.js | SPA Vite |
|---|---|---|
| SEO (site vitrine → référencement local Conakry) | Pages rendues serveur/statiques, indexables | Rendu client, SEO médiocre sans bricolage |
| Performance sur réseau mobile guinéen (3G fréquente) | Pages statiques pré-générées, très peu de JS envoyé | Tout le bundle JS avant premier affichage |
| Images (site très visuel : café, beauté, BTP) | `next/image` : compression, formats modernes, lazy-load automatiques | À la main |
| Formulaires sécurisés | Server Actions : validation côté serveur, clés jamais exposées | Il faut exposer l'API Supabase côté client partout |
| Déploiement | Vercel en un clic, HTTPS, CDN | Pareil, mais sans les points ci-dessus |

### Pourquoi Supabase

- **Postgres managé** (articles, créneaux, réservations, demandes) + **Auth** (comptes admin cliente/employé) + **Storage** (images d'articles) dans un seul service, plan gratuit largement suffisant au démarrage.
- **Row Level Security (RLS)** : le public ne peut qu'insérer des réservations/demandes et lire les articles publiés ; seuls les comptes admin lisent et gèrent le reste.
- Pas de serveur à maintenir — critique pour un projet livré à une cliente non technique.

## 2. Stack retenue

| Couche | Choix | Rôle |
|---|---|---|
| Framework | **Next.js 15 (App Router, TypeScript)** | Pages publiques statiques (SSG/ISR) + back-office dynamique |
| UI | **Tailwind CSS v4** | Mobile-first natif (classes de base = mobile, `md:`/`lg:` = agrandissement) |
| Base de données | **Supabase Postgres** | Articles, créneaux, réservations, demandes |
| Auth | **Supabase Auth** (email + mot de passe) | 2–3 comptes admin (cliente + employé) |
| Fichiers | **Supabase Storage** | Images de couverture des articles |
| Formulaires | **Server Actions** + validation **Zod** | Insertion sécurisée, honeypot anti-spam |
| Hébergement | **Vercel** | CDN, HTTPS, previews |
| Polices | `next/font` — serif prestige (ex. Cormorant Garamond) + sans-serif (ex. Inter) | Chargement optimisé, pas de FOUT |

Les blocs structurés (prestations, menu du café, tarifs pressing…) restent dans
le code. Leurs titres, introductions et visibilité peuvent toutefois être
surchargés depuis l'admin grâce à `page_sections`. Sans surcharge, le rendu
reprend automatiquement le contenu du code. Les lignes `is_custom=true`
représentent des sections libres ajoutées en fin de page depuis le CMS. Le champ `activity` des articles
permet d'étendre le blog aux autres activités plus tard sans migration.

Les prix suivent le même principe hybride : les grilles de référence restent
versionnées dans `src/lib/data/`, tandis que `pricing_overrides` conserve les
montants, libellés et états de visibilité modifiés depuis `Admin > Tarifs`.
Les lignes `is_custom=true` sont de nouveaux tarifs rattachés à une catégorie
existante ; les autres restent des surcharges des références du code.

> **État d'implémentation (juillet 2026)** : Supabase est branché **en local** via le
> Supabase CLI (Docker). Le schéma vit désormais dans `supabase/migrations/` (plus de
> `supabase/schema.sql`), avec en plus la colonne `class_slots.format` (`reformer`/`mat`)
> et la fonction `open_slots()` (places restantes sans exposer `bookings`). Les lectures
> publiques passent par `src/lib/data/` (client anon) et les écritures par des Server
> Actions Zod dans `src/lib/actions/` (client service role). Le socle du back-office
> `/admin` est maintenant opérationnel : authentification Supabase SSR, proxy Next.js 16,
> contrôle du rôle, tableau de bord, vues de consultation responsive et édition
> des sections des pages publiques. Restent à faire : CRUD des contenus métier,
> upload Storage et déploiement cloud.

## 3. Modèle de données (Supabase)

```sql
-- Articles (Pilates d'abord, extensible via `activity`)
articles (
  id uuid pk,
  activity text default 'pilates',          -- extension future : 'cafe', 'beleza'…
  title text, slug text unique,
  excerpt text, body text,                  -- body en markdown simple
  cover_image_url text,
  status text check in ('draft','published') default 'draft',
  published_at timestamptz, created_at, updated_at
)

-- Créneaux de cours Pilates (créés par l'admin)
class_slots (
  id uuid pk,
  title text,                               -- ex. "Pilates Mat débutant"
  starts_at timestamptz, duration_min int default 60,
  capacity int default 8,
  status text check in ('open','closed','cancelled') default 'open'
)

-- Réservations : Pilates (liées à un créneau) ET Beleza (date souhaitée libre)
bookings (
  id uuid pk,
  activity text check in ('pilates','beleza'),
  slot_id uuid null references class_slots, -- rempli pour Pilates
  service text,                             -- pour Beleza : "Massage relaxant", etc.
  preferred_at timestamptz null,            -- pour Beleza : date/heure souhaitée
  customer_name text, phone text,           -- téléphone = contact principal (WhatsApp)
  email text null, notes text null,
  status text check in ('pending','confirmed','cancelled','done') default 'pending',
  created_at
)

-- Demandes de contact / devis
leads (
  id uuid pk,
  activity text check in ('construction','pressing','boutique','showroom','general'),
  name text, phone text, email text null,
  subject text null, message text,
  status text check in ('new','in_progress','closed') default 'new',
  created_at
)

-- Profils admin (miroir de auth.users)
profiles ( id uuid pk references auth.users, full_name text, role text default 'admin' )
```

**Règles RLS :**
- `articles` : SELECT public si `status='published'` ; CRUD complet pour rôle authentifié.
- `class_slots` : SELECT public si `status='open'` et `starts_at > now()` ; CRUD admin.
- `bookings` / `leads` : **aucun accès public direct** — insertion uniquement via Server Action (clé service côté serveur, jamais dans le navigateur) ; lecture/mise à jour réservées aux admins.
- Storage `article-images` : lecture publique, écriture admin.

## 4. Arborescence des routes

```
Public (statique/ISR, mobile-first)
/                        Accueil : LUMORA GROUP + grille des 7 activités
/construction            Prestations BTP + formulaire devis
/cafe                    Menu à prix fixes + infos pratiques (pas de résa)
/pilates                 Cours, coachs, horaires + réservation de créneau
/pilates/actualites      Liste des articles publiés
/pilates/actualites/[slug]  Article
/pressing                Services, tarifs + formulaire contact/devis
/beleza-beauty           Prestations massage/soins + formulaire réservation
/boutique                Présentation produits, moyens de paiement acceptés + contact
/showroom                Galerie échantillons + formulaire demande de devis
/contact                 Coordonnées, carte, liens Facebook/TikTok

Admin (protégé, dynamique, mobile-first avec barre de navigation basse)
/admin/login
/admin                   Tableau de bord : compteurs (nouvelles résa/demandes)
/admin/pages             Pages publiques regroupées par catégorie
/admin/pages/[slug]      Sections éditables d'une page
/admin/pages/[slug]/nouvelle  Ajout d'une section libre en fin de page
/admin/pages/[slug]/[sectionKey]  Édition, visibilité et réinitialisation
/admin/tarifs            Vue des grilles Café, Pilates et Pressing
/admin/tarifs/[activity]/nouveau  Ajout d'une ligne tarifaire
/admin/tarifs/[activity]/[itemKey]  Édition d'un tarif et retour au défaut
/admin/realisations       Projets de la page Lumora Construction
/admin/realisations/nouveau  Ajout avec téléversement d'une photo
/admin/realisations/[id]  Modification, publication ou suppression
/admin/articles          Liste + créer/éditer/publier/dépublier
/admin/articles/nouveau
/admin/articles/[id]
/admin/creneaux          Gestion des créneaux Pilates
/admin/reservations      Pilates + Beleza, filtre par activité/statut
/admin/demandes          Devis/contact, filtre par activité/statut
```

Protection : middleware Next.js — toute route `/admin/*` (hors login) exige une session Supabase.

## 5. Stratégie de rendu et performance

- **Pages publiques** : génération statique ; les pages articles utilisent l'ISR avec `revalidateTag` déclenché à la publication → publication visible immédiatement sans redéploiement.
- **Back-office** : composants client + Server Actions, aucune indexation (`noindex`).
- **Budget mobile** : images via `next/image` (AVIF/WebP), pas de bibliothèque UI lourde, pas de carrousel JS sur l'accueil, cible Lighthouse mobile ≥ 90.
- **Tactile** : cibles ≥ 44 px, formulaires courts (nom + téléphone obligatoires, e-mail optionnel — usage WhatsApp dominant), aucun comportement dépendant du hover.
- **Back-office mobile** : listes en cartes (jamais de tableaux larges), barre d'onglets fixe en bas (Articles / Résa / Demandes), actions par boutons pleine largeur.

## 6. Charte graphique (tokens Tailwind)

```css
--color-forest:  #1a3d2e;   /* marque, titres, fonds sombres */
--color-gold:    #c9a35c;   /* accents, filets, boutons secondaires */
--color-cream:   #f5f0e8;   /* fond général */
--font-display:  serif élégante (titres, logo texte)
--font-body:     sans-serif fine (texte courant)
```

Élément graphique récurrent : feuille de thé (SVG plat). Le logo PNG 3D fourni sera décliné en version plate SVG/PNG optimisée pour le header (fond sombre) et le favicon.

## 7. Notifications (v1 simple)

À la v1, les nouvelles réservations/demandes apparaissent dans le tableau de bord admin avec badge « nouveau ». Option d'extension facile : e-mail automatique à la cliente via Resend (gratuit à ce volume) à chaque nouvelle réservation — prévu dans l'architecture (Server Action → envoi après insertion), activable en phase 2.

## 8. Plan de développement (aligné sur les priorités)

1. **Fondations** : init Next.js + Tailwind + tokens charte, layout global (header/footer/nav mobile), navigation des 7 activités.
2. **Pages publiques statiques** : accueil + 8 pages activités/contact avec contenu provisoire réaliste.
3. **Supabase** : projet, schéma SQL + RLS, clients server/browser, auth admin.
4. **Réservations** : créneaux Pilates (affichage public + résa) et formulaire Beleza ; Server Actions + Zod.
5. **Devis/contact** : formulaires Construction, Pressing, Boutique, Showroom → table `leads`.
6. **Module articles** : CRUD complet + upload image + publication/dépublication + ISR.
7. **Back-office complet** : tableau de bord, gestion réservations et demandes avec statuts, le tout mobile-first.
8. **Finitions** : intégration du logo optimisé, SEO (métadonnées, OpenGraph, sitemap), liens Facebook/TikTok, audit Lighthouse mobile.

## 9. Prérequis côté cliente / à fournir

- Fichier logo PNG (haute résolution) pour dérivation web.
- URLs exactes des pages Facebook et TikTok.
- Contenus réels : menu café, tarifs pressing, liste des soins Beleza, types de cours Pilates, photos.
- Adresse physique + numéro(s) de téléphone/WhatsApp à afficher.
- Compte Supabase et compte Vercel (gratuits) — ou création lors du déploiement.
```
