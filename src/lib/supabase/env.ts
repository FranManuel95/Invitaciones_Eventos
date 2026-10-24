/**
 * Configuración de Supabase. Sin estas variables la aplicación funciona solo en modo
 * demostración (datos de ejemplo en memoria), como en local o en las pruebas E2E.
 */
export function supabaseEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export const isSupabaseConfigured = () => supabaseEnv() !== null;
