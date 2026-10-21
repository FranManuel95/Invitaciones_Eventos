"use client";

import { m } from "motion/react";

const DIGITS = "0123456789";

/**
 * Año con dígitos que giran como un contador mecánico, desde el año del momento anterior
 * hasta el actual, al entrar en pantalla. Si el valor no es un número («Hoy») se muestra tal cual.
 */
export function RollingYear({ value, from }: { value: string; from?: string }) {
  if (!/^\d+$/.test(value)) return <>{value}</>;
  const start = from && /^\d+$/.test(from) && from.length === value.length ? from : value;
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex">
        {Array.from(value).map((digit, i) => (
          <span key={i} className="inline-block h-[1em] overflow-hidden">
            <m.span
              className="flex flex-col"
              initial={{ y: `${-Number(start[i])}em` }}
              whileInView={{ y: `${-Number(digit)}em` }}
              // La tira mide 10 dígitos y casi toda está oculta: basta con que asome.
              viewport={{ once: true, amount: 0.05, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 1.3, delay: 0.12 * i, ease: [0.65, 0, 0.35, 1] }}
            >
              {Array.from(DIGITS).map((d) => (
                <span key={d} className="block h-[1em]">
                  {d}
                </span>
              ))}
            </m.span>
          </span>
        ))}
      </span>
    </>
  );
}
