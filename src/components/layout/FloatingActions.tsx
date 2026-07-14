import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";

export function FloatingActions() {
  return (
    <div className="public-floating-actions fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
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
