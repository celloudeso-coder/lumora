# LUMORA GROUP — Site vitrine

Site vitrine multi-activités de LUMORA GROUP (Conakry, Guinée) — *Elevating Everyday Living*.
Sept univers : Construction, Café, Pilates, Pressing, Beleza Beauty, Boutique, Show room.

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour l'architecture complète.

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4** — mobile-first
- **Supabase** (Postgres + Auth + Storage) — *pas encore branché* : le site tourne
  actuellement sur des données mockées (`src/lib/data/`)
- Déploiement cible : **Vercel**

## Démarrer en local

```bash
npm install
npm run dev      # http://localhost:3000
```

## État actuel

- ✅ Pages publiques avec contenu provisoire (accueil, 7 activités, contact, actualités Pilates)
- ✅ Charte graphique (vert forêt `#1a3d2e`, or `#c9a35c`, crème `#f5f0e8`) et logo plat
- ✅ Formulaires en **mode démo** (aucune persistance) — voir les `TODO Supabase`
- ✅ Schéma de base prêt : [`supabase/schema.sql`](./supabase/schema.sql) (tables + RLS), à appliquer plus tard
- ⏳ À venir : branchement Supabase (Server Actions), back-office `/admin`, déploiement

## Points d'attention

- Les coordonnées (téléphone, adresse, réseaux sociaux) sont des placeholders dans
  [`src/lib/site.ts`](./src/lib/site.ts) — à remplacer avant mise en ligne.
- Les prix (menu café, pressing, soins Beleza) sont **indicatifs**, à valider avec la cliente.
- Le logo officiel (plaque 3D) sera déposé dans `public/` ; l'interface utilise une
  version plate dérivée ([`src/components/brand/Logo.tsx`](./src/components/brand/Logo.tsx)).
