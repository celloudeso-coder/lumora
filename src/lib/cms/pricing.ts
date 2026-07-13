import { cache } from "react";
import { CAFE_MENU, type MenuCategory } from "@/lib/data/cafe-menu";
import { PILATES_OFFERS, type PilatesOffer } from "@/lib/data/pilates-pricing";
import { PRESSING_PRICES, type PressingPrice } from "@/lib/data/pressing-pricing";
import { pricingKey, type PricingActivity } from "@/lib/cms/pricing-registry";
import { createPublicServerClient } from "@/lib/supabase/server";

export type PricingOverride = {
  item_key: string;
  label: string | null;
  price: number | null;
  price_small: number | null;
  price_medium: number | null;
  price_large: number | null;
  note: string | null;
  is_visible: boolean;
  is_custom: boolean;
  group_name: string | null;
  mode: "single" | "sizes" | null;
};

export const getPricingOverrides = cache(async (activity: PricingActivity) => {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("pricing_overrides")
    .select("item_key, label, price, price_small, price_medium, price_large, note, is_visible, is_custom, group_name, mode")
    .eq("activity", activity);

  if (error) throw new Error(`Lecture des tarifs « ${activity} » impossible : ${error.message}`);

  return new Map(
    (data as PricingOverride[]).map((item) => [item.item_key, item]),
  );
});

export async function getCafeMenu(): Promise<MenuCategory[]> {
  const overrides = await getPricingOverrides("cafe");
  const customItems = [...overrides.values()].filter((item) => item.is_custom && item.is_visible);

  return CAFE_MENU.map((category) => ({
    ...category,
    items: [
      ...category.items.flatMap((item) => {
      const override = overrides.get(pricingKey(category.category, item.name));
      if (override?.is_visible === false) return [];
      if (!override) return [item];

      return [{
        ...item,
        name: override.label ?? item.name,
        note: override.note ?? item.note,
        ...(item.sizes
          ? { sizes: [
              override.price_small ?? item.sizes[0],
              override.price_medium ?? item.sizes[1],
              override.price_large ?? item.sizes[2],
            ] as [number | null, number | null, number | null] }
          : { price: override.price ?? item.price }),
      }];
      }),
      ...customItems
        .filter((item) => item.group_name === category.category)
        .map((item) => ({
          name: item.label ?? "Nouveau produit",
          note: item.note ?? undefined,
          ...(item.mode === "sizes"
            ? { sizes: [item.price_small, item.price_medium, item.price_large] as [number | null, number | null, number | null] }
            : { price: item.price ?? undefined }),
        })),
    ],
  })).filter((category) => category.items.length > 0);
}

export async function getPilatesOffers(): Promise<PilatesOffer[]> {
  const overrides = await getPricingOverrides("pilates");
  const customItems = [...overrides.values()].filter((item) => item.is_custom && item.is_visible);

  return PILATES_OFFERS.map((offer) => ({
    ...offer,
    formulas: [...offer.formulas.flatMap((formula) => {
      const override = overrides.get(formula.id);
      if (override?.is_visible === false) return [];
      return [{
        ...formula,
        label: override?.label ?? formula.label,
        price: override?.price ?? formula.price,
      }];
    }), ...customItems
      .filter((item) => item.group_name === offer.format && item.price != null)
      .map((item) => ({ id: item.item_key, label: item.label ?? "Nouvelle formule", price: item.price! }))],
  })).filter((offer) => offer.formulas.length > 0);
}

export async function getPressingPrices(): Promise<PressingPrice[]> {
  const overrides = await getPricingOverrides("pressing");
  const customItems = [...overrides.values()].filter((item) => item.is_custom && item.is_visible && item.price != null);

  return [...PRESSING_PRICES.flatMap((item) => {
    const override = overrides.get(item.id);
    if (override?.is_visible === false) return [];
    return [{
      ...item,
      item: override?.label ?? item.item,
      price: override?.price ?? item.price,
    }];
  }), ...customItems.map((item) => ({ id: item.item_key, item: item.label ?? "Nouvelle prestation", price: item.price! }))];
}
