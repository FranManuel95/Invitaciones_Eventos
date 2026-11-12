"use client";

import { clsx } from "clsx";
import { PenLine } from "lucide-react";
import { useEffect, useId, useState, useTransition } from "react";
import { signGuestbook } from "@/app/actions/guestbook";
import { Button } from "@/components/ui/button";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { hostNames } from "@/lib/event-kind";
import {
  addOwnMessage,
  cleanMessage,
  GUESTBOOK_MAX_LENGTH,
  GUESTBOOK_MAX_PER_GROUP,
  messageError,
  type GuestbookState,
} from "@/lib/guestbook";

/** En la demo y la vista previa los mensajes propios se recuerdan en este navegador. */
const demoKey = (token: string) => `invitacion:${token}:firmas`;

function readDemoMine(token: string): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(demoKey(token)) ?? "[]");
    return Array.isArray(raw)
      ? raw.filter((v): v is string => typeof v === "string").slice(0, GUESTBOOK_MAX_PER_GROUP)
      : [];
  } catch {
    return [];
  }
}

const dayFormat = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long" });

/**
 * Libro de firmas: unas palabras para los anfitriones a la vista de todos los invitados. Cada
 * mensaje es una nota de papel, algo torcida; en el móvil se pasan de lado con el dedo. Solo se
 * muestra si la pareja lo ha activado; los mensajes los modera ella desde el panel.
 */
export function GuestbookSection({
  event,
  group,
  live,
  initial,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  /** Invitación real: los mensajes se guardan en el servidor. */
  live: boolean;
  initial: GuestbookState;
}) {
  const [state, setState] = useState(initial);
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();
  const fieldId = useId();
  const noticeId = useId();

  // Demo: se recuperan los mensajes dejados antes en este navegador.
  useEffect(() => {
    if (live) return;
    const mine = readDemoMine(group.token);
    if (!mine.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el navegador
    setState((s) =>
      mine.reduceRight((acc, body, i) => {
        const at = new Date(Date.now() - i * 1000);
        return addOwnMessage(acc, group.displayName, body, at);
      }, s),
    );
  }, [live, group.token, group.displayName]);

  const mine = state.messages.filter((m) => m.mine).length;
  const full = mine >= GUESTBOOK_MAX_PER_GROUP;
  const left = GUESTBOOK_MAX_LENGTH - cleanMessage(text).length;

  const sign = () => {
    const error = messageError(text, state);
    if (error) {
      setFailed(true);
      setNotice(error);
      return;
    }
    const done = "Gracias. Vuestro mensaje ya está en el libro.";
    if (!live) {
      const next = addOwnMessage(state, group.displayName, text, new Date());
      setState(next);
      try {
        window.localStorage.setItem(
          demoKey(group.token),
          JSON.stringify(next.messages.filter((m) => m.mine).map((m) => m.body)),
        );
      } catch {
        // Si el navegador no deja guardar, el mensaje dura lo que dure la página.
      }
      setText("");
      setFailed(false);
      setNotice(done);
      return;
    }
    start(async () => {
      const result = await signGuestbook(group.token, text);
      if (result.ok) {
        setState(result.state);
        setText("");
        setFailed(false);
        setNotice(done);
      } else {
        setFailed(true);
        setNotice(result.error);
      }
    });
  };

  return (
    <section aria-labelledby="firmas-title" className="overflow-hidden bg-paper">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24">
        <span data-view aria-hidden className="title-rule mb-5 block h-px bg-gold" />
        <h2
          id="firmas-title"
          className="reveal-title font-display text-[2.5rem] leading-[1.05] text-ink sm:text-[3rem]"
        >
          Libro de firmas
        </h2>
        <p className="mt-3 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-soft">
          Unas palabras para {hostNames(event.couple, " y ")}. Las verán ellos y el resto de
          invitados.
        </p>

        {state.messages.length ? (
          <ul
            tabIndex={0}
            aria-label="Mensajes del libro de firmas"
            className="relative mt-8 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pt-3 pb-5 max-sm:-mx-6 max-sm:px-6 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3"
          >
            {state.messages.map((message, i) => (
              <li
                key={message.id}
                data-view
                className={clsx(
                  "tag-in note-lines relative flex shrink-0 snap-center flex-col border border-line bg-ivory px-5 pt-6 pb-5 shadow-[0_14px_28px_-18px_rgb(0_0_0/0.45)] max-sm:w-[80%]",
                  message.mine && "ring-1 ring-gold",
                )}
                style={{ rotate: `${[-1.2, 0.8, -0.5, 1.4, -0.9][i % 5]}deg` }}
              >
                <p className="font-display text-[1.25rem] leading-[1.75rem] text-ink italic">
                  {message.body}
                </p>
                <p className="mt-auto pt-5 text-right text-[0.9375rem] text-ink-soft">
                  <span className="font-medium text-ink">{message.name}</span>
                  <br />
                  <time dateTime={message.createdAt} className="text-[0.8125rem] text-muted">
                    {message.mine ? "Vuestro mensaje, " : ""}
                    {dayFormat.format(new Date(message.createdAt))}
                  </time>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 font-display text-[1.375rem] text-ink-soft italic">
            Nadie ha firmado todavía. Estrenad el libro.
          </p>
        )}

        {full ? (
          <p className="mt-6 text-[0.9375rem] text-muted">
            Ya habéis dejado {GUESTBOOK_MAX_PER_GROUP} mensajes. ¡Gracias!
          </p>
        ) : (
          <form
            className="mt-8 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              sign();
            }}
          >
            <label htmlFor={fieldId} className="text-[0.9375rem] font-medium text-ink">
              Vuestro mensaje
            </label>
            <textarea
              id={fieldId}
              rows={4}
              value={text}
              maxLength={GUESTBOOK_MAX_LENGTH + 40}
              aria-describedby={noticeId}
              aria-invalid={failed || undefined}
              onChange={(e) => {
                setText(e.target.value);
                if (failed) {
                  setFailed(false);
                  setNotice("");
                }
              }}
              placeholder="Escribid aquí…"
              className="note-lines mt-2 block w-full resize-none rounded-[3px] border border-ink/25 bg-ivory px-4 py-[0.4375rem] font-display text-[1.25rem] leading-[1.75rem] text-ink italic placeholder:text-muted focus:border-ink focus:outline-none"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <Button type="submit" size="lg" disabled={pending}>
                <PenLine aria-hidden className="size-4" />
                {pending ? "Guardando…" : "Firmar el libro"}
              </Button>
              <p
                className={clsx(
                  "text-[0.8125rem] tabular-nums",
                  left < 0 ? "text-danger" : "text-muted",
                )}
              >
                {left < 60 ? `Quedan ${left} caracteres` : `Firmáis como ${group.displayName}`}
              </p>
            </div>
            <p
              id={noticeId}
              role="status"
              className={clsx(
                "mt-2 min-h-5 text-[0.875rem]",
                failed ? "text-danger" : "text-success",
              )}
            >
              {notice}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
