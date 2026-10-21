import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Monogram } from "@/features/invitation/ornaments";
import { createSessionClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage(props: PageProps<"/entrar">) {
  const params = await props.searchParams;
  const wanted = typeof params.siguiente === "string" ? params.siguiente : "/panel";
  // Solo rutas internas: evita redirecciones abiertas a otros dominios.
  const next = wanted.startsWith("/") && !wanted.startsWith("//") ? wanted : "/panel";

  const supabase = await createSessionClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect(next);
  }

  return (
    <main className="paper-grain grid min-h-dvh place-items-center bg-ivory px-6 py-16">
      <div className="w-full max-w-sm">
        <Monogram first="I" second="E" className="mx-auto size-12 text-gold" />
        <h1 className="mt-6 text-center font-display text-[2.5rem] leading-tight text-ink">
          Vuestro panel
        </h1>
        <p className="mt-2 mb-8 text-center text-[0.9375rem] text-muted">
          Crea y gestiona vuestras invitaciones.
        </p>
        {supabase ? (
          <LoginForm next={next} />
        ) : (
          <p className="rounded-md border border-line bg-paper p-4 text-[0.9375rem] text-ink-soft">
            Este entorno funciona en modo demostración, sin cuentas.
          </p>
        )}
        {params.error === "enlace" ? (
          <p className="mt-4 text-center text-[0.875rem] text-danger">
            El enlace ha caducado o ya se usó. Entra con tu email y contraseña.
          </p>
        ) : null}
        <p className="mt-8 text-center text-[0.875rem] text-muted">
          ¿Solo quieres echar un vistazo?{" "}
          <Link
            href="/panel/demo"
            className="text-ink underline decoration-gold underline-offset-4"
          >
            Ver el panel de demostración
          </Link>
        </p>
      </div>
    </main>
  );
}
