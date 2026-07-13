import type { Metadata } from "next";
import { Clock, Truck, BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { AdditionalPageSections } from "@/components/ui/AdditionalPageSections";
import { LeadForm } from "@/components/forms/LeadForm";
import { getActivity } from "@/lib/activities";
import { getPressingPrices } from "@/lib/cms/pricing";
import { formatGNF } from "@/lib/format";

export const metadata: Metadata = {
  title: "Lumora Pressing — Professional Care à Conakry",
  description:
    "Pressing professionnel à Conakry : nettoyage à sec, repassage, entretien du linge de maison. Tarifs clairs, délais tenus.",
};

const COMMITMENTS = [
  {
    icon: BadgeCheck,
    title: "Soin professionnel",
    text: "Produits adaptés à chaque textile, repassage soigné, contrôle qualité avant restitution.",
  },
  {
    icon: Clock,
    title: "Délais tenus",
    text: "Standard sous 48h ; service express 24h disponible sur demande.",
  },
  {
    icon: Truck,
    title: "Dépôt & retrait faciles",
    text: "Déposez et récupérez en boutique ; collecte/livraison possible selon le quartier.",
  },
];

export default async function PressingPage() {
  const activity = getActivity("pressing")!;
  const prices = await getPressingPrices();

  return (
    <>
      <PageHero
        pageSlug="pressing"
        title={activity.name}
        tagline={activity.tagline}
        description="Confiez-nous vos vêtements et votre linge de maison : nettoyage, repassage et soin du détail, avec des tarifs clairs et des délais respectés."
        icon={activity.icon}
      />

      <Section pageSlug="pressing" sectionKey="engagements" title="Nos engagements">
        <div className="grid gap-4 sm:grid-cols-3">
          {COMMITMENTS.map((c) => (
            <div
              key={c.title}
              className="edge-gold panel-forest rounded-2xl border border-gold/30 bg-cream-50 p-5"
            >
              <c.icon className="h-7 w-7 text-gold-600" />
              <h3 className="mt-3 font-display text-xl font-semibold text-forest">
                {c.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-forest/80">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        pageSlug="pressing"
        sectionKey="tarifs"
        title="Tarifs indicatifs"
        intro="Tarifs provisoires, confirmés au dépôt selon la matière et l'état de l'article."
        tone="light"
      >
        <ul className="panel-forest max-w-xl divide-y divide-gold/20 rounded-2xl border border-gold/30 bg-white px-5">
          {prices.map((p) => (
            <li
              key={p.item}
              className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"
            >
              <span className="text-forest/85">{p.item}</span>
              <span className="shrink-0 font-medium text-gold-700">
                {formatGNF(p.price)}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        pageSlug="pressing"
        sectionKey="contact"
        title="Une question, un besoin particulier ?"
        intro="Grande quantité, textile délicat, entreprise ou hôtel : écrivez-nous, nous vous répondons rapidement."
      >
        <div className="max-w-xl">
          <LeadForm
            activity="pressing"
            subjects={[
              "Nettoyage ponctuel",
              "Abonnement / dépôt régulier",
              "Linge professionnel (hôtel, restaurant…)",
              "Textile délicat",
              "Autre",
            ]}
          />
        </div>
      </Section>
      <AdditionalPageSections pageSlug="pressing" />
    </>
  );
}
