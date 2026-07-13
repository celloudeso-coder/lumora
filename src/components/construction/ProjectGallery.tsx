import Image from "next/image";
import { Building2, CalendarDays, MapPin } from "lucide-react";
import type { ConstructionProject } from "@/lib/data/construction-projects";

const CATEGORY_LABELS: Record<ConstructionProject["category"], string> = {
  construction: "Construction",
  renovation: "Rénovation",
  amenagement: "Aménagement",
};

export function ProjectGallery({ projects }: { projects: ConstructionProject[] }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gold/40 bg-cream-50 px-5 py-12 text-center">
        <Building2 className="mx-auto h-8 w-8 text-gold-600" />
        <p className="mt-3 font-display text-xl font-semibold text-forest">Nos projets arrivent bientôt</p>
        <p className="mt-1 text-sm font-light text-forest/60">Les prochaines réalisations de Lumora Construction seront présentées ici.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article key={project.id} className="card-lift edge-gold overflow-hidden rounded-2xl border border-gold/30 bg-cream-50 shadow-[var(--shadow-forest-sm)]">
          <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
            <Image src={project.imageUrl} alt={project.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            <span className="absolute left-3 top-3 rounded-full border border-cream/25 bg-forest-950/80 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-gold backdrop-blur-md">{CATEGORY_LABELS[project.category]}</span>
          </div>
          <div className="p-5">
            <h3 className="font-display text-xl font-semibold text-forest">{project.title}</h3>
            {(project.location || project.completedAt) && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-forest/55">
                {project.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold-700" />{project.location}</span>}
                {project.completedAt && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-gold-700" />{new Date(`${project.completedAt}T00:00:00`).getFullYear()}</span>}
              </div>
            )}
            {project.description && <p className="mt-3 line-clamp-4 text-sm font-light leading-relaxed text-forest/75">{project.description}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
