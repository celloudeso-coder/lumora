import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Newspaper, Search } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ACTIVITIES } from "@/lib/activities";
import { getPublishedArticles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez un service, une page ou une actualité LUMORA GROUP.",
};

const STATIC_PAGES = [
  {
    title: "Accueil",
    href: "/",
    description: "Présentation de LUMORA GROUP et de ses sept univers.",
    keywords: "groupe accueil lumora conakry",
  },
  {
    title: "Galerie",
    href: "/galerie",
    description: "Photos du Café, du studio Pilates, de Beleza et du showroom.",
    keywords: "photos images espaces locaux",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Adresse, téléphone, WhatsApp, carte et formulaire de contact.",
    keywords: "adresse email téléphone whatsapp maps localisation kipé",
  },
  {
    title: "Actualités Pilates",
    href: "/pilates/actualites",
    description: "Conseils, événements et nouveautés du studio Pilates.",
    keywords: "blog nouvelles conseils sport bien-être",
  },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matches(query: string, ...values: string[]) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const haystack = normalize(values.join(" "));
  return terms.every((term) => haystack.includes(term));
}

type Props = { searchParams: Promise<{ q?: string }> };

export default async function RecherchePage({ searchParams }: Props) {
  const params = await searchParams;
  const query = String(params.q ?? "").trim().slice(0, 80);
  const searchable = query.length >= 2;
  const articles = searchable ? await getPublishedArticles() : [];

  const pageResults = searchable
    ? STATIC_PAGES.filter((page) =>
        matches(query, page.title, page.description, page.keywords),
      )
    : [];

  const serviceResults = searchable
    ? ACTIVITIES.filter((activity) =>
        matches(
          query,
          activity.name,
          activity.shortName,
          activity.tagline,
          activity.pitch,
        ),
      )
    : [];

  const articleResults = searchable
    ? articles.filter((article) =>
        matches(query, article.title, article.excerpt, article.body),
      )
    : [];

  const total = pageResults.length + serviceResults.length + articleResults.length;

  return (
    <>
      <PageHero
        title="Recherche"
        tagline="LUMORA GROUP"
        description="Trouvez rapidement une activité, une information pratique ou une actualité."
        icon={Search}
      />

      <Section>
        <form action="/recherche" role="search" className="mx-auto max-w-2xl">
          <label htmlFor="site-search" className="mb-2 block text-sm font-medium text-forest">
            Que recherchez-vous ?
          </label>
          <div className="flex items-center rounded-2xl border border-gold/35 bg-white p-2 shadow-[var(--shadow-forest-md)] focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20">
            <Search className="ml-2 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
            <input
              id="site-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Ex. Pilates, café, devis, horaires…"
              className="min-h-12 min-w-0 flex-1 border-0 bg-transparent px-3 text-base text-forest outline-none placeholder:text-forest/40"
            />
            <button type="submit" className="btn-primary shrink-0 px-5">
              Rechercher
            </button>
          </div>
        </form>

        {!searchable ? (
          <div className="mx-auto mt-12 max-w-xl text-center text-forest/60">
            <Search className="mx-auto h-8 w-8 text-gold-600" />
            <p className="mt-3 font-light">Saisissez au moins deux caractères pour lancer une recherche.</p>
          </div>
        ) : (
          <div className="mt-12">
            <p className="text-sm text-forest/60">
              {total} résultat{total > 1 ? "s" : ""} pour <strong className="font-medium text-forest">« {query} »</strong>
            </p>

            {total === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gold/40 bg-cream-50 px-5 py-12 text-center">
                <h2 className="font-display text-2xl font-semibold text-forest">Aucun résultat</h2>
                <p className="mt-2 text-sm font-light text-forest/60">Essayez un terme plus général ou contactez directement notre équipe.</p>
                <Link href="/contact" className="btn-outline mt-5">Nous contacter</Link>
              </div>
            ) : (
              <div className="mt-6 space-y-8">
                {serviceResults.length > 0 && (
                  <ResultGroup title="Services">
                    {serviceResults.map((activity) => (
                      <ResultCard key={activity.slug} href={`/${activity.slug}`} title={activity.name} description={activity.pitch} icon={activity.icon} />
                    ))}
                  </ResultGroup>
                )}

                {pageResults.length > 0 && (
                  <ResultGroup title="Pages">
                    {pageResults.map((page) => (
                      <ResultCard key={page.href} href={page.href} title={page.title} description={page.description} icon={FileText} />
                    ))}
                  </ResultGroup>
                )}

                {articleResults.length > 0 && (
                  <ResultGroup title="Actualités">
                    {articleResults.map((article) => (
                      <ResultCard key={article.id} href={`/pilates/actualites/${article.slug}`} title={article.title} description={article.excerpt} icon={Newspaper} />
                    ))}
                  </ResultGroup>
                )}
              </div>
            )}
          </div>
        )}
      </Section>
    </>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-medium uppercase tracking-[0.22em] text-gold-700">{title}</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

function ResultCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: typeof FileText;
}) {
  return (
    <Link href={href} className="card-lift group flex items-start gap-4 rounded-2xl border border-gold/25 bg-cream-50 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <strong className="font-display text-xl font-semibold text-forest">{title}</strong>
          <ArrowRight className="h-4 w-4 shrink-0 text-gold-700" />
        </span>
        <span className="mt-1 block text-sm font-light leading-relaxed text-forest/65">{description}</span>
      </span>
    </Link>
  );
}
