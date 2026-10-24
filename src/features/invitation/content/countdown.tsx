"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";
import { countdownParts } from "@/lib/calendar";

const daysFormat = new Intl.NumberFormat("es-ES");

/**
 * «Faltan 213 días», en una frase en lugar de un marcador de números grandes.
 * La invitación solo se pinta en el cliente, así que puede leer la hora en el estado inicial.
 */
export function DaysLeft({ date, className }: { date: string; className?: string }) {
  const [now] = useState(() => Date.now());
  const days = Math.ceil((Date.parse(date) - now) / 86_400_000);

  if (days < 0) return null;
  return (
    <p className={className}>
      {days === 0
        ? "Es hoy."
        : days === 1
          ? "Es mañana."
          : `Faltan ${daysFormat.format(days)} días.`}
    </p>
  );
}

/** Una cifra de panel de aeropuerto: al cambiar, la nueva cae plegándose desde arriba. */
function FlipDigit({ digit }: { digit: string }) {
  return (
    <span className="relative inline-grid h-[1.5em] w-[1em] place-items-center overflow-hidden rounded-[3px] bg-ink text-paper shadow-[inset_0_-2px_0_rgb(0_0_0/0.35)] [perspective:240px]">
      <m.span
        key={digit}
        className="block"
        style={{ transformOrigin: "50% 0%" }}
        initial={{ rotateX: -95, opacity: 0.2 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.3, 1.4, 0.5, 1] }}
      >
        {digit}
      </m.span>
      {/* La ranura de las dos mitades del cartón. */}
      <span className="absolute inset-x-0 top-1/2 h-px bg-black/45" />
    </span>
  );
}

function Unit({ value, pad, label }: { value: number; pad: number; label: string }) {
  return (
    <span className="flex flex-col items-center gap-1.5">
      <span className="flex gap-[3px] font-display text-[1.75rem] leading-none tabular-nums">
        {Array.from(String(value).padStart(pad, "0")).map((d, i) => (
          <FlipDigit key={i} digit={d} />
        ))}
      </span>
      <span className="text-[0.75rem] text-muted">{label}</span>
    </span>
  );
}

/** Cuenta atrás de días, horas y minutos con cifras que se pliegan al cambiar. */
export function FlipCountdown({ date, className }: { date: string; className?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 10_000);
    return () => window.clearInterval(id);
  }, []);
  const target = Date.parse(date);
  if (target <= now) return null;
  const { days, hours, minutes } = countdownParts(target, now);
  return (
    <div className={className}>
      <p className="sr-only">
        Faltan {days} días, {hours} horas y {minutes} minutos.
      </p>
      <div aria-hidden className="flex items-start gap-4">
        <Unit value={days} pad={days > 99 ? 3 : 2} label="días" />
        <Unit value={hours} pad={2} label="horas" />
        <Unit value={minutes} pad={2} label="minutos" />
      </div>
    </div>
  );
}
