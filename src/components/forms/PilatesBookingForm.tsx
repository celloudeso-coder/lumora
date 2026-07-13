"use client";

import { useActionState, useState } from "react";
import type { ClassSlot } from "@/lib/data/slots";
import { formatSlotDate } from "@/lib/data/slots";
import type { CourseFormat, PilatesOffer } from "@/lib/data/pilates-pricing";
import { formatGNF } from "@/lib/format";
import { submitPilatesBooking } from "@/lib/actions/bookings";
import { initialFormState } from "@/lib/actions/form-state";
import { Field, inputClass, SuccessNote, ErrorNote, Honeypot } from "./fields";

/**
 * Réservation d'un cours Pilates en 3 étapes : format (Reformer ou
 * Mat/Yoga) → formule (session unique / pack 5 / pack 10) → créneau,
 * puis Server Action `submitPilatesBooking` → table `bookings`
 * (activity='pilates', slot_id).
 */
export function PilatesBookingForm({ slots, offers }: { slots: ClassSlot[]; offers: PilatesOffer[] }) {
  const [state, formAction, pending] = useActionState(
    submitPilatesBooking,
    initialFormState,
  );
  const [format, setFormat] = useState<CourseFormat | "">("");
  const [formulaId, setFormulaId] = useState("");
  const [slotId, setSlotId] = useState("");

  if (state.status === "success") {
    return (
      <SuccessNote message="Votre demande de réservation a bien été enregistrée. Vous recevrez une confirmation par téléphone ou WhatsApp." />
    );
  }

  const offer = format ? offers.find((item) => item.format === format) ?? null : null;
  const formatSlots = format ? slots.filter((s) => s.format === format) : [];

  const selectFormat = (f: CourseFormat) => {
    setFormat(f);
    setFormulaId("");
    setSlotId("");
  };

  return (
    <form action={formAction} className="form-shell relative space-y-6">
      <Honeypot />

      {/* Étape 1 : format de cours */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-forest">
          1. Choisissez votre format de cours{" "}
          <span className="text-gold-600">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {offers.map((o) => {
            const selected = format === o.format;
            return (
              <label
                key={o.format}
                className={`choice-card flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                  selected ? "border-gold bg-gold-100" : "border-forest/15 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={o.format}
                  required
                  checked={selected}
                  onChange={() => selectFormat(o.format)}
                  className="h-5 w-5 accent-[var(--color-forest)]"
                />
                <span className="text-sm font-medium text-forest">{o.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Étape 2 : formule */}
      {offer && (
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-forest">
            2. Choisissez votre formule <span className="text-gold-600">*</span>
          </legend>
          <div className="space-y-2">
            {offer.formulas.map((f) => {
              const selected = formulaId === f.id;
              return (
                <label
                  key={f.id}
                  className={`choice-card flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                    selected
                      ? "border-gold bg-gold-100"
                      : "border-forest/15 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="formula"
                    value={f.id}
                    required
                    checked={selected}
                    onChange={() => setFormulaId(f.id)}
                    className="h-5 w-5 accent-[var(--color-forest)]"
                  />
                  <span className="flex flex-1 items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-forest">
                      {f.label}
                    </span>
                    <span className="text-sm font-medium text-gold-700">
                      {formatGNF(f.price)}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Étape 3 : créneau */}
      {offer && formulaId && (
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-forest">
            3. Choisissez votre premier créneau{" "}
            <span className="text-gold-600">*</span>
          </legend>
          {formatSlots.length === 0 ? (
            <p className="rounded-xl border border-forest/15 bg-white px-4 py-4 text-sm font-light text-forest/70">
              Aucun créneau {offer.name} ouvert cette semaine — laissez vos
              coordonnées, nous vous proposerons un horaire par WhatsApp.
            </p>
          ) : (
            <div className="space-y-2">
              {formatSlots.map((slot) => {
                const selected = slotId === slot.id;
                const full = slot.remaining === 0;
                return (
                  <label
                    key={slot.id}
                    className={`choice-card flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
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
          )}
        </fieldset>
      )}

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

      {state.status === "error" && <ErrorNote message={state.message} />}

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {pending ? "Envoi en cours…" : "Réserver"}
      </button>
    </form>
  );
}
