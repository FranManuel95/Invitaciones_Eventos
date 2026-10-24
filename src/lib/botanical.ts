/*
 * Ramas dibujadas: la geometría de la portada «herbario». Cada rama es una curva (Bézier cúbica)
 * con hojas repartidas a lo largo, alternando de lado, cada vez más pequeñas hacia la punta.
 * Aquí solo hay números; la escena los convierte en trazos SVG que se dibujan solos.
 */

export type Point = [x: number, y: number];

export interface BranchSpec {
  /** Inicio, dos puntos de control y punta de la curva. */
  from: Point;
  c1: Point;
  c2: Point;
  to: Point;
  /** Hojas a lo largo del tallo (sin contar la de la punta). */
  leaves: number;
  /** Largo de la hoja más grande, en unidades del dibujo. */
  size: number;
  leaf: LeafKind;
}

export type LeafKind = "olivo" | "eucalipto";

export interface Leaf {
  x: number;
  y: number;
  /** Giro en grados: la hoja nace apuntando hacia +x. */
  angle: number;
  size: number;
  /** Posición en el tallo, de 0 (base) a 1 (punta): sirve para escalonar la animación. */
  at: number;
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Punto de la curva en t. */
export function pointAt({ from, c1, c2, to }: BranchSpec, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * from[0] + b * c1[0] + c * c2[0] + d * to[0],
    a * from[1] + b * c1[1] + c * c2[1] + d * to[1],
  ];
}

/** Dirección de la curva en t, en grados. */
export function angleAt({ from, c1, c2, to }: BranchSpec, t: number): number {
  const u = 1 - t;
  const dx =
    3 * u * u * (c1[0] - from[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * t * t * (to[0] - c2[0]);
  const dy =
    3 * u * u * (c1[1] - from[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * t * t * (to[1] - c2[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/** El tallo como atributo `d` de un trazo SVG. */
export function stemPath({ from, c1, c2, to }: BranchSpec): string {
  const p = (q: Point) => `${round(q[0])} ${round(q[1])}`;
  return `M${p(from)}C${p(c1)} ${p(c2)} ${p(to)}`;
}

/** Hojas de la rama: alternan de lado y menguan hacia la punta, que acaba en una hoja recta. */
export function branchLeaves(spec: BranchSpec): Leaf[] {
  const leaves: Leaf[] = [];
  const spread = spec.leaf === "olivo" ? 38 : 62;
  for (let i = 0; i < spec.leaves; i++) {
    const at = 0.14 + (0.8 * i) / Math.max(1, spec.leaves);
    const [x, y] = pointAt(spec, at);
    const side = i % 2 === 0 ? 1 : -1;
    leaves.push({
      x: round(x),
      y: round(y),
      angle: round(angleAt(spec, at) + side * spread),
      size: round(spec.size * (1 - at * 0.45)),
      at: round(at * 100) / 100,
    });
  }
  const [x, y] = pointAt(spec, 1);
  leaves.push({
    x: round(x),
    y: round(y),
    angle: round(angleAt(spec, 1)),
    size: round(spec.size * 0.6),
    at: 1,
  });
  return leaves;
}

/** Silueta de una hoja de largo 1 que nace en el origen y apunta hacia +x. */
export const LEAF_PATHS: Record<LeafKind, string> = {
  // Alargada y estrecha, con la punta afilada.
  olivo: "M0 0C.3-.17.7-.15 1 0C.7.15.3.17 0 0Z",
  // Redonda, con un rabillo corto.
  eucalipto: "M0 0L.18 0C.24-.36.78-.42.98 0C.78.42.24.36.18 0Z",
};

/** Nervio central de la hoja, también de largo 1. */
export const LEAF_VEIN = "M.04 0L.9 0";
