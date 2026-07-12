import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/data/articles";
import { formatDate } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6 lg:py-16">
          <Link
            href="/pilates/actualites"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les actualités
          </Link>
          <time className="mt-6 block text-xs uppercase tracking-widest text-gold">
            {formatDate(article.publishedAt)}
          </time>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight lg:text-4xl">
            {article.title}
          </h1>
        </div>
      </section>

      <Section>
        <article className="mx-auto max-w-3xl space-y-5 font-light leading-relaxed text-forest/90">
          {renderBody(article.body)}
        </article>
      </Section>
    </>
  );
}

/** Rendu minimal du markdown des articles (paragraphes + **gras**). */
function renderBody(body: string) {
  return body.split(/\n\n+/).map((paragraph, i) => (
    <p key={i} className="whitespace-pre-line">
      {paragraph.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="font-medium text-forest">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </p>
  ));
}
