// Couche d'accès aux créneaux Pilates.
// TODO Supabase : remplacer les mocks par des requêtes sur la table
// `class_slots` (voir supabase/schema.sql) sans changer les signatures.

export type ClassSlot = {
  id: string;
  title: string;
  startsAt: string; // ISO
  durationMin: number;
  capacity: number;
  remaining: number;
};

/** Prochains créneaux ouverts, générés sur la semaine à venir. */
export async function getOpenSlots(): Promise<ClassSlot[]> {
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  const at = (dayOffset: number, hour: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  return [
    { id: "s1", title: "Pilates Mat — Débutant", startsAt: at(1, 8), durationMin: 60, capacity: 8, remaining: 3 },
    { id: "s2", title: "Pilates Mat — Intermédiaire", startsAt: at(1, 18), durationMin: 60, capacity: 8, remaining: 5 },
    { id: "s3", title: "Pilates Stretch & Relax", startsAt: at(3, 18), durationMin: 45, capacity: 10, remaining: 7 },
    { id: "s4", title: "Pilates Mat — Débutant", startsAt: at(4, 8), durationMin: 60, capacity: 8, remaining: 2 },
    { id: "s5", title: "Pilates Prénatal", startsAt: at(6, 10), durationMin: 45, capacity: 6, remaining: 4 },
    { id: "s6", title: "Pilates Mat — Intermédiaire", startsAt: at(6, 17), durationMin: 60, capacity: 8, remaining: 8 },
  ];
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
