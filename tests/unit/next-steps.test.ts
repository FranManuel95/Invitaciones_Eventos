import { describe, expect, it } from "vitest";
import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";
import { daysUntil, nextSteps, songTally } from "@/lib/next-steps";

const group = (id: string, extra: Partial<GuestGroup> = {}): GuestGroup => ({
  id,
  token: id,
  displayName: id,
  category: "Amigos",
  members: [],
  maxAttendees: 2,
  openedAt: null,
  ...extra,
});

const reply = (groupId: string, status: "attending" | "declined"): RsvpResponse => ({
  groupId,
  status,
  attendees: [],
  transport: null,
  message: "",
  song: "",
  updatedAt: "2027-01-10T10:00:00.000Z",
});

describe("qué toca ahora", () => {
  it("sin invitaciones, propone crearlas", () => {
    expect(nextSteps([], [], "2027-04-01", "2027-01-01").map((s) => s.id)).toEqual([
      "sin-invitaciones",
    ]);
  });

  it("separa las que no se han abierto de las abiertas sin responder y las confirmadas sin mesa", () => {
    const groups = [
      group("a"),
      group("b", { openedAt: "2027-01-02T10:00:00Z" }),
      group("c", { openedAt: "2027-01-02T10:00:00Z" }),
      group("d", { tableId: "m1" }),
      group("e"),
    ];
    const steps = nextSteps(
      groups,
      [reply("c", "attending"), reply("d", "attending"), reply("e", "declined")],
      "2027-04-01",
      "2027-01-01",
    );
    expect(steps.map((s) => s.id)).toEqual(["sin-abrir", "sin-responder", "sin-mesa"]);
    expect(steps[0]!.title).toBe("1 invitación sin abrir");
    expect(steps[2]!.title).toBe("1 invitación confirmada sin mesa");
  });

  it("avisa del plazo solo cuando está cerca y falta gente por responder", () => {
    const groups = [group("a")];
    expect(nextSteps(groups, [], "2027-04-01", "2027-03-25")[0]).toMatchObject({
      id: "plazo",
      title: "Quedan 7 días para responder",
    });
    expect(nextSteps(groups, [], "2027-04-01", "2027-04-01")[0]!.title).toBe(
      "El plazo de respuesta termina hoy",
    );
    expect(nextSteps(groups, [], "2027-04-01", "2027-04-03")[0]!.title).toBe(
      "El plazo de respuesta ha terminado",
    );
    expect(nextSteps(groups, [], "2027-04-01", "2027-01-01").map((s) => s.id)).not.toContain(
      "plazo",
    );
  });

  it("cuando no queda nada, lo dice", () => {
    const steps = nextSteps(
      [group("a", { tableId: "m1" })],
      [reply("a", "attending")],
      "2027-04-01",
      "2027-03-30",
    );
    expect(steps).toEqual([expect.objectContaining({ id: "al-dia", path: null })]);
  });

  it("cuenta los días entre fechas sin depender de la hora", () => {
    expect(daysUntil("2027-04-01", "2027-03-31T23:30:00Z")).toBe(1);
    expect(daysUntil("2027-04-01T09:00:00Z", "2027-04-02")).toBe(-1);
  });
});

describe("canciones pedidas", () => {
  it("agrupa la misma canción aunque cambien mayúsculas o acentos y ordena por veces pedida", () => {
    const tally = songTally([
      { song: "Despechá — Rosalía", groupName: "Ana" },
      { song: "Mi gran noche — Raphael", groupName: "Luis" },
      { song: "despecha —  rosalia", groupName: "Eva" },
      { song: "  ", groupName: "Nadie" },
    ]);
    expect(tally).toEqual([
      { song: "Despechá — Rosalía", count: 2, askedBy: ["Ana", "Eva"] },
      { song: "Mi gran noche — Raphael", count: 1, askedBy: ["Luis"] },
    ]);
  });
});
