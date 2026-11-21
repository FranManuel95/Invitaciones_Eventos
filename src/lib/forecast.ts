import "server-only";
import type { WeddingEvent } from "@/lib/domain/types";
import { forecastDue, pickForecast, type DailyForecast, type Forecast } from "@/lib/weather";

/** Cada cuánto se vuelve a pedir la previsión (segundos): la previsión cambia pocas veces al día. */
const REFRESH = 3 * 60 * 60;

/**
 * Previsión real del día del evento, solo cuando faltan dos semanas o menos y el tiempo habitual
 * se calculó con coordenadas. La respuesta se guarda en la caché de Next unas horas, así que los
 * invitados no esperan al servicio en cada visita. Si no responde a tiempo, null (y la invitación
 * enseña el tiempo habitual).
 */
export async function getForecast(
  event: Pick<WeddingEvent, "climate" | "date">,
  today = new Date().toISOString().slice(0, 10),
): Promise<Forecast | null> {
  const c = event.climate;
  if (c?.lat == null || c.lon == null || !forecastDue(event.date, today)) return null;
  const day = event.date.slice(0, 10);
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?${new URLSearchParams({
        latitude: String(c.lat),
        longitude: String(c.lon),
        daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        timezone: "auto",
        start_date: day,
        end_date: day,
      })}`,
      { next: { revalidate: REFRESH }, signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { daily?: DailyForecast };
    return data.daily ? pickForecast(data.daily, day) : null;
  } catch {
    return null;
  }
}
