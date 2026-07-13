// Client Supabase côté navigateur (clé anon uniquement).
// Pas encore utilisé : les lectures publiques passent par les composants
// serveur et les écritures par les Server Actions. Servira au back-office
// /admin (auth) et à d'éventuelles lectures temps réel côté client.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

export function createBrowserClient(): SupabaseClient {
  browserClient ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return browserClient;
}
