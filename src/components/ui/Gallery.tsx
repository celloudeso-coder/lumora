import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Camera } from "lucide-react";

export type GalleryImage = {
  /** Chemin public, ex. "/images/cafe/salle.jpg" */
  src: string;
  alt: string;
  /** Format du cadre. Les photos verticales du site utilisent le ratio 9:16. */
  aspect?: "portrait" | "landscape";
};

/**
 * Composants serveur uniquement : tant que le fichier n'existe pas dans
 * public/, un emplacement « Photo à venir » est affiché à la place —
 * déposer les fichiers aux chemins du manifeste (src/lib/images.ts)
 * suffit à activer les vraies photos.
 */
function imageExists(src: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src));
  } catch {
    return false;
  }
}

const COLS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const SIZES: Record<2 | 3 | 4, string> = {
  2: "(min-width: 640px) 50vw, 100vw",
  3: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  4: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
};

/** Grille photo mobile-first : 1 colonne sur mobile, grille au-delà. */
export function Gallery({
  images,
  columns = 3,
}: {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
}) {
  const portrait = images.every((image) => image.aspect === "portrait");

  return (
    <div
      className={`gallery-grid grid gap-4 ${
        portrait
          ? `portrait-gallery portrait-columns-${columns}`
          : COLS[columns]
      }`}
    >
      {images.map((image) => (
        <GalleryTile
          key={image.src}
          image={image}
          sizes={
            portrait
              ? "(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 82vw"
              : SIZES[columns]
          }
        />
      ))}
    </div>
  );
}

function GalleryTile({
  image,
  sizes,
}: {
  image: GalleryImage;
  sizes: string;
}) {
  const frameClass =
    image.aspect === "portrait" ? "aspect-[9/16]" : "aspect-[4/3]";

  if (!imageExists(image.src)) {
    return (
      <figure
        className={`gallery-tile flex ${frameClass} flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/40 bg-cream-200 p-4 text-center`}
      >
        <Camera className="h-6 w-6 text-gold-600" aria-hidden />
        <figcaption className="text-xs font-light leading-relaxed text-forest/60">
          {image.alt}
        </figcaption>
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gold-600">
          Photo à venir
        </span>
      </figure>
    );
  }

  return (
    <figure
      className={`gallery-tile group relative ${frameClass} overflow-hidden rounded-2xl`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-[var(--ease-spring)] group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/85 to-transparent px-4 pb-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <figcaption className="text-sm font-light text-cream">{image.alt}</figcaption>
      </div>
    </figure>
  );
}

/** Photo unique pleine largeur (ex. façade sur l'accueil). */
export function WidePhoto({
  image,
  priority = false,
}: {
  image: GalleryImage;
  priority?: boolean;
}) {
  if (!imageExists(image.src)) {
    return (
      <figure className="gallery-tile flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/40 bg-cream-200 p-4 text-center sm:aspect-[21/9]">
        <Camera className="h-7 w-7 text-gold-600" aria-hidden />
        <figcaption className="text-sm font-light leading-relaxed text-forest/60">
          {image.alt}
        </figcaption>
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gold-600">
          Photo à venir
        </span>
      </figure>
    );
  }

  return (
    <figure className="gallery-tile group relative aspect-[16/9] overflow-hidden rounded-2xl sm:aspect-[21/9]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(min-width: 1152px) 1104px, 100vw"
        className="object-cover transition-transform duration-700 ease-[var(--ease-spring)] group-hover:scale-[1.03]"
      />
    </figure>
  );
}
