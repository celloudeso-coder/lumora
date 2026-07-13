import { Section } from "@/components/ui/Section";
import { getCustomPageSections } from "@/lib/cms/page-sections";

export async function AdditionalPageSections({ pageSlug }: { pageSlug: string }) {
  const sections = await getCustomPageSections(pageSlug);

  return sections.map((section, index) => (
    <Section
      key={section.section_key}
      pageSlug={pageSlug}
      sectionKey={section.section_key}
      title={section.title ?? undefined}
      intro={section.intro ?? undefined}
      tone={index % 2 === 0 ? "light" : "cream"}
    >
      {section.body && (
        <div className="max-w-3xl whitespace-pre-line font-light leading-relaxed text-forest/80">
          {section.body}
        </div>
      )}
    </Section>
  ));
}
