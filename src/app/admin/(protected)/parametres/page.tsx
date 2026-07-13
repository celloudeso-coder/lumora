import { Building2, MapPin, Phone, Settings, Share2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { SITE } from "@/lib/site";

export const metadata = { title: "Paramètres" };

const SETTINGS_GROUPS = [
  {
    title: "Identité",
    icon: Building2,
    rows: [
      { label: "Nom", value: SITE.name },
      { label: "Slogan", value: SITE.slogan },
      { label: "Ville", value: SITE.city },
    ],
  },
  {
    title: "Coordonnées",
    icon: Phone,
    rows: [
      { label: "Téléphone", value: SITE.phone },
      { label: "WhatsApp", value: SITE.whatsapp },
      { label: "E-mail", value: SITE.email },
    ],
  },
  {
    title: "Localisation",
    icon: MapPin,
    rows: [{ label: "Adresse", value: SITE.address }],
  },
  {
    title: "Réseaux sociaux",
    icon: Share2,
    rows: [
      { label: "Facebook", value: SITE.social.facebook },
      { label: "TikTok", value: SITE.social.tiktok },
    ],
  },
];

export default function AdminParametresPage() {
  return (
    <>
      <AdminPageHeader
        title="Paramètres"
        description="Identité et coordonnées actuellement utilisées sur l’ensemble du site."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {SETTINGS_GROUPS.map((group) => (
          <section
            key={group.title}
            className="rounded-2xl border border-gold/25 bg-cream-50 p-5 shadow-[var(--shadow-forest-sm)] sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-gold">
                <group.icon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-xl font-semibold text-forest">{group.title}</h2>
            </div>
            <dl className="mt-5 divide-y divide-gold/15">
              {group.rows.map((row) => (
                <div key={row.label} className="py-3 first:pt-0 last:pb-0">
                  <dt className="text-xs text-forest/50">{row.label}</dt>
                  <dd className="mt-1 break-words text-sm text-forest">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex sm:items-start sm:gap-4">
        <Settings className="h-6 w-6 shrink-0 text-amber-700" />
        <div className="mt-3 sm:mt-0">
          <h2 className="font-medium text-amber-900">Édition bientôt disponible</h2>
          <p className="mt-1 text-sm font-light leading-relaxed text-amber-900/70">
            Ces valeurs proviennent actuellement de <code>src/lib/site.ts</code>. Leur modification depuis l’admin nécessitera une table de paramètres avec validation et historique.
          </p>
        </div>
      </section>
    </>
  );
}
