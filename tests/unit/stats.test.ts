import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { DEMO_TOTAL_SEATS, demoGroups, demoResponses } from "@/data/demo/guests";
import { buildGuestRows, confirmationsByDay, summarize, transportStats } from "@/lib/stats";

describe("datos de demostración", () => {
  it("son deterministas y suman las plazas previstas", () => {
    const seats = demoGroups.reduce((s, g) => s + g.maxAttendees, 0);
    expect(seats).toBe(DEMO_TOTAL_SEATS);
    expect(new Set(demoGroups.map((g) => g.token)).size).toBe(demoGroups.length);
  });
});

describe("resumen del panel", () => {
  const summary = summarize(demoGroups, demoResponses);

  it("cuadra el reparto de plazas", () => {
    expect(summary.attending + summary.declined + summary.pending + summary.unusedSeats).toBe(
      summary.totalSeats,
    );
    expect(summary.attending).toBeGreaterThan(0);
  });

  it("coincide con las filas de invitados confirmados", () => {
    const rows = buildGuestRows(demoGroups, demoResponses);
    expect(rows.filter((r) => r.status === "attending")).toHaveLength(summary.attending);
  });

  it("acumula confirmaciones por día hasta el total", () => {
    const points = confirmationsByDay(demoResponses, "2026-09-01", "2026-10-20");
    expect(points[0]!.date).toBe("2026-09-01");
    expect(points.at(-1)!.total).toBe(summary.attending);
    for (let i = 1; i < points.length; i++)
      expect(points[i]!.total).toBeGreaterThanOrEqual(points[i - 1]!.total);
  });

  it("calcula plazas disponibles por ruta", () => {
    const { routes, busSeatsNeeded, invitations } = transportStats(
      demoEvent,
      demoGroups,
      demoResponses,
    );
    const answered = demoResponses.filter((r) => r.status === "attending").length;
    expect(invitations.yes + invitations.no).toBe(answered);
    expect(routes).toHaveLength(3);
    expect(routes.reduce((s, r) => s + r.requested, 0)).toBe(busSeatsNeeded);
    for (const r of routes) expect(r.available).toBe(r.seats - r.requested);
  });
});
