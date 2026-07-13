import { MessageSquareText } from "lucide-react";
import { AdminPageHeader, EmptyState, StatusBadge, activityLabel, formatAdminDate } from "@/components/admin/AdminUI";
import { createSessionClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "Demandes" };

export default async function AdminDemandesPage() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, activity, name, phone, email, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Lecture des demandes impossible : ${error.message}`);

  return (
    <>
      <AdminPageHeader title="Demandes" description="Contacts et demandes de devis reçus depuis les différentes activités." />
      {!data?.length ? (
        <EmptyState icon={MessageSquareText} title="Aucune demande" text="Les demandes envoyées depuis les formulaires du site apparaîtront ici." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-gold-700">{activityLabel(lead.activity)}</p>
                  <h2 className="mt-1 truncate font-display text-xl font-semibold text-forest">{lead.name}</h2>
                  <p className="mt-0.5 text-sm text-forest/65">{lead.subject || "Demande générale"}</p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <p className="mt-4 line-clamp-3 text-sm font-light leading-relaxed text-forest/75">{lead.message}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-gold/15 pt-4 text-xs text-forest/55">
                <span>{lead.phone}</span>
                {lead.email && <span>{lead.email}</span>}
                <time>{formatAdminDate(lead.created_at)}</time>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
