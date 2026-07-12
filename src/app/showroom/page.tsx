import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Grid2x2, Lightbulb, PaintRoller, Bath, DoorOpen, Layers } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { LeadForm } from "@/components/forms/LeadForm";
import { getActivity } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Show Room — LUMORA GROUP à Conakry",
  description:
    "Visitez le showroom LUMORA à Conakry : matériaux, finitions et échantillons pour vos projets de construction et de rénovation. Devis sur place ou en ligne.",
};

// Espaces d'exposition — photos réelles à intégrer plus tard.
const SPACES = [
  { icon: Grid2x2, title: "Carrelages & revêtements", text: "Sols et murs : grès, faïence, mosaïque." },
  { icon: Bath, title: "Sanitaires", text: "Robinetterie, vasques, douches et baignoires." },
  { icon: PaintRoller, title: "Peintures & enduits", text: "Nuanciers et finitions intérieures/extérieures." },
  { icon: Lightbulb, title: "Luminaires", text: "Éclairage résidentiel et professionnel." },
  { icon: DoorOpen, title: "Menuiserie", text: "Portes, fenêtres et placards sur mesure." },
  { icon: Layers, title: "Échantillons matériaux", text: "Bois, aluminium, marbre et composites." },
];

export default function ShowroomPage() {
  const activity = getActivity("showroom")!;

  return (
    <>
      <PageHero
        title={activity.name}
        tagline={activity.tagline}
        description="Voyez et touchez les matériaux avant de choisir. Notre showroom expose une sélection de finitions et d'échantillons pour vos projets — l'équipe vous conseille et établit votre devis sur place."
        icon={activity.icon}
      />

      <Section
        title="Nos espaces d'exposition"
        intro="Aperçu provisoire — les photos du showroom seront ajoutées prochainement."
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {SPACES.map((s) => (
            <div
              key={s.title}
              className="flex flex-col items-center rounded-2xl border border-gold/30 bg-cream-50 p-5 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-gold">
                <s.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold leading-tight text-forest">
                {s.title}
              </h3>
              <p className="mt-1.5 text-xs font-light leading-relaxed text-forest/70">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-forest p-6 text-cream sm:flex sm:items-center sm:justify-between">
          <p className="font-light">
            Un projet de construction ou de rénovation ? Le showroom travaille
            main dans la main avec{" "}
            <Link href="/construction" className="font-medium text-gold underline-offset-4 hover:underline">
              Lumora Construction
            </Link>
            .
          </p>
          <Link href="/construction" className="btn-gold mt-4 shrink-0 sm:ml-6 sm:mt-0">
            Voir le BTP
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section
        title="Demander un devis"
        intro="Décrivez ce qui vous intéresse (matériaux, quantités, projet) : nous préparons votre devis et vous recontactons."
        tone="light"
      >
        <div className="max-w-xl">
          <LeadForm
            activity="showroom"
            subjects={[
              "Carrelage / revêtements",
              "Sanitaires",
              "Peintures",
              "Luminaires",
              "Menuiserie",
              "Plusieurs matériaux / projet complet",
            ]}
            messageLabel="Votre besoin (matériaux, quantités, projet)"
            submitLabel="Demander mon devis"
          />
        </div>
      </Section>
    </>
  );
}
