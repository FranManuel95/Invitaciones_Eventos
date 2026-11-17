import { ArrowRight, Copy } from "lucide-react";
import Link from "next/link";
import type { EventSummary } from "@/lib/data/repository";
import { formatLongDate } from "@/lib/format";
import { duplicateEvent, signOut } from "./actions";
import { CreateEventForm } from "./create-event-form";

const STATUS = {
  draft: { label: "Borrador sin publicar", dot: "bg-gold" },
  save_the_date: { label: "Save the date publicado", dot: "bg-success" },
  invitacion: { label: "Invitación publicada", dot: "bg-success" },
};

/** «Mis eventos»: los eventos de la cuenta y el alta de uno nuevo. */
export function MyEvents({
  email,
  events,
  minDate,
}: {
  email: string | undefined;
  events: Pick<EventSummary, "id" | "couple" | "date" | "status" | "phase">[];
  minDate: string;
}) {
  const first = events.length === 0;

  return (
    <div className="panel min-h-dvh">
      <header className="panel-dark pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/panel" className="text-[0.875rem] text-muted">
            <span className="panel-title text-[1.5rem] text-ink">eFeLe</span> Invitaciones
          </Link>
          <form action={signOut} className="flex min-w-0 items-center gap-4 text-[0.875rem]">
            {email ? <span className="hidden truncate text-muted sm:inline">{email}</span> : null}
            <button
              type="submit"
              className="inline-flex h-11 items-center text-ink underline decoration-gold underline-offset-4"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-5xl px-4 pt-10 pb-16 sm:px-6 lg:pt-14">
        <h1 className="panel-title text-[2.75rem] leading-none text-ink sm:text-[3.5rem]">
          Vuestras invitaciones
        </h1>
        <p className="mt-3 max-w-[60ch] text-[1rem] leading-relaxed text-ink-soft">
          {first
            ? "Aún no tenéis ninguna. Contadnos qué celebráis, quién y cuándo, y os preparamos una invitación de ejemplo con vuestros nombres para personalizar."
            : "Entrad en cada una para seguir las respuestas, o cread otra para otro evento."}
        </p>

        {first ? null : (
          <ul className="mt-8 space-y-3">
            {events.map((e) => {
              const status = STATUS[e.status === "draft" ? "draft" : e.phase];
              return (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-paper py-2 pr-3 pl-5 shadow-[var(--shadow-paper)] sm:flex-nowrap"
                >
                  <Link
                    href={`/panel/${e.id}`}
                    className="group flex min-w-0 flex-1 basis-full items-center justify-between gap-4 py-3 sm:basis-auto"
                  >
                    <span className="min-w-0">
                      <span
                        translate="no"
                        className="panel-title block truncate text-[1.875rem] leading-tight text-ink"
                      >
                        {e.couple}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.875rem] text-muted">
                        <span>{e.date ? formatLongDate(e.date) : "Sin fecha"}</span>
                        <span className="flex items-center gap-1.5">
                          <span aria-hidden className={`size-2 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-[0.875rem] text-ink">
                      <span className="hidden sm:inline">Abrir el panel</span>
                      <ArrowRight
                        aria-hidden
                        className="size-5 text-gold transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                  <form action={duplicateEvent} className="-mt-2 sm:mt-0">
                    <input type="hidden" name="eventId" value={e.id} />
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-[0.875rem] text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                    >
                      <Copy aria-hidden className="size-4" />
                      Duplicar<span className="sr-only"> {e.couple}</span>
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}

        <section
          aria-labelledby="nueva"
          className={`rounded-2xl border border-line bg-paper px-5 py-7 shadow-[var(--shadow-paper)] sm:px-8 ${first ? "mt-8" : "mt-14"}`}
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
            <div>
              <h2 id="nueva" className="panel-title text-[2rem] leading-none text-ink">
                {first ? "Vuestra primera invitación" : "Nueva invitación"}
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                Parte de una invitación de ejemplo. Después, en el panel, una guía os lleva paso a
                paso: la plantilla, vuestras fotos y textos, las invitaciones y publicar.
              </p>
            </div>
            <CreateEventForm minDate={minDate} />
          </div>
        </section>
      </main>
    </div>
  );
}
