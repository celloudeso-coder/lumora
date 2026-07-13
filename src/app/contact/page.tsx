import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { LeadForm } from "@/components/forms/LeadForm";
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
        pageSlug="contact"
        title="Contactez-nous"
        tagline={SITE.slogan}
        description="Une question sur l'une de nos activités ? Écrivez-nous ou appelez-nous : nous répondons rapidement, y compris sur WhatsApp."
      />

      <Section pageSlug="contact" sectionKey="coordonnees">
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

            <div className="panel-forest relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/30 bg-cream-200 sm:aspect-[16/10]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3933.8717959112796!2d-13.64675042497395!3d9.606306090479931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOcKwMzYnMjIuNyJOIDEzwrAzOCczOS4wIlc!5e0!3m2!1sen!2s!4v1783953155981!5m2!1sen!2s"
                title="Localisation de LUMORA GROUP à Conakry"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
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
