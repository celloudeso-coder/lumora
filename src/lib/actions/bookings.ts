"use server";

// Server Actions des réservations Pilates et Beleza → table `bookings`.
// Insertion via la clé service role (pas de policy d'insertion anonyme).

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getOffer } from "@/lib/data/pilates-pricing";
import type { FormState } from "./form-state";

const nameSchema = z.string().trim().min(2, "Indiquez votre nom complet.").max(120);
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Indiquez un numéro de téléphone valide.")
  .max(30, "Indiquez un numéro de téléphone valide.");

// ------------------------------------------------------------------
// Pilates : format → formule → créneau
// ------------------------------------------------------------------

const pilatesSchema = z.object({
  format: z.enum(["reformer", "mat"], "Choisissez un format de cours."),
  formula: z.string().min(1, "Choisissez une formule."),
  slot: z.uuid("Choisissez un créneau."),
  name: nameSchema,
  phone: phoneSchema,
});

type OpenSlotRow = {
  id: string;
  title: string;
  format: string;
  remaining: number;
};

export async function submitPilatesBooking(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (formData.get("website")) {
    return { status: "success" }; // honeypot
  }

  const parsed = pilatesSchema.safeParse({
    format: String(formData.get("format") ?? ""),
    formula: String(formData.get("formula") ?? ""),
    slot: String(formData.get("slot") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
    };
  }

  const { format, formula: formulaId, slot: slotId, name, phone } = parsed.data;

  const offer = getOffer(format);
  const formula = offer.formulas.find((f) => f.id === formulaId);
  if (!formula) {
    return { status: "error", message: "Formule invalide pour ce format de cours." };
  }

  const supabase = createAdminClient();

  // Le créneau doit être ouvert, à venir, du bon format, avec de la place.
  const { data: slots, error: slotsError } = await supabase.rpc("open_slots");
  if (slotsError) {
    console.error("submitPilatesBooking/open_slots:", slotsError.message);
    return {
      status: "error",
      message: "Une erreur est survenue. Réessayez dans quelques instants.",
    };
  }
  const slot = (slots as OpenSlotRow[]).find((s) => s.id === slotId);
  if (!slot || slot.format !== format) {
    return {
      status: "error",
      message: "Ce créneau n'est plus disponible — choisissez-en un autre.",
    };
  }
  if (slot.remaining <= 0) {
    return { status: "error", message: "Ce créneau est complet — choisissez-en un autre." };
  }

  const { error } = await supabase.from("bookings").insert({
    activity: "pilates",
    slot_id: slotId,
    service: `${offer.name} — ${formula.label}`,
    customer_name: name,
    phone,
  });

  if (error) {
    console.error("submitPilatesBooking:", error.message);
    return {
      status: "error",
      message:
        "Une erreur est survenue lors de la réservation. Réessayez, ou contactez-nous par WhatsApp.",
    };
  }

  // Met à jour le compteur de places restantes affiché sur la page.
  revalidatePath("/pilates");
  return { status: "success" };
}

// ------------------------------------------------------------------
// Beleza : soin + date/heure souhaitées
// ------------------------------------------------------------------

const belezaSchema = z.object({
  service: z.string().trim().min(1, "Choisissez un soin.").max(200),
  date: z.iso.date("Indiquez une date souhaitée."),
  time: z.iso.time("Indiquez une heure souhaitée."),
  name: nameSchema,
  phone: phoneSchema,
  notes: z.string().trim().max(2000, "Précisions trop longues.").optional(),
});

export async function submitBelezaBooking(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (formData.get("website")) {
    return { status: "success" }; // honeypot
  }

  const parsed = belezaSchema.safeParse({
    service: String(formData.get("service") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: formData.get("notes") ? String(formData.get("notes")) : undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
    };
  }

  const { service, date, time, name, phone, notes } = parsed.data;
  // Conakry est à l'heure UTC : l'ISO en Z correspond à l'heure locale.
  const preferredAt = new Date(`${date}T${time}:00Z`);

  const supabase = createAdminClient();
  const { error } = await supabase.from("bookings").insert({
    activity: "beleza",
    service,
    preferred_at: preferredAt.toISOString(),
    customer_name: name,
    phone,
    notes: notes || null,
  });

  if (error) {
    console.error("submitBelezaBooking:", error.message);
    return {
      status: "error",
      message:
        "Une erreur est survenue lors de la demande. Réessayez, ou contactez-nous par WhatsApp.",
    };
  }

  return { status: "success" };
}
