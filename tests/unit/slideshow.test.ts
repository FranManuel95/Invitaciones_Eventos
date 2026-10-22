import { describe, expect, it } from "vitest";
import { kenBurns, stepIndex } from "@/lib/slideshow";

describe("pase de fotos", () => {
  it("avanza y retrocede en bucle", () => {
    expect(stepIndex(0, 1, 3)).toBe(1);
    expect(stepIndex(2, 1, 3)).toBe(0);
    expect(stepIndex(0, -1, 3)).toBe(2);
    expect(stepIndex(0, 1, 0)).toBe(0);
  });

  it("alterna acercar y alejar, con puntos distintos", () => {
    const [a, b] = [kenBurns(0), kenBurns(1)];
    expect(a.to).toBeGreaterThan(a.from);
    expect(b.to).toBeLessThan(b.from);
    expect(a.origin).not.toBe(b.origin);
  });
});
