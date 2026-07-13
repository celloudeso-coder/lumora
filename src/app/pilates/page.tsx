import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { AdditionalPageSections } from "@/components/ui/AdditionalPageSections";
import { Gallery } from "@/components/ui/Gallery";
import { Reveal } from "@/components/ui/Reveal";
import { PilatesBookingForm } from "@/components/forms/PilatesBookingForm";
import { getActivity } from "@/lib/activities";
import { getOpenSlots } from "@/lib/data/slots";
import { getPublishedArticles } from "@/lib/data/articles";
import { getPilatesOffers } from "@/lib/cms/pricing";
import { formatDate, formatGNF } from "@/lib/format";
import { GALLERIES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Lumora Pilates — Mind & Body Fitness à Conakry",
  description:
    "Lumora Studio à Conakry : cours de Pilates Reformer et Mat/Yoga en petit groupe. Session unique ou packs 5 et 10 séances — réservez votre créneau en ligne.",
};

export default async function PilatesPage() {
  const activity = getActivity("pilates")!;
  const [slots, articles, offers] = await Promise.all([
    getOpenSlots(),
    getPublishedArticles(),
    getPilatesOffers(),
  ]);
  const latest = articles.slice(0, 2);

  return (
    <>
      <PageHero
        pageSlug="pilates"
        title={activity.name}
        tagline={activity.tagline}
        description="Renforcez votre corps, apaisez votre esprit. Des cours en petit groupe encadrés par une coach certifiée, dans un studio lumineux pensé pour votre bien-être."
        icon={activity.icon}
      />

      <Section
        pageSlug="pilates"
        sectionKey="galerie"
        title="Le studio en images"
        intro="Le studio Lumora Pilates et ses appareils Reformer."
      >
        <Gallery images={GALLERIES.pilates} columns={3} />
      </Section>

      <Section
        pageSlug="pilates"
        sectionKey="offres"
        title="Nos offres — Lumora Studio"
        intro="Deux formats de cours, chacun en session unique ou en pack de 5 ou 10 séances. Prix en francs guinéens (GNF)."
        tone="light"
      >
        <Reveal className="grid gap-6 sm:grid-cols-2">
          {offers.map((offer) => (
            <div
              key={offer.format}
              className="edge-gold panel-forest flex flex-col rounded-2xl border border-gold/30 bg-white p-6"
            >
              <h3 className="font-display text-2xl font-semibold text-forest">
                {offer.name}
              </h3>
              <div className="mt-2 h-px w-10 bg-gold" />
              <p className="mt-3 text-sm font-light leading-relaxed text-forest/80">
                {offer.description}
              </p>
              <ul className="mt-5 flex-1 space-y-3">
                {offer.formulas.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-baseline justify-between gap-3 rounded-xl bg-cream-50 px-4 py-3"
                  >
                    <span className="flex items-center gap-2 text-sm text-forest/85">
                      <Check className="h-4 w-4 shrink-0 text-gold-600" />
                      {f.label}
                    </span>
                    <span className="shrink-0 text-sm font-medium text-gold-700">
                      {formatGNF(f.price)}
                    </span>
                  </li>
                ))}
              </ul>
              <a href="#reserver" className="btn-primary mt-6 w-full">
                Réserver
              </a>
            </div>
          ))}
        </Reveal>

        <div className="edge-gold panel-forest mt-8 rounded-2xl bg-forest p-6 text-cream sm:flex sm:items-center sm:justify-between">
          <p className="font-light">
            Envie d’un accompagnement sur mesure ? La salle peut être{" "}
            <span className="font-medium text-gold">privatisée</span> et des{" "}
            <span className="font-medium text-gold">cours privés</span> sont
            possibles, sur demande.
          </p>
          <Link href="/contact" className="btn-gold mt-4 shrink-0 sm:ml-6 sm:mt-0">
            Nous contacter
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section
        pageSlug="pilates"
        sectionKey="reservation"
        title="Réserver un cours"
        intro="Choisissez votre format, votre formule puis un créneau de la semaine : la confirmation arrive par téléphone ou WhatsApp."
        id="reserver"
      >
        <div className="max-w-xl">
          <PilatesBookingForm slots={slots} offers={offers} />
        </div>
      </Section>

      {/* Actualités du studio */}
      <Section
        pageSlug="pilates"
        sectionKey="actualites"
        title="Actualités du studio"
        intro="Nouveaux cours, conseils bien-être, événements et offres du moment."
        tone="light"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {latest.map((article) => (
            <Link
              key={article.id}
              href={`/pilates/actualites/${article.slug}`}
              className="card-lift edge-gold group flex flex-col rounded-2xl border border-gold/30 bg-cream-50 p-5 lg:hover:border-gold"
            >
              <time className="text-xs uppercase tracking-widest text-gold-600">
                {formatDate(article.publishedAt)}
              </time>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-forest">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-forest/80">
                {article.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                Lire l’article
                <ArrowRight className="h-4 w-4 text-gold" />
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/pilates/actualites"
          className="btn-outline mt-6 w-full sm:w-auto"
        >
          Toutes les actualités
        </Link>
      </Section>
      <AdditionalPageSections pageSlug="pilates" />
    </>
  );
}
