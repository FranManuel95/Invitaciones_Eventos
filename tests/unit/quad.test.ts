import { describe, expect, it } from "vitest";
import { mapPoint, quadToMatrix3d, scaleQuad, type Quad } from "@/lib/quad";

const card: Quad = [
  [228, 358],
  [576, 392],
  [495, 938],
  [145, 860],
];

describe("texto pegado a la tarjeta", () => {
  it("las esquinas del texto caen en las de la tarjeta", () => {
    const [w, h] = [400, 560];
    const corners: [number, number][] = [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ];
    corners.forEach((p, i) => {
      const [x, y] = mapPoint(w, h, card, p);
      expect(x).toBeCloseTo(card[i]![0], 6);
      expect(y).toBeCloseTo(card[i]![1], 6);
    });
  });

  it("un rectángulo que ya coincide da la identidad", () => {
    const same: Quad = [
      [0, 0],
      [100, 0],
      [100, 50],
      [0, 50],
    ];
    expect(quadToMatrix3d(100, 50, same)).toBe("matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)");
  });

  it("escala esquinas en fracciones al tamaño del marco", () => {
    expect(
      scaleQuad(
        [
          [0.5, 0.5],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        200,
        400,
      )[0],
    ).toEqual([100, 200]);
  });
});
