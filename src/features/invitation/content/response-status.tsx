"use client";

import { CircleCheck, CircleDashed, CircleX } from "lucide-react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatLongDate } from "@/lib/format";
import { isDeadlinePassed } from "@/lib/rsvp/draft";
import { describeTransport } from "@/lib/rsvp/summary";
import { useSavedResponse } from "../rsvp/use-saved-response";

const link =
  "text-ink underline decoration-gold underline-offset-4 transition-colors hover:decoration-ink";

/** Barra «tu respuesta» bajo la cabecera: estado del RSVP y del autobús de un vistazo. */
export function ResponseStatus({ event, group }: { event: WeddingEvent; group: GuestGroup }) {
  const saved = useSavedResponse(group.token);
  const closed = isDeadlinePassed(event, group);

  if (!saved) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem]">
        <CircleDashed aria-hidden className="size-5 text-warning" />
        <p className="text-ink-soft">
          {closed
            ? "No llegaste a confirmar y el plazo ha terminado."
            : `Aún no has confirmado. Tienes hasta el ${formatLongDate(event.rsvpDeadline)}.`}
        </p>
        {closed ? null : (
          <a href="#confirmar" className={link}>
            Confirmar ahora
          </a>
        )}
      </div>
    );
  }

  if (saved.status === "declined") {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem]">
        <CircleX aria-hidden className="size-5 text-danger" />
        <p className="text-ink-soft">Nos dijiste que no podréis venir. Os echaremos de menos.</p>
        {closed ? null : (
          <a href="#confirmar" className={link}>
            Cambiar respuesta
          </a>
        )}
      </div>
    );
  }

  const transport = describeTransport(saved, event);
  return (
    <div className="grid gap-3 text-[0.9375rem] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-x-4">
      <CircleCheck aria-hidden className="size-5 text-success" />
      <div>
        <p className="font-medium text-ink">
          Confirmado: {saved.attendees.length}{" "}
          {saved.attendees.length === 1 ? "persona" : "personas"}
        </p>
        <p className="text-ink-soft">
          Autobús: <strong className="font-semibold text-ink">{transport.answer}</strong>.{" "}
          {transport.detail}
        </p>
      </div>
      <div className="flex gap-4">
        <a href="#pase" className={link}>
          Ver tu pase
        </a>
        {closed ? null : (
          <a href="#confirmar" className={link}>
            Editar
          </a>
        )}
      </div>
    </div>
  );
}
