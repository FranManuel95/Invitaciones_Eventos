"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import type { WeddingEvent } from "@/lib/domain/types";

/* Piezas comunes de las portadas de concepto: las props, las letras, las fechas y el botón de abrir. */

export interface ConceptProps {
  event: WeddingEvent;
  /** A quién va dirigida («Familia García»); en la vista previa puede faltar. */
  guestName?: string;
  /** Abre la invitación (la portada se levanta). */
  onOpen: () => void;
  reduce: boolean;
}

export const PLAYFAIR = "var(--font-playfair), 'Playfair Display', Georgia, serif";
export const SANS = "var(--font-jost), Jost, Futura, system-ui, sans-serif";
export const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
export const FRAUNCES = "var(--font-fraunces), Fraunces, Georgia, serif";
export const COURIER =
  "var(--font-courier), 'Courier Prime', 'Courier New', ui-monospace, monospace";
export const SCRIPT = "var(--font-pinyon), 'Pinyon Script', 'Snell Roundhand', cursive";

export const madrid = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", ...options });
/** dd, MM y aa de la fecha del evento, en hora peninsular. */
export function dateParts(iso: string) {
  const parts = madrid({ day: "2-digit", month: "2-digit", year: "2-digit" }).formatToParts(
    new Date(iso),
  );
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { dd: get("day"), mm: get("month"), yy: get("year") };
}

export function OpenHint({ onOpen, children }: { onOpen: () => void; children?: ReactNode }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onOpen}
      className="group mx-auto flex flex-col items-center gap-1 rounded-full px-6 py-2 transition-opacity hover:opacity-80"
      style={{ fontFamily: SANS }}
    >
      {children}
      <span className="text-[0.9375rem]">Desliza o toca para abrir</span>
      <ChevronDown aria-hidden className="nudge size-5" />
    </button>
  );
}

/** Año de la fecha del evento, en hora peninsular. */
export const yearOf = (iso: string) => madrid({ year: "numeric" }).format(new Date(iso));

/** Número romano (para años y arcanos). */
export function roman(value: number) {
  const table: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let rest = Math.max(0, Math.floor(value));
  let out = "";
  for (const [n, symbol] of table) {
    while (rest >= n) {
      out += symbol;
      rest -= n;
    }
  }
  return out;
}

/** Botón que hace la acción propia del objeto y abre la invitación. */
export function ActionButton({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className={`mx-auto flex flex-col items-center gap-0.5 rounded-full px-6 py-2 ${className}`}
      style={{ fontFamily: SANS }}
    >
      <span className="text-[1rem] font-medium">{label}</span>
      <span className="text-[0.8125rem]">Desliza o toca para abrir</span>
      <ChevronDown aria-hidden className="nudge size-5" />
    </button>
  );
}
