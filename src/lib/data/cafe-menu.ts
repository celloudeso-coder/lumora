// Menu réel du Lumora Café — prix en GNF relevés sur place (juillet 2026).
// Les mentions « à confirmer » sont à valider avec la cliente.

export type MenuItem = {
  name: string;
  /** Prix Petit / Moyen / Grand — null si le format n'est pas proposé. */
  sizes?: [number | null, number | null, number | null];
  /** Prix unique. */
  price?: number;
  note?: string;
};

export type MenuCategory = {
  category: string;
  note?: string;
  /** Suppléments : prix affichés précédés de « + ». */
  supplement?: boolean;
  items: MenuItem[];
};

export const CAFE_MENU: MenuCategory[] = [
  {
    category: "Cafés & boissons chaudes",
    items: [
      { name: "Cappuccino", sizes: [25_000, 30_000, 40_000] },
      { name: "Latte", sizes: [25_000, 30_000, 40_000] },
      { name: "Macchiato Caramel", sizes: [25_000, 35_000, 40_000] },
      { name: "Flat White", price: 30_000, note: "prix unique, à confirmer" },
    ],
  },
  {
    category: "Cafés glacés",
    items: [
      { name: "Latte Glacé", sizes: [20_000, 30_000, 40_000] },
      { name: "Chocolat Classique Glacé", sizes: [25_000, 35_000, 45_000] },
      { name: "Macchiato Caramel Glacé", sizes: [25_000, 35_000, 45_000] },
      { name: "Moka Glacé", sizes: [25_000, 35_000, 45_000] },
      { name: "White Moka Glacé", sizes: [25_000, 35_000, 45_000] },
      { name: "Double Shoot Glacé", sizes: [25_000, 35_000, 45_000] },
      { name: "Thé glacé banane-kiwi", sizes: [25_000, 35_000, 45_000] },
    ],
  },
  {
    category: "Milkshakes",
    note: "Parfums : vanille, caramel, noisette, fraise, chocolat, chocolat blanc, Oréo, banane, mangue.",
    items: [{ name: "Tous les parfums", sizes: [35_000, 45_000, 65_000] }],
  },
  {
    category: "Jus frais",
    note: "Grand format.",
    items: [
      { name: "Orange", price: 30_000 },
      { name: "Ananas", price: 30_000 },
      { name: "Mangue", price: 30_000 },
      { name: "Bissap", price: 30_000 },
      { name: "Gingembre", price: 30_000 },
    ],
  },
  {
    category: "Matcha",
    items: [
      { name: "Matcha Chaud", sizes: [40_000, 50_000, 60_000] },
      { name: "Matcha Glacé", sizes: [40_000, 50_000, 60_000] },
    ],
  },
  {
    category: "Thés",
    items: [
      { name: "Thé au gingembre", note: "prix à confirmer" },
      { name: "Thé à la menthe", note: "prix à confirmer" },
      { name: "Thé à la fraise", note: "prix à confirmer" },
      { name: "Thé à la camomille", note: "prix à confirmer" },
      { name: "Thé Glacé Peach", sizes: [20_000, null, 25_000] },
    ],
  },
  {
    category: "Accompagnements",
    items: [
      { name: "Croissant", price: 20_000 },
      { name: "Sandwich au thon", price: 60_000 },
      { name: "Poke Bowl", note: "prix à confirmer" },
    ],
  },
  {
    category: "Suppléments",
    supplement: true,
    items: [
      {
        name: "Sirop (caramel, noisette, vanille, white moka, moka, fraise)",
        price: 5_000,
      },
      { name: "Shot d'expresso", price: 5_000 },
      { name: "Crème chantilly", price: 5_000 },
      { name: "Lait spécial (écrémé, demi-écrémé, amande, avoine)", price: 15_000 },
    ],
  },
];
