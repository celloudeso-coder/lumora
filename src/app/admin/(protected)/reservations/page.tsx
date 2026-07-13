import { ClipboardList } from "lucide-react";
import { AdminPageHeader, EmptyState, StatusBadge, activityLabel, formatAdminDate } from "@/components/admin/AdminUI";
import { createSessionClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "Réservations" };

export default async function AdminReservationsPage() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, activity, customer_name, phone, email, service, preferred_at, status, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Lecture des réservations impossible : ${error.message}`);

  return (
    <>
      <AdminPageHeader
        title="Réservations"
        description="Demandes Pilates et Beleza, classées de la plus récente à la plus ancienne."
      />
      {!data?.length ? (
        <EmptyState icon={ClipboardList} title="Aucune réservation" text="Les réservations envoyées depuis le site apparaîtront ici." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold-700">{activityLabel(booking.activity)}</p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-forest">{booking.customer_name}</h2>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-forest/50">Téléphone</dt><dd className="mt-0.5 text-forest">{booking.phone}</dd></div>
                <div><dt className="text-xs text-forest/50">Service</dt><dd className="mt-0.5 text-forest">{booking.service || "—"}</dd></div>
                {booking.preferred_at && <div><dt className="text-xs text-forest/50">Moment souhaité</dt><dd className="mt-0.5 text-forest">{formatAdminDate(booking.preferred_at)}</dd></div>}
                <div><dt className="text-xs text-forest/50">Reçue le</dt><dd className="mt-0.5 text-forest">{formatAdminDate(booking.created_at)}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
