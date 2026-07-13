import Link from "next/link";
import { ExternalLink, FileText, Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { EDITABLE_PAGES } from "@/lib/cms/page-registry";

export const metadata = { title: "Pages" };

const GROUPS = ["Pages principales", "Activités", "Actualités"] as const;

export default function AdminPagesPage() {
  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Modifiez les titres, introductions, descriptions et la visibilité des différentes sections du site."
      />

      <div className="space-y-8">
        {GROUPS.map((group) => (
          <section key={group}>
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gold-700" />
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-forest/60">{group}</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {EDITABLE_PAGES.filter((page) => page.group === group).map((page) => (
                <article key={page.href} className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full border border-forest-100 bg-forest-50 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-wide text-forest">
                        {page.sections.length} section{page.sections.length > 1 ? "s" : ""}
                      </span>
                      <h3 className="mt-3 font-display text-xl font-semibold text-forest">{page.title}</h3>
                    </div>
                    <Link href={page.href} target="_blank" aria-label={`Voir la page ${page.title}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold-700 transition-colors hover:bg-gold-100">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                  <p className="mt-2 text-sm font-light leading-relaxed text-forest/65">{page.description}</p>
                  <Link href={`/admin/pages/${page.slug}`} className="btn-outline mt-5 w-full">
                    <Pencil className="h-4 w-4" /> Modifier les sections
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
