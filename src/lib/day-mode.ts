import type { ProgramItem, WeddingEvent } from "@/lib/domain/types";

/**
 * Modo «día de la boda»: qué está pasando ahora y qué viene después.
 * Las horas del programa son locales del evento; las de madrugada (00:00, 01:30…) cuentan
 * como del día siguiente.
 */

const TIME_ZONE = "Europe/Madrid";
const DAY_START = 6 * 60; // las horas antes de las 06:00 pertenecen a la noche del evento

export const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number) as [number, number];
  const minutes = h * 60 + m;
  return minutes < DAY_START ? minutes + 24 * 60 : minutes;
};

const madridParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    day: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
};

export interface DayClock {
  /** true si es el día de la boda (o la noche siguiente, hasta las 06:00). */
  active: boolean;
  /** Minutos desde la medianoche del día del evento (madrugada > 1440). */
  minutes: number;
  /** true si viene de ?dia=boda (demostración). */
  simulated: boolean;
}

/** Calcula el reloj del modo día a partir de la fecha real o de los parámetros de la demo. */
export function dayClock(event: WeddingEvent, now: Date, search = ""): DayClock {
  const params = new URLSearchParams(search);
  if (params.get("dia") === "boda") {
    const hora = /^\d{2}:\d{2}$/.test(params.get("hora") ?? "") ? params.get("hora")! : "19:10";
    return { active: true, minutes: toMinutes(hora), simulated: true };
  }
  const eventDay = event.date.slice(0, 10);
  const { day, time } = madridParts(now);
  const next = new Date(`${eventDay}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const nextDay = next.toISOString().slice(0, 10);
  const [h, m] = time.split(":").map(Number) as [number, number];
  if (day === eventDay)
    return { active: h * 60 + m >= DAY_START, minutes: h * 60 + m, simulated: false };
  if (day === nextDay && h * 60 + m < DAY_START)
    return { active: true, minutes: 24 * 60 + h * 60 + m, simulated: false };
  return { active: false, minutes: 0, simulated: false };
}

/**
 * ¿Ya pasó la boda? A partir de las 06:00 del día siguiente la invitación da las gracias en vez
 * de pedir confirmación. En la demo se fuerza con ?dia=despues.
 */
export function isAfterEvent(event: WeddingEvent, now: Date, search = ""): boolean {
  const params = new URLSearchParams(search);
  if (params.get("dia") === "despues") return true;
  if (params.get("dia") === "boda") return false;
  const next = new Date(`${event.date.slice(0, 10)}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const nextDay = next.toISOString().slice(0, 10);
  const { day, time } = madridParts(now);
  return day > nextDay || (day === nextDay && time >= "06:00");
}

export interface LiveProgram {
  current: ProgramItem | null;
  next: ProgramItem | null;
  /** Minutos hasta el siguiente acto. */
  minutesToNext: number | null;
}

export function liveProgram(program: ProgramItem[], minutes: number): LiveProgram {
  const sorted = [...program].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  const current = [...sorted].reverse().find((p) => toMinutes(p.time) <= minutes) ?? null;
  const next = sorted.find((p) => toMinutes(p.time) > minutes) ?? null;
  return { current, next, minutesToNext: next ? toMinutes(next.time) - minutes : null };
}

/** Próximas salidas de vuelta de todos los autobuses, ordenadas. */
export function nextReturns(event: WeddingEvent, minutes: number) {
  return event.busRoutes
    .flatMap((r) => r.returnTrips.map((time) => ({ time, route: r.label })))
    .filter((t) => toMinutes(t.time) > minutes)
    .sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
}

/** «en 25 min», «en 1 h 50 min». */
export function formatIn(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `en ${h} h${m ? ` ${m} min` : ""}` : `en ${m} min`;
}
