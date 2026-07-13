export type PressingPrice = {
  id: string;
  item: string;
  price: number;
};

// Tarifs provisoires en GNF — à valider avec la cliente.
export const PRESSING_PRICES: PressingPrice[] = [
  { id: "chemise", item: "Chemise / chemisier", price: 30_000 },
  { id: "pantalon", item: "Pantalon", price: 35_000 },
  { id: "costume-2-pieces", item: "Costume 2 pièces", price: 120_000 },
  { id: "robe", item: "Robe", price: 80_000 },
  { id: "tenue-traditionnelle", item: "Tenue traditionnelle / boubou", price: 90_000 },
  { id: "veste-manteau", item: "Veste / manteau", price: 100_000 },
  { id: "parure-draps", item: "Parure de draps", price: 60_000 },
  { id: "rideaux-panneau", item: "Rideaux (le panneau)", price: 70_000 },
];
