import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Gallery } from "@/components/ui/Gallery";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { getActivity } from "@/lib/activities";
import { SITE } from "@/lib/site";
import { GALLERIES } from "@/lib/images";
import { formatGNF } from "@/lib/format";
import { CAFE_MENU, type MenuCategory, type MenuItem } from "@/lib/data/cafe-menu";

export const metadata: Metadata = {
  title: "Lumora Café — Coffee & Lifestyle à Conakry",
  description:
    "Cafés d'exception, boissons glacées, milkshakes, matcha et jus frais à prix fixes, dans un cadre élégant à Kipé, Conakry.",
};

export default function CafePage() {
  const activity = getActivity("cafe")!;

  return (
    <>
      <PageHero
        pageSlug="cafe"
        title={activity.name}
        tagline={activity.tagline}
        description="Un écrin chaleureux pour vos pauses café, vos rendez-vous et vos moments de détente. Tous nos prix sont fixes et affichés — pas de surprise."
        icon={activity.icon}
      />

      <Section
        pageSlug="cafe"
        sectionKey="galerie"
        title="Le café en images"
        intro="La salle, la décoration et notre machine à café professionnelle Caffè Moreno."
      >
        <Gallery images={GALLERIES.cafe} columns={4} />
      </Section>

      <Section
        pageSlug="cafe"
        sectionKey="menu"
        title="Notre menu"
        intro="Prix en francs guinéens (GNF), en formats Petit / Moyen / Grand selon les boissons."
        tone="light"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {CAFE_MENU.map((cat) => (
            <MenuCategoryCard key={cat.category} category={cat} />
          ))}
        </div>
      </Section>

      <Section pageSlug="cafe" sectionKey="infos" title="Infos pratiques">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
              <Clock className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-forest">
                Horaires
              </h3>
              <p className="mt-1 text-sm font-light text-forest/80">
                Lundi – Samedi : 7h30 – 20h00
                <br />
                Dimanche : 9h00 – 18h00
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
              <MapPin className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-forest">
                Adresse
              </h3>
              <p className="mt-1 text-sm font-light text-forest/80">
                {SITE.address}
              </p>
            </div>
          </div>
        </div>

        <div className="edge-gold panel-forest mt-10 rounded-2xl bg-forest p-6 text-cream sm:flex sm:items-center sm:justify-between">
          <p className="font-light">
            Suivez nos nouveautés et l’ambiance du café sur nos réseaux :
          </p>
          <SocialLinks className="mt-4 sm:mt-0" />
        </div>
      </Section>
    </>
  );
}

/** Carte d'une catégorie : tableau P/M/G si au moins un item a des formats. */
function MenuCategoryCard({ category }: { category: MenuCategory }) {
  const hasSizes = category.items.some((i) => i.sizes);

  return (
    <div className="edge-gold panel-forest rounded-2xl border border-gold/30 bg-cream-50 p-5">
      <h3 className="font-display text-xl font-semibold text-forest">
        {category.category}
      </h3>
      <div className="mt-2 h-px w-10 bg-gold" />
      {category.note && (
        <p className="mt-3 text-xs font-light leading-relaxed text-forest/60">
          {category.note}
        </p>
      )}

      {hasSizes ? (
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_repeat(3,3.5rem)] items-baseline gap-x-2 gap-y-3">
          <span aria-hidden />
          {["Petit", "Moyen", "Grand"].map((size) => (
            <span
              key={size}
              className="text-right text-[0.65rem] uppercase tracking-wider text-gold-600"
            >
              {size}
            </span>
          ))}
          {category.items.map((item) => (
            <SizedRow key={item.name} item={item} />
          ))}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {category.items.map((item) => (
            <li
              key={item.name}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="text-forest/85">{item.name}</span>
              {item.price !== undefined ? (
                <span className="shrink-0 font-medium text-gold-700">
                  {category.supplement && "+ "}
                  {formatGNF(item.price)}
                </span>
              ) : (
                <span className="shrink-0 text-xs italic text-forest/50">
                  {item.note ?? "à confirmer"}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Ligne d'un tableau P/M/G : 1 cellule nom + 3 cellules prix. */
function SizedRow({ item }: { item: MenuItem }) {
  return (
    <>
      <span className="text-sm text-forest/85">
        {item.name}
        {item.note && (item.sizes || item.price !== undefined) && (
          <span className="block text-xs italic text-forest/50">{item.note}</span>
        )}
      </span>
      {item.sizes ? (
        item.sizes.map((price, i) => (
          <span
            key={i}
            className="text-right text-sm font-medium text-gold-700"
          >
            {price !== null ? (
              formatGNF(price, false)
            ) : (
              <span aria-label="non proposé" className="text-forest/30">
                —
              </span>
            )}
          </span>
        ))
      ) : (
        <span className="col-span-3 text-right text-sm font-medium text-gold-700">
          {item.price !== undefined ? (
            formatGNF(item.price, false)
          ) : (
            <span className="text-xs font-normal italic text-forest/50">
              {item.note ?? "à confirmer"}
            </span>
          )}
        </span>
      )}
    </>
  );
}
