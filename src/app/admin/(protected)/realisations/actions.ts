"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/auth-server";

const projectSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(3000),
  location: z.string().trim().max(200),
  category: z.enum(["construction", "renovation", "amenagement"]),
  completedAt: z.string().trim().refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value)),
  position: z.coerce.number().int().min(0).max(9999),
  isVisible: z.boolean(),
});

const ALLOWED_IMAGES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function parseProject(formData: FormData) {
  const parsed = projectSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    location: String(formData.get("location") ?? ""),
    category: String(formData.get("category") ?? ""),
    completedAt: String(formData.get("completedAt") ?? ""),
    position: String(formData.get("position") ?? "0"),
    isVisible: formData.get("isVisible") === "on",
  });
  if (!parsed.success) throw new Error("Les informations de la réalisation sont invalides.");
  return parsed.data;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function uploadImage(supabase: Awaited<ReturnType<typeof createSessionClient>>, file: File) {
  const extension = ALLOWED_IMAGES.get(file.type);
  if (!extension) throw new Error("Utilisez une image JPG, PNG ou WebP.");
  if (file.size > 8 * 1024 * 1024) throw new Error("L’image ne doit pas dépasser 8 Mo.");

  const path = `construction/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("project-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Envoi de l’image impossible : ${error.message}`);
  return supabase.storage.from("project-images").getPublicUrl(path).data.publicUrl;
}

function storagePath(publicUrl: string) {
  const marker = "/storage/v1/object/public/project-images/";
  const index = publicUrl.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(publicUrl.slice(index + marker.length));
}

async function removeStoredImage(supabase: Awaited<ReturnType<typeof createSessionClient>>, publicUrl: string) {
  const path = storagePath(publicUrl);
  if (path) await supabase.storage.from("project-images").remove([path]);
}

export async function createProject(formData: FormData) {
  const project = parseProject(formData);
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) throw new Error("Ajoutez une photo à la réalisation.");

  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const imageUrl = await uploadImage(supabase, file);

  const { error } = await supabase.from("construction_projects").insert({
    title: project.title,
    slug: `${slugify(project.title) || "realisation"}-${Date.now().toString(36)}`,
    description: project.description,
    location: project.location || null,
    category: project.category,
    image_url: imageUrl,
    completed_at: project.completedAt || null,
    position: project.position,
    is_visible: project.isVisible,
  });
  if (error) {
    await removeStoredImage(supabase, imageUrl);
    throw new Error(`Création impossible : ${error.message}`);
  }

  revalidatePath("/construction");
  revalidatePath("/admin/realisations");
  redirect("/admin/realisations?created=1");
}

export async function updateProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!z.uuid().safeParse(id).success) throw new Error("Réalisation invalide.");
  const project = parseProject(formData);
  const supabase = await createSessionClient();
  const { data: existing, error: readError } = await supabase.from("construction_projects").select("image_url").eq("id", id).maybeSingle();
  if (readError || !existing) throw new Error("Réalisation introuvable.");

  const file = formData.get("image");
  const hasNewImage = file instanceof File && file.size > 0;
  const imageUrl = hasNewImage ? await uploadImage(supabase, file) : existing.image_url;
  const { error } = await supabase.from("construction_projects").update({
    title: project.title,
    description: project.description,
    location: project.location || null,
    category: project.category,
    image_url: imageUrl,
    completed_at: project.completedAt || null,
    position: project.position,
    is_visible: project.isVisible,
  }).eq("id", id);
  if (error) {
    if (hasNewImage) await removeStoredImage(supabase, imageUrl);
    throw new Error(`Mise à jour impossible : ${error.message}`);
  }
  if (hasNewImage) await removeStoredImage(supabase, existing.image_url);

  revalidatePath("/construction");
  revalidatePath("/admin/realisations");
  redirect("/admin/realisations?saved=1");
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!z.uuid().safeParse(id).success) throw new Error("Réalisation invalide.");
  const supabase = await createSessionClient();
  const { data: project } = await supabase.from("construction_projects").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("construction_projects").delete().eq("id", id);
  if (error) throw new Error(`Suppression impossible : ${error.message}`);
  if (project?.image_url) await removeStoredImage(supabase, project.image_url);

  revalidatePath("/construction");
  revalidatePath("/admin/realisations");
  redirect("/admin/realisations?deleted=1");
}
