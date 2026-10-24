"use client";

import type { CSSProperties } from "react";
import { seeded } from "@/lib/theme/cover";

/*
 * Escena «luces y mariposas»: noche azul teñida con el color de la cera, dos guirnaldas de
 * bombillas que titilan, destellos desenfocados que suben despacio y mariposas que aletean y
 * recorren curvas suaves (offset-path). Todo en SVG y CSS: solo se animan transform y opacity.
 * Con movimiento reducido, las animaciones CSS se detienen (globals.css) y queda una imagen fija.
 */

const rand = seeded(7);
// Destellos: posición (%), tamaño (px), duración y retraso (s).
const BOKEH = Array.from({ length: 26 }, () => ({
  x: rand() * 100,
  y: 35 + rand() * 65,
  size: 6 + rand() * 26,
  duration: 9 + rand() * 9,
  delay: -rand() * 18,
  gold: rand() > 0.45,
}));

/** Puntos de una guirnalda que cuelga entre dos alturas (catenaria aproximada). */
function garland(y0: number, y1: number, sag: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return { x: t * 100, y: y0 + (y1 - y0) * t + sag * Math.sin(Math.PI * t) };
  });
}
const GARLANDS = [garland(10, 7, 9, 13), garland(4, 15, 8, 12)];

// Rutas de vuelo de las mariposas, en píxeles relativos a la escena (390 × 844 de referencia).
const FLIGHTS = [
  { path: "M-40 640C60 560 140 700 230 610S360 520 440 600", duration: 17, delay: -2, scale: 1 },
  { path: "M430 720C320 650 300 760 200 690S60 620 -50 700", duration: 21, delay: -9, scale: 0.8 },
  {
    path: "M-30 520C80 470 120 560 210 500S330 430 430 470",
    duration: 24,
    delay: -14,
    scale: 0.65,
  },
  { path: "M180 900C150 800 260 760 230 660S120 560 160 470", duration: 19, delay: -6, scale: 0.9 },
];

function Butterfly({ scale }: { scale: number }) {
  const wing = (side: 1 | -1) => (
    <g className={side === 1 ? "wing-r" : "wing-l"} style={{ transformOrigin: "0px 0px" }}>
      <path
        d={`M0 0C${side * 8} -18 ${side * 30} -24 ${side * 30} -8C${side * 30} 2 ${side * 14} 4 0 0Z`}
        fill="url(#mariposa)"
      />
      <path
        d={`M0 0C${side * 12} 4 ${side * 24} 10 ${side * 18} 20C${side * 12} 26 ${side * 4} 14 0 0Z`}
        fill="url(#mariposa)"
        opacity=".9"
      />
      <path
        d={`M0 0C${side * 10} -10 ${side * 22} -14 ${side * 24} -8`}
        fill="none"
        stroke="#fff"
        strokeOpacity=".35"
        strokeWidth=".8"
      />
    </g>
  );
  return (
    <svg
      viewBox="-34 -30 68 60"
      width={68 * scale * 1.7}
      height={60 * scale * 1.7}
      className="overflow-visible drop-shadow-[0_0_8px_rgb(120_170_255/0.7)]"
    >
      {wing(-1)}
      {wing(1)}
      <ellipse cx="0" cy="2" rx="1.6" ry="9" fill="#120c1c" />
    </svg>
  );
}

export function LightsScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_85%_at_50%_30%,color-mix(in_srgb,var(--seal)_25%,#1f3fa6)_0%,#0a1233_55%,#050816_100%)]"
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id="mariposa" cx="30%" cy="30%" r="90%">
            <stop offset="0" style={{ stopColor: "#cfe0ff" }} />
            <stop offset=".55" style={{ stopColor: "#3f7dff" }} />
            <stop offset="1" style={{ stopColor: "#0b1a5c" }} />
          </radialGradient>
        </defs>
      </svg>

      {/* Destellos desenfocados que suben despacio. */}
      {BOKEH.map((b, i) => (
        <span
          key={i}
          className="scene-rise absolute block rounded-full blur-[2px]"
          style={
            {
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              background: b.gold
                ? "radial-gradient(circle, rgb(255 214 140 / 0.55), transparent 70%)"
                : "radial-gradient(circle, color-mix(in srgb, var(--seal), white 50%), transparent 70%)",
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            } as CSSProperties
          }
        />
      ))}

      {/* Guirnaldas de luces. */}
      <svg
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[30%] w-full"
      >
        {GARLANDS.map((points, g) => (
          <path
            key={g}
            d={`M${points.map((p) => `${p.x} ${p.y}`).join(" L")}`}
            fill="none"
            stroke="#2a2418"
            strokeWidth=".25"
          />
        ))}
      </svg>
      {GARLANDS.flatMap((points, g) =>
        points.map((p, i) => (
          <span
            key={`${g}-${i}`}
            className="scene-twinkle absolute block size-2.5 -translate-x-1/2 rounded-full bg-[#ffe3a3] shadow-[0_0_10px_4px_rgb(255_200_110/0.55),0_0_28px_10px_rgb(255_190_90/0.25)]"
            style={{
              left: `${p.x}%`,
              top: `calc(${(p.y / 30) * 30}% + 2px)`,
              animationDelay: `${-((i * 0.37 + g * 0.8) % 3)}s`,
            }}
          />
        )),
      )}

      {/* Mariposas en vuelo. */}
      {FLIGHTS.map((f, i) => (
        <div
          key={i}
          className="scene-fly absolute top-0 left-0"
          style={
            {
              offsetPath: `path("${f.path}")`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
            } as CSSProperties
          }
        >
          <div style={{ transform: "rotate(90deg)" }}>
            <Butterfly scale={f.scale} />
          </div>
        </div>
      ))}
    </div>
  );
}
