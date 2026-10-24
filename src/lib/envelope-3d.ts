/*
 * Cálculos del sobre en 3D, sin React ni three.js para poder probarlos: el doblez de la solapa al
 * levantarse, las dos mitades del lacre, el encuadre de la cámara y los tiempos de la apertura.
 */

export type Point = [x: number, y: number];

/** Tramo normalizado (0–1) de `t` entre `a` y `b`. */
export const segment = (t: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (t - a) / (b - a)));

export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
export const easeOut = (x: number) => 1 - (1 - x) ** 3;
export const easeIn = (x: number) => x * x * x;
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/**
 * Coreografía en segundos (a ritmo normal). Los tramos se solapan un poco: el papel no espera a
 * que acabe un gesto para empezar el siguiente.
 */
export const TIMELINE = {
  press: [0, 0.26],
  crack: [0.24, 1.7],
  flap: [0.5, 1.75],
  letter: [1.5, 2.75],
  away: [2.55, 3.55],
  present: [2.6, 3.6],
} as const;

/**
 * Perfil de la solapa mientras gira sobre la bisagra: posición (y, z) de cada fila, desde la
 * bisagra hasta la punta. `angle` va de 0 (cerrada, colgando hacia abajo) a π (abierta hacia
 * arriba). Mientras se levanta, la punta se queda algo atrás (el papel se curva) y vuelve a quedar
 * plana al terminar: el retraso es proporcional a sen(angle).
 */
export function flapProfile(rows: number, length: number, angle: number, curl = 0.55): Point[] {
  const step = length / rows;
  const lag = curl * Math.sin(angle);
  const points: Point[] = [[0, 0]];
  let y = 0;
  let z = 0;
  for (let i = 0; i < rows; i++) {
    // Ángulo en el centro del tramo: cuanto más lejos de la bisagra, más se retrasa.
    const a = angle - lag * ((i + 0.5) / rows);
    y += -Math.cos(a) * step;
    z += Math.sin(a) * step;
    points.push([y, z]);
  }
  return points;
}

/** Puntos de un `polygon(x% y%, …)` de CSS, en fracciones de 0 a 1. */
export function parsePolygon(clip: string): Point[] {
  const inner = /polygon\((.*)\)/.exec(clip)?.[1] ?? "";
  return inner
    .split(",")
    .map((pair) => pair.trim().split(/\s+/).map(parseFloat))
    .filter((p): p is [number, number] => p.length === 2 && p.every(Number.isFinite))
    .map(([x, y]) => [x / 100, y / 100]);
}

/** Puntos del atributo `points` de un polígono SVG del lacre (lienzo 100 × 100), centrados en 0. */
export function parseOutline(points: string): Point[] {
  return points
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number) as Point)
    .map(([x, y]) => [(x - 50) / 50, (50 - y) / 50]);
}

/** Grieta en zigzag que parte el lacre, de arriba abajo (en radios). */
export const CRACK: Point[] = [
  [0.04, 1.2],
  [-0.12, 0.42],
  [0.12, -0.1],
  [-0.08, -1.2],
];

/** x de la grieta a la altura y (interpolando entre sus vértices). */
function crackX(y: number) {
  for (let i = 0; i < CRACK.length - 1; i++) {
    const [x0, y0] = CRACK[i]!;
    const [x1, y1] = CRACK[i + 1]!;
    if (y <= y0 && y >= y1) return x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
  }
  return 0;
}

/**
 * Las dos mitades del lacre: cada contorno se queda con su lado de la grieta y se cierra
 * siguiendo el zigzag, así que las dos piezas encajan como al romperse.
 */
export function sealHalves(outline: Point[]): { left: Point[]; right: Point[] } {
  const angleOf = ([x, y]: Point) => Math.atan2(y, x);
  // Recorrido en sentido antihorario empezando arriba (90°).
  const sorted = [...outline].sort((a, b) => {
    const norm = (p: Point) => (angleOf(p) - Math.PI / 2 + Math.PI * 4) % (Math.PI * 2);
    return norm(a) - norm(b);
  });
  const left = sorted.filter(([x, y]) => x < crackX(y));
  const right = sorted.filter(([x, y]) => x >= crackX(y));
  const inside = CRACK.filter(([, y]) => Math.abs(y) < 1);
  // Izquierda: de arriba a abajo por fuera y de vuelta arriba por la grieta.
  return {
    left: [...left, ...[...inside].reverse()],
    right: [...right, ...inside],
  };
}

/**
 * Distancia a la que hay que poner un objeto de ancho `width` para que ocupe `fill` del ancho
 * de la pantalla, con un campo de visión vertical `fovDeg` y una proporción `aspect`.
 */
export function distanceToFill(width: number, fovDeg: number, aspect: number, fill: number) {
  const visibleAtOne = 2 * Math.tan((fovDeg * Math.PI) / 360) * aspect;
  return width / (fill * visibleAtOne);
}

/**
 * Caída con rozamiento: posición tras `t` segundos de una pieza lanzada con velocidad `v` y
 * gravedad `g`, frenada por el aire (`drag`, 1/s). Sirve para las migas y las mitades del lacre.
 */
export function fall(v: number, g: number, t: number, drag = 1.2) {
  const k = drag;
  const e = Math.exp(-k * t);
  return (v / k) * (1 - e) + (g / k) * (t - (1 - e) / k);
}
