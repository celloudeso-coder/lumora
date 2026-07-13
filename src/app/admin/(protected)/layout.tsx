import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import logo from "../../../../public/images/logo/Logo.png";
import { AdminNav } from "@/components/admin/AdminNav";
import { createSessionClient } from "@/lib/supabase/auth-server";
import { logout } from "../actions";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") redirect("/admin/unauthorized");

  const displayName = profile.full_name || user.email || "Administrateur";

  return (
    <div className="min-h-dvh bg-cream">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-forest-950 px-5 py-6 text-cream lg:flex">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="LUMORA GROUP"
            priority
            className="h-14 w-14 rounded-full object-contain"
            sizes="56px"
          />
          <div>
            <p className="font-display text-xl font-semibold">LUMORA</p>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold">
              Administration
            </p>
          </div>
        </Link>
        <AdminNav variant="desktop" />
        <Link
          href="/"
          className="mt-auto text-sm text-cream/60 transition-colors hover:text-gold"
        >
          Voir le site public →
        </Link>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-gold/20 bg-cream/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-forest">{displayName}</p>
            <p className="truncate text-xs text-forest/55">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/35 px-4 text-sm text-forest transition-colors hover:bg-gold-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </form>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-28 pt-7 sm:px-6 lg:px-8 lg:pb-10 lg:pt-9">
          {children}
        </main>
      </div>

      <AdminNav variant="mobile" />
    </div>
  );
}
