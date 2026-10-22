import { describe, expect, it } from "vitest";
import {
  angleAt,
  branchLeaves,
  pointAt,
  stemPath,
  type BranchSpec,
  type Leaf,
} from "@/lib/botanical";

const straight: BranchSpec = {
  from: [0, 0],
  c1: [10, 0],
  c2: [20, 0],
  to: [30, 0],
  leaves: 4,
  size: 10,
  leaf: "olivo",
};

describe("ramas dibujadas", () => {
  it("la curva empieza y acaba en sus extremos", () => {
    expect(pointAt(straight, 0)).toEqual([0, 0]);
    expect(pointAt(straight, 1)).toEqual([30, 0]);
    expect(angleAt(straight, 0.5)).toBeCloseTo(0);
  });

  it("el tallo se escribe como un trazo SVG", () => {
    expect(stemPath(straight)).toBe("M0 0C10 0 20 0 30 0");
  });

  it("las hojas alternan de lado, menguan y acaban en la punta", () => {
    const leaves = branchLeaves(straight);
    expect(leaves).toHaveLength(5);
    const [first, second, , fourth] = leaves as [Leaf, Leaf, Leaf, Leaf];
    expect(first.angle).toBeGreaterThan(0);
    expect(second.angle).toBeLessThan(0);
    expect(fourth.size).toBeLessThan(first.size);
    expect(leaves.at(-1)).toMatchObject({ x: 30, y: 0, angle: 0, at: 1 });
    // Ordenadas de la base a la punta: así se encienden según avanza el trazo.
    const at = leaves.map((l) => l.at);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });

  it("el eucalipto abre más las hojas que el olivo", () => {
    const olive = branchLeaves(straight)[0]?.angle ?? 0;
    const eucalyptus = branchLeaves({ ...straight, leaf: "eucalipto" })[0]?.angle ?? 0;
    expect(eucalyptus).toBeGreaterThan(olive);
  });
});
