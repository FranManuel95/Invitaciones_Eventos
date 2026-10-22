/*
 * Pase de fotos: avanzar en bucle y elegir el movimiento lento de cada foto (efecto Ken Burns).
 * Cada foto se acerca hacia un punto distinto, así el pase no se siente repetido.
 */

/** Siguiente posición en bucle: después de la última vuelve a la primera (y al revés). */
export function stepIndex(index: number, delta: number, total: number): number {
  if (total <= 0) return 0;
  return (((index + delta) % total) + total) % total;
}

/** Hacia dónde se acerca cada foto: esquinas y centro, alternando. */
const ORIGINS = ["30% 35%", "70% 30%", "50% 60%", "25% 70%", "72% 66%"] as const;

export interface KenBurns {
  origin: string;
  /** Unas fotos se acercan y otras se alejan. */
  from: number;
  to: number;
}

export function kenBurns(index: number): KenBurns {
  const origin = ORIGINS[index % ORIGINS.length] ?? "50% 50%";
  return index % 2 === 0 ? { origin, from: 1, to: 1.14 } : { origin, from: 1.14, to: 1.02 };
}

/** Tiempo que se queda cada foto en pantalla, en milisegundos. */
export const SLIDE_MS = 6000;
