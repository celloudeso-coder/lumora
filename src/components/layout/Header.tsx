"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Images, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ACTIVITIES } from "@/lib/activities";

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const servicesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const serviceActive = ACTIVITIES.some((activity) =>
    pathname.startsWith(`/${activity.slug}`),
  );

  useEffect(() => {
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 18);
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [servicesOpen]);

  return (
    <header className={`site-header glass-cream edge-gold sticky top-0 z-50 border-b border-gold/25 ${scrolled ? "is-scrolled" : ""}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 transition-[height] duration-300 lg:px-6">
        <Logo height={48} priority className="transition-transform duration-300 hover:scale-105" />

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              pathname === "/" ? "bg-forest text-cream" : "text-forest hover:bg-forest-50"
            }`}
          >
            Accueil
          </Link>

          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((value) => !value)}
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              className={`flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm transition-colors ${
                serviceActive || servicesOpen
                  ? "bg-forest text-cream"
                  : "text-forest hover:bg-forest-50"
              }`}
            >
              Services
              <ChevronDown
                className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              role="menu"
              className={`absolute right-0 top-[calc(100%+0.75rem)] w-[34rem] origin-top-right rounded-2xl border border-gold/25 bg-cream-50 p-3 shadow-2xl transition-all before:absolute before:-top-3 before:inset-x-0 before:h-3 before:content-[''] ${
                servicesOpen
                  ? "visible translate-y-0 scale-100 opacity-100"
                  : "invisible -translate-y-2 scale-95 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-1.5">
                {ACTIVITIES.map((activity) => {
                  const active = pathname.startsWith(`/${activity.slug}`);
                  return (
                    <Link
                      key={activity.slug}
                      href={`/${activity.slug}`}
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-xl p-3 transition-colors ${
                        active ? "bg-gold-100" : "hover:bg-forest-50"
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-gold">
                        <activity.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-lg font-semibold leading-tight text-forest">
                          {activity.shortName}
                        </span>
                        <span className="block truncate text-[0.65rem] uppercase tracking-wider text-gold-700">
                          {activity.tagline}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            href="/galerie"
            aria-current={pathname.startsWith("/galerie") ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              pathname.startsWith("/galerie")
                ? "bg-forest text-cream"
                : "text-forest hover:bg-forest-50"
            }`}
          >
            Galerie
          </Link>

          <Link
            href="/contact"
            aria-current={pathname.startsWith("/contact") ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              pathname.startsWith("/contact")
                ? "bg-forest text-cream"
                : "text-forest hover:bg-forest-50"
            }`}
          >
            Contact
          </Link>

          <form
            action="/recherche"
            role="search"
            className="ml-2 flex h-10 w-48 items-center rounded-full border border-forest/15 bg-white/70 px-3 transition-all focus-within:w-56 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20"
          >
            <Search className="h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Rechercher…"
              aria-label="Rechercher sur le site"
              className="min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-forest outline-none placeholder:text-forest/40"
            />
          </form>
        </nav>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-transparent text-forest transition-all hover:border-gold/30 hover:bg-forest-50 active:scale-95 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu mobile plein écran — grandes cibles tactiles */}
      {open && (
        <nav
          aria-label="Navigation mobile"
          className="mobile-nav glass-cream absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gold/20 lg:hidden"
        >
          <ul className="divide-y divide-gold/20 px-4 pb-24 pt-2">
            <li className="py-4">
              <form
                action="/recherche"
                role="search"
                className="flex min-h-12 items-center rounded-2xl border border-gold/30 bg-white px-4 shadow-sm"
              >
                <Search className="h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  placeholder="Rechercher un service, une page…"
                  aria-label="Rechercher sur le site"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 text-base text-forest outline-none placeholder:text-forest/40"
                />
              </form>
            </li>
            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                aria-current={pathname === "/" ? "page" : undefined}
                className={`flex min-h-14 items-center px-2 font-display text-2xl ${pathname === "/" ? "text-gold-600" : "text-forest"}`}
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/galerie"
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith("/galerie") ? "page" : undefined}
                className={`flex min-h-14 items-center gap-3 px-2 font-display text-2xl ${pathname.startsWith("/galerie") ? "text-gold-600" : "text-forest"}`}
              >
                Galerie
                <Images className="h-5 w-5 text-gold-700" />
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setMobileServicesOpen((value) => !value)}
                aria-expanded={mobileServicesOpen}
                className={`flex min-h-14 w-full items-center justify-between px-2 font-display text-2xl ${serviceActive ? "text-gold-600" : "text-forest"}`}
              >
                Services
                <ChevronDown className={`h-5 w-5 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileServicesOpen && (
                <ul className="mb-3 grid gap-2 border-l border-gold/30 pl-3 sm:grid-cols-2">
                  {ACTIVITIES.map((activity) => {
                    const active = pathname.startsWith(`/${activity.slug}`);
                    return (
                      <li key={activity.slug}>
                        <Link
                          href={`/${activity.slug}`}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm ${active ? "bg-gold-100 text-forest" : "bg-cream-50 text-forest/75"}`}
                        >
                          <activity.icon className="h-5 w-5 shrink-0 text-gold-700" />
                          {activity.shortName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith("/contact") ? "page" : undefined}
                className={`flex min-h-14 items-center px-2 font-display text-2xl ${pathname.startsWith("/contact") ? "text-gold-600" : "text-forest"}`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      )}
      <span
        className="scroll-progress absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
    </header>
  );
}
