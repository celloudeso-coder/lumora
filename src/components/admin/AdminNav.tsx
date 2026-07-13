"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  House,
  Building2,
  Menu,
  MessageSquareText,
  Newspaper,
  Tags,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";

type AdminItem = { href: string; label: string; icon: LucideIcon };

const GROUPS: { label: string; items: AdminItem[] }[] = [
  {
    label: "Général",
    items: [{ href: "/admin", label: "Tableau de bord", icon: House }],
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/realisations", label: "Réalisations", icon: Building2 },
      { href: "/admin/tarifs", label: "Tarifs", icon: Tags },
      { href: "/admin/articles", label: "Articles", icon: Newspaper },
    ],
  },
  {
    label: "Planning",
    items: [{ href: "/admin/creneaux", label: "Créneaux", icon: CalendarDays }],
  },
  {
    label: "Relation client",
    items: [
      { href: "/admin/reservations", label: "Réservations", icon: ClipboardList },
      { href: "/admin/demandes", label: "Demandes", icon: MessageSquareText },
    ],
  },
  {
    label: "Configuration",
    items: [{ href: "/admin/parametres", label: "Paramètres", icon: Settings }],
  },
];

const MOBILE_ITEMS = [
  { href: "/admin", label: "Accueil", icon: House },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/reservations", label: "Réserv.", icon: ClipboardList },
  { href: "/admin/demandes", label: "Demandes", icon: MessageSquareText },
] satisfies AdminItem[];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminNav({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (variant === "desktop") {
    return (
      <nav className="mt-8 flex-1 overflow-y-auto" aria-label="Administration">
        <div className="space-y-6">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-4 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-gold/65">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm transition-all ${
                        active
                          ? "bg-gold text-forest-950 shadow-md"
                          : "text-cream/75 hover:bg-cream/10 hover:text-cream"
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <>
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-3 bottom-20 max-h-[75dvh] overflow-y-auto rounded-3xl border border-gold/25 bg-cream-50 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold-700">Navigation</p>
                <h2 className="font-display text-2xl font-semibold text-forest">Administration</h2>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-forest"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gold-700">
                    {group.label}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {group.items.map((item) => {
                      const active = isActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 text-sm ${
                            active
                              ? "border-gold bg-gold-100 text-forest"
                              : "border-forest/10 bg-white text-forest/75"
                          }`}
                        >
                          <item.icon className="h-5 w-5 text-gold-700" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-gold/25 bg-forest-950/95 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden"
        aria-label="Administration mobile"
      >
        {MOBILE_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.65rem] transition-colors ${
                active ? "bg-gold/15 text-gold" : "text-cream/65"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[0.65rem] ${
            menuOpen ? "bg-gold/15 text-gold" : "text-cream/65"
          }`}
        >
          <Menu className="h-5 w-5" />
          Plus
        </button>
      </nav>
    </>
  );
}
