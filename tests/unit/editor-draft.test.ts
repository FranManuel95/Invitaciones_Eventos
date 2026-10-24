import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { errorFor, getIn, setIn, validateDraft } from "@/lib/editor/draft";
import { madridIso, splitIso } from "@/lib/events/datetime";
import { DEFAULT_THEME } from "@/lib/theme";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- el id no forma parte del contenido
const { id, ...content } = demoEvent;

describe("borrador del editor", () => {
  it("cambia un valor por ruta sin tocar el original", () => {
    const next = setIn(content, ["program", 0, "title"], "Boda civil");
    expect(getIn(next, ["program", 0, "title"])).toBe("Boda civil");
    expect(content.program[0]?.title).toBe("Ceremonia");
    expect(next.program[1]).toBe(content.program[1]);
    expect(next.venues).toBe(content.venues);
  });

  it("acepta el contenido de la demo", () => {
    expect(validateDraft({ content, theme: DEFAULT_THEME }).ok).toBe(true);
  });

  it("marca los campos no válidos con mensajes en español", () => {
    let bad = setIn(content, ["program", 1, "time"], "18h");
    bad = setIn(bad, ["couple", "first"], "");
    bad = setIn(bad, ["busRoutes", 0, "returnTrips", 1], "tarde");
    const check = validateDraft({ content: bad, theme: DEFAULT_THEME });
    expect(check.ok).toBe(false);
    if (check.ok) return;
    expect(errorFor(check.errors, ["program", 1, "time"])).toBe("Hora en formato HH:MM");
    expect(errorFor(check.errors, ["couple", "first"])).toBe("Este campo no puede quedar vacío.");
    expect(errorFor(check.errors, ["busRoutes", 0, "returnTrips"])).toBe("Hora en formato HH:MM");
    expect(errorFor(check.errors, ["program", 0, "time"])).toBeUndefined();
  });

  it("rechaza temas desconocidos en lugar de corregirlos en silencio", () => {
    const check = validateDraft({ content, theme: { ...DEFAULT_THEME, style: "neón" } });
    expect(check.ok).toBe(false);
  });
});

describe("fechas en Madrid", () => {
  it("usa +02:00 en verano y +01:00 en invierno", () => {
    expect(madridIso("2027-05-22", "16:30")).toBe("2027-05-22T16:30:00+02:00");
    expect(madridIso("2027-12-11", "12:00")).toBe("2027-12-11T12:00:00+01:00");
    // El día del cambio de hora (31 de octubre de 2027, a las 3:00 vuelve a ser las 2:00).
    expect(madridIso("2027-10-31", "18:00")).toBe("2027-10-31T18:00:00+01:00");
  });

  it("separa día y hora tal como se guardaron", () => {
    expect(splitIso("2027-05-22T16:30:00+02:00")).toEqual({ date: "2027-05-22", time: "16:30" });
  });
});

describe("fotos", () => {
  it("reduce al lado máximo sin agrandar", async () => {
    const { fitWithin } = await import("@/features/editor/image");
    expect(fitWithin(4000, 3000)).toEqual({ width: 2000, height: 1500 });
    expect(fitWithin(1200, 1800)).toEqual({ width: 1200, height: 1800 });
    expect(fitWithin(3000, 6000, 512)).toEqual({ width: 256, height: 512 });
  });
});
