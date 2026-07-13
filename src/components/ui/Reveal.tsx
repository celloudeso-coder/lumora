"use client";

import { useEffect, useRef } from "react";

/**
 * Apparition douce au scroll (fade-in + léger décalage vertical) via
 * Intersection Observer natif — aucune dépendance.
 *
 * Robustesse : l'état masqué initial est porté par la classe CSS `.reveal`
 * (voir globals.css). Un `<noscript>` dans le layout force la visibilité
 * sans JS, et `prefers-reduced-motion` neutralise l'animation côté CSS.
 * Si l'API n'existe pas, on révèle immédiatement.
 */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Décalage optionnel pour un effet d'escalier entre blocs voisins. */
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
