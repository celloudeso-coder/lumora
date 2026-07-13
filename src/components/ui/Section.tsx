import { Reveal } from "@/components/ui/Reveal";
import { resolvePageSection } from "@/lib/cms/page-sections";

export async function Section({
  title,
  intro,
  children,
  tone = "cream",
  id,
  pageSlug,
  sectionKey,
}: {
  title?: string;
  intro?: string;
  children: React.ReactNode;
  tone?: "cream" | "light";
  id?: string;
  pageSlug?: string;
  sectionKey?: string;
}) {
  const content =
    pageSlug && sectionKey
      ? await resolvePageSection(pageSlug, sectionKey, { title, intro })
      : { title, intro, isVisible: true };

  if (!content.isVisible) return null;

  const resolvedTitle = content.title;
  const resolvedIntro = content.intro;

  return (
    <section
      id={id}
      className={`section-shell ${tone === "light" ? "section-light bg-cream-50" : "bg-cream"}`}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:py-16 lg:px-6 lg:py-20">
        {(resolvedTitle || resolvedIntro) && (
          <Reveal className="section-heading">
            {resolvedTitle && (
              <h2 className="font-display text-3xl font-semibold leading-tight text-forest sm:text-4xl">
                {resolvedTitle}
              </h2>
            )}
            {resolvedTitle && <div className="section-rule mt-3" aria-hidden="true" />}
            {resolvedIntro && (
              <p className="mt-4 max-w-2xl font-light leading-relaxed text-forest/75 sm:text-lg">
                {resolvedIntro}
              </p>
            )}
          </Reveal>
        )}
        <Reveal className={resolvedTitle || resolvedIntro ? "mt-8" : ""} delayMs={60}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
