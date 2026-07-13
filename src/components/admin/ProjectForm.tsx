import Link from "next/link";
import { Save } from "lucide-react";

export type ProjectFormValue = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  category: string;
  completed_at: string | null;
  position: number;
  is_visible: boolean;
};

const fieldClass = "mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-gold-600 focus:ring-2 focus:ring-gold/20";

export function ProjectForm({ action, project }: { action: (formData: FormData) => Promise<void>; project?: ProjectFormValue }) {
  return (
    <form action={action} className="max-w-3xl space-y-6 rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] sm:p-7">
      {project && <input type="hidden" name="id" value={project.id} />}
      <label className="block text-sm font-medium text-forest">Titre <span className="text-gold-700">*</span><input name="title" required minLength={2} maxLength={200} defaultValue={project?.title} className={fieldClass} /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-forest">Catégorie<select name="category" defaultValue={project?.category ?? "construction"} className={fieldClass}><option value="construction">Construction</option><option value="renovation">Rénovation</option><option value="amenagement">Aménagement</option></select></label>
        <label className="block text-sm font-medium text-forest">Localisation<input name="location" maxLength={200} defaultValue={project?.location ?? ""} placeholder="Ex. Kipé, Conakry" className={fieldClass} /></label>
      </div>
      <label className="block text-sm font-medium text-forest">Description<textarea name="description" rows={6} maxLength={3000} defaultValue={project?.description} className={fieldClass} /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-forest">Date d’achèvement<input name="completedAt" type="date" defaultValue={project?.completed_at ?? ""} className={fieldClass} /></label>
        <label className="block text-sm font-medium text-forest">Ordre d’affichage<input name="position" type="number" min="0" max="9999" defaultValue={project?.position ?? 0} className={fieldClass} /></label>
      </div>
      <label className="block text-sm font-medium text-forest">Photo {project ? "de remplacement" : <span className="text-gold-700">*</span>}<input name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!project} className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-xs file:text-cream`} /><span className="mt-1.5 block text-xs font-light text-forest/50">JPG, PNG ou WebP, 8 Mo maximum. Un format paysage est recommandé.</span></label>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold/25 bg-white p-4"><input name="isVisible" type="checkbox" defaultChecked={project?.is_visible ?? true} className="mt-0.5 h-4 w-4 accent-forest" /><span><span className="block text-sm font-medium text-forest">Afficher sur la page Construction</span><span className="mt-0.5 block text-xs font-light text-forest/55">Décochez pour conserver le projet en brouillon.</span></span></label>
      <div className="flex flex-wrap gap-3 border-t border-gold/20 pt-5"><button type="submit" className="btn-primary"><Save className="h-4 w-4" /> {project ? "Enregistrer" : "Ajouter la réalisation"}</button><Link href="/admin/realisations" className="btn-outline">Annuler</Link></div>
    </form>
  );
}
