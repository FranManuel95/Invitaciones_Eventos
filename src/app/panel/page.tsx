import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Monogram } from "@/features/invitation/ornaments";
import { listMyEvents } from "@/lib/data/repository";
import { formatLongDate } from "@/lib/format";
import { createSessionClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { CreateEventForm } from "./create-event-form";

export const metadata: Metadata = { title: "Mis eventos" };

export default async function MyEventsPage() {
  const supabase = await createSessionClient();
  // Sin Supabase (modo demostración) solo existe el panel de ejemplo.
  if (!supabase) redirect("/panel/demo");
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar");
  const events = await listMyEvents();

  return (
    <main className="min-h-dvh bg-ivory">
      <header className="border-b border-line bg-paper/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <span className="flex items-center gap-2.5">
            <Monogram first="I" second="E" className="size-8 text-gold" />
            <span className="font-display text-xl text-ink">Mis eventos</span>
          </span>
          <form action={signOut} className="flex items-center gap-4 text-[0.875rem]">
            <span className="hidden text-muted sm:inline">{data.user.email}</span>
            <button type="submit" className="text-ink underline decoration-gold underline-offset-4">
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-display text-[2.5rem] leading-tight text-ink">Vuestras invitaciones</h1>
        {events.length ? (
          <ul className="mt-6 border-t border-line">
            {events.map((e) => (
              <li key={e.id} className="border-b border-line">
                <Link
                  href={`/panel/${e.id}`}
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span>
                    <span className="block font-display text-[1.625rem] leading-tight text-ink">
                      {e.couple}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] text-muted">
                      {e.date ? formatLongDate(e.date) : "Sin fecha"} ·{" "}
                      {e.status === "published" ? "Publicada" : "Borrador"}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 text-ink-soft transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[1rem] text-ink-soft">
            Todavía no tenéis ninguna. Empezad aquí: en un minuto tendréis una invitación de ejemplo
            para personalizar.
          </p>
        )}

        <section
          aria-labelledby="nueva"
          className="mt-12 rounded-md border border-line bg-paper p-6"
        >
          <h2 id="nueva" className="font-display text-[1.75rem] text-ink">
            Nueva invitación
          </h2>
          <p className="mt-1 mb-6 text-[0.9375rem] text-muted">
            Parte de la plantilla de ejemplo; después podréis cambiar textos, estilo y fotos.
          </p>
          <CreateEventForm />
        </section>
      </div>
    </main>
  );
}
