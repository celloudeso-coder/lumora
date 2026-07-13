import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { HomeHero } from "@/components/home/HomeHero";
import { ACTIVITIES, VALUES } from "@/lib/activities";

export default function HomePage() {
  const subBrands = ACTIVITIES.filter((a) => a.isSubBrand);
  const independents = ACTIVITIES.filter((a) => !a.isSubBrand);

  return (
    <>
      <HomeHero />

      {/* Les 5 sous-marques */}
      <Section
        id="activites"
        title="Nos univers"
        intro="Cinq sous-marques portées par une même identité, et deux espaces à découvrir sur place."
      >
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subBrands.map((a) => (
            <ActivityCard key={a.slug} activity={a} />
          ))}
        </Reveal>

        <h3 className="mt-12 font-display text-2xl font-semibold text-forest">
          Nos espaces
        </h3>
        <div className="mt-2 h-px w-12 bg-gold" />
        <Reveal className="mt-6 grid gap-4 sm:grid-cols-2">
          {independents.map((a) => (
            <ActivityCard key={a.slug} activity={a} />
          ))}
        </Reveal>
      </Section>

      {/* Valeurs */}
      <section className="bg-forest-900 text-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
          <h2 className="text-center font-display text-3xl font-semibold">
            Nos valeurs
          </h2>
          <div className="mx-auto mt-3 h-px w-16 bg-gold" />
          <Reveal className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {VALUES.map((v) => (
              <div
                key={v}
                className="edge-gold rounded-xl border border-gold/25 px-4 py-5 text-center"
              >
                <span className="text-sm uppercase tracking-[0.2em] text-gold">
                  {v}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ActivityCard({
  activity,
}: {
  activity: (typeof ACTIVITIES)[number];
}) {
  const Icon = activity.icon;
  return (
    <Link
      href={`/${activity.slug}`}
      className="card-lift edge-gold group flex flex-col rounded-2xl border border-gold/30 bg-cream-50 p-5 lg:hover:border-gold"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold leading-tight text-forest">
            {activity.name}
          </h3>
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-gold-600">
            {activity.tagline}
          </p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm font-light leading-relaxed text-forest/80">
        {activity.pitch}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
        {activity.ctaLabel}
        <ArrowRight className="h-4 w-4 text-gold transition-transform lg:group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
