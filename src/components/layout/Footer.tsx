import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ACTIVITIES, VALUES } from "@/lib/activities";
import { SITE } from "@/lib/site";

const NAVIGATION = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/showroom", label: "Showroom" },
  { href: "/galerie", label: "Galerie" },
  { href: "/pilates/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
] as const;

const FOOTER_UNIVERSES = ACTIVITIES.filter((activity) => activity.isSubBrand);

const sectionClass = "border-t border-gold/20 pt-7 sm:border-t-0 sm:pt-0";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-forest-900 text-cream">
      <div className="edge-gold border-b border-gold/20 bg-forest-950">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-3 px-4 py-5 text-center text-[0.65rem] uppercase tracking-[0.22em] text-gold sm:grid-cols-5 lg:px-6">
          {VALUES.map((value) => (
            <li key={value} className="last:col-span-2 sm:last:col-span-1">
              {value}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 sm:py-12 lg:grid-cols-12 lg:gap-8 lg:px-6 lg:py-14">
        <section className="lg:col-span-3">
          <Logo height={82} />
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">
            {SITE.slogan}
          </p>
          <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-cream/70">
            Sept univers réunis à Conakry autour d’une même exigence : rendre
            votre quotidien plus beau, plus simple et plus durable.
          </p>
          <div className="mt-5">
            <SocialLinks />
          </div>
        </section>

        <section className={`${sectionClass} lg:col-span-3`}>
          <FooterHeading>Navigation</FooterHeading>
          <ul className="mt-4 grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-5 gap-y-1">
            {NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center text-sm text-cream/75 transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${sectionClass} lg:col-span-3`}>
          <FooterHeading>Nos univers</FooterHeading>
          <ul className="mt-4 grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-5 gap-y-1">
            {FOOTER_UNIVERSES.map((activity) => (
              <li key={activity.slug}>
                <Link href={`/${activity.slug}`} className="group inline-flex min-h-10 items-center gap-2 text-sm text-cream/75 transition-colors hover:text-gold">
                  <activity.icon className="h-4 w-4 shrink-0 text-gold/75 transition-colors group-hover:text-gold" />
                  {activity.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${sectionClass} lg:col-span-3`}>
          <FooterHeading>Nous contacter</FooterHeading>
          <ul className="mt-5 space-y-4 text-sm text-cream/75">
            <li className="flex items-start gap-3">
              <ContactIcon><MapPin className="h-4 w-4" /></ContactIcon>
              <span className="pt-1 leading-relaxed">{SITE.address}</span>
            </li>
            <li>
              <a href={`tel:${SITE.phone.replaceAll(" ", "")}`} className="group flex items-center gap-3 transition-colors hover:text-gold">
                <ContactIcon><Phone className="h-4 w-4" /></ContactIcon>
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="group flex min-w-0 items-center gap-3 transition-colors hover:text-gold">
                <ContactIcon><Mail className="h-4 w-4" /></ContactIcon>
                <span className="min-w-0 break-all">{SITE.email}</span>
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 transition-colors hover:text-gold">
                <ContactIcon><MessageCircle className="h-4 w-4" /></ContactIcon>
                Écrire sur WhatsApp
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className="border-t border-gold/20 bg-forest-950/45">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-cream/55 sm:flex-row sm:text-left lg:px-6">
          <p>© {new Date().getFullYear()} {SITE.name} — {SITE.city}. Tous droits réservés.</p>
          <p>
            Developed by <span className="font-medium tracking-wide text-gold">LYNXA tech</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-gold">{children}</h2>
      <div className="mt-2 h-px w-10 bg-gold/70" aria-hidden="true" />
    </div>
  );
}

function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/35 text-gold">
      {children}
    </span>
  );
}
