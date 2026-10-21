"use client";

import { CalendarPlus, Check, Lock } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { buildIcs } from "@/lib/calendar";
import { loadResponse } from "@/lib/data/rsvp-store";
import type { GuestGroup, RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import {
  createDraft,
  isDeadlinePassed,
  stepsFor,
  type RsvpDraft,
  type RsvpStep,
} from "@/lib/rsvp/draft";
import { formatLongDate } from "@/lib/format";
import { Section } from "../content/sections";
import { RsvpForm } from "./rsvp-form";
import { ResponseDetails } from "./rsvp-summary";

type View = "intro" | "form" | "done";

export function RsvpSection({ event, group }: { event: WeddingEvent; group: GuestGroup }) {
  // Este componente solo se monta en el cliente (tras abrir la invitación), así que puede leer
  // el almacenamiento local en el estado inicial.
  const [saved, setSaved] = useState<RsvpResponse | null>(() => loadResponse(group.token));
  const [view, setView] = useState<View>(() => (saved ? "done" : "intro"));
  const [form, setForm] = useState<{ draft: RsvpDraft; step: RsvpStep } | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const closed = isDeadlinePassed(event, group);

  useEffect(() => {
    if (view === "done" && justSaved) doneRef.current?.focus();
  }, [view, justSaved]);

  const start = (status?: "attending" | "declined") => {
    const draft = createDraft(group, saved);
    if (status) draft.status = status;
    // Si ya eligió "sí" o "no" en la tarjeta, empieza directamente en el segundo paso.
    const step = status ? (stepsFor(draft, event, group)[1] ?? "attendance") : "attendance";
    setForm({ draft, step });
    setView("form");
  };

  const calendarHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event))}`;

  return (
    <Section
      id="confirmar"
      title="Confirma tu asistencia"
      aside={
        closed ? undefined : (
          <>
            Puedes responder o cambiar tu respuesta hasta el{" "}
            <strong className="font-medium text-ink">{formatLongDate(event.rsvpDeadline)}</strong>.
          </>
        )
      }
    >
      <div className="max-w-xl">
        <div className="paper-grain rounded-[3px] border border-line bg-paper px-5 py-8 shadow-[var(--shadow-paper)] sm:px-10 sm:py-10">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={view}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {view === "intro" && closed ? (
                <div className="text-center">
                  <Lock aria-hidden className="mx-auto size-6 text-ink-soft" strokeWidth={1.5} />
                  <h3 className="mt-4 font-display text-3xl text-ink">El plazo ha terminado</h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
                    La confirmación se cerró el {formatLongDate(event.rsvpDeadline)}. Si necesitas
                    cambiar algo, escribe directamente a {event.couple.first} o{" "}
                    {event.couple.second}.
                  </p>
                </div>
              ) : null}

              {view === "intro" && !closed ? (
                <div className="text-center">
                  <p className="font-display text-[1.75rem] text-ink">
                    {group.members.length > 1 ? "¿Venís?" : "¿Vienes?"}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {group.maxAttendees === 1
                      ? "Tu invitación es individual."
                      : `Tu invitación incluye ${group.maxAttendees} plazas.`}
                  </p>
                  <div className="mt-7 grid gap-3">
                    <Button size="lg" onClick={() => start("attending")}>
                      Sí, asistiré
                    </Button>
                    <Button size="lg" variant="secondary" onClick={() => start("declined")}>
                      No podré asistir
                    </Button>
                  </div>
                </div>
              ) : null}

              {view === "form" && form ? (
                <RsvpForm
                  event={event}
                  group={group}
                  initialDraft={form.draft}
                  initialStep={form.step}
                  onCancel={() => setView(saved ? "done" : "intro")}
                  onSaved={(response) => {
                    setSaved(response);
                    setJustSaved(true);
                    setView("done");
                  }}
                />
              ) : null}

              {view === "done" && saved ? (
                <div>
                  <div className="text-center">
                    <m.span
                      initial={justSaved ? { scale: 0.4, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                      className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-paper"
                    >
                      <Check aria-hidden className="size-6" strokeWidth={2} />
                    </m.span>
                    <h3
                      ref={doneRef}
                      tabIndex={-1}
                      className="mt-5 font-display text-[2rem] leading-tight text-ink outline-none"
                    >
                      {saved.status === "attending"
                        ? "¡Qué ilusión! Gracias por confirmar"
                        : "Gracias por avisarnos"}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      Respuesta guardada el{" "}
                      {new Intl.DateTimeFormat("es-ES", {
                        dateStyle: "long",
                        timeStyle: "short",
                      }).format(new Date(saved.updatedAt))}
                      <span className="sr-only"> (demo: solo en este navegador)</span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <ResponseDetails event={event} response={saved} />
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {saved.status === "attending" ? (
                      <a
                        href={calendarHref}
                        download="boda.ics"
                        className={buttonClasses("secondary", "lg")}
                      >
                        <CalendarPlus aria-hidden className="size-4" /> Añadir al calendario
                      </a>
                    ) : null}
                    {closed ? (
                      <p className="text-center text-sm text-muted sm:col-span-2">
                        El plazo para cambiar la respuesta ha terminado.
                      </p>
                    ) : (
                      <Button
                        variant={saved.status === "attending" ? "primary" : "secondary"}
                        size="lg"
                        className={saved.status === "attending" ? "" : "sm:col-span-2"}
                        onClick={() => start()}
                      >
                        Editar respuesta
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
