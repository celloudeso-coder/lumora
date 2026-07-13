// Clients Supabase côté serveur (composants serveur et Server Actions).
// Ne JAMAIS importer ce module depuis un composant client : la clé
// service role ne doit exister que sur le serveur.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function env(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variable d'environnement ${name} manquante — lancer \`supabase start\` puis copier les clés dans .env.local (voir .env.example).`,
    );
  }
  return value;
}

/**
 * Client anon : lectures publiques soumises à la RLS (articles publiés,
 * créneaux ouverts). Utilisé par la couche data (src/lib/data/).
 */
export function createPublicServerClient(): SupabaseClient {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false } },
  );
}

/**
 * Client service role : contourne la RLS. Réservé aux Server Actions
 * (insertion `leads` / `bookings`) — voir la politique dans la migration :
 * aucune policy d'insertion anonyme n'existe volontairement.
 */
export function createAdminClient(): SupabaseClient {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );
}
