"use client";

import { Check, MessageCircle, RotateCcw } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/fields";
import type { GuestGroup } from "@/lib/domain/types";
import {
  DEFAULT_REMINDER,
  fillTemplate,
  invitationUrl,
  plural,
  whatsappUrl,
} from "@/lib/guests/share";

const noopSubscribe = () => () => {};

// Preferencias del recordatorio guardadas en este navegador (sin datos de invitados). Si no hay
// almacenamiento (modo privado), se guardan en memoria mientras dure la página.
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function useStored<T>(key: string, initial: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const value = useMemo(() => {
    if (!raw) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }, [raw, initial]);
  const update = (next: T) => {
    const json = JSON.stringify(next);
    memory.set(key, json);
    try {
      window.localStorage.setItem(key, json);
    } catch {
      // Sin almacenamiento: vale la copia en memoria.
    }
    listeners.forEach((l) => l());
  };
  return [value, update] as const;
}

const NO_SENT: string[] = [];

/**
 * Recordatorios a quien no ha respondido: un texto común con huecos y un botón de WhatsApp por
 * invitación. Se marca en este navegador a quién se le ha escrito ya, para no repetir.
 */
export function Reminders({
  eventKey,
  groups,
  couple,
  deadline,
}: {
  eventKey: string;
  /** Invitaciones sin respuesta. */
  groups: GuestGroup[];
  couple: string;
  /** Plazo ya escrito («15 de abril de 2027»). */
  deadline: string;
}) {
  const origin = useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => "",
  );
  const [template, setTemplate] = useStored(`recordatorio:${eventKey}`, DEFAULT_REMINDER);
  const [sent, setSent] = useStored<string[]>(`recordados:${eventKey}`, NO_SENT);
  const pending = groups.filter((g) => !sent.includes(g.id));

  const markSent = (id: string) => setSent(sent.includes(id) ? sent : [...sent, id]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section aria-labelledby="mensaje">
        <h2 id="mensaje" className="font-display text-[1.5rem] text-ink">
          Mensaje
        </h2>
        <label
          htmlFor="plantilla"
          className="mt-3 mb-1.5 block text-[0.875rem] font-medium text-ink"
        >
          Texto del recordatorio
        </label>
        <TextArea
          id="plantilla"
          aria-describedby="plantilla-ayuda"
          value={template}
          maxLength={800}
          rows={7}
          onChange={(e) => setTemplate(e.target.value)}
        />
        <p id="plantilla-ayuda" className="mt-1.5 text-[0.8125rem] text-muted">
          Huecos: {"{nombre}"}, {"{pareja}"}, {"{plazo}"} y {"{enlace}"}. Se rellenan para cada
          invitación.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => setTemplate(DEFAULT_REMINDER)}>
            <RotateCcw aria-hidden className="size-3.5" />
            Texto original
          </Button>
          {sent.length ? (
            <Button variant="ghost" size="sm" onClick={() => setSent([])}>
              Volver a empezar ({sent.length} ya avisadas)
            </Button>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="sin-responder">
        <h2 id="sin-responder" className="font-display text-[1.5rem] text-ink">
          Sin responder
        </h2>
        <p aria-live="polite" className="mt-1 text-[0.875rem] text-muted">
          {groups.length === 0
            ? "Han respondido todas las invitaciones."
            : `${plural(pending.length, "invitación por avisar", "invitaciones por avisar")} de ${groups.length} sin respuesta.`}
        </p>
        <ul className="mt-4 divide-y divide-line rounded-md border border-line bg-paper">
          {groups.map((g) => {
            const done = sent.includes(g.id);
            const text = fillTemplate(template, {
              nombre: g.displayName,
              pareja: couple,
              plazo: deadline,
              enlace: invitationUrl(origin, g.token),
            });
            return (
              <li
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{g.displayName}</p>
                  <p className="text-[0.8125rem] text-muted">
                    {g.phone ? g.phone : "Sin teléfono: WhatsApp te dejará elegir el chat"}
                  </p>
                </div>
                {done ? (
                  <span className="inline-flex items-center gap-1 text-[0.8125rem] text-success">
                    <Check aria-hidden className="size-3.5" />
                    Avisada
                  </span>
                ) : (
                  <a
                    href={whatsappUrl(text, g.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markSent(g.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink/15 bg-paper px-3 text-[0.8125rem] text-ink transition-colors hover:border-ink/40"
                  >
                    <MessageCircle aria-hidden className="size-3.5" />
                    Recordar por WhatsApp
                    <span className="sr-only">
                      {" "}
                      a {g.displayName} (se abre en una pestaña nueva)
                    </span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
