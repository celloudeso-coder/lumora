// Grille tarifaire réelle « Lumora Studio » — prix en GNF (juillet 2026).
// Deux formats de cours, chacun avec 3 formules. La privatisation de la
// salle et les cours privés sont sur demande, sans tarif affiché.

export type CourseFormat = "reformer" | "mat";

export type PilatesFormula = {
  id: string;
  label: string;
  price: number;
};

export type PilatesOffer = {
  format: CourseFormat;
  name: string;
  description: string;
  formulas: PilatesFormula[];
};

export const PILATES_OFFERS: PilatesOffer[] = [
  {
    format: "reformer",
    name: "Reformer",
    description:
      "Séances sur appareils Reformer, pour un travail profond, précis et guidé par la résistance des ressorts.",
    formulas: [
      { id: "reformer-1", label: "Session unique", price: 300_000 },
      { id: "reformer-5", label: "Pack 5 séances", price: 1_500_000 },
      { id: "reformer-10", label: "Pack 10 séances", price: 2_850_000 },
    ],
  },
  {
    format: "mat",
    name: "Mat / Yoga",
    description:
      "Cours au tapis — Pilates Mat et Yoga — pour renforcer le centre, gagner en souplesse et apaiser l'esprit.",
    formulas: [
      { id: "mat-1", label: "Session unique", price: 200_000 },
      { id: "mat-5", label: "Pack 5 séances", price: 900_000 },
      { id: "mat-10", label: "Pack 10 séances", price: 1_800_000 },
    ],
  },
];

export function getOffer(format: CourseFormat): PilatesOffer {
  return PILATES_OFFERS.find((o) => o.format === format)!;
}
