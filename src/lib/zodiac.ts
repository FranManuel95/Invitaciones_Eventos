/*
 * Signo del zodiaco de una fecha (plantilla de concepto «Horóscopo»): el del día de la boda, en
 * hora peninsular. Los símbolos llevan el selector de texto para que no salgan como emoji.
 */

export interface Zodiac {
  name: string;
  symbol: string;
}

const ZODIAC: Zodiac[] = [
  { name: "Capricornio", symbol: "♑︎" },
  { name: "Acuario", symbol: "♒︎" },
  { name: "Piscis", symbol: "♓︎" },
  { name: "Aries", symbol: "♈︎" },
  { name: "Tauro", symbol: "♉︎" },
  { name: "Géminis", symbol: "♊︎" },
  { name: "Cáncer", symbol: "♋︎" },
  { name: "Leo", symbol: "♌︎" },
  { name: "Virgo", symbol: "♍︎" },
  { name: "Libra", symbol: "♎︎" },
  { name: "Escorpio", symbol: "♏︎" },
  { name: "Sagitario", symbol: "♐︎" },
];
// Último día de cada mes que pertenece al signo «anterior» (enero: hasta el 19, Capricornio…).
const CUSP = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];

/** Signo del día (AAAA-MM-DD…, en hora de Madrid). */
export function zodiacOf(iso: string): Zodiac {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    day: "numeric",
    month: "numeric",
  }).formatToParts(new Date(iso));
  const month = Number(parts.find((p) => p.type === "month")?.value) - 1;
  const day = Number(parts.find((p) => p.type === "day")?.value);
  const index = day <= CUSP[month]! ? month : (month + 1) % 12;
  return ZODIAC[index]!;
}
