"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="public-floating-actions fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Revenir en haut de la page"
        className={`floating-action bg-cream text-forest ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
      <a
        href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-action group bg-forest text-cream"
        aria-label="Contacter LUMORA GROUP sur WhatsApp"
      >
        <MessageCircle className="h-5 w-5 text-gold" />
        <span className="hidden pr-1 text-xs font-medium sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
