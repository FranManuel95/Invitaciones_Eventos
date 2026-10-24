/**
 * Formatos de fecha y hora del evento. Siempre en la zona horaria del evento para que
 * servidor y cliente pinten lo mismo (sin desajustes de hidratación).
 */
const TIME_ZONE = "Europe/Madrid";

const longDate = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const weekdayDate = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const numericDate = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: TIME_ZONE,
});

/** «22 de mayo de 2027» */
export const formatLongDate = (iso: string) => longDate.format(new Date(iso));

/** «sábado, 22 de mayo de 2027» */
export const formatWeekdayDate = (iso: string) => weekdayDate.format(new Date(iso));

/** «22/05/2027» */
export const formatNumericDate = (iso: string) => numericDate.format(new Date(iso));

/** Fecha ISO (AAAA-MM-DD) para el atributo dateTime de <time>. */
export const isoDay = (iso: string) => iso.slice(0, 10);
