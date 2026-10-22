"use client";

import { hostNames } from "@/lib/event-kind";
import { Check, Lock } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
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
import { PhotoSlot } from "../content/photo-slot";
import { Petals } from "../effects/petals";
import { GuestPass } from "./guest-pass";
import { ResponseDetails } from "./rsvp-summary";
import { useSavedResponse } from "./use-saved-response";

type View = "intro" | "form" | "done";

export function RsvpSection({ event, group }: { event: WeddingEvent; group: GuestGroup }) {
  // La respuesta guardada es compartida con la cabecera y el pase (misma fuente de datos).
  const saved = useSavedResponse(group.token);
  const [editing, setEditing] = useState(false);
  const view: View = editing ? "form" : saved ? "done" : "intro";
  const [form, setForm] = useState<{ draft: RsvpDraft; step: RsvpStep } | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  // Cada confirmación de asistencia lanza una lluvia de pétalos (la clave la reinicia).
  const [celebration, setCelebration] = useState(0);
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
    setEditing(true);
  };

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
      {celebration ? <Petals key={celebration} quick /> : null}
      <div className="max-w-xl">
        {saved?.status === "attending" && !editing ? (
          <div className="mb-8">
            <GuestPass event={event} group={group} response={saved} />
          </div>
        ) : null}
        <div className="paper-grain overflow-hidden rounded-[3px] border border-line bg-paper px-5 py-8 shadow-[var(--shadow-paper)] sm:px-10 sm:py-10">
          {view === "intro" && !closed && event.banquetPhoto ? (
            <PhotoSlot
              src={event.banquetPhoto}
              alt=""
              ratio="3/2"
              sizes="(min-width: 640px) 576px, 100vw"
              className="-mx-5 -mt-8 mb-8 rounded-none sm:-mx-10 sm:-mt-10"
            />
          ) : null}
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
                    cambiar algo, escribe directamente a {hostNames(event.couple, " o ")}.
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
                  onCancel={() => setEditing(false)}
                  onSaved={(response) => {
                    setJustSaved(true);
                    if (response.status === "attending") setCelebration((n) => n + 1);
                    setEditing(false);
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
                  {saved.status === "attending" ? (
                    <details className="group mt-6 border-t border-line pt-4">
                      <summary className="cursor-pointer list-none text-[0.9375rem] text-ink underline decoration-gold underline-offset-4 [&::-webkit-details-marker]:hidden">
                        Ver la respuesta completa
                      </summary>
                      <div className="mt-2">
                        <ResponseDetails event={event} response={saved} />
                      </div>
                    </details>
                  ) : (
                    <div className="mt-4">
                      <ResponseDetails event={event} response={saved} />
                    </div>
                  )}
                  <div className="mt-6">
                    {closed ? (
                      <p className="text-center text-sm text-muted">
                        El plazo para cambiar la respuesta ha terminado.
                      </p>
                    ) : (
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full"
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
