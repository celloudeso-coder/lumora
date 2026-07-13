import Image from "next/image";
import Link from "next/link";
import { Building2, EyeOff, Pencil, Plus } from "lucide-react";
import { AdminPageHeader, EmptyState, formatAdminDate } from "@/components/admin/AdminUI";
import { createSessionClient } from "@/lib/supabase/auth-server";

export const metadata = { title: "Réalisations" };

type Props = { searchParams: Promise<{ created?: string; saved?: string; deleted?: string }> };

const CATEGORY_LABELS: Record<string, string> = {
  construction: "Construction",
  renovation: "Rénovation",
  amenagement: "Aménagement",
};

export default async function AdminProjectsPage({ searchParams }: Props) {
  const query = await searchParams;
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("construction_projects").select("id, title, description, location, category, image_url, completed_at, is_visible, position, updated_at").order("position", { ascending: true }).order("updated_at", { ascending: false });
  if (error) throw new Error(`Lecture des réalisations impossible : ${error.message}`);

  return (
    <>
      <AdminPageHeader title="Réalisations" description="Projets affichés dans la section Réalisations de Lumora Construction." action={<Link href="/admin/realisations/nouveau" className="btn-primary"><Plus className="h-4 w-4" /> Ajouter une réalisation</Link>} />
      {(query.created === "1" || query.saved === "1" || query.deleted === "1") && <p className="mb-5 rounded-xl border border-forest-100 bg-forest-50 px-4 py-3 text-sm text-forest">{query.deleted === "1" ? "La réalisation a été supprimée." : query.created === "1" ? "La réalisation a été ajoutée." : "La réalisation a été mise à jour."}</p>}

      {!data.length ? (
        <EmptyState icon={Building2} title="Aucune réalisation" text="Ajoutez le premier projet pour alimenter la page Lumora Construction." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-2xl border border-gold/25 bg-cream-50 shadow-[var(--shadow-forest-sm)] sm:flex">
              <div className="relative aspect-[4/3] shrink-0 bg-cream-200 sm:aspect-auto sm:w-44"><Image src={project.image_url} alt={project.title} fill sizes="176px" className="object-cover" /></div>
              <div className="flex min-w-0 flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-gold/30 bg-gold-50 px-2.5 py-1 text-[0.6rem] uppercase tracking-wide text-gold-800">{CATEGORY_LABELS[project.category]}</span>{!project.is_visible && <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[0.6rem] uppercase tracking-wide text-red-800"><EyeOff className="h-3 w-3" /> Masquée</span>}</div>
                <h2 className="mt-3 font-display text-xl font-semibold text-forest">{project.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm font-light text-forest/60">{project.location || "Localisation non renseignée"}{project.completed_at ? ` · ${new Date(`${project.completed_at}T00:00:00`).getFullYear()}` : ""}</p>
                <p className="mt-2 text-[0.65rem] text-forest/40">Ordre {project.position} · Mis à jour {formatAdminDate(project.updated_at)}</p>
                <Link href={`/admin/realisations/${project.id}`} className="btn-outline mt-4 w-full sm:w-auto"><Pencil className="h-4 w-4" /> Modifier</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
