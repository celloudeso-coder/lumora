import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <>
      <Link href="/admin/realisations" className="mb-5 inline-flex items-center gap-2 text-sm text-forest/65 hover:text-forest"><ArrowLeft className="h-4 w-4" /> Retour aux réalisations</Link>
      <AdminPageHeader eyebrow="Contenu · Construction" title="Nouvelle réalisation" description="Présentez un projet terminé avec une photo, sa catégorie et sa localisation." />
      <ProjectForm action={createProject} />
    </>
  );
}
