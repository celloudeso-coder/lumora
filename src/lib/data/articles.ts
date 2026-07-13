// Couche d'accès aux articles — table `articles` (Supabase).
// Les signatures sont stables : les composants ne connaissent pas Supabase.

import { createPublicServerClient } from "@/lib/supabase/server";

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

type ArticleRow = {
  id: string;
  activity: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  status: string;
  published_at: string | null;
};

const ARTICLE_COLUMNS =
  "id, activity, title, slug, excerpt, body, cover_image_url, status, published_at";

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    activity: row.activity as Article["activity"],
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    body: row.body,
    coverImageUrl: row.cover_image_url,
    status: row.status as Article["status"],
    publishedAt: row.published_at ?? "",
  };
}

export async function getPublishedArticles(): Promise<Article[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Lecture des articles impossible : ${error.message}`);
  }
  return (data as ArticleRow[]).map(mapArticle);
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Lecture de l'article « ${slug} » impossible : ${error.message}`);
  }
  return data ? mapArticle(data as ArticleRow) : undefined;
}
