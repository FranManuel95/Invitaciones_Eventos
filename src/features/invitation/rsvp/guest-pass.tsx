"use client";

import { Printer, Share2 } from "lucide-react";
import { QrCode } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import { MENU_LABELS } from "@/lib/domain/catalog";
import type { GuestGroup, MenuId, RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import { formatWeekdayDate } from "@/lib/format";
import { describeTransport } from "@/lib/rsvp/summary";
import { FoilMonogram } from "../effects/foil";

function menuSummary(response: RsvpResponse) {
  const counts = new Map<MenuId, number>();
  for (const a of response.attendees) if (a.menu) counts.set(a.menu, (counts.get(a.menu) ?? 0) + 1);
  return [...counts].map(([menu, n]) => `${n} ${MENU_LABELS[menu].toLowerCase()}`).join(", ");
}

/**
 * Pase personal tras confirmar: lo que el invitado necesita el día de la boda, en una pieza
 * que se puede guardar, compartir o imprimir. El QR es de demostración (no se valida en ningún sitio).
 */
export function GuestPass({
  event,
  group,
  response,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  response: RsvpResponse;
}) {
  const transport = describeTransport(response, event);
  const ceremony = event.program[0];
  const code = `INV-${group.token.toUpperCase()}-${response.updatedAt.slice(0, 10).replaceAll("-", "")}`;
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  const share = () => {
    void navigator
      .share({
        title: `Boda de ${event.couple.first} y ${event.couple.second}`,
        text: `Nuestro pase para la boda de ${event.couple.first} y ${event.couple.second}.`,
        url: window.location.href,
      })
      .catch(() => {});
  };

  return (
    <div id="pase" className="print-area scroll-mt-24">
      <article
        aria-labelledby="pase-title"
        className="paper-grain relative overflow-hidden rounded-[4px] border border-line bg-paper shadow-[var(--shadow-paper)] sm:grid sm:grid-cols-[minmax(0,1fr)_11rem]"
      >
        {/* Franja holográfica, como la de una entrada auténtica: sus colores se desplazan. */}
        <span aria-hidden className="holo absolute inset-x-0 top-0 h-1.5 sm:col-span-2" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <FoilMonogram
              first={event.couple.first}
              second={event.couple.second}
              className="size-10 text-[2.5rem]"
            />
            <div>
              <h3 id="pase-title" className="font-display text-[1.5rem] leading-tight text-ink">
                Pase de {group.displayName}
              </h3>
              <p className="caption text-ink-soft">
                {formatWeekdayDate(event.date)}
                {ceremony ? `, ${ceremony.time}` : ""}
              </p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-[0.9375rem]">
            <div className="col-span-2">
              <dt className="text-[0.8125rem] text-muted">Asistentes</dt>
              <dd className="text-ink">{response.attendees.map((a) => a.name).join(", ")}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Menús</dt>
              <dd className="text-ink">{menuSummary(response)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-muted">Mesa</dt>
              <dd className="text-ink">{group.tableName ?? "Se asignará pronto"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[0.8125rem] text-muted">Autobús</dt>
              <dd className="text-ink">
                <strong className="font-semibold">{transport.answer}</strong>. {transport.detail}
              </dd>
            </div>
          </dl>
        </div>

        {/* Talón con perforado: línea discontinua y muescas como en un billete */}
        <div className="relative flex flex-col items-center justify-center gap-2 border-t border-dashed border-ink/25 px-6 py-6 sm:border-t-0 sm:border-l">
          <span
            aria-hidden
            className="absolute -top-3 -left-3 size-6 rounded-full bg-ivory sm:-top-3 sm:-left-3"
          />
          <span
            aria-hidden
            className="absolute -top-3 -right-3 size-6 rounded-full bg-ivory sm:top-auto sm:right-auto sm:-bottom-3 sm:-left-3"
          />
          <QrCode
            value={code}
            label={`Código QR de demostración ${code}`}
            className="size-28"
          />
          <p className="font-mono text-[0.6875rem] tracking-wide text-muted" translate="no">
            {code}
          </p>
          <p className="text-center text-[0.75rem] text-muted">Código de demostración</p>
        </div>
      </article>

      <div className="no-print mt-4 flex flex-wrap gap-3">
        {canShare ? (
          <Button variant="secondary" onClick={share}>
            <Share2 aria-hidden className="size-4" /> Compartir el pase
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer aria-hidden className="size-4" /> Imprimir o guardar en PDF
        </Button>
      </div>
    </div>
  );
}
