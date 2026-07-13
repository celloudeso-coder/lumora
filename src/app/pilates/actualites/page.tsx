import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getActivity } from "@/lib/activities";
import { getPublishedArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Actualités — Lumora Pilates",
  description:
    "Nouveaux cours, conseils bien-être, événements et promotions du studio Lumora Pilates à Conakry.",
};

export default async function ActualitesPage() {
  const activity = getActivity("pilates")!;
  const articles = await getPublishedArticles();

  return (
    <>
      <PageHero
        title="Actualités du studio"
        tagline={activity.tagline}
        description="Suivez la vie de Lumora Pilates : nouveaux cours, conseils de votre coach, événements et offres du moment."
        icon={activity.icon}
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/pilates/actualites/${article.slug}`}
              className="card-lift edge-gold group flex flex-col rounded-2xl border border-gold/30 bg-cream-50 p-5 lg:hover:border-gold"
            >
              <time className="text-xs uppercase tracking-widest text-gold-600">
                {formatDate(article.publishedAt)}
              </time>
              <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-forest">
                {article.title}
              </h2>
              <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-forest/80">
                {article.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                Lire l’article
                <ArrowRight className="h-4 w-4 text-gold" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
