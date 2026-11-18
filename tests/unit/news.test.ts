import { describe, expect, it } from "vitest";
import type { RsvpResponse } from "@/lib/domain/types";
import {
  hasNewSince,
  latestReplyAt,
  replyLabel,
  repliesSince,
  repliesSummary,
  visitBaseline,
} from "@/lib/guests/news";

const groups = [
  { id: "a", displayName: "Familia Ruiz" },
  { id: "b", displayName: "Marta y Jorge" },
  { id: "c", displayName: "Tía Carmen" },
];

const attendee = (name: string) => ({
  guestId: name,
  name,
  isExtra: false,
  isChild: false,
  menu: null,
  allergies: [],
  allergyNotes: "",
});

const reply = (
  groupId: string,
  status: "attending" | "declined",
  updatedAt: string,
  people = 2,
): RsvpResponse => ({
  groupId,
  status,
  attendees:
    status === "attending" ? Array.from({ length: people }, (_, i) => attendee(`p${i}`)) : [],
  transport: null,
  message: "",
  song: "",
  updatedAt,
});

const responses = [
  reply("a", "attending", "2027-03-01T10:00:00Z", 3),
  reply("b", "declined", "2027-03-05T18:30:00Z"),
  reply("c", "attending", "2027-02-20T09:00:00Z", 1),
  // Una respuesta de una invitación borrada no se cuenta.
  reply("zz", "attending", "2027-03-06T09:00:00Z"),
];

describe("desde vuestra última visita", () => {
  it("lista las respuestas posteriores, de la más reciente a la más antigua", () => {
    const news = repliesSince(groups, responses, "2027-02-25T00:00:00Z");
    expect(news.map((r) => [r.name, r.status, r.people])).toEqual([
      ["Marta y Jorge", "declined", 0],
      ["Familia Ruiz", "attending", 3],
    ]);
  });

  it("sin fecha de última visita, nada es nuevo", () => {
    expect(repliesSince(groups, responses, null)).toEqual([]);
    expect(repliesSince(groups, responses, "no es una fecha")).toEqual([]);
  });

  it("una respuesta justo a la hora de la visita ya se había visto", () => {
    expect(repliesSince(groups, responses, "2027-03-05T18:30:00Z")).toEqual([]);
  });

  it("el punto de la navegación sale si la última respuesta es posterior a la visita", () => {
    const latest = latestReplyAt(responses);
    expect(latest).toBe("2027-03-06T09:00:00Z");
    expect(hasNewSince(latest, "2027-03-01T00:00:00Z")).toBe(true);
    expect(hasNewSince(latest, "2027-03-07T00:00:00Z")).toBe(false);
    expect(hasNewSince(latest, null)).toBe(false);
    expect(hasNewSince(latestReplyAt([]), "2027-03-01T00:00:00Z")).toBe(false);
  });

  it("dentro de la misma visita se mantiene la fecha con la que empezó", () => {
    expect(visitBaseline("2027-03-01T00:00:00Z", "2027-03-09T00:00:00Z")).toBe(
      "2027-03-01T00:00:00Z",
    );
    expect(visitBaseline(null, "2027-03-09T00:00:00Z")).toBe("2027-03-09T00:00:00Z");
    expect(visitBaseline(null, null)).toBeNull();
    expect(visitBaseline(null, "basura", "2027-01-01T00:00:00Z")).toBe("2027-01-01T00:00:00Z");
  });

  it("resume y describe cada respuesta en frases cortas", () => {
    const news = repliesSince(groups, responses, "2027-01-01T00:00:00Z");
    expect(repliesSummary(news)).toBe("3 respuestas nuevas: 2 confirman y 1 no podrá venir");
    expect(repliesSummary(news.slice(0, 1))).toBe("1 respuesta nueva: no podrá venir");
    expect(repliesSummary(news.filter((r) => r.status === "attending"))).toBe(
      "2 respuestas nuevas: todas confirman",
    );
    expect(repliesSummary([])).toBe("");
    expect(news.map(replyLabel)).toEqual([
      "No podrá venir",
      "Confirma: vienen 3 personas",
      "Confirma: viene 1 persona",
    ]);
  });
});
