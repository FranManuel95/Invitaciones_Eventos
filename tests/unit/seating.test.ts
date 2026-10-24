import { describe, expect, it } from "vitest";
import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";
import { headcount, nextTable, summarizeTables, unseatedGroups } from "@/lib/seating";

const group = (id: string, max: number, children = 0): GuestGroup => ({
  id,
  token: id,
  displayName: `Grupo ${id}`,
  category: "Familia",
  maxAttendees: max,
  members: Array.from({ length: max }, (_, i) => ({
    id: `${id}-${i}`,
    firstName: `P${i}`,
    lastName: "",
    isPrimary: i === 0,
    isChild: i < children,
  })),
});

const attendee = (name: string, extra: Partial<RsvpResponse["attendees"][number]> = {}) => ({
  guestId: name,
  name,
  isExtra: false,
  isChild: false,
  menu: null,
  allergies: [],
  allergyNotes: "",
  ...extra,
});

const response = (
  groupId: string,
  status: "attending" | "declined",
  attendees: RsvpResponse["attendees"] = [],
): RsvpResponse => ({
  groupId,
  status,
  attendees,
  transport: null,
  message: "",
  song: "",
  updatedAt: "2026-10-01T10:00:00Z",
});

describe("plano de mesas", () => {
  const a = group("a", 4, 1);
  const b = group("b", 2);
  const c = group("c", 3);
  const responses = [
    response("a", "attending", [
      attendee("Ana García"),
      attendee("Leo", { isChild: true }),
      attendee("Eva Ruiz", { allergies: ["gluten"] }),
    ]),
    response("b", "declined"),
  ];

  it("cuenta las personas confirmadas, estima las pendientes y no sienta a quien no viene", () => {
    expect(headcount(a, responses[0])).toMatchObject({ people: 3, children: 1, confirmed: true });
    expect(headcount(b, responses[1])).toMatchObject({ people: 0 });
    expect(headcount(c)).toMatchObject({ people: 3, confirmed: false });
  });

  it("avisa del aforo, los niños y las alergias de cada mesa", () => {
    const tables = [{ id: "t1", name: "Mesa 1", shape: "round" as const, seats: 5, x: 10, y: 10 }];
    const [summary] = summarizeTables(tables, [a, b, c], responses, { a: "t1", c: "t1" });
    expect(summary).toMatchObject({ people: 6, pending: 3, children: 1, free: -1, over: true });
    expect(summary?.allergies).toEqual(["Eva: gluten"]);
  });

  it("deja fuera de «sin mesa» a quien ya tiene mesa o no viene", () => {
    expect(unseatedGroups([a, b, c], responses, { a: "t1" }).map((g) => g.id)).toEqual(["c"]);
  });

  it("propone un nombre de mesa libre", () => {
    const t = (name: string) => ({
      id: name,
      name,
      shape: "round" as const,
      seats: 10,
      x: 0,
      y: 0,
    });
    expect(nextTable([t("Mesa 1"), t("Mesa 3")]).name).toBe("Mesa 4");
    expect(nextTable([]).name).toBe("Mesa 1");
  });
});
