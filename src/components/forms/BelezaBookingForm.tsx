"use client";

import { useActionState } from "react";
import { submitBelezaBooking } from "@/lib/actions/bookings";
import { initialFormState } from "@/lib/actions/form-state";
import { Field, inputClass, textareaClass, SuccessNote, ErrorNote, Honeypot } from "./fields";

/**
 * Prise de rendez-vous Beleza Beauty : choix du soin + date/heure
 * souhaitées → Server Action `submitBelezaBooking` → table `bookings`
 * (activity='beleza').
 */
export function BelezaBookingForm({ services }: { services: string[] }) {
  const [state, formAction, pending] = useActionState(
    submitBelezaBooking,
    initialFormState,
  );

  if (state.status === "success") {
    return (
      <SuccessNote message="Votre demande de rendez-vous a bien été enregistrée. Beleza Beauty vous confirmera l'horaire par téléphone ou WhatsApp." />
    );
  }

  return (
    <form action={formAction} className="form-shell relative space-y-5">
      <Honeypot />

      <Field label="Soin souhaité" required>
        <select name="service" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choisissez un soin…
          </option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date souhaitée" required>
          <input name="date" required type="date" className={inputClass} />
        </Field>
        <Field label="Heure souhaitée" required>
          <input name="time" required type="time" className={inputClass} />
        </Field>
      </div>

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

      <Field label="Précisions (facultatif)">
        <textarea
          name="notes"
          className={textareaClass}
          placeholder="Allergies, préférences, questions…"
        />
      </Field>

      {state.status === "error" && <ErrorNote message={state.message} />}

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {pending ? "Envoi en cours…" : "Demander ce rendez-vous"}
      </button>
    </form>
  );
}
