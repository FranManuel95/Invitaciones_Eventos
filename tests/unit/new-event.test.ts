import { describe, expect, it } from "vitest";
import { buildNewEventContent, slugFor, validateNewEvent } from "@/lib/events/new-event";

describe("alta de eventos", () => {
  const input = { first: "Lucía", second: "Íñigo", date: "2028-06-10" };

  it("parte de la plantilla con los nombres, la fecha y el plazo cinco semanas antes", () => {
    const content = buildNewEventContent(input);
    expect(content.couple).toEqual({ first: "Lucía", second: "Íñigo", monogram: "LÍ" });
    expect(content.date).toBe("2028-06-10T16:30:00+02:00");
    expect(content.rsvpDeadline.slice(0, 10)).toBe("2028-05-06");
    expect(content.program.length).toBeGreaterThan(0);
  });

  it("crea un slug legible y válido", () => {
    expect(slugFor(input, "x7k2")).toBe("lucia-y-inigo-2028-x7k2");
    expect(slugFor(input, "x7k2")).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("valida nombres y fecha futura", () => {
    const today = new Date("2026-10-21T00:00:00Z");
    expect(validateNewEvent(input, today)).toBeNull();
    expect(validateNewEvent({ ...input, first: " " }, today)).toMatch(/nombres/);
    expect(validateNewEvent({ ...input, date: "2025-01-01" }, today)).toMatch(/futura/);
  });
});
