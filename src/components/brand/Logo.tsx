import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo/Logo.png";

/**
 * Version plate (feuille de thé cerclée d'or) — icône compacte réutilisée
 * là où le logo doit rester lisible en très petit sur fond clair/sombre.
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

/**
 * Logo officiel utilisé dans le header et le footer. `height` pilote la
 * taille rendue ; l'import statique permet à Next.js de conserver le ratio
 * carré du fichier et de générer les variantes optimisées.
 */
export function Logo({
  height = 44,
  priority = false,
  className,
}: {
  tone?: "light" | "dark";
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className ?? ""}`}
      aria-label="LUMORA GROUP — Accueil"
    >
      <Image
        src={logo}
        alt="LUMORA GROUP"
        sizes={`${height}px`}
        style={{ height, width: height }}
        className="object-contain"
        priority={priority}
      />
    </Link>
  );
}
