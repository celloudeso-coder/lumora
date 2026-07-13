import { cache } from "react";
import { createPublicServerClient } from "@/lib/supabase/server";

export type PageSectionContent = {
  pageSlug: string;
  sectionKey: string;
  title?: string;
  intro?: string;
  body?: string;
  isVisible: boolean;
  overridden: boolean;
};

type PageSectionRow = {
  page_slug: string;
  section_key: string;
  title: string | null;
  intro: string | null;
  body: string | null;
  is_visible: boolean;
  is_custom: boolean;
  position: number;
};

export const getPageSectionOverrides = cache(async (pageSlug: string) => {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("page_slug, section_key, title, intro, body, is_visible, is_custom, position")
    .eq("page_slug", pageSlug);

  if (error) {
    throw new Error(`Lecture du contenu CMS « ${pageSlug} » impossible : ${error.message}`);
  }

  return new Map(
    (data as PageSectionRow[]).map((row) => [row.section_key, row]),
  );
});

export async function getCustomPageSections(pageSlug: string) {
  const overrides = await getPageSectionOverrides(pageSlug);
  return [...overrides.values()]
    .filter((section) => section.is_custom)
    .sort((a, b) => a.position - b.position);
}

export async function resolvePageSection(
  pageSlug: string,
  sectionKey: string,
  fallback: { title?: string; intro?: string; body?: string },
): Promise<PageSectionContent> {
  const overrides = await getPageSectionOverrides(pageSlug);
  const override = overrides.get(sectionKey);

  return {
    pageSlug,
    sectionKey,
    title: override?.title ?? fallback.title,
    intro: override?.intro ?? fallback.intro,
    body: override?.body ?? fallback.body,
    isVisible: override?.is_visible ?? true,
    overridden: Boolean(override),
  };
}
