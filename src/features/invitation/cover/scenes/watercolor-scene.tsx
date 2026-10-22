"use client";

import type { CSSProperties } from "react";
import { Petals } from "../../effects/petals";

/*
 * Escena «acuarela floral»: un fondo lavado en tonos del tema y ramos de flores pintadas en las
 * esquinas. Cada flor es un SVG con un filtro de acuarela (turbulencia + desplazamiento) que se
 * rasteriza una vez; lo que se anima es el contenedor HTML (escala y opacidad), así el filtro no
 * se recalcula en cada fotograma. Después caen pétalos.
 */

// Flores: posición (%), tamaño (vw), giro, color (mezcla con la cera) y retraso.
const FLOWERS = [
  { x: -8, y: -6, size: 62, rotate: 18, tone: 35, delay: 0.2 },
  { x: 52, y: -10, size: 46, rotate: -30, tone: 55, delay: 0.6 },
  { x: 68, y: 66, size: 64, rotate: 160, tone: 30, delay: 0.9 },
  { x: -14, y: 74, size: 50, rotate: 200, tone: 60, delay: 1.2 },
  { x: 30, y: 84, size: 34, rotate: 120, tone: 45, delay: 1.5 },
];

function Flower({ tone }: { tone: number }) {
  const petal = (angle: number, scale: number, opacity: number) => (
    <ellipse
      key={`${angle}-${scale}`}
      cx="0"
      cy={-30 * scale}
      rx={22 * scale}
      ry={34 * scale}
      transform={`rotate(${angle})`}
      fill={`color-mix(in srgb, var(--seal), white ${tone}%)`}
      fillOpacity={opacity}
    />
  );
  return (
    <svg viewBox="-100 -100 200 200" className="size-full overflow-visible">
      <g filter="url(#acuarela)">
        {/* Hojas */}
        {[30, 150, 260].map((a) => (
          <path
            key={a}
            d="M0 0C20 -30 60 -50 95 -40C70 -10 40 10 0 0Z"
            transform={`rotate(${a})`}
            fill="#6f8a64"
            fillOpacity=".55"
          />
        ))}
        {/* Tres coronas de pétalos, de fuera adentro: cada una más intensa. */}
        {[0, 60, 120, 180, 240, 300].map((a) => petal(a, 1, 0.6))}
        {[30, 90, 150, 210, 270, 330].map((a) => petal(a, 0.72, 0.7))}
        {[0, 72, 144, 216, 288].map((a) => petal(a, 0.45, 0.7))}
        <circle r="9" fill="#d9b25c" fillOpacity=".85" />
      </g>
    </svg>
  );
}

export function WatercolorScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(110%_80%_at_50%_40%,color-mix(in_srgb,var(--seal)_40%,#2a2230)_0%,color-mix(in_srgb,var(--seal)_25%,#140f18)_100%)]"
    >
      <svg width="0" height="0" className="absolute">
        <filter id="acuarela" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="14" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </svg>
      {/* Manchas de color lavado al fondo. */}
      <div className="absolute inset-0 bg-[radial-gradient(45%_30%_at_20%_25%,rgb(255_255_255/0.08),transparent),radial-gradient(40%_28%_at_80%_70%,rgb(255_230_240/0.07),transparent)]" />
      {FLOWERS.map((f, i) => (
        <div
          key={i}
          className="scene-bloom absolute"
          style={
            {
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: `${f.size}vw`,
              maxWidth: `${f.size * 4.2}px`,
              aspectRatio: "1",
              rotate: `${f.rotate}deg`,
              animationDelay: `${f.delay}s`,
            } as CSSProperties
          }
        >
          <Flower tone={f.tone} />
        </div>
      ))}
      <Petals />
    </div>
  );
}
