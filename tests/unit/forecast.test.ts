import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { getForecast } = await import("@/lib/forecast");

const climate = {
  max: 24,
  min: 11,
  rainChance: 20,
  place: "Chinchón, Madrid",
  lat: 40.14,
  lon: -3.42,
};

afterEach(() => vi.unstubAllGlobals());

describe("previsión en la invitación", () => {
  it("no la pide si falta más de dos semanas o no hay coordenadas", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await getForecast({ climate, date: "2028-06-10" }, "2028-05-01")).toBeNull();
    expect(
      await getForecast(
        { climate: { ...climate, lat: undefined }, date: "2028-06-10" },
        "2028-06-05",
      ),
    ).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("la pide para el día y el lugar cuando ya toca", async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        daily: {
          time: ["2028-06-10"],
          temperature_2m_max: [27],
          temperature_2m_min: [14],
          precipitation_probability_max: [10],
        },
      }),
    });
    vi.stubGlobal("fetch", fetch);
    expect(await getForecast({ climate, date: "2028-06-10T18:00" }, "2028-06-05")).toEqual({
      max: 27,
      min: 14,
      rainChance: 10,
    });
    expect(String(fetch.mock.calls[0]?.[0])).toContain("latitude=40.14");
  });

  it("si el servicio falla, se queda con el tiempo habitual", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("sin red")));
    expect(await getForecast({ climate, date: "2028-06-10" }, "2028-06-05")).toBeNull();
  });
});
