import Link from "next/link";
import { ExternalLink, Newspaper, Plus } from "lucide-react";
import { AdminPageHeader, EmptyState, StatusBadge, activityLabel, formatAdminDate } from "@/components/admin/AdminUI";
import { createSessionClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "Articles" };

export default async function AdminArticlesPage() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, activity, title, slug, excerpt, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Lecture des articles impossible : ${error.message}`);

  return (
    <>
      <AdminPageHeader
        title="Articles"
        description="Contenus éditoriaux publiés ou préparés pour les actualités."
        action={
          <span className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-full bg-forest/10 px-5 text-sm text-forest/45" title="Éditeur à venir">
            <Plus className="h-4 w-4" /> Nouvel article
          </span>
        }
      />
      {!data?.length ? (
        <EmptyState icon={Newspaper} title="Aucun article" text="Le futur éditeur permettra de créer le premier article depuis cet écran." />
      ) : (
        <div className="space-y-3">
          {data.map((article) => (
            <article key={article.id} className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-gold-700">{activityLabel(article.activity)}</span>
                  <StatusBadge status={article.status} />
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold text-forest">{article.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm font-light text-forest/65">{article.excerpt || "Aucun résumé"}</p>
                <p className="mt-2 text-[0.7rem] text-forest/45">Mis à jour le {formatAdminDate(article.updated_at)}</p>
              </div>
              {article.status === "published" && (
                <Link href={`/pilates/actualites/${article.slug}`} target="_blank" className="mt-4 inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-medium text-gold-700 hover:underline sm:mt-0">
                  Voir <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
