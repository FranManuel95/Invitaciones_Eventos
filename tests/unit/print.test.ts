import { describe, expect, it } from "vitest";
import { demoGroups, demoResponses } from "@/data/demo/guests";
import { demoAssignment, demoTables } from "@/data/demo/tables";
import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";
import {
  cateringSheet,
  djSongs,
  djSongsCsv,
  djSongsText,
  findYourTable,
  seatedGuests,
} from "@/lib/print";

const groups = demoGroups.map((g) => ({ ...g, tableId: demoAssignment[g.id] ?? null }));

const group = (id: string, first: string, tableId: string | null): GuestGroup => ({
  id,
  token: id,
  displayName: first,
  category: "Amigos",
  members: [{ id: `${id}-1`, firstName: first, lastName: "Prueba", isPrimary: true }],
  maxAttendees: 1,
  tableId,
});
const yes = (
  groupId: string,
  guestId: string,
  extra: Partial<RsvpResponse> = {},
): RsvpResponse => ({
  groupId,
  status: "attending",
  attendees: [
    {
      guestId,
      name: "x",
      isExtra: false,
      isChild: false,
      menu: "pescado",
      allergies: ["gluten"],
      allergyNotes: "",
    },
  ],
  transport: null,
  message: "",
  song: "",
  updatedAt: "2027-01-01T00:00:00Z",
  ...extra,
});

describe("documentos para imprimir", () => {
  it("las tarjetas incluyen confirmados y pendientes, nunca a quien no viene", () => {
    const guests = seatedGuests(
      [group("a", "Ana", "t1"), group("b", "Bruno", null), group("c", "Carla", "t1")],
      [yes("a", "a-1"), { ...yes("c", "c-1"), status: "declined", attendees: [] }],
      [{ id: "t1", name: "Mesa 1", shape: "round", seats: 8, x: 0, y: 0 }],
    );
    expect(guests.map((g) => [g.name, g.table, g.menu])).toEqual([
      ["Ana Prueba", "Mesa 1", "Pescado"],
      ["Bruno Prueba", null, null],
    ]);
    expect(guests[0]!.allergies).toEqual(["Gluten"]);
  });

  it("«Busca tu mesa» ordena por nombre y deja aparte a quien aún no tiene mesa", () => {
    const { seated, unseated } = findYourTable(seatedGuests(groups, demoResponses, demoTables));
    const names = seated.map((g) => g.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "es")));
    expect(seated.every((g) => g.table)).toBe(true);
    expect(unseated.every((g) => !g.table)).toBe(true);
  });

  it("la hoja del catering suma los menús de los confirmados mesa a mesa", () => {
    const sheet = cateringSheet(groups, demoResponses, demoTables);
    const sum = Object.values(sheet.totals).reduce((s, n) => s + (n ?? 0), 0);
    expect(sum).toBe(sheet.total);
    expect(sheet.perTable.reduce((s, t) => s + t.guests, 0)).toBe(sheet.total);
    const tableOrder = sheet.perTable.map((t) => t.table).filter((t) => t !== "Sin mesa");
    const planOrder = demoTables.map((t) => t.name).filter((n) => tableOrder.includes(n));
    expect(tableOrder).toEqual(planOrder);
  });

  it("las canciones para el DJ no se repiten y se exportan en texto y CSV", () => {
    const songs = djSongs(
      [group("a", "Ana", null), group("b", "Bruno", null)],
      [yes("a", "a-1", { song: "Mediterráneo  " }), yes("b", "b-1", { song: "mediterráneo" })],
    );
    expect(songs).toEqual([{ song: "Mediterráneo", from: ["Ana", "Bruno"] }]);
    expect(djSongsText(songs)).toBe("1. Mediterráneo");
    expect(djSongsCsv(songs)).toBe('"Canción";"Pedida por"\r\n"Mediterráneo";"Ana, Bruno"');
  });
});
