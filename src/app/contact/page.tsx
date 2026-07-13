import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { LeadForm } from "@/components/forms/LeadForm";
import { LeafMark } from "@/components/brand/Logo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — LUMORA GROUP",
  description:
    "Contactez LUMORA GROUP à Conakry : téléphone, WhatsApp, e-mail, réseaux sociaux et formulaire de contact.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contactez-nous"
        tagline={SITE.slogan}
        description="Une question sur l'une de nos activités ? Écrivez-nous ou appelez-nous : nous répondons rapidement, y compris sur WhatsApp."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-forest">
              Nos coordonnées
            </h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-forest">Adresse</p>
                  <p className="mt-0.5 font-light text-forest/80">{SITE.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-forest">Téléphone / WhatsApp</p>
                  <a
                    href={`tel:${SITE.phone.replaceAll(" ", "")}`}
                    className="mt-0.5 block font-light text-forest/80 underline-offset-4 hover:underline"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-forest">E-mail</p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-0.5 block font-light text-forest/80 underline-offset-4 hover:underline"
                  >
                    {SITE.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-forest">Horaires d’accueil</p>
                  <p className="mt-0.5 font-light text-forest/80">
                    Lundi – Samedi : 8h00 – 19h00
                  </p>
                </div>
              </li>
            </ul>

            <div>
              <p className="mb-3 text-sm font-medium text-forest">
                Suivez-nous
              </p>
              <SocialLinks />
            </div>

            {/* Emplacement carte — intégration Google Maps à la mise en ligne */}
            <div className="flex h-48 items-center justify-center rounded-2xl border border-gold/30 bg-cream-200">
              <div className="text-center text-forest/60">
                <LeafMark className="mx-auto h-8 w-8" />
                <p className="mt-2 text-xs uppercase tracking-widest">
                  Carte / localisation à venir
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">
              Écrivez-nous
            </h2>
            <div className="mt-6">
              <LeadForm
                activity="general"
                subjects={[
                  "Lumora Construction",
                  "Lumora Café",
                  "Lumora Pilates",
                  "Lumora Pressing",
                  "Beleza Beauty",
                  "Boutique",
                  "Show room",
                  "Autre demande",
                ]}
                submitLabel="Envoyer mon message"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
