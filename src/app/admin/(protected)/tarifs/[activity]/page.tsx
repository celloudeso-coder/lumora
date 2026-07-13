import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, EyeOff, Pencil, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { formatGNF } from "@/lib/format";
import { getPricingArea } from "@/lib/cms/pricing-registry";
import { createSessionClient } from "@/lib/supabase/auth-server";

type Props = {
  params: Promise<{ activity: string }>;
  searchParams: Promise<{ saved?: string; reset?: string; created?: string }>;
};

type Override = {
  item_key: string;
  price: number | null;
  price_small: number | null;
  price_medium: number | null;
  price_large: number | null;
  is_visible: boolean;
  label: string | null;
  note: string | null;
  is_custom: boolean;
  group_name: string | null;
  mode: "single" | "sizes" | null;
};

function priceSummary(item: { mode: "single" | "sizes"; price?: number; sizes?: [number | null, number | null, number | null] }, override?: Override) {
  if (item.mode === "single") {
    const price = override?.price ?? item.price;
    return price == null ? "Prix à confirmer" : formatGNF(price);
  }
  const prices = override
    ? [
        override.price_small ?? item.sizes?.[0] ?? null,
        override.price_medium ?? item.sizes?.[1] ?? null,
        override.price_large ?? item.sizes?.[2] ?? null,
      ]
    : item.sizes ?? [];
  return prices.map((price) => price == null ? "—" : formatGNF(price, false)).join(" / ");
}

export default async function AdminPricingAreaPage({ params, searchParams }: Props) {
  const { activity } = await params;
  const query = await searchParams;
  const area = getPricingArea(activity);
  if (!area) notFound();

  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("pricing_overrides")
    .select("item_key, label, note, price, price_small, price_medium, price_large, is_visible, is_custom, group_name, mode")
    .eq("activity", area.activity);
  if (error) throw new Error(`Lecture des tarifs impossible : ${error.message}`);

  const overrides = new Map((data as Override[]).map((item) => [item.item_key, item]));
  const customItems = (data as Override[]).filter((item) => item.is_custom).map((item) => ({
    activity: area.activity,
    key: item.item_key,
    group: area.activity === "pilates" ? (item.group_name === "reformer" ? "Reformer" : "Mat / Yoga") : item.group_name ?? "Autres",
    label: item.label ?? "Nouveau tarif",
    mode: item.mode ?? "single" as const,
    price: undefined,
    sizes: undefined,
    note: item.note ?? undefined,
  }));
  const allItems = [...area.items, ...customItems];
  const groups = [...new Set(allItems.map((item) => item.group))];

  return (
    <>
      <Link href="/admin/tarifs" className="mb-5 inline-flex items-center gap-2 text-sm text-forest/65 transition-colors hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Retour aux tarifs
      </Link>
      <AdminPageHeader
        eyebrow="Contenu · Tarifs"
        title={area.title}
        description="Les montants sont exprimés en francs guinéens (GNF)."
        action={<div className="flex flex-wrap gap-2">
          <Link href={`/admin/tarifs/${area.activity}/nouveau`} className="btn-primary"><Plus className="h-4 w-4" /> Ajouter un tarif</Link>
          <Link href={area.href} target="_blank" className="btn-outline"><ExternalLink className="h-4 w-4" /> Voir la page</Link>
        </div>}
      />

      {query.saved === "1" && <p className="mb-5 rounded-xl border border-forest-100 bg-forest-50 px-4 py-3 text-sm text-forest">Le tarif a été enregistré et la page publique actualisée.</p>}
      {query.created === "1" && <p className="mb-5 rounded-xl border border-forest-100 bg-forest-50 px-4 py-3 text-sm text-forest">Le nouveau tarif a été ajouté à la grille publique.</p>}
      {query.reset === "1" && <p className="mb-5 rounded-xl border border-gold/30 bg-gold-50 px-4 py-3 text-sm text-forest">Le tarif défini dans le code est de nouveau utilisé.</p>}

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold-700">{group}</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {allItems.filter((item) => item.group === group).map((item) => {
                const override = overrides.get(item.key);
                return (
                  <article key={item.key} className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-wide ${override?.is_visible === false ? "border-red-200 bg-red-50 text-red-800" : override ? "border-gold/35 bg-gold-50 text-gold-800" : "border-stone-200 bg-stone-100 text-stone-600"}`}>
                          {override?.is_visible === false && <EyeOff className="h-3 w-3" />}
                          {override?.is_visible === false ? "Masqué" : override ? "Personnalisé" : "Par défaut"}
                        </span>
                        <h3 className="mt-3 font-display text-lg font-semibold text-forest">{override?.label ?? item.label}</h3>
                      </div>
                      <Link href={`/admin/tarifs/${area.activity}/${item.key}`} aria-label={`Modifier ${item.label}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold-700 hover:bg-gold-100"><Pencil className="h-4 w-4" /></Link>
                    </div>
                    <p className="mt-3 font-medium text-gold-700">{priceSummary(item, override)}</p>
                    {item.mode === "sizes" && <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-forest/45">Petit / Moyen / Grand</p>}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
