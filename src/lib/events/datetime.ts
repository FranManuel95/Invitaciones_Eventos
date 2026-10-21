/*
 * Fechas del evento. Se guardan en ISO con el desfase de Madrid de ese día
 * («2027-05-22T16:30:00+02:00»), así la hora es la misma para cualquier invitado.
 */

const TIME_ZONE = "Europe/Madrid";

/** Separa «2027-05-22T16:30:00+02:00» en día y hora tal como se escribieron. */
export function splitIso(iso: string): { date: string; time: string } {
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}

/** Desfase de Madrid («+01:00» o «+02:00») en un instante dado. */
function madridOffset(instant: number): string {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, timeZoneName: "longOffset" })
      .formatToParts(new Date(instant))
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT+01:00";
  const match = /GMT([+-]\d{2}:\d{2})/.exec(name);
  return match?.[1] ?? "+00:00";
}

const minutes = (offset: string) =>
  (offset.startsWith("-") ? -1 : 1) * (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4)));

/** Día (AAAA-MM-DD) y hora (HH:MM) en Madrid → ISO con su desfase, horario de verano incluido. */
export function madridIso(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const local = Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0);
  // Primera aproximación con el desfase de esa hora local tomada como UTC; luego se corrige.
  let offset = madridOffset(local);
  offset = madridOffset(local - minutes(offset) * 60_000);
  return `${date}T${time}:00${offset}`;
}
