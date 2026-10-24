import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { showcaseGroups } from "@/data/demo/guests";
import {
  addExtra,
  canAddExtra,
  createDraft,
  isDeadlinePassed,
  rsvpResponseSchema,
  stepsFor,
  toResponse,
  validateStep,
} from "@/lib/rsvp/draft";

const family = showcaseGroups.find((g) => g.token === "familia-garcia")!;
const single = showcaseGroups.find((g) => g.token === "plazo-cerrado")!;

describe("borrador RSVP", () => {
  it("parte con todos los miembros marcados y el menú infantil para niños", () => {
    const draft = createDraft(family);
    expect(draft.attendees).toHaveLength(3);
    expect(draft.attendees.every((a) => a.attending)).toBe(true);
    expect(draft.attendees.find((a) => a.isChild)?.menu).toBe("infantil");
  });

  it("respeta el cupo de acompañantes", () => {
    let draft = createDraft(family);
    expect(canAddExtra(draft, family)).toBe(true);
    draft = addExtra(draft);
    expect(canAddExtra(draft, family)).toBe(false);
    expect(draft.attendees).toHaveLength(4);
  });

  it("exige nombre para el acompañante y al menos un asistente", () => {
    let draft = addExtra(createDraft(family));
    expect(validateStep("guests", draft, family)).toHaveProperty("name-extra-1");
    draft = { ...draft, attendees: draft.attendees.map((a) => ({ ...a, attending: false })) };
    expect(validateStep("guests", draft, family)).toHaveProperty("guests");
  });

  it("pide punto de recogida si necesita autobús y detalle si marca otra alergia", () => {
    const draft = { ...createDraft(family), status: "attending" as const, needsBus: true };
    expect(validateStep("transport", draft, family)).toHaveProperty("routeId");
    const withAllergy = {
      ...draft,
      attendees: draft.attendees.map((a) => ({
        ...a,
        menu: "carne" as const,
        allergies: ["otros" as const],
      })),
    };
    expect(Object.keys(validateStep("menu", withAllergy, family))).toContain("notes-g1-1");
  });

  it("omite pasos innecesarios según la respuesta y la invitación", () => {
    const declined = { ...createDraft(family), status: "declined" as const };
    expect(stepsFor(declined, demoEvent, family)).toEqual(["attendance", "message", "summary"]);
    const soloYes = { ...createDraft(single), status: "attending" as const };
    expect(stepsFor(soloYes, demoEvent, single)).not.toContain("guests");
  });

  it("genera una respuesta válida según el esquema", () => {
    const draft = {
      ...createDraft(family),
      status: "attending" as const,
      needsBus: false,
      offersCarSeats: false,
    };
    draft.attendees = draft.attendees.map((a) => ({ ...a, menu: a.menu ?? "pescado" }));
    const response = toResponse(draft, family, new Date("2026-10-01T10:00:00Z"));
    expect(rsvpResponseSchema.safeParse(response).success).toBe(true);
    expect(response.attendees).toHaveLength(3);
    expect(response.transport?.carSeats).toBe(0);
  });

  it("si antes rechazó, al editar vuelve a marcar a todos", () => {
    const previous = toResponse({ ...createDraft(family), status: "declined" }, family);
    expect(createDraft(family, previous).attendees.every((a) => a.attending)).toBe(true);
  });

  it("detecta el plazo cerrado", () => {
    expect(isDeadlinePassed(demoEvent, single)).toBe(true);
    expect(isDeadlinePassed(demoEvent, family, new Date("2026-10-21"))).toBe(false);
    expect(isDeadlinePassed(demoEvent, family, new Date("2027-05-01"))).toBe(true);
  });
});
