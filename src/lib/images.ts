// Manifeste des photos réelles prises dans les locaux de LUMORA GROUP.
// Les fichiers sont déposés au fur et à mesure dans public/images/ :
// tant qu'un chemin ci-dessous n'existe pas, la galerie affiche un
// emplacement « Photo à venir ». Déposer les fichiers sous ces noms
// (ou ajuster les chemins ici) pour activer l'affichage.

import type { GalleryImage } from "@/components/ui/Gallery";

/** Façade de nuit avec l'enseigne « Lumora » — hero de l'accueil. */
export const FACADE_PHOTO: GalleryImage = {
  src: "/images/facade/facade-nuit.jpg",
  alt: "La façade de LUMORA GROUP illuminée de nuit, avec son enseigne Lumora",
};

/** Logo officiel : rendu 3D de la plaque acrylique rétroéclairée. */
export const LOGO_PHOTO: GalleryImage = {
  src: "/images/logo/Logo.png",
  alt: "Logo LUMORA GROUP — plaque acrylique rétroéclairée",
};

// L'emblème circulaire seul (public/images/logo/emblem-circle.png, généré par
// scripts/build-emblem.mjs) est importé statiquement dans HomeHero — pas de
// référence par chemin ici pour bénéficier du hash de contenu de Next.

export const GALLERIES = {
  cafe: [
    { src: "/images/cafe/salle.jpg", alt: "La salle du Lumora Café" },
    { src: "/images/cafe/decoration.jpg", alt: "Décoration et ambiance du café" },
    { src: "/images/cafe/plats.jpg", alt: "Douceurs et plats servis au café" },
    {
      src: "/images/cafe/machine-caffe-moreno.jpg",
      alt: "La machine à café professionnelle Caffè Moreno",
    },
  ],
  pilates: [
    { src: "/images/pilates/studio.jpg", alt: "Le studio Lumora Pilates" },
    {
      src: "/images/pilates/reformers.jpg",
      alt: "Les appareils Reformer Fat-Plate du studio",
    },
    { src: "/images/pilates/decor.jpg", alt: "Décor et ambiance du studio" },
  ],
  beleza: [
    {
      src: "/images/beleza/salle-massage.jpg",
      alt: "La salle de massage de l'institut Beleza Beauty",
    },
    { src: "/images/beleza/tables-soin.jpg", alt: "Les tables de soin de l'institut" },
    { src: "/images/beleza/ambiance.jpg", alt: "L'ambiance apaisante de l'institut" },
  ],
  showroom: [
    { src: "/images/showroom/sanitaires.jpg", alt: "Sanitaires exposés au showroom" },
    { src: "/images/showroom/exposition.jpg", alt: "L'espace d'exposition du showroom" },
    { src: "/images/showroom/stock.jpg", alt: "Le stock de matériel du showroom" },
  ],
} satisfies Record<string, GalleryImage[]>;
