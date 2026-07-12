import type { Metadata } from "next";
import { Clock, Truck, BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { getActivity } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Lumora Pressing — Professional Care à Conakry",
  description:
    "Pressing professionnel à Conakry : nettoyage à sec, repassage, entretien du linge de maison. Tarifs clairs, délais tenus.",
};

// Tarifs provisoires en GNF — à valider avec la cliente.
const PRICES = [
  { item: "Chemise / chemisier", price: "30 000 GNF" },
  { item: "Pantalon", price: "35 000 GNF" },
  { item: "Costume 2 pièces", price: "120 000 GNF" },
  { item: "Robe", price: "80 000 GNF" },
  { item: "Tenue traditionnelle / boubou", price: "90 000 GNF" },
  { item: "Veste / manteau", price: "100 000 GNF" },
  { item: "Parure de draps", price: "60 000 GNF" },
  { item: "Rideaux (le panneau)", price: "70 000 GNF" },
];

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

export default function PressingPage() {
  const activity = getActivity("pressing")!;

  return (
    <>
      <PageHero
        title={activity.name}
        tagline={activity.tagline}
        description="Confiez-nous vos vêtements et votre linge de maison : nettoyage, repassage et soin du détail, avec des tarifs clairs et des délais respectés."
        icon={activity.icon}
      />

      <Section title="Nos engagements">
        <div className="grid gap-4 sm:grid-cols-3">
          {COMMITMENTS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-gold/30 bg-cream-50 p-5"
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
        title="Tarifs indicatifs"
        intro="Tarifs provisoires, confirmés au dépôt selon la matière et l'état de l'article."
        tone="light"
      >
        <ul className="max-w-xl divide-y divide-gold/20 rounded-2xl border border-gold/30 bg-white px-5">
          {PRICES.map((p) => (
            <li
              key={p.item}
              className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm"
            >
              <span className="text-forest/85">{p.item}</span>
              <span className="shrink-0 font-medium text-gold-700">
                {p.price}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
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
    </>
  );
}
