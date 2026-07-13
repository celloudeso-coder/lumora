// Client Supabase lié à la session de l'utilisateur courant.
// À utiliser uniquement dans les Server Components, Server Actions et
// Route Handlers de l'admin : les requêtes restent soumises à la RLS.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variable d'environnement ${name} manquante.`);
  return value;
}

export async function createSessionClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Un Server Component ne peut pas toujours écrire les cookies.
            // Le proxy se charge alors du rafraîchissement de la session.
          }
        },
      },
    },
  );
}
