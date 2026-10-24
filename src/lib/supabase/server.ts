import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/**
 * Cliente con la sesión del usuario (cookies): para el panel y el editor. Las políticas RLS
 * deciden qué puede ver y cambiar.
 */
export async function createSessionClient() {
  const env = supabaseEnv();
  if (!env) return null;
  const store = await cookies();
  return createServerClient(env.url, env.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Desde un Server Component no se pueden escribir cookies: lo hace el proxy.
        }
      },
    },
  });
}

/** Cliente anónimo, sin sesión: para las funciones de los invitados (get_invitation…). */
export function createAnonClient() {
  const env = supabaseEnv();
  if (!env) return null;
  return createPlainClient(env.url, env.key, { auth: { persistSession: false } });
}
