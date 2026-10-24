import { NextResponse, type NextRequest } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";

/** Enlace del email de confirmación: canjea el código por una sesión y entra al panel. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const supabase = await createSessionClient();
  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/panel", request.url));
  }
  return NextResponse.redirect(new URL("/entrar?error=enlace", request.url));
}
