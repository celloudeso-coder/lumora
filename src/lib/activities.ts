import type { LucideIcon } from "lucide-react";
import {
  Coffee,
  Flower2,
  HardHat,
  Shirt,
  ShoppingBag,
  Sparkles,
  Warehouse,
} from "lucide-react";

export type ActivityCta = "booking" | "quote" | "none";

export type Activity = {
  slug: string;
  name: string;
  /** Libellé court pour la navigation */
  shortName: string;
  /** Tagline officielle (logo) */
  tagline: string;
  /** Accroche pour la carte d'accueil */
  pitch: string;
  icon: LucideIcon;
  cta: ActivityCta;
  ctaLabel: string;
  /** true = sous-marque du logo, false = activité indépendante */
  isSubBrand: boolean;
};

export const ACTIVITIES: Activity[] = [
  {
    slug: "construction",
    name: "Lumora Construction",
    shortName: "Construction",
    tagline: "Building Futures",
    pitch:
      "Construction, rénovation et matériaux de qualité pour vos projets résidentiels et professionnels à Conakry.",
    icon: HardHat,
    cta: "quote",
    ctaLabel: "Demander un devis",
    isSubBrand: true,
  },
  {
    slug: "cafe",
    name: "Lumora Café",
    shortName: "Café",
    tagline: "Coffee & Lifestyle",
    pitch:
      "Un lieu chaleureux pour savourer cafés d'exception, douceurs et moments de détente, à prix fixes.",
    icon: Coffee,
    cta: "none",
    ctaLabel: "Découvrir le menu",
    isSubBrand: true,
  },
  {
    slug: "pilates",
    name: "Lumora Pilates",
    shortName: "Pilates",
    tagline: "Mind & Body Fitness",
    pitch:
      "Cours de Pilates encadrés en petit groupe, pour renforcer le corps et apaiser l'esprit. Sur réservation.",
    icon: Flower2,
    cta: "booking",
    ctaLabel: "Réserver un cours",
    isSubBrand: true,
  },
  {
    slug: "pressing",
    name: "Lumora Pressing",
    shortName: "Pressing",
    tagline: "Professional Care",
    pitch:
      "Nettoyage et entretien professionnel de vos vêtements et textiles, avec le soin du détail.",
    icon: Shirt,
    cta: "quote",
    ctaLabel: "Nous contacter",
    isSubBrand: true,
  },
  {
    slug: "beleza-beauty",
    name: "Beleza Beauty",
    shortName: "Beleza",
    tagline: "Beauty & Care",
    pitch:
      "Institut de beauté : massages, soins du visage et du corps, dans un cadre apaisant. Sur rendez-vous.",
    icon: Sparkles,
    cta: "booking",
    ctaLabel: "Prendre rendez-vous",
    isSubBrand: true,
  },
  {
    slug: "boutique",
    name: "Boutique",
    shortName: "Boutique",
    tagline: "Sélection & Qualité",
    pitch:
      "Une sélection de produits du quotidien et d'exception. Paiement en espèces, Orange Money ou carte.",
    icon: ShoppingBag,
    cta: "quote",
    ctaLabel: "Nous contacter",
    isSubBrand: false,
  },
  {
    slug: "showroom",
    name: "Show Room",
    shortName: "Showroom",
    tagline: "Exposition & Inspiration",
    pitch:
      "Découvrez nos échantillons et matériaux en exposition, et repartez avec un devis pour votre projet.",
    icon: Warehouse,
    cta: "quote",
    ctaLabel: "Demander un devis",
    isSubBrand: false,
  },
];

export const VALUES = [
  "Qualité",
  "Confiance",
  "Excellence",
  "Passion",
  "Prestige",
] as const;

export function getActivity(slug: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.slug === slug);
}
