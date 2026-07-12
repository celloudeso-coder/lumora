import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, HeartPulse, Baby, User } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { PilatesBookingForm } from "@/components/forms/PilatesBookingForm";
import { getActivity } from "@/lib/activities";
import { getOpenSlots } from "@/lib/data/slots";
import { getPublishedArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Lumora Pilates — Mind & Body Fitness à Conakry",
  description:
    "Cours de Pilates en petit groupe à Conakry : débutant, intermédiaire, prénatal. Réservez votre créneau en ligne.",
};

const COURSES = [
  {
    icon: Users,
    title: "Pilates Mat — Débutant",
    text: "Les fondamentaux du Pilates au tapis : respiration, posture, renforcement du centre. Idéal pour commencer.",
  },
  {
    icon: HeartPulse,
    title: "Pilates Mat — Intermédiaire",
    text: "Enchaînements plus dynamiques pour gagner en force, en contrôle et en fluidité.",
  },
  {
    icon: Baby,
    title: "Pilates Prénatal",
    text: "Un accompagnement doux et sécurisé pour les futures mamans, en tout petit groupe.",
  },
  {
    icon: User,
    title: "Cours privé",
    text: "Séance individuelle sur mesure, adaptée à vos objectifs et à votre rythme. Sur demande.",
  },
];

export default async function PilatesPage() {
  const activity = getActivity("pilates")!;
  const [slots, articles] = await Promise.all([
    getOpenSlots(),
    getPublishedArticles(),
  ]);
  const latest = articles.slice(0, 2);

  return (
    <>
      <PageHero
        title={activity.name}
        tagline={activity.tagline}
        description="Renforcez votre corps, apaisez votre esprit. Des cours en petit groupe encadrés par une coach certifiée, dans un studio lumineux pensé pour votre bien-être."
        icon={activity.icon}
      />

      <Section title="Nos cours">
        <div className="grid gap-4 sm:grid-cols-2">
          {COURSES.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-gold/30 bg-cream-50 p-5"
            >
              <c.icon className="h-7 w-7 text-gold-600" />
              <h3 className="mt-3 font-display text-xl font-semibold text-forest">
                {c.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-forest/80">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Réserver un cours"
        intro="Choisissez un créneau de la semaine, laissez vos coordonnées : la confirmation arrive par téléphone ou WhatsApp."
        tone="light"
        id="reserver"
      >
        <div className="max-w-xl">
          <PilatesBookingForm slots={slots} />
        </div>
      </Section>

      {/* Actualités du studio */}
      <Section
        title="Actualités du studio"
        intro="Nouveaux cours, conseils bien-être, événements et offres du moment."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {latest.map((article) => (
            <Link
              key={article.id}
              href={`/pilates/actualites/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-gold/30 bg-cream-50 p-5 transition-colors active:bg-gold-100 lg:hover:border-gold"
            >
              <time className="text-xs uppercase tracking-widest text-gold-600">
                {formatDate(article.publishedAt)}
              </time>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-forest">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-forest/80">
                {article.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest">
                Lire l'article
                <ArrowRight className="h-4 w-4 text-gold" />
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/pilates/actualites"
          className="btn-outline mt-6 w-full sm:w-auto"
        >
          Toutes les actualités
        </Link>
      </Section>
    </>
  );
}
