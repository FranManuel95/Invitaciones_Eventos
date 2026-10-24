"use client";

import type { CSSProperties } from "react";
import { LEAF_PATHS, LEAF_VEIN, branchLeaves, stemPath, type BranchSpec } from "@/lib/botanical";

/*
 * Escena «herbario»: ramas de olivo y eucalipto en oro que se dibujan solas sobre verde botella,
 * como una lámina grabada, y un marco fino que se traza alrededor. Todo es SVG con trazos que se
 * animan con CSS (stroke-dashoffset con pathLength=1): sin librerías y sin coste en cada
 * fotograma. Con movimiento reducido se ve ya dibujado.
 */

// Ramas de una esquina (la de arriba a la izquierda; la de abajo es la misma girada).
const BRANCHES: (BranchSpec & { delay: number; duration: number })[] = [
  {
    from: [-6, 34],
    c1: [40, 44],
    c2: [92, 30],
    to: [156, 70],
    leaves: 7,
    size: 22,
    leaf: "olivo",
    delay: 0.9,
    duration: 2.6,
  },
  {
    from: [18, -6],
    c1: [28, 48],
    c2: [50, 98],
    to: [58, 160],
    leaves: 6,
    size: 17,
    leaf: "eucalipto",
    delay: 1.3,
    duration: 2.4,
  },
  {
    from: [-4, -4],
    c1: [38, 28],
    c2: [78, 66],
    to: [116, 112],
    leaves: 5,
    size: 18,
    leaf: "olivo",
    delay: 1.7,
    duration: 2.2,
  },
];

const GOLD = "#d8bd80";

function Corner({ className, offset = 0 }: { className: string; offset?: number }) {
  return (
    <svg viewBox="0 0 200 200" className={`absolute aspect-square overflow-visible ${className}`}>
      <g className="herb-sway" style={{ animationDelay: `${4.5 + offset}s` } as CSSProperties}>
        {BRANCHES.map((b, i) => (
          <g key={i}>
            <path
              d={stemPath(b)}
              pathLength={1}
              fill="none"
              stroke={GOLD}
              strokeWidth={1.1}
              strokeLinecap="round"
              className="herb-draw"
              style={
                {
                  "--herb-delay": `${b.delay + offset}s`,
                  "--herb-duration": `${b.duration}s`,
                } as CSSProperties
              }
            />
            {branchLeaves(b).map((leaf, j) => (
              <g
                key={j}
                transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.size})`}
              >
                <g
                  className="herb-leaf"
                  style={
                    {
                      animationDelay: `${b.delay + offset + leaf.at * b.duration * 0.9}s`,
                    } as CSSProperties
                  }
                >
                  <path
                    d={LEAF_PATHS[b.leaf]}
                    fill={GOLD}
                    fillOpacity={0.16}
                    stroke={GOLD}
                    strokeWidth={0.9}
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={LEAF_VEIN}
                    fill="none"
                    stroke={GOLD}
                    strokeOpacity={0.6}
                    strokeWidth={0.6}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              </g>
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

/**
 * Marco de línea fina que se traza alrededor de la pantalla. Sin viewBox: el rectángulo mide lo
 * que mide la pantalla, así el trazo no se deforma y pathLength reparte bien el dibujo.
 */
function Frame({ inset, delay, opacity }: { inset: number; delay: number; opacity: number }) {
  return (
    <svg
      className="absolute overflow-visible"
      style={{
        top: inset,
        left: inset,
        width: `calc(100% - ${2 * inset}px)`,
        height: `calc(100% - ${2 * inset}px)`,
      }}
    >
      <rect
        width="100%"
        height="100%"
        pathLength={1}
        fill="none"
        stroke={GOLD}
        strokeOpacity={opacity}
        strokeWidth={1}
        className="herb-draw"
        style={{ "--herb-delay": `${delay}s`, "--herb-duration": "3.2s" } as CSSProperties}
      />
    </svg>
  );
}

export function HerbariumScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_85%_at_50%_42%,#25392e_0%,#14211a_58%,#0b130f_100%)]"
    >
      {/* Una luz cálida y suave, como de lámpara sobre la lámina. */}
      <div className="absolute inset-0 bg-[radial-gradient(50%_35%_at_50%_40%,rgb(216_189_128/0.1),transparent)]" />
      <Frame inset={14} delay={0.4} opacity={0.55} />
      <Frame inset={20} delay={0.7} opacity={0.3} />
      <Corner className="top-0 left-0 w-[66vw] max-w-[24rem]" />
      {/* La de abajo, más pequeña: deja libre el «Desliza o toca para abrir». */}
      <Corner className="right-0 bottom-0 w-[46vw] max-w-[17rem] rotate-180" offset={0.5} />
    </div>
  );
}
