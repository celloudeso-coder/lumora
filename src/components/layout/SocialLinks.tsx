import { SITE } from "@/lib/site";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21v-7h2.4l.5-3h-2.9V9.1c0-.9.3-1.6 1.6-1.6h1.4V4.8c-.7-.1-1.5-.2-2.3-.2-2.4 0-4 1.4-4 4.1V11H7.8v3h2.4v7h3.3Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.6 3c.3 1.9 1.5 3.4 3.4 3.7v3c-1.3 0-2.5-.4-3.4-1.1v6.4c0 3.4-2.4 5.6-5.5 5.6C8 20.6 6 18.5 6 15.9c0-2.7 2.1-4.8 5-4.8.3 0 .7 0 1 .1v3.1c-.3-.1-.6-.2-1-.2-1.2 0-2.1.9-2.1 2s.9 2 2.1 2c1.3 0 2.3-.9 2.3-2.5V3h3.3Z" />
    </svg>
  );
}

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <a
        href={SITE.social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook LUMORA GROUP"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold transition-colors hover:bg-gold hover:text-forest-950"
      >
        <FacebookIcon className="h-5 w-5" />
      </a>
      <a
        href={SITE.social.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok LUMORA GROUP"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold transition-colors hover:bg-gold hover:text-forest-950"
      >
        <TikTokIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
