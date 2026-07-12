import Link from "next/link";

/**
 * Version plate du logo LUMORA GROUP pour le web, dérivée de la plaque
 * 3D officielle : feuille de thé cerclée d'or + wordmark serif.
 * `tone="dark"` pour les fonds vert forêt, `tone="light"` pour les fonds crème.
 */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="20"
        cy="20"
        r="18.5"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
      />
      {/* Feuille de thé */}
      <path
        d="M20 31c-6.2-4.6-6.2-14.4 0-21.5 6.2 7.1 6.2 16.9 0 21.5Z"
        fill="currentColor"
      />
      {/* Nervure centrale */}
      <path
        d="M20 29V12"
        stroke="var(--color-gold)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const nameColor = tone === "dark" ? "text-cream" : "text-forest";
  const leafColor = tone === "dark" ? "text-cream" : "text-forest";

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className ?? ""}`}
      aria-label="LUMORA GROUP — Accueil"
    >
      <LeafMark className={`h-9 w-9 shrink-0 ${leafColor}`} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-xl font-semibold tracking-[0.18em] ${nameColor}`}
        >
          LUMORA
        </span>
        <span className="mt-1 text-[0.58rem] font-medium tracking-[0.52em] text-gold">
          GROUP
        </span>
      </span>
    </Link>
  );
}
