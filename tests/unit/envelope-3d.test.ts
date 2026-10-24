import { describe, expect, it } from "vitest";
import {
  distanceToFill,
  fall,
  flapProfile,
  parseOutline,
  parsePolygon,
  sealHalves,
  segment,
} from "@/lib/envelope-3d";
import { flapGeometry, sealOutline } from "@/lib/theme";

describe("sobre 3D", () => {
  it("la solapa cerrada cuelga recta y abierta queda recta hacia arriba", () => {
    const closed = flapProfile(10, 1, 0);
    expect(closed.at(-1)![0]).toBeCloseTo(-1);
    expect(closed.at(-1)![1]).toBeCloseTo(0);
    const open = flapProfile(10, 1, Math.PI);
    expect(open.at(-1)![0]).toBeCloseTo(1);
    expect(open.at(-1)![1]).toBeCloseTo(0, 5);
  });

  it("a medio camino la punta se queda atrás: el papel se curva", () => {
    const half = flapProfile(20, 1, Math.PI / 2);
    const [y, z] = half.at(-1)!;
    // Sin curva, la punta estaría en (0, 1); con el retraso, aún cuelga un poco.
    expect(y).toBeLessThan(-0.1);
    expect(z).toBeLessThan(1);
    // La longitud del papel se conserva.
    let length = 0;
    for (let i = 1; i < half.length; i++) {
      length += Math.hypot(half[i]![0] - half[i - 1]![0], half[i]![1] - half[i - 1]![1]);
    }
    expect(length).toBeCloseTo(1, 6);
  });

  it("lee los recortes de la solapa del tema", () => {
    const points = parsePolygon(flapGeometry("pico").clip);
    expect(points).toEqual([
      [0, 0],
      [1, 0],
      [0.5, 1],
    ]);
    expect(parsePolygon(flapGeometry("festoneada").clip).length).toBeGreaterThan(20);
  });

  it("las dos mitades del lacre se reparten el contorno y comparten la grieta", () => {
    const outline = parseOutline(sealOutline("cera"));
    expect(outline.every(([x, y]) => Math.hypot(x, y) <= 1.01)).toBe(true);
    const { left, right } = sealHalves(outline);
    const crackPoints = 2;
    expect(left.length + right.length).toBe(outline.length + crackPoints * 2);
    expect(left.filter(([x]) => x > 0.2)).toEqual([]);
    expect(right.filter(([x]) => x < -0.2)).toEqual([]);
  });

  it("encuadra la carta para que ocupe la parte pedida de la pantalla", () => {
    const d = distanceToFill(3, 35, 0.5, 0.9);
    const visible = 2 * d * Math.tan((35 * Math.PI) / 360) * 0.5;
    expect(3 / visible).toBeCloseTo(0.9);
  });

  it("las piezas caen cada vez más deprisa, frenadas por el aire", () => {
    expect(fall(0, -9.8, 0)).toBe(0);
    const a = fall(0, -9.8, 0.5);
    const b = fall(0, -9.8, 1);
    expect(b).toBeLessThan(a * 2);
    expect(b).toBeGreaterThan(-9.8 / 2);
    expect(segment(1.5, 1, 2)).toBe(0.5);
    expect(segment(3, 1, 2)).toBe(1);
  });
});
