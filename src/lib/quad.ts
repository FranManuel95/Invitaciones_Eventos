/*
 * Pegar un rectángulo sobre un cuadrilátero con perspectiva: lo usa la apertura en vídeo para que
 * el texto quede impreso sobre la tarjeta del último fotograma, siguiendo sus cuatro esquinas.
 * Devuelve la transformación proyectiva como `matrix3d` de CSS (con `transform-origin: 0 0`).
 */

export type Point = [x: number, y: number];
/** Esquinas en orden: arriba-izquierda, arriba-derecha, abajo-derecha, abajo-izquierda. */
export type Quad = [Point, Point, Point, Point];

/** Coeficientes que llevan el cuadrado unidad (u, v) a las cuatro esquinas. */
function squareToQuad([[x0, y0], [x1, y1], [x2, y2], [x3, y3]]: Quad) {
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = den === 0 ? 0 : (dx3 * dy2 - dx2 * dy3) / den;
  const h = den === 0 ? 0 : (dx1 * dy3 - dx3 * dy1) / den;
  return {
    a: x1 - x0 + g * x1,
    b: x3 - x0 + h * x3,
    c: x0,
    d: y1 - y0 + g * y1,
    e: y3 - y0 + h * y3,
    f: y0,
    g,
    h,
  };
}

/** Lleva un punto del rectángulo w × h a su sitio en el cuadrilátero (para comprobar). */
export function mapPoint(w: number, h: number, quad: Quad, [x, y]: Point): Point {
  const { a, b, c, d, e, f, g, h: k } = squareToQuad(quad);
  const u = x / w;
  const v = y / h;
  const z = g * u + k * v + 1;
  return [(a * u + b * v + c) / z, (d * u + e * v + f) / z];
}

/** `matrix3d(...)` que deforma un elemento de w × h píxeles hasta las cuatro esquinas dadas. */
export function quadToMatrix3d(w: number, h: number, quad: Quad): string {
  const { a, b, c, d, e, f, g, h: k } = squareToQuad(quad);
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((n) => Number(n.toFixed(8))).join(",")})`;
}

/** Escala unas esquinas dadas en fracciones (0–1) al tamaño real del marco. */
export const scaleQuad = (quad: Quad, width: number, height: number): Quad =>
  quad.map(([x, y]) => [x * width, y * height]) as Quad;
