# LUMORA GROUP — Site vitrine

Site vitrine multi-activités de LUMORA GROUP (Conakry, Guinée) — *Elevating Everyday Living*.
Sept univers : Construction, Café, Pilates, Pressing, Beleza Beauty, Boutique, Show room.

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour l'architecture complète.

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4** — mobile-first
- **React 19**, composants serveur par défaut et composants client ciblés pour
  les formulaires, la navigation et les animations
- **Supabase** (Postgres + Auth + Storage) — **branché en local** via le Supabase CLI
  (Docker) : lectures publiques (articles, créneaux) et écritures (réservations,
  demandes) passent par Supabase, plus de données mockées
- **Supabase SSR** : session admin sécurisée par cookies, rafraîchie dans le
  proxy Next.js et soumise aux politiques RLS
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

### Vérifier le projet

```bash
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript strict
npm run build     # build de production Next.js
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

> Ces comptes ne servent qu'en local pour tester le back-office `/admin`. **Ne jamais
> les seeder en production.**

### Tester l'administration locale

Après `supabase start` et `npm run dev`, ouvrir :

```text
http://localhost:3000/admin
```

Une visite sans session est redirigée vers `/admin/login`. Utiliser l'un des
comptes de test ci-dessus. La déconnexion supprime la session puis renvoie vers
la page de connexion.

## État actuel

- ✅ Pages publiques (accueil, 7 activités, galerie, recherche, contact et actualités Pilates)
- ✅ Coordonnées réelles dans [`src/lib/site.ts`](./src/lib/site.ts) (tél/WhatsApp, e-mail, adresse Kipé)
- ✅ Carte Google Maps intégrée à la page Contact
- ✅ **Vrai menu du café** (prix Petit/Moyen/Grand en GNF) : [`src/lib/data/cafe-menu.ts`](./src/lib/data/cafe-menu.ts)
- ✅ **Vraie grille tarifaire Pilates** (Reformer et Mat/Yoga, session/pack 5/pack 10) :
  [`src/lib/data/pilates-pricing.ts`](./src/lib/data/pilates-pricing.ts)
- ✅ Photos réelles intégrées pour la façade, le Café, le Pilates, Beleza et le
  showroom. Les galeries ([`Gallery.tsx`](./src/components/ui/Gallery.tsx))
  respectent le format portrait 9:16 : défilement tactile sur mobile et grille
  responsive sur les écrans plus larges
- ✅ Hero d'accueil adapté à la façade verticale : photo architecturale dédiée,
  médaillon du logo officiel et localisation « Kipé, Conakry »
- ✅ Logo officiel [`public/images/logo/Logo.png`](./public/images/logo/Logo.png)
  utilisé dans le header, le footer et le hero d'accueil
- ✅ Charte graphique (vert forêt `#1a3d2e`, or `#c9a35c`, crème `#f5f0e8`),
  composants visuels harmonisés et animations accessibles (`prefers-reduced-motion`)
- ✅ Navigation enrichie : progression de lecture, menu mobile animé, lien
  d'évitement clavier, menu Univers avec Boutique et Showroom en accès direct,
  recherche globale et bouton WhatsApp flottant
- ✅ **Supabase local branché** : schéma en migration ([`supabase/migrations/`](./supabase/migrations/)),
  clients [`src/lib/supabase/`](./src/lib/supabase/), couche data ([`articles.ts`](./src/lib/data/articles.ts),
  [`slots.ts`](./src/lib/data/slots.ts)) sur de vraies requêtes
- ✅ **Formulaires branchés** : Server Actions + validation Zod + honeypot
  ([`src/lib/actions/`](./src/lib/actions/)) insèrent dans `leads` / `bookings`
- ✅ **Socle du back-office `/admin`** : connexion/déconnexion Supabase,
  protection des routes par proxy Next.js 16, vérification du rôle admin,
  navigation responsive et interface `noindex`
- ✅ **Tableau de bord réel** : compteurs des réservations en attente, nouvelles
  demandes, brouillons et créneaux à venir, avec les dernières entrées
- ✅ **Consultation admin** : listes responsive des articles, créneaux,
  réservations et demandes, toutes lues avec la session courante et la RLS
- ✅ **Navigation admin catégorisée** : Général, Contenu, Planning, Relation
  client et Configuration, avec vues d'ensemble des pages publiques et des
  paramètres actuellement définis dans le code
- ✅ **Édition des pages par sections** : depuis `Admin > Contenu > Pages`, les
  en-têtes et sections de l'accueil, des activités, du contact, de la galerie
  et des actualités peuvent être renommés, complétés ou masqués. Les surcharges
  sont enregistrées dans `page_sections` ; un champ vide conserve le contenu
  par défaut du code et l'action de réinitialisation supprime la surcharge. Le
  bouton **Ajouter une section** crée un nouveau bloc de texte en fin de page
- ✅ **Édition centralisée des tarifs** : `Admin > Contenu > Tarifs` permet de
  modifier ou masquer les prix du Café, des formules Pilates et du Pressing.
  Les personnalisations vivent dans `pricing_overrides` et les montants du code
  restent disponibles comme valeurs par défaut. De nouvelles lignes peuvent
  être ajoutées aux catégories tarifaires existantes puis supprimées
- ✅ **Réalisations Construction administrables** : la page Construction
  affiche les projets visibles et `Admin > Contenu > Réalisations` permet de
  les ajouter, modifier, ordonner, masquer ou supprimer avec leur photo. Les
  images sont stockées dans le bucket Supabase `project-images`
- ⏳ À venir : création/édition des articles, gestion des statuts, création des
  créneaux, upload d'images, puis déploiement Vercel + Supabase cloud

## Gérer les images

Le projet distingue deux sources d'images.

### Images fixes dans le code

Les photos permanentes du site (façade, locaux, studios, showroom) vivent dans
`public/images/`. Le manifeste [`src/lib/images.ts`](./src/lib/images.ts) associe
chaque fichier à son texte alternatif et à son format d'affichage.

Pour remplacer une image existante, conserver exactement son chemin et son nom,
par exemple :

```text
public/images/facade/facade-nuit.jpg
public/images/cafe/salle.jpg
public/images/pilates/studio.jpg
public/images/beleza/salle-massage.jpg
public/images/showroom/exposition.jpg
```

Pour ajouter une nouvelle photo à une galerie :

1. déposer le fichier dans le dossier correspondant sous `public/images/` ;
2. ajouter une entrée dans le tableau concerné de `src/lib/images.ts` ;
3. utiliser `aspect: "portrait"` pour les photos verticales 9:16.

Exemple :

```ts
{
  src: "/images/cafe/terrasse.jpg",
  alt: "La terrasse du Lumora Café",
  aspect: "portrait",
}
```

Si un fichier déclaré dans le manifeste est absent, la galerie affiche
automatiquement « Photo à venir ».

### Images administrées par le CMS

Les images ajoutées depuis l'éditeur d'articles du back-office, notamment les
couvertures, seront stockées dans le bucket Supabase Storage `article-images`. Leur
URL est enregistrée en base dans `articles.cover_image_url`; elles ne doivent pas
être copiées dans `public/images/`.

## Points d'attention (TODO à confirmer avec la cliente)

- URLs Facebook/TikTok encore placeholders dans [`src/lib/site.ts`](./src/lib/site.ts) ;
  nom exact du repère « Extension TV » (adresse) à confirmer.
- Tagline Pressing : logo « Professional Care » vs kakémono « Luxury Garment Care » —
  on garde le logo pour l'instant (voir TODO dans [`src/lib/activities.ts`](./src/lib/activities.ts)).
- Construction : le kakémono mentionne « BTP - Immobilier » — volet immobilier à clarifier,
  aucun contenu ajouté pour l'instant.
- Prix restants à confirmer : Flat White (unique ?), thés chauds, Poke Bowl ;
  soins Beleza et tarifs pressing toujours **indicatifs**.
- Deux emplacements photo sont encore sans fichier :
  `public/images/beleza/ambiance.jpg` et
  `public/images/showroom/sanitaires.jpg`.
