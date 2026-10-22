"use client";

import { clsx } from "clsx";
import { Check, Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { claimGift } from "@/app/actions/gifts";
import { Button } from "@/components/ui/button";
import type { GiftItem, WeddingEvent } from "@/lib/domain/types";
import {
  applyClaim,
  giftState,
  othersOnShared,
  type GiftState,
  type GiftStatus,
} from "@/lib/gifts";
import { Section } from "./sections";

/** En la demo y la vista previa las reservas propias se recuerdan en este navegador. */
const demoKey = (token: string) => `invitacion:${token}:regalos`;

function readDemoMine(token: string): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(demoKey(token)) ?? "[]");
    return Array.isArray(raw) ? raw.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeDemoMine(token: string, mine: string[]) {
  try {
    window.localStorage.setItem(demoKey(token), JSON.stringify(mine));
  } catch {
    // Si el navegador no deja guardar, la reserva dura lo que dure la página.
  }
}

/**
 * Regalo: el número de cuenta (si lo hay) y la lista de regalos. Cada regalo es una etiqueta de
 * papel; al reservarlo queda sellada para el resto de invitados (salvo los compartidos, a los que
 * se puede apuntar más de una invitación).
 */
export function GiftSection({
  event,
  token,
  live,
  initial,
}: {
  event: WeddingEvent;
  token: string;
  /** Invitación real: las reservas se guardan en el servidor. */
  live: boolean;
  initial: GiftStatus;
}) {
  const items = event.gift.items ?? [];
  const [status, setStatus] = useState(initial);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [, start] = useTransition();

  // Demo: se recuperan las reservas hechas antes en este navegador.
  useEffect(() => {
    if (live) return;
    const mine = readDemoMine(token);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el navegador
    if (mine.length) setStatus((s) => mine.reduce((acc, id) => applyClaim(acc, id, true), s));
  }, [live, token]);

  const toggle = (item: GiftItem, claim: boolean) => {
    const done = claim
      ? `Gracias de corazón: ${item.title} queda a vuestro nombre.`
      : `Reserva quitada: ${item.title} vuelve a estar libre.`;
    if (!live) {
      const next = applyClaim(status, item.id, claim);
      setStatus(next);
      writeDemoMine(token, next.mine);
      setNotice(done);
      return;
    }
    setBusy(item.id);
    start(async () => {
      const r = await claimGift(token, item.id, claim);
      setBusy(null);
      if (r.ok) {
        setStatus(r.status);
        setNotice(done);
      } else {
        setNotice(r.error);
        // Si otra persona se ha adelantado, se marca como reservado sin recargar.
        if (r.error.startsWith("Ese regalo ya lo ha reservado")) {
          setStatus((s) => ({ ...s, counts: { ...s.counts, [item.id]: 1 } }));
        }
      }
    });
  };

  return (
    <Section id="regalo" title={items.length ? "Regalos" : "Regalo"}>
      <div className="max-w-2xl">
        <p className="font-display text-[1.5rem] leading-snug text-ink">{event.gift.message}</p>
        {items.length ? (
          <>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2" aria-label="Lista de regalos">
              {items.map((item, i) => (
                <GiftTag
                  key={item.id}
                  item={item}
                  index={i}
                  state={giftState(item, status)}
                  others={othersOnShared(item, status)}
                  busy={busy === item.id}
                  onToggle={(claim) => toggle(item, claim)}
                />
              ))}
            </ul>
            <p aria-live="polite" className="mt-3 min-h-5 text-[0.875rem] text-muted">
              {notice}
            </p>
          </>
        ) : null}
        {event.gift.iban.trim() ? <BankAccount event={event} titled={items.length > 0} /> : null}
      </div>
    </Section>
  );
}

function GiftTag({
  item,
  index,
  state,
  others,
  busy,
  onToggle,
}: {
  item: GiftItem;
  index: number;
  state: GiftState;
  others: number;
  busy: boolean;
  onToggle: (claim: boolean) => void;
}) {
  const taken = state === "taken";
  return (
    <li
      className={clsx(
        "paper-grain relative flex flex-col rounded-[3px] border border-line bg-paper p-5 pt-8 shadow-[0_1px_2px_rgb(35_39_30/0.06)]",
        // Las etiquetas caen ligeramente torcidas, como colgadas de su cordel.
        index % 2 ? "sm:rotate-[0.6deg]" : "sm:-rotate-[0.5deg]",
        taken && "opacity-80",
      )}
    >
      {/* Ojal y cordel de la etiqueta. */}
      <span
        aria-hidden
        className="absolute top-3 left-5 size-3 rounded-full border border-taupe bg-ivory shadow-[inset_0_1px_1px_rgb(35_39_30/0.2)]"
      />
      <span
        aria-hidden
        className="absolute -top-4 left-[1.55rem] h-7 w-px origin-bottom rotate-[18deg] bg-taupe"
      />
      {item.photo ? (
        <div className="relative mb-4 aspect-[3/2] overflow-hidden rounded-[2px] bg-cream">
          <Image
            src={item.photo}
            alt=""
            fill
            sizes="(min-width: 640px) 300px, 85vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <h3 className="font-display text-[1.375rem] leading-tight text-ink">{item.title}</h3>
      {item.detail ? (
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">{item.detail}</p>
      ) : null}
      <div className="mt-auto pt-4">
        {item.price ? <p className="text-[0.875rem] text-muted">{item.price}</p> : null}
        {item.shared && others > 0 ? (
          <p className="text-[0.875rem] text-muted">
            {others === 1
              ? "Ya se ha apuntado otra invitación."
              : `Ya se han apuntado ${others} invitaciones.`}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {taken ? (
            <span className="inline-flex -rotate-3 items-center rounded-full border-2 border-wax/70 px-3 py-1 font-display text-[1.0625rem] text-wax">
              Reservado
            </span>
          ) : state === "mine" ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-success">
                <Check aria-hidden className="size-4" />
                {item.shared ? "Apuntado a vuestro nombre" : "Reservado a vuestro nombre"}
              </span>
              <Button variant="ghost" size="sm" disabled={busy} onClick={() => onToggle(false)}>
                Deshacer<span className="sr-only">: {item.title}</span>
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" disabled={busy} onClick={() => onToggle(true)}>
              {busy ? "Guardando…" : item.shared ? "Me apunto" : "Lo regalo yo"}
              <span className="sr-only">: {item.title}</span>
            </Button>
          )}
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[0.875rem] text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
            >
              Ver en la tienda
              <ExternalLink aria-hidden className="size-3.5" />
              <span className="sr-only">(se abre en otra pestaña)</span>
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/** Número de cuenta con botón de copiar y aviso accesible al copiarlo. */
function BankAccount({ event, titled }: { event: WeddingEvent; titled: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(event.gift.iban.replaceAll(" ", ""));
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="paper-grain mt-6 max-w-xl rounded-[3px] border border-line bg-paper p-5">
      {titled ? (
        <p className="mb-3 text-[0.9375rem] text-ink-soft">
          Si preferís hacernos una transferencia:
        </p>
      ) : null}
      <p className="text-[0.8125rem] text-muted">Titular</p>
      <p className="text-ink">{event.gift.holder}</p>
      <p className="mt-3 text-[0.8125rem] text-muted">Número de cuenta (IBAN)</p>
      <p translate="no" className="font-mono text-[1.0625rem] tracking-wide text-ink">
        {event.gift.iban}
      </p>
      <Button variant="secondary" className="mt-4" onClick={copy}>
        {status === "copied" ? (
          <>
            <Check aria-hidden className="size-4" /> Copiado
          </>
        ) : (
          <>
            <Copy aria-hidden className="size-4" /> Copiar número de cuenta
          </>
        )}
      </Button>
      <p aria-live="polite" className="mt-2 min-h-5 text-[0.8125rem] text-muted">
        {status === "copied"
          ? "Número de cuenta copiado."
          : status === "error"
            ? "No se ha podido copiar. Selecciona el número y cópialo a mano."
            : ""}
      </p>
    </div>
  );
}
