"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { publishEvent } from "../actions";

const TITLES = {
  draft: "Borrador sin publicar",
  save_the_date: "Save the date publicado",
  invitacion: "Invitación publicada",
};

const DESCRIPTIONS = {
  draft:
    "Publica para que los enlaces de los invitados funcionen. Puedes empezar por un save the date: solo la fecha y el calendario, sin confirmación.",
  save_the_date:
    "Los invitados ven el aviso con la fecha. Cuando tengáis todo listo, publicad la invitación completa: el enlace es el mismo.",
  invitacion:
    "Los invitados ven la última versión publicada. Vuelve a publicar tras hacer cambios.",
};

/**
 * Estado del evento real: borrador, save the date o invitación publicada, con los botones de
 * publicar y los enlaces personales de cada invitación (para copiar o abrir).
 */
export function PublishBar({
  eventId,
  status,
  phase,
  links,
}: {
  eventId: string;
  status: "draft" | "published";
  phase: "save_the_date" | "invitacion";
  links: { name: string; token: string }[];
}) {
  const state = status === "draft" ? "draft" : phase;
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const publish = (next: "save_the_date" | "invitacion") =>
    start(async () => {
      const result = await publishEvent(eventId, next);
      setError(result.error);
    });

  return (
    <section
      aria-labelledby="publicacion"
      className="mb-8 rounded-md border border-line bg-paper p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="publicacion" className="font-display text-[1.5rem] text-ink">
            {TITLES[state]}
          </h2>
          <p className="mt-1 max-w-[60ch] text-[0.9375rem] text-muted">{DESCRIPTIONS[state]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {state === "invitacion" ? null : (
            <Button variant="secondary" disabled={pending} onClick={() => publish("save_the_date")}>
              {state === "save_the_date" ? "Actualizar save the date" : "Publicar save the date"}
            </Button>
          )}
          <Button disabled={pending} onClick={() => publish("invitacion")}>
            {pending
              ? "Publicando…"
              : state === "invitacion"
                ? "Volver a publicar"
                : "Publicar invitación completa"}
          </Button>
        </div>
      </div>
      <p role="status" aria-live="polite" className="text-[0.875rem] text-danger">
        {error}
      </p>
      {links.length ? (
        <details className="mt-4 border-t border-line pt-4">
          <summary className="cursor-pointer text-[0.9375rem] text-ink underline decoration-gold underline-offset-4">
            Enlaces de las invitaciones ({links.length})
          </summary>
          <ul className="mt-3 divide-y divide-line">
            {links.map((l) => {
              const url = `${origin}/i/${l.token}`;
              return (
                <li
                  key={l.token}
                  className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                >
                  <span className="text-[0.9375rem] text-ink">{l.name}</span>
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(url).then(() => setCopied(l.token));
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-3 text-[0.8125rem] text-ink hover:border-ink"
                    >
                      {copied === l.token ? (
                        <Check aria-hidden className="size-3.5" />
                      ) : (
                        <Copy aria-hidden className="size-3.5" />
                      )}
                      {copied === l.token ? "Copiado" : "Copiar enlace"}
                      <span className="sr-only"> de {l.name}</span>
                    </button>
                    <a
                      href={`/i/${l.token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[0.8125rem] text-ink-soft hover:text-ink"
                    >
                      <ExternalLink aria-hidden className="size-3.5" />
                      Abrir
                      <span className="sr-only"> la invitación de {l.name} (pestaña nueva)</span>
                    </a>
                  </span>
                </li>
              );
            })}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
