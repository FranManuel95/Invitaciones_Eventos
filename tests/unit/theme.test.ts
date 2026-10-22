import { describe, expect, it } from "vitest";
import {
  accentFor,
  applyTemplate,
  contrast,
  DEFAULT_THEME,
  mix,
  normalizeOrder,
  SECTION_IDS,
  STYLE_IDS,
  STYLES,
  TEMPLATE_IDS,
  templateOf,
  themeVars,
  WAX_IDS,
} from "@/lib/theme";
import { parseTheme, themeInputSchema } from "@/lib/theme/schema";

describe("tema", () => {
  it("vuelve a los valores por defecto con datos incompletos o desconocidos", () => {
    expect(parseTheme(null)).toEqual(DEFAULT_THEME);
    expect(parseTheme({ style: "noche", envelope: "plástico" })).toEqual({
      ...DEFAULT_THEME,
      style: "noche",
    });
  });

  it("los temas guardados antes de las secciones y la música siguen valiendo", () => {
    expect(parseTheme({ style: "clasico" })).toMatchObject({ hidden: [], music: true });
    expect(parseTheme({ hidden: ["historia", "regalo"], music: false })).toMatchObject({
      hidden: ["historia", "regalo"],
      music: false,
    });
    expect(parseTheme({ hidden: ["confirmar"] }).hidden).toEqual([]);
  });

  it("mezcla y mide el contraste como WCAG", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("los temas Clásico guardados antes de elegir letra conservan su garalda", () => {
    expect(parseTheme({ style: "clasico" }).font).toBe("clasica");
    expect(parseTheme({ style: "clasico", font: "deco" }).font).toBe("deco");
    expect(parseTheme({ style: "noche" }).font).toBe("editorial");
  });

  it("la tipografía fija titulares y nombres", () => {
    const vars = themeVars({ ...DEFAULT_THEME, font: "caligrafica" }) as Record<string, string>;
    expect(vars["--font-display"]).toContain("--font-playfair");
    expect(vars["--font-names"]).toContain("--font-great-vibes");
    const plain = themeVars(DEFAULT_THEME) as Record<string, string>;
    expect(plain["--font-names"]).toBe(plain["--font-display"]);
  });

  it("la carta guardada antes de elegir composición sigue siendo la clásica", () => {
    expect(parseTheme({ style: "noche" })).toMatchObject({
      layout: "clasica",
      edge: "barba",
      ornament: "almendro",
    });
    expect(parseTheme({ layout: "revista" }).layout).toBe("clasica");
  });

  it("el orden de las secciones se completa y no admite repetidas", () => {
    expect(normalizeOrder(["regalo", "fecha", "regalo", "nada"])).toEqual([
      "regalo",
      "fecha",
      ...SECTION_IDS.filter((id) => id !== "regalo" && id !== "fecha"),
    ]);
    expect(parseTheme({}).order).toEqual([...SECTION_IDS]);
    expect(parseTheme({ order: "mal" }).order).toEqual([...SECTION_IDS]);
    const twice = [...SECTION_IDS.slice(0, -1), SECTION_IDS[0]];
    expect(themeInputSchema.safeParse({ ...DEFAULT_THEME, order: twice }).success).toBe(false);
  });

  it("acepta un color propio válido y descarta el que no lo es", () => {
    expect(parseTheme({ waxColor: "#C0FFEE" }).waxColor).toBe("#C0FFEE");
    expect(parseTheme({ waxColor: "rojo" }).waxColor).toBeNull();
    expect(themeInputSchema.safeParse({ ...DEFAULT_THEME, waxColor: "#12345" }).success).toBe(
      false,
    );
  });

  it("las plantillas conservan secciones y música, y se reconocen", () => {
    const current = { ...DEFAULT_THEME, hidden: ["regalo" as const], music: false };
    for (const id of TEMPLATE_IDS) {
      const theme = applyTemplate(current, id);
      expect(themeInputSchema.safeParse(theme).success, id).toBe(true);
      expect(theme).toMatchObject({ hidden: ["regalo"], music: false });
      expect(templateOf(theme)).toBe(id);
    }
    expect(templateOf({ ...applyTemplate(current, "costa"), wax: "negro" })).toBeNull();
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

    it.each(["#ffff00", "#f5f0e6", "#101010", "#7fd1ff", "#ff69b4"])(
      "un color propio %s se corrige hasta leerse",
      (waxColor) => {
        const accent = accentFor({ ...DEFAULT_THEME, style: id, waxColor });
        expect(contrast(accent, p.paper)).toBeGreaterThanOrEqual(4.5);
      },
    );

    it("sobrescribe las variables de color", () => {
      const vars = themeVars({ ...DEFAULT_THEME, style: id }) as Record<string, string>;
      expect(vars["--color-paper"]).toBe(p.paper);
      expect(vars["--color-ink"]).toBe(p.ink);
    });
  });
});
