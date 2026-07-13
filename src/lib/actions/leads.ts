"use server";

// Server Action des formulaires de contact / devis → table `leads`.
// Insertion via la clé service role : aucune policy d'insertion anonyme
// n'existe volontairement (voir la migration initiale).

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import type { FormState } from "./form-state";

const leadSchema = z.object({
  activity: z.enum(["construction", "pressing", "boutique", "showroom", "general"]),
  name: z.string().trim().min(2, "Indiquez votre nom complet.").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Indiquez un numéro de téléphone valide.")
    .max(30, "Indiquez un numéro de téléphone valide."),
  email: z.union([z.literal(""), z.email("Adresse e-mail invalide.")]),
  subject: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(5, "Décrivez votre demande en quelques mots.")
    .max(3000, "Message trop long (3000 caractères maximum)."),
});

export async function submitLead(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Honeypot : un humain ne remplit jamais ce champ caché — on fait
  // semblant d'accepter pour ne pas renseigner les robots.
  if (formData.get("website")) {
    return { status: "success" };
  }

  const parsed = leadSchema.safeParse({
    activity: String(formData.get("activity") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: formData.get("subject") ? String(formData.get("subject")) : undefined,
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
    };
  }

  const { activity, name, phone, email, subject, message } = parsed.data;
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").insert({
    activity,
    name,
    phone,
    email: email || null,
    subject: subject || null,
    message,
  });

  if (error) {
    console.error("submitLead:", error.message);
    return {
      status: "error",
      message:
        "Une erreur est survenue lors de l'envoi. Réessayez, ou contactez-nous directement par WhatsApp.",
    };
  }

  return { status: "success" };
}
