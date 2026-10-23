"use client";

import { m, type AnimationScope, type useAnimate } from "motion/react";
import type { SealMarkId, SealShapeId } from "@/lib/theme";
import { WaxSealArt } from "../ornaments";

/*
 * Rotura del lacre, común a los sobres: el lacre se raja con un destello, las dos mitades se
 * separan un poco (la cera aguanta un instante) y después caen con su peso, girando, mientras
 * saltan migas de cera que suben y caen en arco. Las piezas viven dentro del contenedor del lacre
 * y se animan por atributos `data-*` con el `animate` de `useAnimate`.
 */

type Animate = ReturnType<typeof useAnimate>[1];

// Migas de cera: destino relativo al lacre (en tamaños de lacre), giro y tamaño en %.
const CRUMBS: [x: number, y: number, rotate: number, size: number][] = [
  [-0.42, 0.95, -140, 7],
  [-0.22, 1.25, 90, 5],
  [-0.06, 0.75, 200, 4],
  [0.16, 1.15, -60, 6],
  [0.32, 0.88, 160, 5],
  [0.46, 1.32, -220, 4],
  [-0.52, 0.62, 40, 4],
  [0.06, 1.45, 300, 3.5],
  [-0.3, 1.05, 120, 3],
  [0.38, 0.7, -90, 3.5],
  [0.24, 1.5, 60, 3],
  [-0.12, 1.38, -30, 4.5],
];

const LEFT = "polygon(0 0, 52% 0, 44% 30%, 56% 55%, 46% 100%, 0 100%)";
const RIGHT = "polygon(52% 0, 100% 0, 100% 100%, 46% 100%, 56% 55%, 44% 30%)";
// La grieta sigue el mismo zigzag que separa las mitades.
const CRACK = "M52 0 L44 30 L56 55 L46 100";

/** Mitades, grieta y migas: van dentro del contenedor del lacre, encima del lacre entero. */
export function SealBreakPieces({
  monogram,
  shape,
  mark,
}: {
  monogram: string;
  shape: SealShapeId;
  mark: SealMarkId;
}) {
  return (
    <>
      {(["l", "r"] as const).map((side) => (
        <m.span
          key={side}
          data-seal-half={side}
          aria-hidden
          className="absolute inset-0 block opacity-0 drop-shadow-[0_2px_2px_rgb(40_10_10/0.35)]"
          style={{ clipPath: side === "l" ? LEFT : RIGHT }}
        >
          <WaxSealArt monogram={monogram} shape={shape} mark={mark} className="size-full" />
        </m.span>
      ))}
      {/* La grieta: una línea clara que se abre en el centro de la cera. */}
      <m.svg
        data-seal-crack
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 size-full opacity-0"
      >
        <path
          d={CRACK}
          fill="none"
          stroke="rgb(255 236 210)"
          strokeWidth="3"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 3px rgb(255 220 180 / 0.9))" }}
        />
      </m.svg>
      {CRUMBS.map(([, , , size], i) => (
        <m.span
          key={i}
          data-crumb={i}
          aria-hidden
          className="absolute top-1/2 left-1/2 block rounded-[40%] bg-[color-mix(in_srgb,var(--seal),black_12%)] opacity-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
          style={{ width: `${size}%`, height: `${size * 0.8}%` }}
        />
      ))}
    </>
  );
}

/**
 * Coreografía de la rotura. Resuelve cuando las mitades ya se han separado (la solapa puede
 * empezar a levantarse) y deja la caída en marcha. `size` es el ancho del lacre en píxeles y
 * `fall` cuánto caen las piezas, en tamaños de lacre.
 */
export async function breakSeal(
  animate: Animate,
  scope: AnimationScope<Element>,
  { size, fall = 1.6 }: { size: number; fall?: number },
) {
  // 1. La grieta se abre con un destello y el lacre entero deja paso a sus dos mitades.
  animate("[data-seal-crack]", { opacity: [0, 1, 0] }, { duration: 0.32, times: [0, 0.25, 1] });
  animate("[data-seal-whole]", { opacity: 0 }, { duration: 0.06 });
  // 2. La cera aguanta un instante: las mitades se separan apenas, cada una hacia su lado.
  animate(
    "[data-seal-half='l']",
    { opacity: [1, 1], x: [0, -size * 0.05], rotate: [0, -7] },
    { duration: 0.14, ease: "easeOut" },
  );
  animate(
    "[data-seal-half='r']",
    { opacity: [1, 1], x: [0, size * 0.05], rotate: [0, 6] },
    { duration: 0.14, ease: "easeOut" },
  );
  // Las migas saltan hacia arriba y caen en arco.
  CRUMBS.forEach(([x, y, rotate], i) => {
    animate(
      `[data-crumb='${i}']`,
      {
        x: [0, x * size * 0.5, x * size],
        y: [0, -size * (0.12 + (i % 4) * 0.04), y * size * (fall / 1.6)],
        rotate,
        opacity: [1, 1, 0],
      },
      { duration: 0.75 + (i % 5) * 0.06, times: [0, 0.3, 1], ease: ["easeOut", "easeIn"] },
    );
  });
  await new Promise((resolve) => setTimeout(resolve, 160));
  if (!scope.current) return;
  // 3. Las mitades caen con su peso, girando hacia fuera, y se desvanecen al final.
  const gravity = [0.32, 0, 0.85, 0.5] as const;
  animate(
    "[data-seal-half='l']",
    { x: [-size * 0.05, -size * 0.32], y: [0, size * fall], rotate: [-7, -58] },
    { duration: 0.85, ease: gravity },
  );
  animate(
    "[data-seal-half='r']",
    { x: [size * 0.05, size * 0.28], y: [0, size * fall * 1.1], rotate: [6, 48] },
    { duration: 0.9, delay: 0.04, ease: gravity },
  );
  // Siguen enteras mientras caen y solo se desvanecen al final del recorrido.
  animate("[data-seal-half]", { opacity: 0 }, { duration: 0.22, delay: 0.66, ease: "easeIn" });
}
