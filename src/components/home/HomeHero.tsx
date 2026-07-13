import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
// Import statique : Next déduit les dimensions et sert le fichier avec un
// hash de contenu (cache immuable, jamais de variante périmée). Généré par
// scripts/build-emblem.mjs à partir de Logo.png.
import emblem from "../../../public/images/logo/emblem-circle.png";
import { FACADE_PHOTO } from "@/lib/images";
import { SITE } from "@/lib/site";

/**
 * Hero de l'accueil « Lumora Glass ».
 *
 * Profondeur : la photo de façade sert de fond (object-cover + overlay
 * dégradé forêt) DÈS QU'ELLE est déposée dans public/. Tant qu'elle est
 * absente, un dégradé radial multi-stops tient lieu de fond (profondeur
 * sans image). Par-dessus : filigrane feuille + rétroéclairage doré animé.
 *
 * Composition : asymétrique sur desktop (texte à gauche, emblème circulaire
 * flottant à droite, cerné d'un halo doré doux), empilement vertical centré
 * sur mobile (emblème redimensionné sous le texte).
 */
function publicFileExists(src: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src));
  } catch {
    return false;
  }
}

export function HomeHero() {
  const hasFacade = publicFileExists(FACADE_PHOTO.src);

  return (
    <section className="home-hero text-cream">
      {hasFacade && (
        <>
          <Image
            src={FACADE_PHOTO.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 object-cover"
          />
          <div className="home-hero-overlay" />
        </>
      )}
      <div className="home-hero-leaves" aria-hidden="true" />
      <div className="home-hero-glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1fr_0.9fr] lg:px-6 lg:py-28">
        {/* Zone texte */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            {SITE.slogan}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[0.1em] sm:text-5xl lg:text-6xl">
            LUMORA <span className="text-gold">GROUP</span>
          </h1>
          <p className="mt-5 max-w-xl font-light leading-relaxed text-cream/85 lg:text-lg">
            Sept univers réunis sous une même exigence de qualité, à Conakry :
            construire, savourer, se renforcer, prendre soin de soi et de son
            quotidien.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href="#activites" className="btn-gold">
              Découvrir nos activités
            </a>
            <Link
              href="/contact"
              className="btn border border-cream/60 bg-transparent text-cream hover:border-gold hover:bg-cream/10"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Visuel : emblème circulaire flottant, cerné d'un halo doré doux.
            Sur desktop il déborde légèrement vers la droite (négatif). */}
        <div className="home-emblem flex justify-center lg:-mr-4 lg:translate-x-2">
          <Image
            src={emblem}
            alt=""
            priority
            // Variantes transparentes uniquement (256 / ≥640) : on évite la
            // variante 384 de l'optimiseur qui aplatit l'alpha.
            sizes="(min-width: 1024px) 460px, (min-width: 640px) 340px, 256px"
            className="relative z-10 h-auto w-[256px] max-w-full sm:w-[340px] lg:w-[460px]"
          />
        </div>
      </div>
    </section>
  );
}
