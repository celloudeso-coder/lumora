"use client";

import { useState } from "react";
import { Field, inputClass, textareaClass, SuccessNote } from "./fields";

/**
 * Formulaire de contact / demande de devis (Construction, Pressing,
 * Boutique, Showroom, Contact général).
 *
 * Mode démo local : l'envoi affiche une confirmation sans persister.
 * TODO Supabase : brancher sur une Server Action qui insère dans `leads`.
 */
export function LeadForm({
  activity,
  subjects,
  messageLabel = "Votre message",
  submitLabel = "Envoyer ma demande",
}: {
  activity: string;
  subjects?: string[];
  messageLabel?: string;
  submitLabel?: string;
}) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <SuccessNote message="Merci ! Votre demande a bien été enregistrée (démo locale — l'envoi réel sera activé avec Supabase). Notre équipe vous recontactera rapidement par téléphone ou WhatsApp." />
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <input type="hidden" name="activity" value={activity} />

      <Field label="Nom complet" required>
        <input name="name" required autoComplete="name" className={inputClass} />
      </Field>

      <Field label="Téléphone (WhatsApp de préférence)" required>
        <input
          name="phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+224 6XX XX XX XX"
          className={inputClass}
        />
      </Field>

      <Field label="E-mail (facultatif)">
        <input name="email" type="email" autoComplete="email" className={inputClass} />
      </Field>

      {subjects && subjects.length > 0 && (
        <Field label="Objet de la demande" required>
          <select name="subject" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Choisissez…
            </option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label={messageLabel} required>
        <textarea
          name="message"
          required
          className={textareaClass}
          placeholder="Décrivez votre besoin en quelques mots…"
        />
      </Field>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        {submitLabel}
      </button>
    </form>
  );
}
