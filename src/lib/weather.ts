import { z } from "zod";

/*
 * Tiempo habitual en la fecha y el lugar del evento: medias de los últimos años alrededor de ese
 * día. Se calcula una vez desde el editor (Open-Meteo, sin cuenta) y se guarda con el contenido,
 * así la invitación no depende de que el servicio responda.
 */

export const climateSchema = z.object({
  /** Máxima y mínima medias (°C). */
  max: z.number().int().min(-40).max(55),
  min: z.number().int().min(-50).max(45),
  /** Probabilidad de lluvia (%), en decenas. */
  rainChance: z.number().int().min(0).max(100),
  /** Lugar con el que se calculó («Chinchón, Madrid»). */
  place: z.string().max(120),
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
