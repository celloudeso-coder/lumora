// Champs de formulaire mobile-first partagés : grandes zones tactiles,
// libellés toujours visibles, pas de dépendance au hover.

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-forest">
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full min-h-12 rounded-xl border border-forest/20 bg-white px-4 text-base text-forest placeholder:text-forest/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";

export const textareaClass = `${inputClass} py-3 min-h-28 resize-y`;

export function SuccessNote({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="rounded-xl border border-forest-100 bg-forest-50 px-4 py-4 text-sm leading-relaxed text-forest"
    >
      {message}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-relaxed text-red-800"
    >
      {message}
    </div>
  );
}

/**
 * Champ anti-spam invisible : les humains ne le voient pas, les robots
 * le remplissent. Les Server Actions ignorent toute soumission où il
 * est renseigné.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Ne pas remplir ce champ
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
