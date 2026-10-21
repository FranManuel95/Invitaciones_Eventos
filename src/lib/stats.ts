import type {
  AllergyId,
  AttendanceStatus,
  GuestGroup,
  MenuId,
  RsvpResponse,
  WeddingEvent,
} from "@/lib/domain/types";

/**
 * Cálculos del panel del organizador a partir de grupos y respuestas.
 * Funciones puras: se ejecutan en el servidor y se prueban de forma aislada.
 */

export type TransportMode = "bus" | "car" | "own";

export interface GuestRow {
  id: string;
  name: string;
  groupId: string;
  groupName: string;
  category: string;
  token: string;
  status: AttendanceStatus;
  isExtra: boolean;
  isChild: boolean;
  transport: TransportMode | null;
  routeId: string | null;
  menu: MenuId | null;
  allergies: AllergyId[];
  allergyNotes: string;
  respondedAt: string | null;
}

export function buildGuestRows(groups: GuestGroup[], responses: RsvpResponse[]): GuestRow[] {
  const byGroup = new Map(responses.map((r) => [r.groupId, r]));
  const rows: GuestRow[] = [];

  for (const group of groups) {
    const response = byGroup.get(group.id);
    const base = {
      groupId: group.id,
      groupName: group.displayName,
      category: group.category,
      token: group.token,
      respondedAt: response?.updatedAt ?? null,
    };
    const transport: TransportMode | null = response?.transport
      ? response.transport.needsBus
        ? "bus"
        : response.transport.offersCarSeats
          ? "car"
          : "own"
      : null;

    for (const member of group.members) {
      const answer = response?.attendees.find((a) => a.guestId === member.id);
      const status: AttendanceStatus = !response
        ? "pending"
        : response.status === "attending" && answer
          ? "attending"
          : "declined";
      rows.push({
        ...base,
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        status,
        isExtra: false,
        isChild: Boolean(member.isChild),
        transport: status === "attending" ? transport : null,
        routeId: status === "attending" ? (response?.transport?.routeId ?? null) : null,
        menu: answer?.menu ?? null,
        allergies: answer?.allergies ?? [],
        allergyNotes: answer?.allergyNotes ?? "",
      });
    }
    for (const extra of response?.attendees.filter((a) => a.isExtra) ?? []) {
      rows.push({
        ...base,
        id: `${group.id}-${extra.guestId}`,
        name: extra.name,
        status: "attending",
        isExtra: true,
        isChild: extra.isChild,
        transport,
        routeId: response?.transport?.routeId ?? null,
        menu: extra.menu,
        allergies: extra.allergies,
        allergyNotes: extra.allergyNotes,
      });
    }
  }
  return rows;
}

export interface Summary {
  totalSeats: number;
  attending: number;
  declined: number;
  pending: number;
  unusedSeats: number;
  groups: number;
  respondedGroups: number;
}

export function summarize(groups: GuestGroup[], responses: RsvpResponse[]): Summary {
  const byGroup = new Map(responses.map((r) => [r.groupId, r]));
  const summary: Summary = {
    totalSeats: 0,
    attending: 0,
    declined: 0,
    pending: 0,
    unusedSeats: 0,
    groups: groups.length,
    respondedGroups: 0,
  };
  for (const group of groups) {
    summary.totalSeats += group.maxAttendees;
    const response = byGroup.get(group.id);
    if (!response) {
      summary.pending += group.maxAttendees;
      continue;
    }
    summary.respondedGroups += 1;
    if (response.status === "declined") {
      summary.declined += group.maxAttendees;
      continue;
    }
    const coming = response.attendees.length;
    const membersComing = response.attendees.filter((a) => !a.isExtra).length;
    summary.attending += coming;
    summary.declined += group.members.length - membersComing;
    summary.unusedSeats += group.maxAttendees - coming - (group.members.length - membersComing);
  }
  return summary;
}

export interface DailyPoint {
  date: string;
  /** Personas confirmadas acumuladas al final del día. */
  total: number;
}

export function confirmationsByDay(
  responses: RsvpResponse[],
  from: string,
  to: string,
): DailyPoint[] {
  const perDay = new Map<string, number>();
  for (const r of responses) {
    if (r.status !== "attending") continue;
    const day = r.updatedAt.slice(0, 10);
    perDay.set(day, (perDay.get(day) ?? 0) + r.attendees.length);
  }
  const points: DailyPoint[] = [];
  let total = 0;
  for (
    let d = new Date(`${from}T00:00:00Z`);
    d <= new Date(`${to}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    const key = d.toISOString().slice(0, 10);
    total += perDay.get(key) ?? 0;
    points.push({ date: key, total });
  }
  return points;
}

export function countBy<K extends string>(
  rows: GuestRow[],
  key: (row: GuestRow) => K[] | K | null,
) {
  const counts = new Map<K, number>();
  for (const row of rows) {
    if (row.status !== "attending") continue;
    const value = key(row);
    const values = Array.isArray(value) ? value : value ? [value] : [];
    for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return counts;
}

export interface RouteBooking {
  groupId: string;
  groupName: string;
  seats: number;
  names: string[];
}

export interface RouteStats {
  id: string;
  label: string;
  pickupPoint: string;
  departure: string;
  seats: number;
  requested: number;
  available: number;
  bookings: RouteBooking[];
}

/**
 * Autobuses a partir de las respuestas: cada invitación indica si usa el autobús (sí/no) y
 * cuántas plazas reserva, que pueden ser menos que sus asistentes.
 */
export function transportStats(
  event: WeddingEvent,
  groups: GuestGroup[],
  responses: RsvpResponse[],
) {
  const names = new Map(groups.map((g) => [g.id, g.displayName]));
  const attending = responses.filter((r) => r.status === "attending" && r.transport);
  const routes: RouteStats[] = event.busRoutes.map((route) => {
    const bookings = attending
      .filter((r) => r.transport!.needsBus && r.transport!.routeId === route.id)
      .map((r) => ({
        groupId: r.groupId,
        groupName: names.get(r.groupId) ?? r.groupId,
        seats: r.transport!.busSeats,
        names: r.attendees.map((a) => a.name),
      }));
    const requested = bookings.reduce((s, b) => s + b.seats, 0);
    return {
      id: route.id,
      label: route.label,
      pickupPoint: route.pickupPoint,
      departure: route.departure,
      seats: route.seats,
      requested,
      available: route.seats - requested,
      bookings,
    };
  });
  const yes = attending.filter((r) => r.transport!.needsBus);
  const no = attending.filter((r) => !r.transport!.needsBus);
  const responded = new Set(responses.map((r) => r.groupId));
  return {
    routes,
    busSeatsNeeded: routes.reduce((s, r) => s + r.requested, 0),
    busSeatsTotal: routes.reduce((s, r) => s + r.seats, 0),
    /** Invitaciones que usan el autobús, que no y que aún no han respondido. */
    invitations: {
      yes: yes.length,
      no: no.length,
      pending: groups.filter((g) => !responded.has(g.id)).length,
    },
    byCar: no.reduce((s, r) => s + r.attendees.length, 0),
  };
}

/** CSV de pasajeros por ruta (separador «;» para que Excel en español lo abra bien). */
export function passengersCsv(routes: RouteStats[]): string {
  const escape = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`;
  const lines = [["Ruta", "Recogida", "Salida", "Invitación", "Plazas", "Asistentes"]];
  for (const r of routes)
    for (const b of r.bookings)
      lines.push([
        r.label,
        r.pickupPoint,
        r.departure,
        b.groupName,
        String(b.seats),
        b.names.join(", "),
      ]);
  return lines.map((l) => l.map(escape).join(";")).join("\r\n");
}

export function songRequests(groups: GuestGroup[], responses: RsvpResponse[]) {
  const names = new Map(groups.map((g) => [g.id, g.displayName]));
  return responses
    .filter((r) => r.status === "attending" && r.song)
    .map((r) => ({ song: r.song, groupName: names.get(r.groupId) ?? r.groupId }));
}

export function carOffers(groups: GuestGroup[], responses: RsvpResponse[]) {
  return responses
    .filter((r) => r.transport?.offersCarSeats)
    .map((r) => ({
      groupName: groups.find((g) => g.id === r.groupId)?.displayName ?? r.groupId,
      seats: r.transport!.carSeats,
    }));
}

export function recentMessages(groups: GuestGroup[], responses: RsvpResponse[], limit = 5) {
  return responses
    .filter((r) => r.message)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
    .map((r) => ({
      groupName: groups.find((g) => g.id === r.groupId)?.displayName ?? r.groupId,
      message: r.message,
      status: r.status,
      date: r.updatedAt,
    }));
}
