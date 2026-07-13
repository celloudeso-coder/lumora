import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { AdditionalPageSections } from "@/components/ui/AdditionalPageSections";
import { Gallery } from "@/components/ui/Gallery";
import { BelezaBookingForm } from "@/components/forms/BelezaBookingForm";
import { getActivity } from "@/lib/activities";
import { GALLERIES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Beleza Beauty — Institut de beauté à Conakry",
  description:
    "Massages, soins du visage et du corps sur rendez-vous, dans un cadre apaisant au cœur de Conakry.",
};

// Carte des soins provisoire — durées et prix (GNF) à valider avec la cliente.
const TREATMENTS = [
  {
    category: "Massages",
    items: [
      { name: "Massage relaxant", detail: "60 min", price: "250 000 GNF" },
      { name: "Massage tonique", detail: "60 min", price: "250 000 GNF" },
      { name: "Massage dos & nuque", detail: "30 min", price: "150 000 GNF" },
    ],
  },
  {
    category: "Soins du visage",
    items: [
      { name: "Soin éclat", detail: "45 min", price: "200 000 GNF" },
      { name: "Soin hydratant profond", detail: "60 min", price: "250 000 GNF" },
      { name: "Nettoyage de peau", detail: "45 min", price: "180 000 GNF" },
    ],
  },
  {
    category: "Corps & esthétique",
    items: [
      { name: "Gommage corporel", detail: "45 min", price: "200 000 GNF" },
      { name: "Manucure / pédicure", detail: "60 min", price: "150 000 GNF" },
      { name: "Épilation (zone au choix)", detail: "dès 30 min", price: "sur demande" },
    ],
  },
];

const SERVICES_LIST = TREATMENTS.flatMap((t) => t.items.map((i) => i.name));

export default function BelezaPage() {
  const activity = getActivity("beleza-beauty")!;

  return (
    <>
      <PageHero
        pageSlug="beleza-beauty"
        title={activity.name}
        tagline={activity.tagline}
        description="Offrez-vous une parenthèse de douceur. Nos esthéticiennes vous accueillent sur rendez-vous pour des soins personnalisés, dans une ambiance feutrée."
        icon={activity.icon}
      />

      <Section
        pageSlug="beleza-beauty"
        sectionKey="galerie"
        title="L'institut en images"
        intro="Nos salles de massage et de soin, pensées pour la détente."
      >
        <Gallery images={GALLERIES.beleza} columns={3} />
      </Section>

      <Section
        pageSlug="beleza-beauty"
        sectionKey="soins"
        title="Nos soins"
        intro="Carte provisoire — durées et tarifs confirmés à la prise de rendez-vous."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {TREATMENTS.map((cat) => (
            <div
              key={cat.category}
              className="edge-gold panel-forest rounded-2xl border border-gold/30 bg-cream-50 p-5"
            >
              <h3 className="font-display text-xl font-semibold text-forest">
                {cat.category}
              </h3>
              <div className="mt-2 h-px w-10 bg-gold" />
              <ul className="mt-4 space-y-3">
                {cat.items.map((item) => (
                  <li key={item.name} className="text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-forest/85">{item.name}</span>
                      <span className="shrink-0 font-medium text-gold-700">
                        {item.price}
                      </span>
                    </div>
                    <span className="text-xs text-forest/60">{item.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        pageSlug="beleza-beauty"
        sectionKey="reservation"
        title="Prendre rendez-vous"
        intro="Indiquez le soin et le moment qui vous conviennent : nous confirmons l'horaire par téléphone ou WhatsApp."
        tone="light"
        id="rendez-vous"
      >
        <div className="max-w-xl">
          <BelezaBookingForm services={SERVICES_LIST} />
        </div>
      </Section>
      <AdditionalPageSections pageSlug="beleza-beauty" />
    </>
  );
}
