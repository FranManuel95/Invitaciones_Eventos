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
    `SUMMARY:${escape(`Boda de ${event.couple.first} y ${event.couple.second}`)}`,
    venue ? `LOCATION:${escape(`${venue.name}, ${venue.address}, ${venue.city}`)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
