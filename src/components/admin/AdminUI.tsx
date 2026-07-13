import type { LucideIcon } from "lucide-react";

export function AdminPageHeader({
  eyebrow = "Administration",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-gold-700">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-forest sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed text-forest/65">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-800 border-blue-200",
  in_progress: "bg-amber-50 text-amber-800 border-amber-200",
  closed: "bg-forest-50 text-forest border-forest-100",
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  cancelled: "bg-red-50 text-red-800 border-red-200",
  done: "bg-forest-50 text-forest border-forest-100",
  draft: "bg-stone-100 text-stone-700 border-stone-200",
  published: "bg-forest-50 text-forest border-forest-100",
  open: "bg-forest-50 text-forest border-forest-100",
  past: "bg-stone-100 text-stone-600 border-stone-200",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  in_progress: "En cours",
  closed: "Traité",
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  done: "Terminée",
  draft: "Brouillon",
  published: "Publié",
  open: "Ouvert",
  past: "Passé",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide ${
        STATUS_STYLES[status] ?? "border-forest/15 bg-cream text-forest/70"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gold/40 bg-cream-50 px-5 py-12 text-center">
      <Icon className="mx-auto h-8 w-8 text-gold-600" />
      <h2 className="mt-3 font-display text-xl font-semibold text-forest">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm font-light text-forest/60">{text}</p>
    </div>
  );
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const ACTIVITY_LABELS: Record<string, string> = {
  pilates: "Pilates",
  beleza: "Beleza Beauty",
  construction: "Construction",
  pressing: "Pressing",
  boutique: "Boutique",
  showroom: "Showroom",
  general: "Général",
  cafe: "Café",
  group: "LUMORA GROUP",
};

export function activityLabel(activity: string) {
  return ACTIVITY_LABELS[activity] ?? activity;
}
