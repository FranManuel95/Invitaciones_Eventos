import { eventTitle, hostsOf } from "./event-kind";
import type { WeddingEvent } from "@/lib/domain/types";

const toIcsDate = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

/** Genera un archivo iCalendar mínimo para añadir el evento al calendario del invitado. */
export function buildIcs(event: WeddingEvent): string {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 11 * 3_600_000);
  const venue = event.venues[0];
  const escape = (text: string) => text.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitaciones//Demo//ES",
    "BEGIN:VEVENT",
    `UID:${event.id}@invitaciones.demo`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escape(eventTitle(hostsOf(event)))}`,
    venue ? `LOCATION:${escape(`${venue.name}, ${venue.address}, ${venue.city}`)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/** Enlace «Añadir a Google Calendar» con el evento ya relleno. */
export function googleCalendarUrl(event: WeddingEvent): string {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 11 * 3_600_000);
  const venue = event.venues[0];
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(hostsOf(event)),
    dates: `${toIcsDate(start)}/${toIcsDate(end)}`,
    details: `Ceremonia a las ${event.program[0]?.time ?? ""}. Toda la información en la invitación.`,
    location: venue ? `${venue.name}, ${venue.address}, ${venue.city}` : "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export interface CalendarCell {
  day: number | null;
  iso: string | null;
}

/**
 * Cuadrícula del mes del evento con la semana empezando en lunes (uso en España).
 * Devuelve semanas de 7 celdas; los huecos antes del día 1 y tras el último son null.
 */
export function monthGrid(isoDate: string): CalendarCell[][] {
  const [year, month] = isoDate.slice(0, 7).split("-").map(Number) as [number, number];
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7; // lunes = 0
  const cells: CalendarCell[] = Array.from({ length: offset }, () => ({ day: null, iso: null }));
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, iso: `${isoDate.slice(0, 7)}-${String(d).padStart(2, "0")}` });
  }
  while (cells.length % 7) cells.push({ day: null, iso: null });
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

/** Iniciales de los días de la semana empezando en lunes («L», «M», «X»…). */
export function weekdayInitials(locale = "es-ES"): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
  // 2024-01-01 fue lunes.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2024, 0, 1 + i))));
}

export interface MonthPage {
  year: number;
  /** 1–12 */
  month: number;
}

/**
 * Hojas del taco que caen antes de llegar al mes de la boda: desde el mes actual hasta el
 * anterior al evento. Si hay muchas, solo las `max` últimas (las primeras pasarían demasiado
 * rápido para verse).
 */
export function pagesUntil(nowIso: string, eventIso: string, max = 8): MonthPage[] {
  const [y0, m0] = nowIso.slice(0, 7).split("-").map(Number) as [number, number];
  const [y1, m1] = eventIso.slice(0, 7).split("-").map(Number) as [number, number];
  const pages: MonthPage[] = [];
  for (let i = y0 * 12 + m0 - 1; i < y1 * 12 + m1 - 1; i++) {
    pages.push({ year: Math.floor(i / 12), month: (i % 12) + 1 });
  }
  return pages.slice(-max);
}

/** Días, horas y minutos que faltan (todo a 0 si ya ha pasado). */
export function countdownParts(targetMs: number, nowMs: number) {
  const total = Math.max(0, Math.floor((targetMs - nowMs) / 60_000));
  return {
    days: Math.floor(total / 1440),
    hours: Math.floor((total % 1440) / 60),
    minutes: total % 60,
  };
}
