// Couche d'accès aux articles.
// TODO Supabase : remplacer les mocks par des requêtes sur la table
// `articles` (voir supabase/schema.sql) sans changer les signatures.

export type Article = {
  id: string;
  activity: "pilates";
  title: string;
  slug: string;
  excerpt: string;
  body: string; // markdown simple
  coverImageUrl: string | null;
  status: "draft" | "published";
  publishedAt: string; // ISO
};

const MOCK_ARTICLES: Article[] = [
  {
    id: "a1",
    activity: "pilates",
    title: "Nouveau : cours de Pilates prénatal le samedi matin",
    slug: "cours-pilates-prenatal-samedi",
    excerpt:
      "À partir de ce mois-ci, Lumora Pilates ouvre un créneau dédié aux futures mamans, chaque samedi à 10h.",
    body: `Nous sommes heureux d'annoncer l'ouverture d'un cours de **Pilates prénatal**, spécialement conçu pour accompagner les futures mamans à chaque étape de la grossesse.

Le cours se déroule chaque **samedi à 10h**, en petit groupe de 6 personnes maximum, dans une ambiance douce et bienveillante.

Au programme : respiration, renforcement en douceur du dos et du plancher pelvien, mobilité et relaxation.

Réservez votre place depuis la page Lumora Pilates — les places partent vite !`,
    coverImageUrl: null,
    status: "published",
    publishedAt: "2026-07-05T09:00:00Z",
  },
  {
    id: "a2",
    activity: "pilates",
    title: "5 bienfaits du Pilates que vous ressentirez dès le premier mois",
    slug: "5-bienfaits-du-pilates",
    excerpt:
      "Posture, souplesse, sommeil… découvrez ce que quelques séances régulières peuvent changer dans votre quotidien.",
    body: `Le Pilates est bien plus qu'une simple gymnastique douce. Pratiqué régulièrement, il transforme la relation que vous entretenez avec votre corps.

1. **Une meilleure posture** — le travail du centre corrige les déséquilibres du quotidien.
2. **Moins de douleurs de dos** — le renforcement profond soulage la colonne.
3. **Plus de souplesse** — les étirements actifs allongent les muscles.
4. **Un meilleur sommeil** — la respiration contrôlée apaise le système nerveux.
5. **Plus d'énergie** — un corps aligné se fatigue moins.

Envie d'essayer ? Votre première séance découverte vous attend chez Lumora Pilates.`,
    coverImageUrl: null,
    status: "published",
    publishedAt: "2026-06-20T09:00:00Z",
  },
  {
    id: "a3",
    activity: "pilates",
    title: "Offre de lancement : -20% sur le pack 10 séances",
    slug: "offre-lancement-pack-10-seances",
    excerpt:
      "Pour fêter l'ouverture du studio, profitez de 20% de réduction sur le pack de 10 séances jusqu'à la fin du mois.",
    body: `Pour célébrer l'ouverture de notre studio à Conakry, **Lumora Pilates** vous offre **20% de réduction** sur le pack de 10 séances.

L'offre est valable jusqu'à la fin du mois, pour toute première inscription.

Renseignez-vous au studio ou via le formulaire de réservation — notre équipe vous recontacte sous 24h.`,
    coverImageUrl: null,
    status: "published",
    publishedAt: "2026-06-01T09:00:00Z",
  },
];

export async function getPublishedArticles(): Promise<Article[]> {
  return MOCK_ARTICLES.filter((a) => a.status === "published").sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  return MOCK_ARTICLES.find(
    (a) => a.slug === slug && a.status === "published",
  );
}
