import Link from "next/link";
import Image from "next/image";
import { LOGO_PHOTO } from "@/lib/images";

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
 * Logo officiel (plaque acrylique, PNG réel) utilisé dans le header et le
 * footer. `height` pilote la taille rendue ; l'image est servie via
 * next/image (WebP/AVIF, transparence préservée). Le prop `tone` est
 * conservé pour compat mais n'affecte plus les couleurs (le PNG les porte).
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
  // Largeur d'affichage dérivée du ratio réel du fichier (2194 × 1920).
  const width = Math.round((height * 2194) / 1920);

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className ?? ""}`}
      aria-label="LUMORA GROUP — Accueil"
    >
      <Image
        src={LOGO_PHOTO.src}
        alt="LUMORA GROUP"
        width={2194}
        height={1920}
        // Variante ≥ 256px (transparente) même en petit affichage : la
        // variante 384px de l'optimiseur perd l'alpha.
        sizes="256px"
        style={{ height, width }}
        className="object-contain"
        priority={priority}
      />
    </Link>
  );
}
