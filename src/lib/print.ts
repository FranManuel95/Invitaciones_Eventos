import { MENU_LABELS, allergyLabel } from "./domain/catalog";
import type { GuestGroup, MenuId, RsvpResponse } from "./domain/types";
import type { SeatingTable } from "./seating";
import { buildGuestRows, songRequests, type GuestRow } from "./stats";

/*
 * Documentos para imprimir desde el panel: tarjetas de mesa, la lista «Busca tu mesa», la hoja
 * del catering y las canciones para el DJ. Solo datos; la maqueta está en features/print.
 */

export interface PrintGuest {
  name: string;
  table: string | null;
  menu: string | null;
  allergies: string[];
  isChild: boolean;
}

/**
 * Invitados que ocupan sitio: los confirmados y, de las invitaciones que aún no han respondido,
 * sus nombres (así las tarjetas se pueden preparar antes de cerrar el plazo). Los que no vienen
 * no cuentan.
 */
export function seatedGuests(
  groups: GuestGroup[],
  responses: RsvpResponse[],
  tables: SeatingTable[],
): PrintGuest[] {
  const tableName = new Map(tables.map((t) => [t.id, t.name]));
  const groupTable = new Map(
    groups.map((g) => [g.id, g.tableId ? tableName.get(g.tableId) : null]),
  );
  return buildGuestRows(groups, responses)
    .filter((r) => r.status !== "declined")
    .map((r: GuestRow) => ({
      name: r.name.trim(),
      table: groupTable.get(r.groupId) ?? null,
      menu: r.menu ? MENU_LABELS[r.menu] : null,
      allergies: [
        ...r.allergies.filter((a) => a !== "otros").map(allergyLabel),
        ...(r.allergyNotes.trim() ? [r.allergyNotes.trim()] : []),
      ],
      isChild: r.isChild,
    }))
    .sort(byName);
}

const collator = new Intl.Collator("es", { sensitivity: "base" });
const byName = (a: { name: string }, b: { name: string }) => collator.compare(a.name, b.name);

/** «Busca tu mesa»: invitados por orden alfabético con su mesa (los que aún no tienen, al final). */
export function findYourTable(guests: PrintGuest[]) {
  return {
    seated: guests.filter((g) => g.table).sort(byName),
    unseated: guests.filter((g) => !g.table).sort(byName),
  };
}

export interface CateringTable {
  table: string;
  guests: number;
  menus: Partial<Record<MenuId | "sin-elegir", number>>;
  allergies: { name: string; detail: string }[];
}

/** Hoja del catering: totales por menú y, mesa a mesa, menús y alergias con nombre. */
export function cateringSheet(
  groups: GuestGroup[],
  responses: RsvpResponse[],
  tables: SeatingTable[],
) {
  const tableName = new Map(tables.map((t) => [t.id, t.name]));
  const groupTable = new Map(
    groups.map((g) => [g.id, (g.tableId && tableName.get(g.tableId)) || "Sin mesa"]),
  );
  // Solo los confirmados: es lo que se cocina.
  const rows = buildGuestRows(groups, responses).filter((r) => r.status === "attending");
  const totals: Partial<Record<MenuId | "sin-elegir", number>> = {};
  const byTable = new Map<string, CateringTable>();
  for (const r of rows) {
    const menu = r.menu ?? "sin-elegir";
    totals[menu] = (totals[menu] ?? 0) + 1;
    const name = groupTable.get(r.groupId) ?? "Sin mesa";
    const entry = byTable.get(name) ?? { table: name, guests: 0, menus: {}, allergies: [] };
    entry.guests += 1;
    entry.menus[menu] = (entry.menus[menu] ?? 0) + 1;
    const detail = [
      ...r.allergies.filter((a) => a !== "otros").map(allergyLabel),
      ...(r.allergyNotes.trim() ? [r.allergyNotes.trim()] : []),
    ].join(", ");
    if (detail) entry.allergies.push({ name: r.name.trim(), detail });
    byTable.set(name, entry);
  }
  // Mesas en el orden del plano; «Sin mesa» al final.
  const order = [...tables.map((t) => t.name), "Sin mesa"];
  const perTable = [...byTable.values()].sort(
    (a, b) => order.indexOf(a.table) - order.indexOf(b.table),
  );
  return { total: rows.length, totals, perTable };
}

export const MENU_ORDER_PRINT: (MenuId | "sin-elegir")[] = [
  "carne",
  "pescado",
  "vegetariano",
  "vegano",
  "infantil",
  "sin-elegir",
];
export const menuLabel = (id: MenuId | "sin-elegir") =>
  id === "sin-elegir" ? "Sin elegir" : MENU_LABELS[id];

/** Canciones pedidas, sin repetir (sin distinguir mayúsculas), con quién las pidió. */
export function djSongs(groups: GuestGroup[], responses: RsvpResponse[]) {
  const seen = new Map<string, { song: string; from: string[] }>();
  for (const { song, groupName } of songRequests(groups, responses)) {
    const clean = song.trim().replace(/\s+/g, " ");
    if (!clean) continue;
    const key = clean.toLocaleLowerCase("es");
    const entry = seen.get(key) ?? { song: clean, from: [] };
    entry.from.push(groupName);
    seen.set(key, entry);
  }
  return [...seen.values()];
}

/** Lista en texto para pegar en un mensaje al DJ. */
export const djSongsText = (songs: { song: string }[]) =>
  songs.map((s, i) => `${i + 1}. ${s.song}`).join("\n");

/** CSV (separador «;», para Excel en español). */
export function djSongsCsv(songs: { song: string; from: string[] }[]) {
  const escape = (v: string) => `"${v.replaceAll('"', '""')}"`;
  return [["Canción", "Pedida por"], ...songs.map((s) => [s.song, s.from.join(", ")])]
    .map((l) => l.map(escape).join(";"))
    .join("\r\n");
}
