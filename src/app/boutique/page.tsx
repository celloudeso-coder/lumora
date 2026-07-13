import type { Metadata } from "next";
import { Banknote, Smartphone, CreditCard } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { AdditionalPageSections } from "@/components/ui/AdditionalPageSections";
import { LeadForm } from "@/components/forms/LeadForm";
import { getActivity } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Boutique — LUMORA GROUP à Conakry",
  description:
    "La boutique LUMORA à Conakry : une sélection de produits du quotidien et d'exception. Paiement en espèces, Orange Money ou carte.",
};

// Catégories provisoires — à ajuster selon l'assortiment réel.
const CATEGORIES = [
  {
    title: "Maison & décoration",
    text: "Objets et accessoires choisis pour embellir votre intérieur.",
  },
  {
    title: "Beauté & bien-être",
    text: "Produits de soin sélectionnés en écho à l'univers Beleza Beauty.",
  },
  {
    title: "Épicerie fine & café",
    text: "Cafés, thés et douceurs dans l'esprit Lumora Café, à emporter.",
  },
  {
    title: "Accessoires & cadeaux",
    text: "Des idées cadeaux élégantes pour toutes les occasions.",
  },
];

const PAYMENTS = [
  { icon: Banknote, label: "Espèces" },
  { icon: Smartphone, label: "Orange Money" },
  { icon: CreditCard, label: "Carte bancaire" },
];

export default function BoutiquePage() {
  const activity = getActivity("boutique")!;

  return (
    <>
      <PageHero
        pageSlug="boutique"
        title={activity.name}
        tagline={activity.tagline}
        description="Notre boutique vous accueille à Conakry avec une sélection de produits fidèle à l'exigence LUMORA : qualité, élégance et utilité au quotidien."
        icon={activity.icon}
      />

      <Section
        pageSlug="boutique"
        sectionKey="rayons"
        title="Nos rayons"
        intro="Assortiment provisoire — le catalogue détaillé sera présenté en boutique."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <div
              key={c.title}
              className="edge-gold panel-forest rounded-2xl border border-gold/30 bg-cream-50 p-5"
            >
              <h3 className="font-display text-xl font-semibold text-forest">
                {c.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-forest/80">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section pageSlug="boutique" sectionKey="paiements" title="Moyens de paiement" tone="light">
        <ul className="flex flex-wrap gap-3">
          {PAYMENTS.map((p) => (
            <li
              key={p.label}
              className="payment-chip flex min-h-12 items-center gap-2.5 rounded-full border border-gold/40 bg-white px-5 text-sm font-medium text-forest"
            >
              <p.icon className="h-5 w-5 text-gold-600" />
              {p.label}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        pageSlug="boutique"
        sectionKey="demande"
        title="Une demande particulière ?"
        intro="Disponibilité d'un produit, commande spéciale, achat en quantité : écrivez-nous."
      >
        <div className="max-w-xl">
          <LeadForm
            activity="boutique"
            subjects={[
              "Disponibilité d'un produit",
              "Commande spéciale",
              "Achat en quantité",
              "Autre",
            ]}
          />
        </div>
      </Section>
      <AdditionalPageSections pageSlug="boutique" />
    </>
  );
}
