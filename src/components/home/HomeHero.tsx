import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import logo from "../../../public/images/logo/Logo.png";
import { FACADE_PHOTO } from "@/lib/images";
import { SITE } from "@/lib/site";
import { resolvePageSection } from "@/lib/cms/page-sections";

/**
 * Hero de l'accueil « Lumora Glass ».
 *
 * Profondeur : la photo de façade sert de fond (object-cover + overlay
 * dégradé forêt) DÈS QU'ELLE est déposée dans public/. Tant qu'elle est
 * absente, un dégradé radial multi-stops tient lieu de fond (profondeur
 * sans image). Par-dessus : filigrane feuille + rétroéclairage doré animé.
 *
 * Composition : asymétrique sur desktop (texte à gauche, logo officiel
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

export async function HomeHero() {
  const hasFacade = publicFileExists(FACADE_PHOTO.src);
  const content = await resolvePageSection("accueil", "hero", {
    title: "LUMORA GROUP",
    intro: SITE.slogan,
    body: "Sept univers réunis sous une même exigence de qualité, à Conakry : construire, savourer, se renforcer, prendre soin de soi et de son quotidien.",
  });

  if (!content.isVisible) return null;

  return (
    <section className="home-hero text-cream">
      <div className="home-hero-leaves" aria-hidden="true" />
      <div className="home-hero-glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 lg:grid-cols-[1.08fr_0.72fr] lg:px-6 lg:py-20">
        {/* Zone texte */}
        <div className="home-hero-copy flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            {content.intro}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[0.1em] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-xl font-light leading-relaxed text-cream/85 lg:text-lg">
            {content.body}
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

        {/* La façade verticale reste un visuel à part entière au lieu d'être
            recadrée en fond horizontal. Le logo se pose en médaillon. */}
        <div className="home-visual flex justify-center lg:justify-end">
          {hasFacade ? (
            <div className="relative w-[min(78vw,330px)] pb-10 sm:w-[360px] lg:w-[380px]">
              <figure className="home-facade-card relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-gold/35">
                <Image
                  src={FACADE_PHOTO.src}
                  alt={FACADE_PHOTO.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 360px, 78vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/65 via-transparent to-transparent" />
                <figcaption className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-cream/20 bg-forest-950/65 px-4 py-2 text-xs tracking-wide text-cream backdrop-blur-md">
                  <MapPin className="h-4 w-4 text-gold" />
                  Kipé, Conakry
                </figcaption>
              </figure>

              <div className="home-logo-medallion absolute -bottom-1 -right-3 z-10 sm:-right-8">
                <Image
                  src={logo}
                  alt="Logo LUMORA GROUP"
                  priority
                  sizes="(min-width: 640px) 180px, 132px"
                  className="h-auto w-[132px] sm:w-[180px]"
                />
              </div>
            </div>
          ) : (
            <div className="home-emblem">
              <Image
                src={logo}
                alt="Logo LUMORA GROUP"
                priority
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 340px, 256px"
                className="relative z-10 h-auto w-[256px] max-w-full sm:w-[340px] lg:w-[380px]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
