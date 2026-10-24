"use client";

import type { CSSProperties } from "react";
import { seeded } from "@/lib/theme/cover";

/*
 * Escena «cielo estrellado»: degradado de noche con un toque del color de la cera, una bruma de
 * vía láctea, estrellas que titilan a ritmos distintos y dos estrellas fugaces que cruzan de vez
 * en cuando. Solo transform y opacity; con movimiento reducido queda el cielo quieto.
 */

const rand = seeded(42);
const STARS = Array.from({ length: 90 }, () => ({
  x: rand() * 100,
  y: rand() * 78,
  size: rand() < 0.85 ? 1 + rand() * 1.4 : 2.4 + rand() * 1.4,
  duration: 2.5 + rand() * 4,
  delay: -rand() * 6,
}));

const SHOOTING = [
  { top: "14%", left: "62%", delay: "-1.5s", duration: "11s" },
  { top: "30%", left: "28%", delay: "-7s", duration: "15s" },
];

export function StarsScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#04060f_0%,color-mix(in_srgb,var(--seal)_25%,#0b1226)_55%,color-mix(in_srgb,var(--seal)_40%,#1b1830)_100%)]"
    >
      {/* Bruma de la vía láctea, en diagonal. */}
      <div className="absolute -inset-[20%] rotate-[-28deg] bg-[radial-gradient(40%_12%_at_50%_45%,rgb(210_200_255/0.16),transparent_70%),radial-gradient(28%_8%_at_42%_47%,rgb(255_230_200/0.1),transparent_70%)]" />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="scene-twinkle absolute block rounded-full bg-white"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              boxShadow: s.size > 2.4 ? "0 0 6px 1px rgb(255 255 255 / 0.6)" : undefined,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
      {SHOOTING.map((s, i) => (
        <span
          key={i}
          className="scene-shoot absolute block h-px w-32 origin-left rotate-[-32deg] bg-[linear-gradient(90deg,rgb(255_255_255/0.9),transparent)]"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
      {/* Horizonte: una loma oscura para dar escala. */}
      <svg
        viewBox="0 0 390 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[16%] w-full"
      >
        <path d="M0 70C70 40 140 60 200 48S320 30 390 56V120H0Z" fill="#05060c" />
        <path d="M0 90C90 70 170 86 250 74S350 66 390 78V120H0Z" fill="#020308" />
      </svg>
    </div>
  );
}
