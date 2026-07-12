"use client";

import { useState } from "react";
import type { ClassSlot } from "@/lib/data/slots";
import { formatSlotDate } from "@/lib/data/slots";
import { Field, inputClass, SuccessNote } from "./fields";

/**
 * Réservation d'un créneau de cours Pilates.
 * Mode démo local — TODO Supabase : Server Action → insertion `bookings`
 * (activity='pilates', slot_id) avec vérification de la capacité restante.
 */
export function PilatesBookingForm({ slots }: { slots: ClassSlot[] }) {
  const [sent, setSent] = useState(false);
  const [slotId, setSlotId] = useState<string>("");

  if (sent) {
    return (
      <SuccessNote message="Votre demande de réservation a bien été enregistrée (démo locale). Vous recevrez une confirmation par téléphone ou WhatsApp." />
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
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-forest">
          Choisissez votre créneau <span className="text-gold-600">*</span>
        </legend>
        <div className="space-y-2">
          {slots.map((slot) => {
            const selected = slotId === slot.id;
            const full = slot.remaining === 0;
            return (
              <label
                key={slot.id}
                className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  selected
                    ? "border-gold bg-gold-100"
                    : "border-forest/15 bg-white"
                } ${full ? "opacity-50" : ""}`}
              >
                <input
                  type="radio"
                  name="slot"
                  value={slot.id}
                  required
                  disabled={full}
                  checked={selected}
                  onChange={() => setSlotId(slot.id)}
                  className="h-5 w-5 accent-[var(--color-forest)]"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-forest">
                    {slot.title}
                  </span>
                  <span className="text-xs capitalize text-forest/70">
                    {formatSlotDate(slot.startsAt)} · {slot.durationMin} min ·{" "}
                    {full
                      ? "complet"
                      : `${slot.remaining} place${slot.remaining > 1 ? "s" : ""} restante${slot.remaining > 1 ? "s" : ""}`}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

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

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Réserver ce créneau
      </button>
    </form>
  );
}
