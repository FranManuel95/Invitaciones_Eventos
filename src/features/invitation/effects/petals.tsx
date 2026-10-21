"use client";

import { useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

// Caída determinista (sin Math.random en render): posición inicial, deriva, giro, duración y retraso.
const PETALS: [number, number, number, number, number, number][] = [
  [6, 40, 220, 7.5, 0.1, 11],
  [18, -30, -180, 8.6, 0.6, 9],
  [29, 60, 300, 7.1, 1.3, 12],
  [41, -50, -260, 9.2, 0.3, 8],
  [52, 20, 200, 8.1, 1.0, 10],
  [63, -70, -320, 7.7, 0.8, 9],
  [74, 45, 260, 9.6, 0.2, 12],
  [85, -25, -200, 8.3, 1.5, 8],
  [94, 35, 240, 7.9, 0.5, 10],
  [12, 80, 360, 10.1, 2.0, 7],
  [47, -90, -280, 9.9, 1.8, 9],
  [79, 55, 300, 10.4, 2.3, 8],
];

/**
 * Pétalos de flor de almendro que caen una sola vez al aparecer la carta.
 * Solo se anima transform/opacity y cada pétalo termina fuera de la pantalla.
 * Con movimiento reducido no se pintan.
 */
export function Petals() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {PETALS.map(([left, drift, spin, fall, delay, size], i) => (
        <svg
          key={i}
          viewBox="0 0 20 24"
          className="petal absolute top-0"
          style={
            {
              left: `${left}%`,
              width: size,
              "--drift": `${drift}px`,
              "--spin": `${spin}deg`,
              "--fall": `${fall}s`,
              "--delay": `${delay}s`,
            } as CSSProperties
          }
        >
          <path
            d="M10 0C16 4 20 12 16 19C14 23 6 23 4 19C0 12 4 4 10 0Z"
            fill={i % 3 ? "#f6e6e5" : "#efd2d4"}
          />
          <path d="M10 18C10 12 9 7 10 3" stroke="#d79aa6" strokeWidth="0.6" fill="none" />
        </svg>
      ))}
    </div>
  );
}
