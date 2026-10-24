"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

/** Cliente del navegador (acceso, subida de fotos). Null si Supabase no está configurado. */
export function createBrowserSupabase() {
  const env = supabaseEnv();
  return env ? createBrowserClient(env.url, env.key) : null;
}
