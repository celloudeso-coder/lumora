export type EditableSection = {
  key: string;
  label: string;
  kind?: "hero" | "section";
  title?: string;
  intro?: string;
  body?: string;
};

export type EditablePage = {
  slug: string;
  title: string;
  href: string;
  group: "Pages principales" | "Activités" | "Actualités";
  description: string;
  sections: EditableSection[];
};

export const EDITABLE_PAGES: EditablePage[] = [
  {
    slug: "accueil",
    title: "Accueil",
    href: "/",
    group: "Pages principales",
    description: "Présentation du groupe et accès aux sept univers.",
    sections: [
      { key: "hero", kind: "hero", label: "En-tête", title: "LUMORA GROUP", intro: "Elevating Everyday Living", body: "Sept univers réunis sous une même exigence de qualité, à Conakry : construire, savourer, se renforcer, prendre soin de soi et de son quotidien." },
      { key: "univers", label: "Nos univers", title: "Nos univers", intro: "Cinq sous-marques portées par une même identité, et deux espaces à découvrir sur place." },
      { key: "valeurs", label: "Nos valeurs", title: "Nos valeurs" },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    href: "/contact",
    group: "Pages principales",
    description: "Coordonnées, carte Google Maps et formulaire général.",
    sections: [
      { key: "hero", kind: "hero", label: "En-tête", title: "Contactez-nous", intro: "Elevating Everyday Living", body: "Une question sur l'une de nos activités ? Écrivez-nous ou appelez-nous : nous répondons rapidement, y compris sur WhatsApp." },
      { key: "coordonnees", label: "Coordonnées et formulaire" },
    ],
  },
  {
    slug: "galerie",
    title: "Galerie",
    href: "/galerie",
    group: "Pages principales",
    description: "Photos des différents espaces LUMORA.",
    sections: [
      { key: "hero", kind: "hero", label: "En-tête", title: "Galerie", intro: "Les espaces LUMORA", body: "Entrez dans nos univers à travers une sélection de photos prises dans nos différents espaces à Kipé, Conakry." },
      { key: "cafe", label: "Lumora Café", title: "Lumora Café", intro: "Un espace chaleureux pensé pour les pauses, les rencontres et les moments de détente." },
      { key: "pilates", label: "Lumora Pilates", title: "Lumora Pilates", intro: "Le studio et ses équipements Reformer dans un environnement lumineux et apaisant." },
      { key: "beleza", label: "Beleza Beauty", title: "Beleza Beauty", intro: "Des salles de soin conçues pour offrir calme, intimité et bien-être." },
      { key: "showroom", label: "Showroom", title: "Showroom", intro: "Matériaux, sanitaires et équipements présentés dans nos espaces d’exposition." },
    ],
  },
  ...[
    {
      slug: "construction", title: "Lumora Construction", href: "/construction", description: "Prestations BTP et demandes de devis.",
      sections: [
        ["hero", "En-tête"], ["prestations", "Nos prestations"], ["realisations", "Nos réalisations"], ["processus", "Comment ça se passe"], ["devis", "Demander un devis gratuit"],
      ],
    },
    {
      slug: "cafe", title: "Lumora Café", href: "/cafe", description: "Galerie, menu et informations pratiques.",
      sections: [["hero", "En-tête"], ["galerie", "Le café en images"], ["menu", "Notre menu"], ["infos", "Infos pratiques"]],
    },
    {
      slug: "pilates", title: "Lumora Pilates", href: "/pilates", description: "Offres, planning et réservation de cours.",
      sections: [["hero", "En-tête"], ["galerie", "Le studio en images"], ["offres", "Nos offres"], ["reservation", "Réserver un cours"], ["actualites", "Actualités du studio"]],
    },
    {
      slug: "pressing", title: "Lumora Pressing", href: "/pressing", description: "Services, tarifs et demandes clients.",
      sections: [["hero", "En-tête"], ["engagements", "Nos engagements"], ["tarifs", "Tarifs indicatifs"], ["contact", "Une question, un besoin particulier ?"]],
    },
    {
      slug: "beleza-beauty", title: "Beleza Beauty", href: "/beleza-beauty", description: "Soins et prise de rendez-vous.",
      sections: [["hero", "En-tête"], ["galerie", "L'institut en images"], ["soins", "Nos soins"], ["reservation", "Prendre rendez-vous"]],
    },
    {
      slug: "boutique", title: "Boutique", href: "/boutique", description: "Rayons, paiements et demandes de produits.",
      sections: [["hero", "En-tête"], ["rayons", "Nos rayons"], ["paiements", "Moyens de paiement"], ["demande", "Une demande particulière ?"]],
    },
    {
      slug: "showroom", title: "Showroom", href: "/showroom", description: "Espaces d’exposition et devis matériaux.",
      sections: [["hero", "En-tête"], ["galerie", "Le showroom en images"], ["espaces", "Nos espaces d'exposition"], ["devis", "Demander un devis"]],
    },
  ].map((page) => ({
    ...page,
    group: "Activités" as const,
    sections: page.sections.map(([key, label], index) => ({
      key,
      label,
      kind: index === 0 ? ("hero" as const) : ("section" as const),
      title: index === 0 ? page.title : label,
    })),
  })),
  {
    slug: "actualites-pilates",
    title: "Actualités Pilates",
    href: "/pilates/actualites",
    group: "Actualités",
    description: "Liste publique des articles publiés.",
    sections: [
      { key: "hero", kind: "hero", label: "En-tête", title: "Actualités du studio", intro: "Mind & Body Fitness", body: "Suivez la vie de Lumora Pilates : nouveaux cours, conseils de votre coach, événements et offres du moment." },
      { key: "liste", label: "Liste des articles" },
    ],
  },
];

export function getEditablePage(slug: string) {
  return EDITABLE_PAGES.find((page) => page.slug === slug);
}

export function getEditableSection(pageSlug: string, sectionKey: string) {
  return getEditablePage(pageSlug)?.sections.find((section) => section.key === sectionKey);
}
