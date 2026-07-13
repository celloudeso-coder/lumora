"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getEditablePage, getEditableSection } from "@/lib/cms/page-registry";
import { createSessionClient } from "@/lib/supabase/auth-server";

const sectionSchema = z.object({
  pageSlug: z.string().min(1).max(100),
  sectionKey: z.string().min(1).max(100),
  title: z.string().trim().max(200),
  intro: z.string().trim().max(1000),
  body: z.string().trim().max(3000),
  isVisible: z.boolean(),
});

function optionalContent(value: string) {
  return value === "" ? null : value;
}

export async function savePageSection(formData: FormData) {
  const parsed = sectionSchema.safeParse({
    pageSlug: String(formData.get("pageSlug") ?? ""),
    sectionKey: String(formData.get("sectionKey") ?? ""),
    title: String(formData.get("title") ?? ""),
    intro: String(formData.get("intro") ?? ""),
    body: String(formData.get("body") ?? ""),
    isVisible: formData.get("isVisible") === "on",
  });

  if (!parsed.success) throw new Error("Contenu de section invalide.");

  const page = getEditablePage(parsed.data.pageSlug);
  const section = getEditableSection(parsed.data.pageSlug, parsed.data.sectionKey);
  if (!page || !section) throw new Error("Page ou section inconnue.");

  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { error } = await supabase.from("page_sections").upsert(
    {
      page_slug: parsed.data.pageSlug,
      section_key: parsed.data.sectionKey,
      title: optionalContent(parsed.data.title),
      intro: optionalContent(parsed.data.intro),
      body: optionalContent(parsed.data.body),
      is_visible: parsed.data.isVisible,
      updated_by: user.id,
    },
    { onConflict: "page_slug,section_key" },
  );

  if (error) throw new Error(`Enregistrement impossible : ${error.message}`);

  revalidatePath(page.href);
  revalidatePath(`/admin/pages/${page.slug}`);
  redirect(`/admin/pages/${page.slug}?saved=1`);
}

export async function resetPageSection(formData: FormData) {
  const pageSlug = String(formData.get("pageSlug") ?? "");
  const sectionKey = String(formData.get("sectionKey") ?? "");
  const page = getEditablePage(pageSlug);
  const section = getEditableSection(pageSlug, sectionKey);
  if (!page || !section) throw new Error("Page ou section inconnue.");

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("page_sections")
    .delete()
    .eq("page_slug", pageSlug)
    .eq("section_key", sectionKey);

  if (error) throw new Error(`Réinitialisation impossible : ${error.message}`);

  revalidatePath(page.href);
  revalidatePath(`/admin/pages/${page.slug}`);
  redirect(`/admin/pages/${page.slug}?reset=1`);
}
