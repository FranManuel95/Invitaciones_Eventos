import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renueva la sesión de Supabase en cada petición del panel y del editor, y manda a /entrar a
 * quien no ha iniciado sesión. La demostración (/panel/demo y /editor/demo) es pública.
 * Es una comprobación optimista: la autorización real la hacen las políticas RLS.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const { pathname } = request.nextUrl;
  if (!url || !key || /^\/(panel|editor)\/demo(\/|$)/.test(pathname)) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  if (!data.user && (pathname.startsWith("/panel") || pathname.startsWith("/editor"))) {
    const login = request.nextUrl.clone();
    login.pathname = "/entrar";
    login.search = `?siguiente=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: ["/panel/:path*", "/editor/:path*", "/entrar"],
};
