"use client";

import { useEffect, useState } from "react";

function remaining(target: number, now: number) {
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
  };
}

/** Cuenta atrás hasta el evento. Se calcula solo en el cliente para evitar desajustes de hidratación. */
export function Countdown({ date }: { date: string }) {
  const target = Date.parse(date);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const parts = now === null ? null : remaining(target, now);
  const units = [
    ["días", parts?.days],
    ["horas", parts?.hours],
    ["min", parts?.minutes],
  ] as const;

  return (
    <dl
      className="flex items-start justify-center gap-6 sm:gap-10"
      aria-label="Tiempo que falta para la boda"
    >
      {units.map(([label, value]) => (
        <div key={label} className="flex min-w-14 flex-col-reverse items-center">
          <dt className="eyebrow mt-1 !text-[0.625rem] text-white/75">{label}</dt>
          <dd className="font-display text-4xl font-light text-white lining-nums tabular-nums sm:text-5xl">
            {value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
