import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { getEditablePage, getEditableSection } from "@/lib/cms/page-registry";
import { createSessionClient } from "@/lib/supabase/auth-server";
import { resetPageSection, savePageSection } from "../../actions";

type Props = {
  params: Promise<{ slug: string; sectionKey: string }>;
};

type SectionOverride = {
  title: string | null;
  intro: string | null;
  body: string | null;
  is_visible: boolean;
  is_custom: boolean;
};

const fieldClass = "mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-gold-600 focus:ring-2 focus:ring-gold/20";

export default async function AdminSectionEditor({ params }: Props) {
  const { slug, sectionKey } = await params;
  const page = getEditablePage(slug);
  if (!page) notFound();

  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("title, intro, body, is_visible, is_custom")
    .eq("page_slug", slug)
    .eq("section_key", sectionKey)
    .maybeSingle();

  if (error) throw new Error(`Lecture de la section impossible : ${error.message}`);
  const override = data as SectionOverride | null;
  const registeredSection = getEditableSection(slug, sectionKey);
  if (!registeredSection && !override?.is_custom) notFound();
  const section = registeredSection ?? {
    key: sectionKey,
    label: override?.title ?? "Section ajoutée",
    title: override?.title ?? undefined,
    intro: override?.intro ?? undefined,
    body: override?.body ?? undefined,
    kind: "section" as const,
  };
  const isCustom = override?.is_custom === true;

  return (
    <>
      <Link href={`/admin/pages/${page.slug}`} className="mb-5 inline-flex items-center gap-2 text-sm text-forest/65 transition-colors hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Retour aux sections
      </Link>

      <AdminPageHeader
        eyebrow={`${page.title} · ${section.kind === "hero" ? "En-tête" : "Section"}`}
        title={section.label}
        description={isCustom ? "Modifiez le contenu de cette section ajoutée." : "Laissez un champ vide pour conserver automatiquement le texte défini dans le code."}
      />

      <div className="max-w-3xl rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] sm:p-7">
        <form action={savePageSection} className="space-y-6">
          <input type="hidden" name="pageSlug" value={page.slug} />
          <input type="hidden" name="sectionKey" value={section.key} />

          <label className="block text-sm font-medium text-forest">
            Titre
            <input
              name="title"
              type="text"
              required={isCustom}
              maxLength={200}
              defaultValue={override?.title ?? ""}
              placeholder={section.title ?? section.label}
              className={fieldClass}
            />
            {!isCustom && <span className="mt-1.5 block text-xs font-light text-forest/50">Par défaut : {section.title ?? section.label}</span>}
          </label>

          <label className="block text-sm font-medium text-forest">
            Introduction
            <textarea
              name="intro"
              rows={4}
              maxLength={1000}
              defaultValue={override?.intro ?? ""}
              placeholder={section.intro ?? "Aucune introduction prévue par défaut"}
              className={fieldClass}
            />
          </label>

          {(section.kind === "hero" || isCustom) ? (
            <label className="block text-sm font-medium text-forest">
              Description
              <textarea
                name="body"
                rows={6}
                maxLength={3000}
                defaultValue={override?.body ?? ""}
                placeholder={section.body ?? "Description de l’en-tête"}
                className={fieldClass}
              />
            </label>
          ) : (
            <input type="hidden" name="body" value={override?.body ?? ""} />
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold/25 bg-white p-4">
            <input name="isVisible" type="checkbox" defaultChecked={override?.is_visible ?? true} className="mt-0.5 h-4 w-4 accent-forest" />
            <span>
              <span className="block text-sm font-medium text-forest">Afficher cette section sur le site</span>
              <span className="mt-0.5 block text-xs font-light text-forest/55">Décochez pour masquer entièrement la section sans supprimer son contenu.</span>
            </span>
          </label>

          <div className="flex flex-wrap gap-3 border-t border-gold/20 pt-5">
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> Enregistrer
            </button>
            <Link href={`/admin/pages/${page.slug}`} className="btn-outline">Annuler</Link>
          </div>
        </form>

        {override && (
          <form action={resetPageSection} className="mt-4 border-t border-gold/20 pt-4">
            <input type="hidden" name="pageSlug" value={page.slug} />
            <input type="hidden" name="sectionKey" value={section.key} />
            <button type="submit" className="inline-flex items-center gap-2 text-sm text-red-700 transition-colors hover:text-red-900">
              <RotateCcw className="h-4 w-4" /> {isCustom ? "Supprimer cette section" : "Revenir entièrement au contenu par défaut"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
