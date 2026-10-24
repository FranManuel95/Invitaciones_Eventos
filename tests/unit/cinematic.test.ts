import { describe, expect, it } from "vitest";
import { countdownParts, pagesUntil } from "@/lib/calendar";

describe("taco del calendario", () => {
  it("cae desde el mes actual hasta el anterior a la boda", () => {
    const pages = pagesUntil("2027-02-10", "2027-05-22");
    expect(pages).toEqual([
      { year: 2027, month: 2 },
      { year: 2027, month: 3 },
      { year: 2027, month: 4 },
    ]);
  });

  it("cruza el cambio de año y se queda con las últimas hojas", () => {
    const pages = pagesUntil("2026-10-21", "2027-05-22", 5);
    expect(pages[0]).toEqual({ year: 2026, month: 12 });
    expect(pages.at(-1)).toEqual({ year: 2027, month: 4 });
    expect(pages).toHaveLength(5);
  });

  it("no hay hojas en el mes de la boda ni después", () => {
    expect(pagesUntil("2027-05-01", "2027-05-22")).toEqual([]);
    expect(pagesUntil("2027-07-01", "2027-05-22")).toEqual([]);
  });
});

describe("cuenta atrás", () => {
  it("separa días, horas y minutos", () => {
    const target = Date.UTC(2027, 4, 22, 14, 30);
    const now = target - (3 * 1440 + 5 * 60 + 7) * 60_000 - 30_000;
    expect(countdownParts(target, now)).toEqual({ days: 3, hours: 5, minutes: 7 });
  });

  it("se queda en cero cuando ya ha pasado", () => {
    expect(countdownParts(0, 1_000_000)).toEqual({ days: 0, hours: 0, minutes: 0 });
  });
});
