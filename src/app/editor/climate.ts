"use server";

import { summarizeClimate, type Climate, type DailyArchive } from "@/lib/weather";

export type ClimateResult = { ok: true; climate: Climate } | { ok: false; error: string };

const YEARS = 10;

/**
 * Calcula el tiempo habitual para la fecha y el lugar con los datos históricos de Open-Meteo
 * (servicio público, sin cuenta). Se llama una vez desde el editor y el resultado se guarda.
 */
export async function fetchClimate(
  city: string,
  region: string,
  date: string,
): Promise<ClimateResult> {
  const name = city.trim();
  if (!name || name.length > 80 || !/^\d{4}-\d{2}-\d{2}/.test(date)) {
    return { ok: false, error: "Escribe la ciudad y la fecha en «Pareja y fecha»." };
  }
  try {
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({
        name,
        count: "5",
        language: "es",
      })}`,
      { signal: AbortSignal.timeout(8000) },
    );
    const places =
      (
        (await geo.json()) as {
          results?: {
            name: string;
            latitude: number;
            longitude: number;
            admin1?: string;
            admin2?: string;
            country?: string;
          }[];
        }
      ).results ?? [];
    // Si hay varias con el mismo nombre, la de la región indicada.
    const wanted = region.trim().toLowerCase();
    const place =
      places.find(
        (p) =>
          wanted && [p.admin1, p.admin2, p.country].some((a) => a?.toLowerCase().includes(wanted)),
      ) ?? places[0];
    if (!place) return { ok: false, error: `No encontramos «${name}». Prueba con otro nombre.` };

    const year = Number(date.slice(0, 4));
    const last = Math.min(year, new Date().getUTCFullYear()) - 1;
    const archive = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?${new URLSearchParams({
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        start_date: `${last - YEARS + 1}-01-01`,
        end_date: `${last}-12-31`,
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
        timezone: "auto",
      })}`,
      { signal: AbortSignal.timeout(15000) },
    );
    if (!archive.ok) {
      return { ok: false, error: "El servicio del tiempo no responde ahora. Prueba más tarde." };
    }
    const data = (await archive.json()) as { daily?: DailyArchive };
    const climate = data.daily
      ? summarizeClimate(
          data.daily,
          date.slice(5, 10),
          [place.name, place.admin2 ?? place.admin1].filter(Boolean).join(", "),
        )
      : null;
    return climate
      ? { ok: true, climate }
      : { ok: false, error: "No hay datos suficientes de ese lugar." };
  } catch {
    return { ok: false, error: "El servicio del tiempo no responde ahora. Prueba más tarde." };
  }
}
