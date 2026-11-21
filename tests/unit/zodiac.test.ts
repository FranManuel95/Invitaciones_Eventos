import { describe, expect, it } from "vitest";
import { zodiacOf } from "@/lib/zodiac";

describe("signo del zodiaco del día de la boda", () => {
  it.each([
    ["2027-01-19", "Capricornio"],
    ["2027-01-20", "Acuario"],
    ["2027-03-21", "Aries"],
    ["2027-05-22", "Géminis"],
    ["2027-07-23", "Leo"],
    ["2027-10-23", "Escorpio"],
    ["2027-12-21", "Sagitario"],
    ["2027-12-22", "Capricornio"],
  ])("%s es %s", (date, sign) => {
    expect(zodiacOf(`${date}T12:00:00+01:00`).name).toBe(sign);
  });

  it("usa el día en hora peninsular, no en UTC", () => {
    // 20 de enero a las 00:30 en Madrid es aún 19 en UTC.
    expect(zodiacOf("2027-01-20T00:30:00+01:00").name).toBe("Acuario");
  });

  it("los símbolos se piden como texto, no como emoji", () => {
    expect(zodiacOf("2027-05-22T12:00:00+02:00").symbol.endsWith("︎")).toBe(true);
  });
});
