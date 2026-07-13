import { createPublicServerClient } from "@/lib/supabase/server";

export type ConstructionProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  category: "construction" | "renovation" | "amenagement";
  imageUrl: string;
  completedAt: string | null;
  position: number;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  category: ConstructionProject["category"];
  image_url: string;
  completed_at: string | null;
  position: number;
};

export async function getVisibleConstructionProjects(): Promise<ConstructionProject[]> {
  const supabase = createPublicServerClient();
  const { data, error } = await supabase
    .from("construction_projects")
    .select("id, title, slug, description, location, category, image_url, completed_at, position")
    .eq("is_visible", true)
    .order("position", { ascending: true })
    .order("completed_at", { ascending: false, nullsFirst: false });

  // Pendant un déploiement progressif, la page Construction doit rester
  // accessible même si la migration vient d'être livrée mais pas encore
  // appliquée à la base cible.
  if (error && ["42P01", "PGRST205"].includes(error.code)) return [];
  if (error) throw new Error(`Lecture des réalisations impossible : ${error.message}`);

  return (data as ProjectRow[]).map((project) => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    location: project.location,
    category: project.category,
    imageUrl: project.image_url,
    completedAt: project.completed_at,
    position: project.position,
  }));
}
