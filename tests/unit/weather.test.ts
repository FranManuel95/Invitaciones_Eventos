import { describe, expect, it } from "vitest";
import { climateText, summarizeClimate, type DailyArchive } from "@/lib/weather";

/** Diez años de mayo: 20–24 °C de máxima, 10 de mínima y lluvia los días 5, 10, 15… */
function archive(): DailyArchive {
  const out: DailyArchive = {
    time: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    precipitation_sum: [],
  };
  for (let year = 2015; year < 2025; year++) {
    for (let day = 10; day <= 31; day++) {
      out.time.push(`${year}-05-${String(day).padStart(2, "0")}`);
      out.temperature_2m_max.push(day % 2 ? 20 : 24);
      out.temperature_2m_min.push(10);
      out.precipitation_sum.push(day % 5 === 0 ? 3 : 0);
    }
    // Un día de otro mes, que no debe contar.
    out.time.push(`${year}-08-22`);
    out.temperature_2m_max.push(40);
    out.temperature_2m_min.push(25);
    out.precipitation_sum.push(0);
  }
  return out;
}

describe("tiempo habitual", () => {
  it("promedia los días alrededor de la fecha en todos los años", () => {
    expect(summarizeClimate(archive(), "05-22", "Chinchón, Madrid")).toEqual({
      max: 22,
      min: 10,
      // Del 19 al 25 llueve el 20 y el 25: 2 de 7 días, unos 3 de cada 10.
      rainChance: 30,
      place: "Chinchón, Madrid",
    });
  });

  it("sin datos suficientes no inventa nada", () => {
    expect(
      summarizeClimate(
        { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_sum: [] },
        "05-22",
        "x",
      ),
    ).toBeNull();
  });

  it("lo cuenta en una frase sencilla", () => {
    expect(climateText({ max: 26, min: 12, rainChance: 10, place: "" })).toBe(
      "Suele hacer entre 12 y 26 °C. Llueve más o menos uno de cada diez días.",
    );
    expect(climateText({ max: 30, min: 18, rainChance: 0, place: "" })).toMatch(/Casi nunca/);
  });
});
