import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { formatGNF } from "@/lib/format";
import { getPricingArea, getPricingItem } from "@/lib/cms/pricing-registry";
import { createSessionClient } from "@/lib/supabase/auth-server";
import { resetPricingItem, savePricingItem } from "../../actions";

type Props = { params: Promise<{ activity: string; itemKey: string }> };

type Override = {
  label: string | null;
  price: number | null;
  price_small: number | null;
  price_medium: number | null;
  price_large: number | null;
  note: string | null;
  is_visible: boolean;
  is_custom: boolean;
  group_name: string | null;
  mode: "single" | "sizes" | null;
};

const fieldClass = "mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-sm text-forest outline-none transition focus:border-gold-600 focus:ring-2 focus:ring-gold/20";

function PriceField({ name, label, value, fallback }: { name: string; label: string; value?: number | null; fallback?: number | null }) {
  return (
    <label className="block text-sm font-medium text-forest">
      {label}
      <div className="relative">
        <input name={name} type="number" min="0" step="1" defaultValue={value ?? ""} placeholder={fallback?.toString() ?? "Non renseigné"} className={`${fieldClass} pr-16`} />
        <span className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-xs text-forest/45">GNF</span>
      </div>
      {fallback != null && <span className="mt-1.5 block text-xs font-light text-forest/50">Par défaut : {formatGNF(fallback)}</span>}
    </label>
  );
}

export default async function AdminPricingEditor({ params }: Props) {
  const { activity, itemKey } = await params;
  const area = getPricingArea(activity);
  if (!area) notFound();

  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("pricing_overrides")
    .select("label, price, price_small, price_medium, price_large, note, is_visible, is_custom, group_name, mode")
    .eq("activity", area.activity)
    .eq("item_key", itemKey)
    .maybeSingle();
  if (error) throw new Error(`Lecture du tarif impossible : ${error.message}`);
  const override = data as Override | null;
  const registeredItem = getPricingItem(activity, itemKey);
  if (!registeredItem && !override?.is_custom) notFound();
  const item = registeredItem ?? {
    activity: area.activity,
    key: itemKey,
    group: area.activity === "pilates" ? (override?.group_name === "reformer" ? "Reformer" : "Mat / Yoga") : override?.group_name ?? "Autres",
    label: override?.label ?? "Nouveau tarif",
    mode: override?.mode ?? "single" as const,
    price: undefined,
    sizes: undefined,
    note: override?.note ?? undefined,
  };
  const isCustom = override?.is_custom === true;

  return (
    <>
      <Link href={`/admin/tarifs/${area.activity}`} className="mb-5 inline-flex items-center gap-2 text-sm text-forest/65 transition-colors hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Retour à {area.title}
      </Link>
      <AdminPageHeader
        eyebrow={`${area.title} · ${item.group}`}
        title={item.label}
        description={isCustom ? "Modifiez cette ligne tarifaire ajoutée." : "Enregistrez une personnalisation ou revenez à tout moment au tarif prévu dans le code."}
      />

      <div className="max-w-3xl rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] sm:p-7">
        <form action={savePricingItem} className="space-y-6">
          <input type="hidden" name="activity" value={area.activity} />
          <input type="hidden" name="itemKey" value={item.key} />

          <label className="block text-sm font-medium text-forest">
            Libellé affiché
            <input name="label" type="text" required={isCustom} maxLength={200} defaultValue={override?.label ?? ""} placeholder={item.label} className={fieldClass} />
            {!isCustom && <span className="mt-1.5 block text-xs font-light text-forest/50">Laissez vide pour conserver « {item.label} ».</span>}
          </label>

          {item.mode === "single" ? (
            <PriceField name="price" label="Prix" value={override?.price} fallback={item.price} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-3">
              <PriceField name="priceSmall" label="Petit" value={override?.price_small} fallback={item.sizes?.[0]} />
              <PriceField name="priceMedium" label="Moyen" value={override?.price_medium} fallback={item.sizes?.[1]} />
              <PriceField name="priceLarge" label="Grand" value={override?.price_large} fallback={item.sizes?.[2]} />
            </div>
          )}

          <label className="block text-sm font-medium text-forest">
            Note facultative
            <textarea name="note" rows={3} maxLength={500} defaultValue={override?.note ?? ""} placeholder={item.note ?? "Exemple : prix à confirmer"} className={fieldClass} />
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold/25 bg-white p-4">
            <input name="isVisible" type="checkbox" defaultChecked={override?.is_visible ?? true} className="mt-0.5 h-4 w-4 accent-forest" />
            <span>
              <span className="block text-sm font-medium text-forest">Afficher ce tarif sur le site</span>
              <span className="mt-0.5 block text-xs font-light text-forest/55">Décochez pour retirer temporairement cette ligne de la grille publique.</span>
            </span>
          </label>

          <div className="flex flex-wrap gap-3 border-t border-gold/20 pt-5">
            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> Enregistrer</button>
            <Link href={`/admin/tarifs/${area.activity}`} className="btn-outline">Annuler</Link>
          </div>
        </form>

        {override && (
          <form action={resetPricingItem} className="mt-4 border-t border-gold/20 pt-4">
            <input type="hidden" name="activity" value={area.activity} />
            <input type="hidden" name="itemKey" value={item.key} />
            <button type="submit" className="inline-flex items-center gap-2 text-sm text-red-700 transition-colors hover:text-red-900"><RotateCcw className="h-4 w-4" /> {isCustom ? "Supprimer ce tarif" : "Revenir au tarif par défaut"}</button>
          </form>
        )}
      </div>
    </>
  );
}
