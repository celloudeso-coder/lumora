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
  const supabase = await createSessionClient();
  if (!page) throw new Error("Page inconnue.");
  const registeredSection = getEditableSection(parsed.data.pageSlug, parsed.data.sectionKey);
  let isCustom = false;
  if (!registeredSection) {
    const { data: customSection } = await supabase
      .from("page_sections")
      .select("id")
      .eq("page_slug", parsed.data.pageSlug)
      .eq("section_key", parsed.data.sectionKey)
      .eq("is_custom", true)
      .maybeSingle();
    if (!customSection) throw new Error("Section inconnue.");
    isCustom = true;
  }
  if (isCustom && parsed.data.title.length < 2) throw new Error("Le titre de la section est obligatoire.");
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
  const supabase = await createSessionClient();
  if (!page) throw new Error("Page inconnue.");
  const registeredSection = getEditableSection(pageSlug, sectionKey);
  if (!registeredSection) {
    const { data: customSection } = await supabase
      .from("page_sections")
      .select("id")
      .eq("page_slug", pageSlug)
      .eq("section_key", sectionKey)
      .eq("is_custom", true)
      .maybeSingle();
    if (!customSection) throw new Error("Section inconnue.");
  }
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

export async function createPageSection(formData: FormData) {
  const pageSlug = String(formData.get("pageSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const intro = String(formData.get("intro") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const page = getEditablePage(pageSlug);
  if (!page || title.length < 2 || title.length > 200 || intro.length > 1000 || body.length > 3000) {
    throw new Error("Contenu de section invalide.");
  }

  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: lastSection } = await supabase
    .from("page_sections")
    .select("position")
    .eq("page_slug", pageSlug)
    .eq("is_custom", true)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sectionKey = `custom-${crypto.randomUUID()}`;
  const { error } = await supabase.from("page_sections").insert({
    page_slug: pageSlug,
    section_key: sectionKey,
    title,
    intro: optionalContent(intro),
    body: optionalContent(body),
    is_visible: true,
    is_custom: true,
    position: (lastSection?.position ?? 0) + 1,
    updated_by: user.id,
  });
  if (error) throw new Error(`Création impossible : ${error.message}`);

  revalidatePath(page.href);
  revalidatePath(`/admin/pages/${page.slug}`);
  redirect(`/admin/pages/${page.slug}?created=1`);
}
