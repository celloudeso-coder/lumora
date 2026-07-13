// Couche d'accès aux créneaux Pilates — fonction `open_slots()` (Supabase),
// qui expose les créneaux ouverts à venir avec les places restantes sans
// donner d'accès public à la table `bookings`.
// Les signatures sont stables : les composants ne connaissent pas Supabase.

import { createPublicServerClient } from "@/lib/supabase/server";
import type { CourseFormat } from "./pilates-pricing";

export type ClassSlot = {
  id: string;
  title: string;
  format: CourseFormat;
  startsAt: string; // ISO
  durationMin: number;
  capacity: number;
  remaining: number;
};

type OpenSlotRow = {
  id: string;
  title: string;
  format: string;
  starts_at: string;
  duration_min: number;
  capacity: number;
  remaining: number;
};

/** Prochains créneaux ouverts, triés par date de début. */
export async function getOpenSlots(): Promise<ClassSlot[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase.rpc("open_slots");

  if (error) {
    throw new Error(`Lecture des créneaux impossible : ${error.message}`);
  }

  return (data as OpenSlotRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    format: row.format as CourseFormat,
    startsAt: row.starts_at,
    durationMin: row.duration_min,
    capacity: row.capacity,
    remaining: row.remaining,
  }));
}

export function formatSlotDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
