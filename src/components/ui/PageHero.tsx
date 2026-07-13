import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { resolvePageSection } from "@/lib/cms/page-sections";

/** En-tête de page d'activité : fond vert forêt, tagline or, titre serif. */
export async function PageHero({
  title,
  tagline,
  description,
  icon: Icon,
  pageSlug,
  sectionKey = "hero",
}: {
  title: string;
  tagline: string;
  description?: string;
  icon?: LucideIcon;
  pageSlug?: string;
  sectionKey?: string;
}) {
  const content = pageSlug
    ? await resolvePageSection(pageSlug, sectionKey, {
        title,
        intro: tagline,
        body: description,
      })
    : { title, intro: tagline, body: description, isVisible: true };

  if (!content.isVisible) return null;

  return (
    <section className="page-hero hero-glow bg-forest text-cream">
      <div className="page-hero-orb page-hero-orb-one" aria-hidden="true" />
      <div className="page-hero-orb page-hero-orb-two" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:py-16 lg:px-6 lg:py-24">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-4">
            {Icon && (
              <span className="page-hero-icon inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/40 bg-cream/5 text-gold sm:h-16 sm:w-16">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
            )}
            <p className="text-xs uppercase tracking-[0.32em] text-gold sm:tracking-[0.4em]">
              {content.intro}
            </p>
          </div>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          {content.body && (
            <p className="mt-5 max-w-2xl font-light leading-relaxed text-cream/80 sm:text-lg">
              {content.body}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
