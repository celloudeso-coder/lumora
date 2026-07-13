import Link from "next/link";
import { ExternalLink, Pencil, Tags } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { PRICING_AREAS } from "@/lib/cms/pricing-registry";
import { createSessionClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "Tarifs" };

export default async function AdminPricingPage() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("pricing_overrides").select("activity");
  if (error) throw new Error(`Lecture des tarifs impossible : ${error.message}`);

  const counts = new Map<string, number>();
  for (const row of data) counts.set(row.activity, (counts.get(row.activity) ?? 0) + 1);

  return (
    <>
      <AdminPageHeader
        title="Tarifs"
        description="Modifiez les prix affichés sur le Café, le Pilates et le Pressing sans intervenir dans le code."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PRICING_AREAS.map((area) => (
          <article key={area.activity} className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)]">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-gold">
                <Tags className="h-5 w-5" />
              </span>
              <Link href={area.href} target="_blank" aria-label={`Voir ${area.title}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold-700 transition-colors hover:bg-gold-100">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold text-forest">{area.title}</h2>
            <p className="mt-1 text-sm font-light leading-relaxed text-forest/65">{area.description}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-forest/50">
              {area.items.length} tarif{area.items.length > 1 ? "s" : ""} · {counts.get(area.activity) ?? 0} personnalisé{(counts.get(area.activity) ?? 0) > 1 ? "s" : ""}
            </p>
            <Link href={`/admin/tarifs/${area.activity}`} className="btn-outline mt-5 w-full">
              <Pencil className="h-4 w-4" /> Gérer les tarifs
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
