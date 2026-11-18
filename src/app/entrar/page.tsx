import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signupOpen } from "@/lib/site";
import { createSessionClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import "../panel/[evento]/panel.css";

export const metadata: Metadata = { title: "Entrar" };
export const viewport: Viewport = { themeColor: "#3a2a22" };

const linkClass =
  "text-ink underline decoration-gold underline-offset-4 transition-colors hover:decoration-ink";

/** Lo que hay dentro del panel, para quien entra por primera vez. */
const INSIDE = [
  ["Vuestra invitación", "Elegís la plantilla, ponéis fotos y textos y la veis como la verán."],
  ["Las respuestas, al momento", "Quién viene, quién no, menús, alergias y autobús."],
  ["El día, en orden", "Mesas, transporte, tareas y presupuesto en el mismo sitio."],
] as const;

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
    <div className="panel min-h-dvh lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* La marca y lo que os espera dentro, sobre la tinta. */}
      <section
        aria-labelledby="entrar-titulo"
        className="panel-dark flex flex-col px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-10 sm:px-10 lg:min-h-dvh lg:px-14 lg:py-12"
      >
        <Link href="/" className="self-start text-[0.875rem] text-muted">
          <span className="panel-title text-[1.5rem] text-ink">eFeLe</span> Invitaciones
        </Link>
        <div className="mt-10 lg:my-auto">
          <h1 id="entrar-titulo" className="panel-title text-[3rem] leading-none sm:text-[4rem]">
            Vuestro panel
          </h1>
          <p className="mt-4 max-w-[34ch] text-[1rem] leading-relaxed text-ink-soft">
            Aquí preparáis la invitación y seguís las respuestas de vuestros invitados.
          </p>
          <ul className="mt-10 hidden max-w-[40ch] space-y-6 lg:block">
            {INSIDE.map(([title, text]) => (
              <li key={title} className="border-t border-line pt-4">
                <p className="font-display text-[1.25rem] text-ink">{title}</p>
                <p className="mt-1 text-[0.9375rem] text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <main className="grid place-items-center px-6 py-10 sm:px-10 lg:py-16">
        <div className="w-full max-w-sm">
          {supabase ? (
            <LoginForm next={next} signup={signupOpen()} />
          ) : (
            <p className="rounded-xl border border-line bg-paper p-5 text-[0.9375rem] text-ink-soft">
              Este entorno funciona en modo demostración, sin cuentas. Podéis ver el panel de
              ejemplo con todas sus secciones.
            </p>
          )}
          {params.error === "enlace" ? (
            <p role="alert" className="mt-4 text-[0.875rem] text-danger">
              El enlace ha caducado o ya se usó. Entrad con vuestro email y contraseña.
            </p>
          ) : null}
          <div className="mt-8 space-y-3 border-t border-line pt-6 text-[0.875rem] text-muted">
            {supabase && !signupOpen() ? (
              <p>
                ¿Aún no tenéis cuenta?{" "}
                <Link href="/#pedir" className={linkClass}>
                  Pedid vuestra invitación
                </Link>{" "}
                y os la preparamos.
              </p>
            ) : null}
            <p>
              ¿Queréis echar un vistazo antes?{" "}
              <Link href="/panel/demo" className={linkClass}>
                Ver el panel de ejemplo
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
