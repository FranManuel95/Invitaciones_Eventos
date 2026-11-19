import { describe, expect, it } from "vitest";
import { editorProgress, progressCount } from "@/lib/editor/progress";
import { buildNewEventContent } from "@/lib/events/new-event";
import { applyTemplate, DEFAULT_THEME } from "@/lib/theme";

const baseline = buildNewEventContent({
  first: "Lucía",
  second: "Pablo",
  date: "2028-06-10",
});

describe("progreso del editor", () => {
  it("un evento recién creado solo tiene hechos sus datos", () => {
    const p = editorProgress(baseline, DEFAULT_THEME, baseline);
    expect(p.datos.done).toBe(true);
    expect(p.estilo).toMatchObject({ done: false, todo: "Elegid una plantilla" });
    expect(p.historia).toMatchObject({ done: false, todo: "Poned vuestras fotos" });
    expect(p.textos.done).toBe(false);
    expect(p.programa.done).toBe(false);
    expect(progressCount(p)).toEqual({ done: 1, total: 5 });
  });

  it("autobuses y preguntas son opcionales y no cuentan", () => {
    const p = editorProgress(baseline, DEFAULT_THEME, baseline);
    expect(p.transporte.optional).toBe(true);
    expect(p.extras.optional).toBe(true);
  });

  it("cada cambio propio marca su pestaña", () => {
    const content = {
      ...baseline,
      coverPhoto: "https://ejemplo.test/nuestra-foto.webp",
      cardMessage: "Por fin llega el día.",
      program: baseline.program.map((item, i) => (i === 0 ? { ...item, title: "Misa" } : item)),
    };
    const p = editorProgress(content, applyTemplate(DEFAULT_THEME, "arcilla"), baseline);
    expect(p.estilo.done).toBe(true);
    expect(p.historia.done).toBe(true);
    expect(p.textos.done).toBe(true);
    expect(p.programa.done).toBe(true);
    expect(progressCount(p)).toEqual({ done: 5, total: 5 });
  });

  it("sin nombre o sin lugar, faltan los datos", () => {
    const p = editorProgress({ ...baseline, city: " " }, DEFAULT_THEME, baseline);
    expect(p.datos).toMatchObject({ done: false, todo: "Faltan nombres, fecha o lugar" });
  });
});
