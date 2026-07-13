/** Montant en francs guinéens, séparateur de milliers français. */
export function formatGNF(amount: number, withUnit = true): string {
  const n = amount.toLocaleString("fr-FR");
  return withUnit ? `${n} GNF` : n;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
