"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getPricingArea, getPricingItem } from "@/lib/cms/pricing-registry";
import { createSessionClient } from "@/lib/supabase/auth-server";

const identitySchema = z.object({
  activity: z.string().min(1).max(40),
  itemKey: z.string().min(1).max(200),
});

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text === "" ? null : text;
}

function optionalPrice(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (raw === "") return null;
  const price = Number(raw);
  if (!Number.isSafeInteger(price) || price < 0) throw new Error("Le tarif doit être un nombre entier positif.");
  return price;
}

export async function savePricingItem(formData: FormData) {
  const identity = identitySchema.safeParse({
    activity: String(formData.get("activity") ?? ""),
    itemKey: String(formData.get("itemKey") ?? ""),
  });
  if (!identity.success) throw new Error("Tarif invalide.");

  const area = getPricingArea(identity.data.activity);
  const supabase = await createSessionClient();
  if (!area) throw new Error("Zone tarifaire inconnue.");
  const registeredItem = getPricingItem(identity.data.activity, identity.data.itemKey);
  let item = registeredItem;
  let isCustom = false;
  if (!item) {
    const { data: customItem } = await supabase
      .from("pricing_overrides")
      .select("item_key, label, group_name, mode")
      .eq("activity", area.activity)
      .eq("item_key", identity.data.itemKey)
      .eq("is_custom", true)
      .maybeSingle();
    if (!customItem || !customItem.mode) throw new Error("Tarif inconnu.");
    item = {
      activity: area.activity,
      key: customItem.item_key,
      group: customItem.group_name ?? "Autres",
      label: customItem.label ?? "Nouveau tarif",
      mode: customItem.mode,
    };
    isCustom = true;
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const isSingle = item.mode === "single";
  const label = optionalText(formData.get("label"));
  const price = isSingle ? optionalPrice(formData.get("price")) : null;
  const priceSmall = isSingle ? null : optionalPrice(formData.get("priceSmall"));
  const priceMedium = isSingle ? null : optionalPrice(formData.get("priceMedium"));
  const priceLarge = isSingle ? null : optionalPrice(formData.get("priceLarge"));
  if (isCustom && !label) throw new Error("Le libellé du tarif est obligatoire.");
  if (isCustom && isSingle && price == null) throw new Error("Le montant du tarif est obligatoire.");
  if (isCustom && !isSingle && priceSmall == null && priceMedium == null && priceLarge == null) throw new Error("Renseignez au moins un montant.");
  const { error } = await supabase.from("pricing_overrides").upsert(
    {
      activity: area.activity,
      item_key: item.key,
      label,
      note: optionalText(formData.get("note")),
      price,
      price_small: priceSmall,
      price_medium: priceMedium,
      price_large: priceLarge,
      is_visible: formData.get("isVisible") === "on",
      updated_by: user.id,
    },
    { onConflict: "activity,item_key" },
  );

  if (error) throw new Error(`Enregistrement impossible : ${error.message}`);

  revalidatePath(area.href);
  revalidatePath(`/admin/tarifs/${area.activity}`);
  redirect(`/admin/tarifs/${area.activity}?saved=1`);
}

export async function resetPricingItem(formData: FormData) {
  const identity = identitySchema.safeParse({
    activity: String(formData.get("activity") ?? ""),
    itemKey: String(formData.get("itemKey") ?? ""),
  });
  if (!identity.success) throw new Error("Tarif invalide.");

  const area = getPricingArea(identity.data.activity);
  const supabase = await createSessionClient();
  if (!area) throw new Error("Zone tarifaire inconnue.");
  const registeredItem = getPricingItem(identity.data.activity, identity.data.itemKey);
  if (!registeredItem) {
    const { data: customItem } = await supabase
      .from("pricing_overrides")
      .select("item_key")
      .eq("activity", area.activity)
      .eq("item_key", identity.data.itemKey)
      .eq("is_custom", true)
      .maybeSingle();
    if (!customItem) throw new Error("Tarif inconnu.");
  }
  const { error } = await supabase
    .from("pricing_overrides")
    .delete()
    .eq("activity", area.activity)
    .eq("item_key", identity.data.itemKey);

  if (error) throw new Error(`Réinitialisation impossible : ${error.message}`);

  revalidatePath(area.href);
  revalidatePath(`/admin/tarifs/${area.activity}`);
  redirect(`/admin/tarifs/${area.activity}?reset=1`);
}

export async function createPricingItem(formData: FormData) {
  const activity = String(formData.get("activity") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const requestedGroup = String(formData.get("group") ?? "");
  const requestedMode = String(formData.get("mode") ?? "single");
  const area = getPricingArea(activity);
  if (!area || label.length < 2 || label.length > 200) throw new Error("Nouveau tarif invalide.");

  const allowedGroups = area.activity === "pilates"
    ? ["reformer", "mat"]
    : area.activity === "pressing"
      ? ["Grille tarifaire"]
      : [...new Set(area.items.map((item) => item.group))];
  if (!allowedGroups.includes(requestedGroup)) throw new Error("Catégorie tarifaire invalide.");
  const mode = area.activity === "cafe" && requestedMode === "sizes" ? "sizes" : "single";

  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const itemKey = `custom-${crypto.randomUUID()}`;
  const isSingle = mode === "single";
  const price = isSingle ? optionalPrice(formData.get("price")) : null;
  const priceSmall = isSingle ? null : optionalPrice(formData.get("priceSmall"));
  const priceMedium = isSingle ? null : optionalPrice(formData.get("priceMedium"));
  const priceLarge = isSingle ? null : optionalPrice(formData.get("priceLarge"));
  if (isSingle && price == null) throw new Error("Le montant du tarif est obligatoire.");
  if (!isSingle && priceSmall == null && priceMedium == null && priceLarge == null) throw new Error("Renseignez au moins un montant.");
  const { error } = await supabase.from("pricing_overrides").insert({
    activity: area.activity,
    item_key: itemKey,
    label,
    note: optionalText(formData.get("note")),
    price,
    price_small: priceSmall,
    price_medium: priceMedium,
    price_large: priceLarge,
    is_visible: true,
    is_custom: true,
    group_name: requestedGroup,
    mode,
    updated_by: user.id,
  });
  if (error) throw new Error(`Création impossible : ${error.message}`);

  revalidatePath(area.href);
  revalidatePath(`/admin/tarifs/${area.activity}`);
  redirect(`/admin/tarifs/${area.activity}?created=1`);
}
