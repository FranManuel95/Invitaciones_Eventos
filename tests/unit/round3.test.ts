import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { showcaseGroups } from "@/data/demo/guests";
import { googleCalendarUrl, monthGrid, weekdayInitials } from "@/lib/calendar";
import {
  busSeatsFor,
  createDraft,
  rsvpResponseSchema,
  toResponse,
  validateStep,
} from "@/lib/rsvp/draft";
import { describeTransport } from "@/lib/rsvp/summary";

const family = showcaseGroups.find((g) => g.token === "familia-garcia")!;

describe("calendario", () => {
  it("empieza la semana en lunes y coloca el 22 de mayo de 2027 en sábado", () => {
    const weeks = monthGrid("2027-05-22");
    expect(weekdayInitials()).toEqual(["L", "M", "X", "J", "V", "S", "D"]);
    // El 1 de mayo de 2027 es sábado: cinco huecos antes.
    expect(weeks[0]!.slice(0, 5).every((c) => c.day === null)).toBe(true);
    const saturdayOf22 = weeks.find((w) => w.some((c) => c.day === 22))!;
    expect(saturdayOf22.findIndex((c) => c.day === 22)).toBe(5);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
  });

  it("genera el enlace de Google Calendar con fechas en UTC", () => {
    const url = new URL(googleCalendarUrl(demoEvent));
    expect(url.hostname).toBe("calendar.google.com");
    expect(url.searchParams.get("dates")).toMatch(/^20270522T143000Z\/20270523T013000Z$/);
    expect(url.searchParams.get("text")).toContain("María y Daniel");
  });
});

describe("autobús sí/no", () => {
  const attending = () => ({
    ...createDraft(family),
    status: "attending" as const,
    attendees: createDraft(family).attendees.map((a) => ({
      ...a,
      menu: a.menu ?? ("carne" as const),
    })),
  });

  it("reserva por defecto una plaza por asistente y permite menos", () => {
    const draft = { ...attending(), needsBus: true, routeId: "madrid" };
    expect(busSeatsFor(draft)).toBe(3);
    expect(validateStep("transport", { ...draft, busSeats: 2 }, family)).toEqual({});
    expect(validateStep("transport", { ...draft, busSeats: 5 }, family)).toHaveProperty("busSeats");
  });

  it("describe claramente el sí y el no", () => {
    const yes = toResponse(
      { ...attending(), needsBus: true, routeId: "madrid", busSeats: 2 },
      family,
    );
    const no = toResponse({ ...attending(), needsBus: false, offersCarSeats: false }, family);
    expect(rsvpResponseSchema.safeParse(yes).success).toBe(true);
    expect(describeTransport(yes, demoEvent)).toMatchObject({ usesBus: true, answer: "Sí" });
    expect(describeTransport(yes, demoEvent).detail).toContain(
      "2 plazas desde Hotel Plaza de España, Madrid",
    );
    expect(describeTransport(no, demoEvent)).toMatchObject({ usesBus: false, answer: "No" });
    expect(no.transport?.busSeats).toBe(0);
  });

  it("guarda la canción y acepta respuestas antiguas sin ella", () => {
    const withSong = toResponse(
      { ...attending(), needsBus: false, offersCarSeats: false, song: " September " },
      family,
    );
    expect(withSong.song).toBe("September");
    const legacy: Partial<typeof withSong> = { ...withSong };
    delete legacy.song;
    expect(rsvpResponseSchema.parse(legacy).song).toBe("");
  });
});
