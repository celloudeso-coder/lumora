import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { getEditablePage } from "@/lib/cms/page-registry";
import { createPageSection } from "../../actions";

type Props = { params: Promise<{ slug: string }> };
const fieldClass = "mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-gold-600 focus:ring-2 focus:ring-gold/20";

export default async function NewPageSection({ params }: Props) {
  const { slug } = await params;
  const page = getEditablePage(slug);
  if (!page) notFound();

  return (
    <>
      <Link href={`/admin/pages/${page.slug}`} className="mb-5 inline-flex items-center gap-2 text-sm text-forest/65 hover:text-forest"><ArrowLeft className="h-4 w-4" /> Retour aux sections</Link>
      <AdminPageHeader eyebrow={`${page.title} · Ajout`} title="Nouvelle section" description="Cette section de contenu sera ajoutée à la fin de la page publique." />
      <form action={createPageSection} className="max-w-3xl space-y-6 rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] sm:p-7">
        <input type="hidden" name="pageSlug" value={page.slug} />
        <label className="block text-sm font-medium text-forest">Titre <span className="text-gold-700">*</span><input name="title" required minLength={2} maxLength={200} className={fieldClass} /></label>
        <label className="block text-sm font-medium text-forest">Introduction<textarea name="intro" rows={4} maxLength={1000} className={fieldClass} /></label>
        <label className="block text-sm font-medium text-forest">Contenu<textarea name="body" rows={8} maxLength={3000} className={fieldClass} /></label>
        <div className="flex flex-wrap gap-3 border-t border-gold/20 pt-5">
          <button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> Ajouter la section</button>
          <Link href={`/admin/pages/${page.slug}`} className="btn-outline">Annuler</Link>
        </div>
      </form>
    </>
  );
}
