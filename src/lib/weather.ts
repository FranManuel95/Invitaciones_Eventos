import { z } from "zod";

/*
 * El tiempo del día del evento, en dos fases:
 * 1. Tiempo habitual: medias de los últimos años alrededor de ese día. El editor lo calcula solo
 *    (Open-Meteo, sin cuenta) al poner la ciudad y la fecha, y se guarda con el contenido, así la
 *    invitación no depende de que el servicio responda. Se guardan también las coordenadas.
 * 2. Previsión: cuando faltan 14 días o menos, la invitación pide la previsión real de ese día
 *    para esas coordenadas (se refresca cada pocas horas). Si el servicio no responde, se sigue
 *    viendo el tiempo habitual.
 */

export const climateSchema = z.object({
  /** Máxima y mínima medias (°C). */
  max: z.number().int().min(-40).max(55),
  min: z.number().int().min(-50).max(45),
  /** Probabilidad de lluvia (%), en decenas. */
  rainChance: z.number().int().min(0).max(100),
  /** Lugar con el que se calculó («Chinchón, Madrid»). */
  place: z.string().max(120),
  /** Coordenadas del lugar, para pedir la previsión cuando se acerque la fecha. */
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
});
export type Climate = z.infer<typeof climateSchema>;

export interface DailyArchive {
  time: string[];
  temperature_2m_max: (number | null)[];
  temperature_2m_min: (number | null)[];
  precipitation_sum: (number | null)[];
}

/** Días de cada año a menos de `window` días de la fecha (mismo mes y día), sin años bisiestos raros. */
function nearDate(day: string, monthDay: string, window: number) {
  const year = Number(day.slice(0, 4));
  const target = Date.UTC(year, Number(monthDay.slice(0, 2)) - 1, Number(monthDay.slice(3, 5)));
  return Math.abs(Date.parse(`${day}T00:00:00Z`) - target) <= window * 86_400_000;
}

/** Resume el archivo diario: medias de máxima y mínima y cuántos días llovió (≥ 1 mm). */
export function summarizeClimate(
  daily: DailyArchive,
  monthDay: string,
  place: string,
  window = 3,
): Climate | null {
  const max: number[] = [];
  const min: number[] = [];
  let rainy = 0;
  let days = 0;
  daily.time.forEach((day, i) => {
    if (!nearDate(day, monthDay, window)) return;
    const hi = daily.temperature_2m_max[i];
    const lo = daily.temperature_2m_min[i];
    const rain = daily.precipitation_sum[i];
    if (hi == null || lo == null) return;
    max.push(hi);
    min.push(lo);
    days += 1;
    if ((rain ?? 0) >= 1) rainy += 1;
  });
  if (days < 7) return null;
  const avg = (list: number[]) => Math.round(list.reduce((s, n) => s + n, 0) / list.length);
  return {
    max: avg(max),
    min: avg(min),
    rainChance: Math.round((rainy / days) * 10) * 10,
    place,
  };
}

/** «Suele hacer entre 12 y 26 °C. Llueve más o menos uno de cada diez días.» */
export function climateText(c: Climate): string {
  const rain =
    c.rainChance === 0
      ? "Casi nunca llueve."
      : c.rainChance >= 50
        ? `Llueve a menudo: ${c.rainChance / 10} de cada diez días.`
        : `Llueve más o menos ${c.rainChance === 10 ? "uno" : c.rainChance / 10} de cada diez días.`;
  return `Suele hacer entre ${c.min} y ${c.max} °C. ${rain}`;
}

/** Previsión real del día (no se guarda: se pide cuando falta poco). */
export interface Forecast {
  max: number;
  min: number;
  /** Probabilidad de lluvia (%), de 0 a 100. */
  rainChance: number;
}

/** Días que se enseña la previsión antes del evento (Open-Meteo prevé hasta 16). */
export const FORECAST_DAYS = 14;

/** Días que faltan para `date` (AAAA-MM-DD…) contando desde `today` (AAAA-MM-DD). */
export function daysUntil(date: string, today: string): number {
  return Math.round(
    (Date.parse(`${date.slice(0, 10)}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000,
  );
}

/** ¿Toca enseñar la previsión? Desde 14 días antes hasta el mismo día. */
export function forecastDue(date: string, today: string): boolean {
  const days = daysUntil(date, today);
  return days >= 0 && days <= FORECAST_DAYS;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: (number | null)[];
  temperature_2m_min: (number | null)[];
  precipitation_probability_max: (number | null)[];
}

/** Saca el día del evento de la respuesta de la previsión. */
export function pickForecast(daily: DailyForecast, date: string): Forecast | null {
  const i = daily.time.indexOf(date.slice(0, 10));
  const hi = daily.temperature_2m_max[i];
  const lo = daily.temperature_2m_min[i];
  if (i < 0 || hi == null || lo == null) return null;
  const rain = daily.precipitation_probability_max[i] ?? 0;
  return {
    max: Math.round(hi),
    min: Math.round(lo),
    rainChance: Math.max(0, Math.min(100, Math.round(rain / 5) * 5)),
  };
}

/** «Entre 14 y 25 °C, con poca probabilidad de lluvia (10 %).» */
export function forecastText(f: Forecast): string {
  const rain =
    f.rainChance <= 10
      ? "Sin lluvia a la vista."
      : f.rainChance >= 60
        ? `Probablemente llueva (${f.rainChance} %): mejor traed paraguas.`
        : `Puede que llueva: ${f.rainChance} % de probabilidad.`;
  return `Entre ${f.min} y ${f.max} °C. ${rain}`;
}
