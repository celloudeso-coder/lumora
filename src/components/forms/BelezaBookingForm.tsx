"use client";

import { useState } from "react";
import { Field, inputClass, textareaClass, SuccessNote } from "./fields";

/**
 * Prise de rendez-vous Beleza Beauty : choix du soin + date/heure souhaitées.
 * Mode démo local — TODO Supabase : Server Action → insertion `bookings`
 * (activity='beleza', service, preferred_at).
 */
export function BelezaBookingForm({ services }: { services: string[] }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <SuccessNote message="Votre demande de rendez-vous a bien été enregistrée (démo locale). Beleza Beauty vous confirmera l'horaire par téléphone ou WhatsApp." />
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

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Demander ce rendez-vous
      </button>
    </form>
  );
}
