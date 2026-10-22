import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { eventContentSchema } from "@/lib/domain/event-schema";
import { announcement, coverVerb, eventTitle, hostNames, ofEvent, toEvent } from "@/lib/event-kind";
import { buildNewEventContent, slugFor, validateNewEvent } from "@/lib/events/new-event";

const today = new Date("2026-10-22T12:00:00Z");

describe("tipos de evento", () => {
  it("sin tipo (eventos de antes) es una boda", () => {
    const hosts = { first: "María", second: "Daniel" };
    expect(hostNames(hosts)).toBe("María & Daniel");
    expect(eventTitle(hosts)).toBe("Boda de María y Daniel");
    expect(coverVerb(hosts)).toBe("se casan el");
    expect(announcement(hosts)).toBe("María y Daniel nos casamos");
  });

  it("un bautizo con un solo nombre", () => {
    const hosts = { first: "Lucía", second: "", kind: "bautizo" as const };
    expect(hostNames(hosts)).toBe("Lucía");
    expect(eventTitle(hosts)).toBe("Bautizo de Lucía");
    expect(coverVerb(hosts)).toBe("se bautiza el");
    expect(ofEvent(hosts)).toBe("del bautizo");
    expect(toEvent(hosts)).toBe("al bautizo");
    expect(announcement(hosts)).toBe("Celebramos el bautizo de Lucía");
  });

  it("la comunión y el aniversario usan sus palabras", () => {
    expect(ofEvent({ kind: "comunion" })).toBe("de la primera comunión");
    expect(coverVerb({ first: "Ana", second: "Luis", kind: "aniversario" })).toBe(
      "celebran su aniversario el",
    );
  });

  it("bodas y aniversarios necesitan dos nombres; un bautizo no", () => {
    const content = eventContentSchema.parse(demoEvent);
    const one = { ...content, couple: { ...content.couple, second: "" } };
    expect(eventContentSchema.safeParse(one).success).toBe(false);
    expect(eventContentSchema.safeParse({ ...one, kind: "bautizo" }).success).toBe(true);
    expect(eventContentSchema.safeParse({ ...one, kind: "aniversario" }).success).toBe(false);
  });

  it("el alta de un bautizo admite un nombre y adapta los textos de partida", () => {
    const input = { first: "Lucía", second: "", date: "2027-06-12", kind: "bautizo" as const };
    expect(validateNewEvent(input, today)).toBeNull();
    expect(validateNewEvent({ ...input, kind: "boda" }, today)).toBe("Escribe los dos nombres.");
    const content = buildNewEventContent(input);
    expect(content.kind).toBe("bautizo");
    expect(content.couple.monogram).toBe("L");
    expect(content.cardMessage).toContain("el bautizo de Lucía");
    expect(content.hashtag).toBe("#Lucía");
    expect(slugFor(input, "abc")).toBe("lucia-2027-abc");
  });
});
