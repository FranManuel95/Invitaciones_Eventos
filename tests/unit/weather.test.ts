import { describe, expect, it } from "vitest";
import {
  climateText,
  daysUntil,
  forecastDue,
  forecastText,
  pickForecast,
  summarizeClimate,
  type DailyArchive,
} from "@/lib/weather";

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

describe("previsión del día", () => {
  it("se enseña desde 14 días antes hasta el mismo día", () => {
    expect(daysUntil("2028-06-10T18:00:00+02:00", "2028-06-01")).toBe(9);
    expect(forecastDue("2028-06-10", "2028-05-26")).toBe(false);
    expect(forecastDue("2028-06-10", "2028-05-27")).toBe(true);
    expect(forecastDue("2028-06-10", "2028-06-10")).toBe(true);
    expect(forecastDue("2028-06-10", "2028-06-11")).toBe(false);
  });

  it("saca el día del evento y redondea", () => {
    const daily = {
      time: ["2028-06-09", "2028-06-10"],
      temperature_2m_max: [30, 25.6],
      temperature_2m_min: [18, 13.4],
      precipitation_probability_max: [0, 23],
    };
    expect(pickForecast(daily, "2028-06-10T18:00")).toEqual({ max: 26, min: 13, rainChance: 25 });
    expect(pickForecast(daily, "2028-06-11")).toBeNull();
  });

  it("lo cuenta según la lluvia", () => {
    expect(forecastText({ max: 26, min: 13, rainChance: 5 })).toBe(
      "Entre 13 y 26 °C. Sin lluvia a la vista.",
    );
    expect(forecastText({ max: 20, min: 12, rainChance: 35 })).toContain("35 % de probabilidad");
    expect(forecastText({ max: 18, min: 11, rainChance: 80 })).toContain("mejor traed paraguas");
  });
});
