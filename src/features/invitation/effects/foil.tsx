"use client";

import { m, useMotionValue, useTransform } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useOptionalTilt } from "./tilt";

/** Valor de brillo (0–100) que sigue la inclinación; fijo en 50 si no hay inclinación. */
function useSheen() {
  const tilt = useOptionalTilt();
  const still = useMotionValue(0);
  return useTransform(tilt?.x ?? still, (v) => 50 + v * 45);
}

/** Texto en oro de lámina cuyo reflejo se desplaza al inclinar el móvil o mover el ratón. */
export function FoilText({ children, className }: { children: ReactNode; className?: string }) {
  const sheen = useSheen();
  return (
    <m.span
      className={`foil-text ${className ?? ""}`}
      style={{ "--sheen": sheen } as CSSProperties}
    >
      {children}
    </m.span>
  );
}

/** Monograma con las iniciales en oro de lámina dentro de un doble aro. */
export function FoilMonogram({
  first,
  second,
  className,
}: {
  first: string;
  second: string;
  className?: string;
}) {
  const sheen = useSheen();
  return (
    <m.span
      aria-hidden
      className={`relative grid aspect-square place-items-center rounded-full border border-gold/70 shadow-[inset_0_0_0_3px_var(--color-paper),inset_0_0_0_3.6px_rgb(163_135_78/0.45)] ${className ?? ""}`}
      style={{ "--sheen": sheen } as CSSProperties}
    >
      {/* Cada inicial lleva su propio recorte: background-clip:text no alcanza a hijos posicionados. */}
      <span className="relative block font-display text-[0.5em] leading-none italic">
        <span className="foil-text relative -top-[0.12em] -left-[0.06em] inline-block">
          {first.charAt(0)}
        </span>
        <span className="foil-text relative top-[0.16em] -left-[0.12em] inline-block">
          {second.charAt(0)}
        </span>
      </span>
    </m.span>
  );
}
