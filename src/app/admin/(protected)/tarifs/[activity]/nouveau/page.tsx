import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { getPricingArea } from "@/lib/cms/pricing-registry";
import { createPricingItem } from "../../actions";

type Props = { params: Promise<{ activity: string }> };
const fieldClass = "mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-gold-600 focus:ring-2 focus:ring-gold/20";

export default async function NewPricingItem({ params }: Props) {
  const { activity } = await params;
  const area = getPricingArea(activity);
  if (!area) notFound();
  const groups = area.activity === "pilates"
    ? [{ value: "reformer", label: "Reformer" }, { value: "mat", label: "Mat / Yoga" }]
    : area.activity === "pressing"
      ? [{ value: "Grille tarifaire", label: "Grille tarifaire" }]
      : [...new Set(area.items.map((item) => item.group))].map((group) => ({ value: group, label: group }));

  return (
    <>
      <Link href={`/admin/tarifs/${area.activity}`} className="mb-5 inline-flex items-center gap-2 text-sm text-forest/65 hover:text-forest"><ArrowLeft className="h-4 w-4" /> Retour aux tarifs</Link>
      <AdminPageHeader eyebrow={`${area.title} · Ajout`} title="Nouveau tarif" description="Ajoutez une ligne à une catégorie existante de la grille publique." />
      <form action={createPricingItem} className="max-w-3xl space-y-6 rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] sm:p-7">
        <input type="hidden" name="activity" value={area.activity} />
        <label className="block text-sm font-medium text-forest">Libellé <span className="text-gold-700">*</span><input name="label" required minLength={2} maxLength={200} className={fieldClass} /></label>
        <label className="block text-sm font-medium text-forest">Catégorie<select name="group" required className={fieldClass}>{groups.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}</select></label>
        {area.activity === "cafe" && <label className="block text-sm font-medium text-forest">Format<select name="mode" className={fieldClass}><option value="single">Prix unique</option><option value="sizes">Petit / Moyen / Grand</option></select></label>}
        {area.activity !== "cafe" && <input type="hidden" name="mode" value="single" />}
        <div className={area.activity === "cafe" ? "grid gap-5 sm:grid-cols-2" : ""}>
          <label className="block text-sm font-medium text-forest">Prix unique<input name="price" type="number" min="0" step="1" className={fieldClass} /><span className="mt-1 block text-xs font-light text-forest/50">Utilisé pour un tarif à prix unique.</span></label>
          {area.activity === "cafe" && <div className="grid grid-cols-3 gap-2"><label className="text-sm font-medium text-forest">Petit<input name="priceSmall" type="number" min="0" step="1" className={fieldClass} /></label><label className="text-sm font-medium text-forest">Moyen<input name="priceMedium" type="number" min="0" step="1" className={fieldClass} /></label><label className="text-sm font-medium text-forest">Grand<input name="priceLarge" type="number" min="0" step="1" className={fieldClass} /></label></div>}
        </div>
        <label className="block text-sm font-medium text-forest">Note facultative<textarea name="note" rows={3} maxLength={500} className={fieldClass} /></label>
        <div className="flex flex-wrap gap-3 border-t border-gold/20 pt-5"><button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> Ajouter le tarif</button><Link href={`/admin/tarifs/${area.activity}`} className="btn-outline">Annuler</Link></div>
      </form>
    </>
  );
}
