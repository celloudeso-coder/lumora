import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import logo from "../../../../public/images/logo/Logo.png";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Connexion" };

type Props = { searchParams: Promise<{ redirectTo?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const redirectTo = params.redirectTo?.startsWith("/admin")
    ? params.redirectTo
    : "/admin";

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-forest-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,163,92,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(58,116,88,0.35),transparent_40%)]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-cream/75 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Link>

        <section className="edge-gold rounded-[2rem] border border-gold/30 bg-cream-50 p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-4">
            <Image
              src={logo}
              alt="LUMORA GROUP"
              priority
              className="h-16 w-16 rounded-full object-contain"
              sizes="64px"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gold-700">
                Espace sécurisé
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
                Administration
              </h1>
            </div>
          </div>

          <p className="mt-6 text-sm font-light leading-relaxed text-forest/70">
            Connectez-vous avec le compte administrateur fourni par LUMORA.
          </p>

          <LoginForm redirectTo={redirectTo} />
        </section>
      </div>
    </main>
  );
}
