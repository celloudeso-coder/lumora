import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { getActivity } from "@/lib/activities";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lumora Café — Coffee & Lifestyle à Conakry",
  description:
    "Cafés d'exception, boissons fraîches et douceurs à prix fixes, dans un cadre élégant au cœur de Conakry.",
};

// Menu provisoire — prix fixes en GNF, à valider avec la cliente.
const MENU: { category: string; items: { name: string; price: string }[] }[] = [
  {
    category: "Cafés & boissons chaudes",
    items: [
      { name: "Espresso", price: "30 000 GNF" },
      { name: "Cappuccino", price: "45 000 GNF" },
      { name: "Café latte", price: "50 000 GNF" },
      { name: "Thé à la menthe", price: "35 000 GNF" },
      { name: "Chocolat chaud", price: "45 000 GNF" },
    ],
  },
  {
    category: "Boissons fraîches",
    items: [
      { name: "Jus de fruits frais (bissap, gingembre, mangue)", price: "40 000 GNF" },
      { name: "Smoothie du jour", price: "55 000 GNF" },
      { name: "Café glacé", price: "50 000 GNF" },
      { name: "Eau minérale", price: "15 000 GNF" },
    ],
  },
  {
    category: "Douceurs & encas",
    items: [
      { name: "Pâtisserie du jour", price: "35 000 GNF" },
      { name: "Cookie maison", price: "25 000 GNF" },
      { name: "Croissant beurre", price: "20 000 GNF" },
      { name: "Sandwich club", price: "60 000 GNF" },
    ],
  },
  {
    category: "Formules",
    items: [
      { name: "Formule matin (boisson chaude + croissant)", price: "45 000 GNF" },
      { name: "Formule déjeuner (sandwich + boisson + douceur)", price: "95 000 GNF" },
    ],
  },
];

export default function CafePage() {
  const activity = getActivity("cafe")!;

  return (
    <>
      <PageHero
        title={activity.name}
        tagline={activity.tagline}
        description="Un écrin chaleureux pour vos pauses café, vos rendez-vous et vos moments de détente. Tous nos prix sont fixes et affichés — pas de surprise."
        icon={activity.icon}
      />

      <Section
        title="Notre menu"
        intro="Menu provisoire — les prix affichés sont indicatifs et seront confirmés à l'ouverture."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {MENU.map((cat) => (
            <div
              key={cat.category}
              className="rounded-2xl border border-gold/30 bg-cream-50 p-5"
            >
              <h3 className="font-display text-xl font-semibold text-forest">
                {cat.category}
              </h3>
              <div className="mt-2 h-px w-10 bg-gold" />
              <ul className="mt-4 space-y-3">
                {cat.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="text-forest/85">{item.name}</span>
                    <span className="shrink-0 font-medium text-gold-700">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Infos pratiques" tone="light">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
              <Clock className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-forest">
                Horaires
              </h3>
              <p className="mt-1 text-sm font-light text-forest/80">
                Lundi – Samedi : 7h30 – 20h00
                <br />
                Dimanche : 9h00 – 18h00
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
              <MapPin className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-forest">
                Adresse
              </h3>
              <p className="mt-1 text-sm font-light text-forest/80">
                {SITE.address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-forest p-6 text-cream sm:flex sm:items-center sm:justify-between">
          <p className="font-light">
            Suivez nos nouveautés et l'ambiance du café sur nos réseaux :
          </p>
          <SocialLinks className="mt-4 sm:mt-0" />
        </div>
      </Section>
    </>
  );
}
