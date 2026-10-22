import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME,
  FLAP_IDS,
  flapGeometry,
  LINER_IDS,
  linerBackground,
  SEAL_SHAPE_IDS,
  sealDroplets,
  sealOutline,
  themeVars,
} from "@/lib/theme";
import { parseTheme } from "@/lib/theme/schema";

const points = (clip: string) =>
  clip
    .replace(/^polygon\(|\)$/g, "")
    .split(", ")
    .map((p) => p.split(" ").map((v) => Number.parseFloat(v)));

describe("sobre a medida", () => {
  it.each(FLAP_IDS)("la solapa %s queda dentro de su caja y baja hasta el centro", (flap) => {
    const { depth, clip } = flapGeometry(flap);
    expect(depth).toBeGreaterThan(20);
    expect(depth).toBeLessThanOrEqual(60);
    const pts = points(clip);
    expect(pts.length).toBeGreaterThanOrEqual(3);
    for (const [x, y] of pts) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(100);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(100);
    }
    // El lacre va en el centro del borde inferior: ahí la solapa llega (casi) al fondo.
    const low = pts.filter(([, y]) => y! > 90);
    expect(low.some(([x]) => x! <= 50) && low.some(([x]) => x! >= 50)).toBe(true);
  });

  it.each(LINER_IDS)("el forro %s da un fondo CSS con los colores del tema", (liner) => {
    const bg = linerBackground(liner, { inside: "#112233", gold: "#c9a65d", own: "#abcdef" });
    expect(bg).toBeTruthy();
    if (liner === "propio") expect(bg).toBe("#abcdef");
    else expect(bg).toContain("#112233");
  });

  it.each(SEAL_SHAPE_IDS)("el lacre %s tiene un contorno cerrado dentro del lienzo", (shape) => {
    const pts = sealOutline(shape)
      .split(" ")
      .map((p) => p.split(",").map(Number));
    expect(pts.length).toBeGreaterThanOrEqual(36);
    for (const [x, y] of pts) {
      expect(Math.hypot(x! - 50, y! - 50)).toBeLessThanOrEqual(50.5);
    }
  });

  it("el lacre con goteo rebosa en varias gotas y suelta gotitas junto a ellas", () => {
    const radii = sealOutline("goteo")
      .split(" ")
      .map((p) => p.split(",").map(Number))
      .map(([x, y]) => Math.hypot(x! - 50, y! - 50));
    expect(Math.max(...radii) - Math.min(...radii)).toBeGreaterThan(5);
    const drops = sealDroplets();
    expect(drops.length).toBeGreaterThanOrEqual(4);
    for (const [x, y] of drops) expect(Math.hypot(x - 50, y - 50)).toBeGreaterThan(44);
  });

  it("sin apertura elegida, el sobre sigue en la mesa", () => {
    expect(parseTheme({}).opening).toBe("mesa");
    expect(parseTheme({ opening: "cohete" }).opening).toBe("mesa");
  });

  it("los temas guardados antes del sobre a medida lo ven igual que antes", () => {
    expect(parseTheme({ style: "noche", envelope: "kraft" })).toMatchObject({
      flap: "pico",
      weight: "medio",
      texture: "liso",
      liner: "propio",
      sealShape: "cera",
      sealMark: "monograma",
    });
  });

  it("el tema pasa el forro, la textura y el canto a variables CSS", () => {
    const vars = themeVars({ ...DEFAULT_THEME, liner: "flores", texture: "verjurado" }) as Record<
      string,
      string
    >;
    expect(vars["--env-liner"]).toContain("data:image/svg+xml");
    expect(vars["--env-texture"]).toContain("repeating-linear-gradient");
    expect(vars["--env-edge"]).toMatch(/^#[0-9a-f]{6}$/);
  });
});
