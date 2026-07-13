import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  MessageSquareText,
  Newspaper,
} from "lucide-react";
import { AdminPageHeader, StatusBadge, activityLabel, formatAdminDate } from "@/components/admin/AdminUI";
import { createSessionClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "Tableau de bord" };

export default async function AdminDashboardPage() {
  const supabase = await createSessionClient();

  const [
    pendingBookings,
    newLeads,
    draftArticles,
    openSlots,
    recentBookings,
    recentLeads,
  ] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase
      .from("class_slots")
      .select("id", { count: "exact", head: true })
      .eq("status", "open")
      .gt("starts_at", new Date().toISOString()),
    supabase
      .from("bookings")
      .select("id, activity, customer_name, service, status, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("leads")
      .select("id, activity, name, subject, status, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const firstError = [
    pendingBookings.error,
    newLeads.error,
    draftArticles.error,
    openSlots.error,
    recentBookings.error,
    recentLeads.error,
  ].find(Boolean);
  if (firstError) throw new Error(`Chargement du tableau de bord impossible : ${firstError.message}`);

  const stats = [
    {
      label: "Réservations en attente",
      value: pendingBookings.count ?? 0,
      href: "/admin/reservations",
      icon: ClipboardList,
    },
    {
      label: "Nouvelles demandes",
      value: newLeads.count ?? 0,
      href: "/admin/demandes",
      icon: MessageSquareText,
    },
    {
      label: "Articles en brouillon",
      value: draftArticles.count ?? 0,
      href: "/admin/articles",
      icon: Newspaper,
    },
    {
      label: "Créneaux à venir",
      value: openSlots.count ?? 0,
      href: "/admin/creneaux",
      icon: CalendarDays,
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Vue d'ensemble"
        title="Tableau de bord"
        description="Les éléments qui demandent votre attention aujourd'hui."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card-lift group rounded-2xl border border-gold/25 bg-cream-50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-gold">
                <stat.icon className="h-5 w-5" />
              </span>
              <ArrowRight className="h-4 w-4 text-gold-600" />
            </div>
            <p className="mt-5 font-display text-4xl font-semibold text-forest">{stat.value}</p>
            <p className="mt-1 text-sm text-forest/65">{stat.label}</p>
          </Link>
        ))}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <DashboardList title="Dernières réservations" href="/admin/reservations">
          {(recentBookings.data ?? []).map((booking) => (
            <li key={booking.id} className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-forest">{booking.customer_name}</p>
                <p className="mt-0.5 truncate text-xs text-forest/55">
                  {activityLabel(booking.activity)} · {booking.service || "Sans précision"}
                </p>
                <time className="mt-1 block text-[0.7rem] text-forest/45">
                  {formatAdminDate(booking.created_at)}
                </time>
              </div>
              <StatusBadge status={booking.status} />
            </li>
          ))}
        </DashboardList>

        <DashboardList title="Dernières demandes" href="/admin/demandes">
          {(recentLeads.data ?? []).map((lead) => (
            <li key={lead.id} className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-forest">{lead.name}</p>
                <p className="mt-0.5 truncate text-xs text-forest/55">
                  {activityLabel(lead.activity)} · {lead.subject || "Demande générale"}
                </p>
                <time className="mt-1 block text-[0.7rem] text-forest/45">
                  {formatAdminDate(lead.created_at)}
                </time>
              </div>
              <StatusBadge status={lead.status} />
            </li>
          ))}
        </DashboardList>
      </div>
    </>
  );
}

function DashboardList({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-forest">{title}</h2>
        <Link href={href} className="text-xs font-medium text-gold-700 hover:underline">
          Tout voir
        </Link>
      </div>
      <ul className="mt-3 divide-y divide-gold/15">{children}</ul>
    </section>
  );
}
