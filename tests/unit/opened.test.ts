import { describe, expect, it } from "vitest";
import type { GuestGroup } from "@/lib/domain/types";
import { byNeedOfReminder, openState, openSummary } from "@/lib/guests/opened";

const group = (id: string, openedAt: string | null = null): GuestGroup => ({
  id,
  token: id,
  displayName: id,
  category: "Amigos",
  members: [],
  maxAttendees: 1,
  openedAt,
});

describe("aperturas de las invitaciones", () => {
  const answered = new Set(["a"]);
  const groups = [
    group("a", "2027-01-02T10:00:00Z"),
    group("b", "2027-01-03T10:00:00Z"),
    group("c"),
  ];

  it("distingue respondida, abierta sin responder y sin abrir", () => {
    expect(groups.map((g) => openState(g, answered))).toEqual([
      "respondida",
      "abierta",
      "sin-abrir",
    ]);
    expect(openSummary(groups, answered)).toEqual({ respondida: 1, abierta: 1, "sin-abrir": 1 });
  });

  it("para recordar, primero las que nadie ha abierto", () => {
    expect(byNeedOfReminder([groups[1]!, groups[2]!]).map((g) => g.id)).toEqual(["c", "b"]);
  });
});
