import { describe, expect, it } from "vitest";
import {
  accentFor,
  contrast,
  DEFAULT_THEME,
  mix,
  parseTheme,
  STYLE_IDS,
  STYLES,
  themeVars,
  WAX_IDS,
} from "@/lib/theme";

describe("tema", () => {
  it("vuelve a los valores por defecto con datos incompletos o desconocidos", () => {
    expect(parseTheme(null)).toEqual(DEFAULT_THEME);
    expect(parseTheme({ style: "noche", envelope: "plástico" })).toEqual({
      ...DEFAULT_THEME,
      style: "noche",
    });
  });

  it("mezcla y mide el contraste como WCAG", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  describe.each(STYLE_IDS)("estilo %s", (id) => {
    const p = STYLES[id].palette;

    it("el texto se lee sobre el papel y el fondo (AA)", () => {
      for (const bg of [p.paper, p.ivory]) {
        for (const fg of [p.ink, p.inkSoft, p.muted, p.success, p.danger, p.warning]) {
          expect(contrast(fg, bg), `${fg} sobre ${bg}`).toBeGreaterThanOrEqual(4.5);
        }
      }
      // Botones principales: papel sobre tinta.
      expect(contrast(p.paper, p.ink)).toBeGreaterThanOrEqual(4.5);
    });

    it.each(WAX_IDS)("el acento con lacre %s se lee y admite texto encima", (wax) => {
      const accent = accentFor({ ...DEFAULT_THEME, style: id, wax });
      expect(contrast(accent, p.paper)).toBeGreaterThanOrEqual(4.5);
    });

    it("sobrescribe las variables de color", () => {
      const vars = themeVars({ ...DEFAULT_THEME, style: id }) as Record<string, string>;
      expect(vars["--color-paper"]).toBe(p.paper);
      expect(vars["--color-ink"]).toBe(p.ink);
    });
  });
});
