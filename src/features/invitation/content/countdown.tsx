"use client";

import { useState } from "react";

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
