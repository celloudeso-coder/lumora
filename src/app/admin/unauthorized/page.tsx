import { ShieldAlert } from "lucide-react";
import { logout } from "../actions";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-forest-950 px-4">
      <section className="max-w-md rounded-3xl border border-gold/30 bg-cream-50 p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-gold-700" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-forest">
          Accès non autorisé
        </h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-forest/70">
          Votre compte est connecté, mais il ne possède pas le rôle administrateur.
        </p>
        <form action={logout} className="mt-6">
          <button type="submit" className="btn-primary w-full">
            Se déconnecter
          </button>
        </form>
      </section>
    </main>
  );
}
