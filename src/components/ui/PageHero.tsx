import type { LucideIcon } from "lucide-react";

/** En-tête de page d'activité : fond vert forêt, tagline or, titre serif. */
export function PageHero({
  title,
  tagline,
  description,
  icon: Icon,
}: {
  title: string;
  tagline: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <section className="bg-forest text-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-20">
        {Icon && (
          <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold">
            <Icon className="h-7 w-7" />
          </span>
        )}
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          {tagline}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl font-light leading-relaxed text-cream/85 lg:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
