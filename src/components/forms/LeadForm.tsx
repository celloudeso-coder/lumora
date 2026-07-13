"use client";

import { useActionState } from "react";
import { submitLead } from "@/lib/actions/leads";
import { initialFormState } from "@/lib/actions/form-state";
import { Field, inputClass, textareaClass, SuccessNote, ErrorNote, Honeypot } from "./fields";

/**
 * Formulaire de contact / demande de devis (Construction, Pressing,
 * Boutique, Showroom, Contact général) → Server Action `submitLead`
 * → table `leads`.
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
  const [state, formAction, pending] = useActionState(submitLead, initialFormState);

  if (state.status === "success") {
    return (
      <SuccessNote message="Merci ! Votre demande a bien été enregistrée. Notre équipe vous recontactera rapidement par téléphone ou WhatsApp." />
    );
  }

  return (
    <form action={formAction} className="relative space-y-5">
      <input type="hidden" name="activity" value={activity} />
      <Honeypot />

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

      {state.status === "error" && <ErrorNote message={state.message} />}

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {pending ? "Envoi en cours…" : submitLabel}
      </button>
    </form>
  );
}
