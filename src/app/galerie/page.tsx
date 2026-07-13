import type { Metadata } from "next";
import { Images } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Gallery } from "@/components/ui/Gallery";
import { GALLERIES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Découvrez en images les espaces LUMORA GROUP à Conakry : café, studio Pilates, institut Beleza Beauty et showroom.",
};

const GALLERY_SECTIONS = [
  {
    key: "cafe",
    title: "Lumora Café",
    intro: "Un espace chaleureux pensé pour les pauses, les rencontres et les moments de détente.",
    images: GALLERIES.cafe,
    columns: 4 as const,
  },
  {
    key: "pilates",
    title: "Lumora Pilates",
    intro: "Le studio et ses équipements Reformer dans un environnement lumineux et apaisant.",
    images: GALLERIES.pilates,
    columns: 3 as const,
  },
  {
    key: "beleza",
    title: "Beleza Beauty",
    intro: "Des salles de soin conçues pour offrir calme, intimité et bien-être.",
    images: GALLERIES.beleza,
    columns: 3 as const,
  },
  {
    key: "showroom",
    title: "Showroom",
    intro: "Matériaux, sanitaires et équipements présentés dans nos espaces d’exposition.",
    images: GALLERIES.showroom,
    columns: 3 as const,
  },
];

export default function GaleriePage() {
  return (
    <>
      <PageHero
        pageSlug="galerie"
        title="Galerie"
        tagline="Les espaces LUMORA"
        description="Entrez dans nos univers à travers une sélection de photos prises dans nos différents espaces à Kipé, Conakry."
        icon={Images}
      />

      {GALLERY_SECTIONS.map((gallery, index) => (
        <Section
          key={gallery.title}
          pageSlug="galerie"
          sectionKey={gallery.key}
          title={gallery.title}
          intro={gallery.intro}
          tone={index % 2 === 1 ? "light" : "cream"}
        >
          <Gallery images={gallery.images} columns={gallery.columns} />
        </Section>
      ))}
    </>
  );
}
