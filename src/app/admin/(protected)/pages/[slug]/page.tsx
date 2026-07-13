import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, EyeOff, Pencil, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { getEditablePage } from "@/lib/cms/page-registry";
import { createSessionClient } from "@/lib/supabase/auth-server";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; reset?: string; created?: string }>;
};

type SectionOverride = {
  section_key: string;
  title: string | null;
  intro: string | null;
  body: string | null;
  is_visible: boolean;
  is_custom: boolean;
};

export default async function AdminPageSections({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const page = getEditablePage(slug);
  if (!page) notFound();

  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("section_key, title, intro, body, is_visible, is_custom")
    .eq("page_slug", page.slug);

  if (error) throw new Error(`Lecture des sections impossible : ${error.message}`);

  const overrides = new Map(
    (data as SectionOverride[]).map((section) => [section.section_key, section]),
  );

  return (
    <>
      <Link href="/admin/pages" className="mb-5 inline-flex items-center gap-2 text-sm text-forest/65 transition-colors hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Retour aux pages
      </Link>

      <AdminPageHeader
        eyebrow="Pages · Sections"
        title={page.title}
        description="Chaque section peut reprendre le contenu prévu dans le code, être personnalisée ou être masquée."
        action={<div className="flex flex-wrap gap-2">
          <Link href={`/admin/pages/${page.slug}/nouvelle`} className="btn-primary"><Plus className="h-4 w-4" /> Ajouter une section</Link>
          <Link href={page.href} target="_blank" className="btn-outline"><ExternalLink className="h-4 w-4" /> Voir la page</Link>
        </div>}
      />

      {query.saved === "1" && (
        <p className="mb-5 rounded-xl border border-forest-100 bg-forest-50 px-4 py-3 text-sm text-forest">
          La section a été enregistrée et la page publique a été actualisée.
        </p>
      )}
      {query.created === "1" && (
        <p className="mb-5 rounded-xl border border-forest-100 bg-forest-50 px-4 py-3 text-sm text-forest">
          La nouvelle section a été ajoutée en fin de page.
        </p>
      )}
      {query.reset === "1" && (
        <p className="mb-5 rounded-xl border border-gold/30 bg-gold-50 px-4 py-3 text-sm text-forest">
          La personnalisation a été supprimée. Le contenu du code est de nouveau utilisé.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {page.sections.map((section) => {
          const override = overrides.get(section.key);
          const title = override?.title ?? section.title ?? section.label;
          const intro = override?.intro ?? section.intro;

          return (
            <article key={section.key} className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full border border-forest-100 bg-forest-50 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-wide text-forest">
                      {section.kind === "hero" ? "En-tête" : "Section"}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-wide ${
                      override?.is_visible === false
                        ? "border-red-200 bg-red-50 text-red-800"
                        : override
                          ? "border-gold/35 bg-gold-50 text-gold-800"
                          : "border-stone-200 bg-stone-100 text-stone-600"
                    }`}>
                      {override?.is_visible === false && <EyeOff className="h-3 w-3" />}
                      {override?.is_visible === false ? "Masquée" : override ? "Personnalisée" : "Par défaut"}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold text-forest">{section.label}</h2>
                </div>
                <Link href={`/admin/pages/${page.slug}/${section.key}`} aria-label={`Modifier ${section.label}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold-700 transition-colors hover:bg-gold-100">
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 text-sm font-medium text-forest">{title}</p>
              {intro && <p className="mt-1 line-clamp-3 text-sm font-light leading-relaxed text-forest/60">{intro}</p>}
              <Link href={`/admin/pages/${page.slug}/${section.key}`} className="btn-outline mt-5 w-full">
                <Pencil className="h-4 w-4" /> Modifier
              </Link>
            </article>
          );
        })}
        {(data as SectionOverride[]).filter((section) => section.is_custom).map((section) => (
          <article key={section.section_key} className="rounded-2xl border border-gold/35 bg-gold-50/40 p-5 shadow-[var(--shadow-forest-sm)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full border border-gold/35 bg-gold-50 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-wide text-gold-800">Section ajoutée</span>
                  {section.is_visible === false && <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-wide text-red-800"><EyeOff className="h-3 w-3" /> Masquée</span>}
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold text-forest">{section.title ?? "Sans titre"}</h2>
              </div>
              <Link href={`/admin/pages/${page.slug}/${section.section_key}`} aria-label={`Modifier ${section.title}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold-700 hover:bg-gold-100"><Pencil className="h-4 w-4" /></Link>
            </div>
            {section.intro && <p className="mt-3 line-clamp-3 text-sm font-light leading-relaxed text-forest/60">{section.intro}</p>}
            <Link href={`/admin/pages/${page.slug}/${section.section_key}`} className="btn-outline mt-5 w-full"><Pencil className="h-4 w-4" /> Modifier</Link>
          </article>
        ))}
      </div>
    </>
  );
}
