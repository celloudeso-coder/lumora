import { CalendarDays, Plus } from "lucide-react";
import { AdminPageHeader, EmptyState, StatusBadge, formatAdminDate } from "@/components/admin/AdminUI";
import { createSessionClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "Créneaux Pilates" };

export default async function AdminCreneauxPage() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("class_slots")
    .select("id, title, format, starts_at, duration_min, capacity, status")
    .order("starts_at", { ascending: true });

  if (error) throw new Error(`Lecture des créneaux impossible : ${error.message}`);

  return (
    <>
      <AdminPageHeader
        title="Créneaux Pilates"
        description="Planning Reformer et Mat/Yoga. Les créneaux passés restent visibles pour le suivi."
        action={
          <span className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-full bg-forest/10 px-5 text-sm text-forest/45" title="Création à venir">
            <Plus className="h-4 w-4" /> Nouveau créneau
          </span>
        }
      />
      {!data?.length ? (
        <EmptyState icon={CalendarDays} title="Aucun créneau" text="La création de créneaux sera ajoutée dans la prochaine étape du back-office." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.map((slot) => {
            const past = new Date(slot.starts_at) < new Date();
            return (
              <article key={slot.id} className={`rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] ${past ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs uppercase tracking-widest text-gold-700">{slot.format === "reformer" ? "Reformer" : "Mat / Yoga"}</span>
                  <StatusBadge status={past ? "past" : slot.status} />
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold text-forest">{slot.title}</h2>
                <time className="mt-2 block text-sm font-medium text-forest">{formatAdminDate(slot.starts_at)}</time>
                <p className="mt-1 text-xs text-forest/55">{slot.duration_min} min · {slot.capacity} places</p>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
