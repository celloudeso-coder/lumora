# LUMORA GROUP — Site vitrine

Site vitrine multi-activités de LUMORA GROUP (Conakry, Guinée) — *Elevating Everyday Living*.
Sept univers : Construction, Café, Pilates, Pressing, Beleza Beauty, Boutique, Show room.

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour l'architecture complète.

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4** — mobile-first
- **Supabase** (Postgres + Auth + Storage) — **branché en local** via le Supabase CLI
  (Docker) : lectures publiques (articles, créneaux) et écritures (réservations,
  demandes) passent par Supabase, plus de données mockées
- Déploiement cible : **Vercel** (pas encore configuré — tout est local pour l'instant)

## Prérequis

- **Node.js** 20+
- **Docker** en cours d'exécution (requis par le Supabase CLI local)
- **Supabase CLI** ([installation](https://supabase.com/docs/guides/cli))

## Démarrer en local

```bash
npm install

# 1. Démarrer l'instance Supabase locale (Postgres + Auth + Storage dans Docker).
#    Applique automatiquement les migrations (supabase/migrations/) et le seed
#    (supabase/seed.sql : articles, créneaux, comptes admin de test).
supabase start

# 2. Configurer les variables d'environnement (une seule fois).
#    Copier .env.example en .env.local puis y coller l'URL et les clés
#    affichées par `supabase status` (API URL, anon key, service_role key).
cp .env.example .env.local

# 3. Lancer le site.
npm run dev      # http://localhost:3000
```

Studio Supabase local : URL affichée par `supabase start` (par défaut
`http://127.0.0.1:54353` dans ce projet — les ports ont été décalés dans
[`supabase/config.toml`](./supabase/config.toml) pour cohabiter avec d'autres
instances locales).

### Commandes Supabase utiles

```bash
supabase status                 # URLs + clés (anon / service_role)
supabase db reset               # ré-applique migrations + seed (repart de zéro)
supabase migration new <nom>    # nouvelle migration vide dans supabase/migrations/
supabase stop                   # arrête les conteneurs
```

### Comptes admin de test (seed local uniquement)

| E-mail | Mot de passe |
| --- | --- |
| `cliente@lumora.test` | `LumoraCliente1!` |
| `employe@lumora.test` | `LumoraEmploye1!` |
| `dev@lumora.test` | `LumoraDev1!` |

> Ces comptes ne servent qu'en local (back-office `/admin` à venir). **Ne jamais
> les seeder en production.**

## État actuel

- ✅ Pages publiques (accueil, 7 activités, contact, actualités Pilates)
- ✅ Coordonnées réelles dans [`src/lib/site.ts`](./src/lib/site.ts) (tél/WhatsApp, e-mail, adresse Kipé)
- ✅ **Vrai menu du café** (prix Petit/Moyen/Grand en GNF) : [`src/lib/data/cafe-menu.ts`](./src/lib/data/cafe-menu.ts)
- ✅ **Vraie grille tarifaire Pilates** (Reformer et Mat/Yoga, session/pack 5/pack 10) :
  [`src/lib/data/pilates-pricing.ts`](./src/lib/data/pilates-pricing.ts)
- ✅ Galeries photo prêtes ([`src/components/ui/Gallery.tsx`](./src/components/ui/Gallery.tsx)) —
  déposer les fichiers dans `public/images/` aux chemins du manifeste
  [`src/lib/images.ts`](./src/lib/images.ts) pour remplacer les « Photo à venir »
- ✅ Charte graphique (vert forêt `#1a3d2e`, or `#c9a35c`, crème `#f5f0e8`) et logo plat
- ✅ **Supabase local branché** : schéma en migration ([`supabase/migrations/`](./supabase/migrations/)),
  clients [`src/lib/supabase/`](./src/lib/supabase/), couche data ([`articles.ts`](./src/lib/data/articles.ts),
  [`slots.ts`](./src/lib/data/slots.ts)) sur de vraies requêtes
- ✅ **Formulaires branchés** : Server Actions + validation Zod + honeypot
  ([`src/lib/actions/`](./src/lib/actions/)) insèrent dans `leads` / `bookings`
- ⏳ À venir : back-office `/admin` (auth Supabase), déploiement Vercel + projet Supabase cloud

## Points d'attention (TODO à confirmer avec la cliente)

- URLs Facebook/TikTok encore placeholders dans [`src/lib/site.ts`](./src/lib/site.ts) ;
  nom exact du repère « Extension TV » (adresse) à confirmer.
- Tagline Pressing : logo « Professional Care » vs kakémono « Luxury Garment Care » —
  on garde le logo pour l'instant (voir TODO dans [`src/lib/activities.ts`](./src/lib/activities.ts)).
- Construction : le kakémono mentionne « BTP - Immobilier » — volet immobilier à clarifier,
  aucun contenu ajouté pour l'instant.
- Prix restants à confirmer : Flat White (unique ?), thés chauds, Poke Bowl ;
  soins Beleza et tarifs pressing toujours **indicatifs**.
- Le logo officiel (plaque 3D) sera déposé dans `public/images/logo/` ; l'interface utilise
  une version plate dérivée ([`src/components/brand/Logo.tsx`](./src/components/brand/Logo.tsx)).
- Colonne `format` (`reformer`/`mat`) à prévoir dans `class_slots` au branchement Supabase.
