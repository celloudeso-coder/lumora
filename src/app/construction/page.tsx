import type { Metadata } from "next";
import { Building2, Hammer, PackageSearch, ClipboardCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { AdditionalPageSections } from "@/components/ui/AdditionalPageSections";
import { LeadForm } from "@/components/forms/LeadForm";
import { getActivity } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Lumora Construction — BTP à Conakry",
  description:
    "Construction neuve, rénovation, finitions et vente de matériaux à Conakry. Demandez votre devis gratuit.",
};

const SERVICES = [
  {
    icon: Building2,
    title: "Construction neuve",
    text: "Villas, immeubles et locaux professionnels : du gros œuvre à la remise des clés, avec un suivi de chantier rigoureux.",
  },
  {
    icon: Hammer,
    title: "Rénovation & finitions",
    text: "Réhabilitation, extension, peinture, carrelage, plomberie, électricité : nous redonnons vie à vos espaces.",
  },
  {
    icon: PackageSearch,
    title: "Vente de matériaux",
    text: "Matériaux de construction sélectionnés pour leur qualité et leur durabilité, disponibles en showroom.",
  },
  {
    icon: ClipboardCheck,
    title: "Études & suivi de projet",
    text: "Conseil, chiffrage et pilotage : un interlocuteur unique du premier rendez-vous à la livraison.",
  },
];

const STEPS = [
  { n: "1", title: "Prise de contact", text: "Décrivez votre projet via le formulaire ou par téléphone." },
  { n: "2", title: "Visite & étude", text: "Nous visitons le site et étudions la faisabilité avec vous." },
  { n: "3", title: "Devis détaillé", text: "Vous recevez un devis clair, sans surprise." },
  { n: "4", title: "Réalisation", text: "Nos équipes exécutent les travaux dans les délais convenus." },
];

export default function ConstructionPage() {
  const activity = getActivity("construction")!;

  return (
    <>
      <PageHero
        pageSlug="construction"
        title={activity.name}
        tagline={activity.tagline}
        description="Bâtir l'avenir, un projet à la fois. Lumora Construction accompagne particuliers et entreprises de Conakry dans leurs projets de construction, de rénovation et d'approvisionnement en matériaux."
        icon={activity.icon}
      />

      <Section pageSlug="construction" sectionKey="prestations" title="Nos prestations">
        <div className="grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="edge-gold panel-forest rounded-2xl border border-gold/30 bg-cream-50 p-5"
            >
              <s.icon className="h-7 w-7 text-gold-600" />
              <h3 className="mt-3 font-display text-xl font-semibold text-forest">
                {s.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-forest/80">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section pageSlug="construction" sectionKey="processus" title="Comment ça se passe" tone="light">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.n} className="process-card edge-gold rounded-2xl bg-forest p-5 text-cream">
              <span className="font-display text-3xl font-semibold text-gold">
                {step.n}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-1 text-sm font-light text-cream/80">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        pageSlug="construction"
        sectionKey="devis"
        title="Demander un devis gratuit"
        intro="Remplissez ce formulaire, notre équipe vous recontacte sous 48h pour étudier votre projet."
      >
        <div className="max-w-xl">
          <LeadForm
            activity="construction"
            subjects={[
              "Construction neuve",
              "Rénovation / finitions",
              "Achat de matériaux",
              "Étude / conseil",
              "Autre",
            ]}
            messageLabel="Décrivez votre projet"
          />
        </div>
      </Section>
      <AdditionalPageSections pageSlug="construction" />
    </>
  );
}
