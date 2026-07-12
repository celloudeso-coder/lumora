import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ACTIVITIES, VALUES } from "@/lib/activities";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-forest-900 text-cream">
      {/* Bandeau des valeurs (repris de la plaque du logo) */}
      <div className="border-b border-gold/20 bg-forest-950">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 text-[0.7rem] uppercase tracking-[0.25em] text-gold">
          {VALUES.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
        <div className="space-y-4">
          <Logo tone="dark" />
          <p className="text-sm font-light italic text-gold-300">
            {SITE.slogan}
          </p>
          <p className="max-w-xs text-sm font-light leading-relaxed text-cream/80">
            Un groupe, sept univers au service de votre quotidien à Conakry :
            construction, café, bien-être, soin du linge, beauté, boutique et
            showroom.
          </p>
          <SocialLinks />
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-gold">Nos activités</h3>
          <ul className="grid grid-cols-2 gap-x-4">
            {ACTIVITIES.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/${a.slug}`}
                  className="flex min-h-10 items-center text-sm text-cream/85 transition-colors hover:text-gold"
                >
                  {a.shortName}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="flex min-h-10 items-center text-sm text-cream/85 transition-colors hover:text-gold"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-gold">Contact</h3>
          <ul className="space-y-3 text-sm text-cream/85">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {SITE.address}
            </li>
            <li>
              <a href={`tel:${SITE.phone.replaceAll(" ", "")}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/20 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {SITE.name} — {SITE.city}. Tous droits
        réservés.
      </div>
    </footer>
  );
}
