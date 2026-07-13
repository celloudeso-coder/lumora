import { CAFE_MENU } from "@/lib/data/cafe-menu";
import { PILATES_OFFERS } from "@/lib/data/pilates-pricing";
import { PRESSING_PRICES } from "@/lib/data/pressing-pricing";

export type PricingActivity = "cafe" | "pilates" | "pressing";
export type PricingMode = "single" | "sizes";

export type PricingItemDefinition = {
  activity: PricingActivity;
  key: string;
  group: string;
  label: string;
  mode: PricingMode;
  price?: number;
  sizes?: [number | null, number | null, number | null];
  note?: string;
};

export type PricingArea = {
  activity: PricingActivity;
  title: string;
  href: string;
  description: string;
  items: PricingItemDefinition[];
};

export function pricingKey(...parts: string[]) {
  return parts
    .join("-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const cafeItems: PricingItemDefinition[] = CAFE_MENU.flatMap((category) =>
  category.items.map((item) => ({
    activity: "cafe" as const,
    key: pricingKey(category.category, item.name),
    group: category.category,
    label: item.name,
    mode: item.sizes ? ("sizes" as const) : ("single" as const),
    price: item.price,
    sizes: item.sizes,
    note: item.note,
  })),
);

const pilatesItems: PricingItemDefinition[] = PILATES_OFFERS.flatMap((offer) =>
  offer.formulas.map((formula) => ({
    activity: "pilates" as const,
    key: formula.id,
    group: offer.name,
    label: formula.label,
    mode: "single" as const,
    price: formula.price,
  })),
);

const pressingItems: PricingItemDefinition[] = PRESSING_PRICES.map((item) => ({
  activity: "pressing" as const,
  key: item.id,
  group: "Grille tarifaire",
  label: item.item,
  mode: "single" as const,
  price: item.price,
}));

export const PRICING_AREAS: PricingArea[] = [
  {
    activity: "cafe",
    title: "Lumora Café",
    href: "/cafe",
    description: "Boissons, accompagnements et suppléments.",
    items: cafeItems,
  },
  {
    activity: "pilates",
    title: "Lumora Pilates",
    href: "/pilates",
    description: "Sessions et packs Reformer ou Mat / Yoga.",
    items: pilatesItems,
  },
  {
    activity: "pressing",
    title: "Lumora Pressing",
    href: "/pressing",
    description: "Prix indicatifs des prestations de pressing.",
    items: pressingItems,
  },
];

export function getPricingArea(activity: string) {
  return PRICING_AREAS.find((area) => area.activity === activity);
}

export function getPricingItem(activity: string, itemKey: string) {
  return getPricingArea(activity)?.items.find((item) => item.key === itemKey);
}
