export function Section({
  title,
  intro,
  children,
  tone = "cream",
  id,
}: {
  title?: string;
  intro?: string;
  children: React.ReactNode;
  tone?: "cream" | "light";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={tone === "light" ? "bg-cream-50" : "bg-cream"}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
        {title && (
          <>
            <h2 className="font-display text-3xl font-semibold text-forest">
              {title}
            </h2>
            <div className="mt-3 h-px w-16 bg-gold" />
          </>
        )}
        {intro && (
          <p className="mt-4 max-w-2xl font-light leading-relaxed text-forest/80">
            {intro}
          </p>
        )}
        <div className={title || intro ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}
