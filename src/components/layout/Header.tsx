"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ACTIVITIES } from "@/lib/activities";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  ...ACTIVITIES.map((a) => ({ href: `/${a.slug}`, label: a.shortName })),
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <Logo />

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-forest text-cream"
                    : "text-forest hover:bg-forest-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-12 w-12 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest-50 active:bg-forest-100 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu mobile plein écran — grandes cibles tactiles */}
      {open && (
        <nav
          aria-label="Navigation mobile"
          className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto bg-cream lg:hidden"
        >
          <ul className="divide-y divide-gold/20 px-4 pb-24 pt-2">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-14 items-center px-2 font-display text-2xl ${
                      active ? "text-gold-600" : "text-forest"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
