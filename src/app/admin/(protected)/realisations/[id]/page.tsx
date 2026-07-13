import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { ProjectForm, type ProjectFormValue } from "@/components/admin/ProjectForm";
import { createSessionClient } from "@/lib/supabase/auth-server";
import { deleteProject, updateProject } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("construction_projects").select("id, title, description, location, category, image_url, completed_at, position, is_visible").eq("id", id).maybeSingle();
  if (error || !data) notFound();

  return (
    <>
      <Link href="/admin/realisations" className="mb-5 inline-flex items-center gap-2 text-sm text-forest/65 hover:text-forest"><ArrowLeft className="h-4 w-4" /> Retour aux réalisations</Link>
      <AdminPageHeader eyebrow="Contenu · Construction" title={data.title} description="Modifiez les informations, remplacez la photo ou masquez temporairement ce projet." />
      <div className="mb-6 max-w-3xl overflow-hidden rounded-2xl border border-gold/25 bg-cream-200"><div className="relative aspect-[16/7]"><Image src={data.image_url} alt={data.title} fill sizes="768px" className="object-cover" /></div></div>
      <ProjectForm action={updateProject} project={data as ProjectFormValue} />
      <form action={deleteProject} className="mt-5 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-5"><input type="hidden" name="id" value={data.id} /><p className="text-sm text-red-800">La suppression retire définitivement la réalisation et sa photo.</p><button type="submit" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-red-300 px-5 text-sm font-medium text-red-800 hover:bg-red-100"><Trash2 className="h-4 w-4" /> Supprimer la réalisation</button></form>
    </>
  );
}
