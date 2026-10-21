import { z } from "zod";
import type {
  AllergyId,
  AttendeeResponse,
  GuestGroup,
  MenuId,
  RsvpResponse,
  WeddingEvent,
} from "@/lib/domain/types";

/**
 * Estado editable del formulario RSVP y su validación por pasos.
 * Es independiente de React para poder probarlo y reutilizarlo en el servidor más adelante.
 */

export interface AttendeeDraft extends AttendeeResponse {
  attending: boolean;
}

export interface RsvpDraft {
  status: "attending" | "declined" | null;
  attendees: AttendeeDraft[];
  needsBus: boolean | null;
  routeId: string | null;
  offersCarSeats: boolean | null;
  carSeats: number;
  message: string;
}

export type RsvpStep = "attendance" | "guests" | "transport" | "menu" | "message" | "summary";

export const STEP_TITLES: Record<RsvpStep, string> = {
  attendance: "Asistencia",
  guests: "Quién viene",
  transport: "Transporte",
  menu: "Menú y alergias",
  message: "Mensaje",
  summary: "Resumen",
};

export function createDraft(group: GuestGroup, previous?: RsvpResponse | null): RsvpDraft {
  const fromPrevious = (id: string) => previous?.attendees.find((a) => a.guestId === id);
  const members: AttendeeDraft[] = group.members.map((m) => {
    const prev = fromPrevious(m.id);
    return {
      guestId: m.id,
      name: `${m.firstName} ${m.lastName.split(" ")[0]}`,
      isExtra: false,
      isChild: Boolean(m.isChild),
      // Si antes rechazó la invitación, al editar se parte de que vienen todos.
      attending: previous?.status === "attending" ? Boolean(prev) : true,
      menu: prev?.menu ?? (m.isChild ? "infantil" : null),
      allergies: prev?.allergies ?? [],
      allergyNotes: prev?.allergyNotes ?? "",
    };
  });
  const extras: AttendeeDraft[] =
    previous?.attendees.filter((a) => a.isExtra).map((a) => ({ ...a, attending: true })) ?? [];

  return {
    status: previous?.status ?? null,
    attendees: [...members, ...extras],
    needsBus: previous?.transport?.needsBus ?? null,
    routeId: previous?.transport?.routeId ?? null,
    offersCarSeats: previous?.transport?.offersCarSeats ?? null,
    carSeats: previous?.transport?.carSeats || 1,
    message: previous?.message ?? "",
  };
}

export function stepsFor(draft: RsvpDraft, event: WeddingEvent, group: GuestGroup): RsvpStep[] {
  if (draft.status !== "attending") return ["attendance", "message", "summary"];
  const steps: RsvpStep[] = ["attendance"];
  // Una invitación individual sin acompañante no necesita el paso de "quién viene".
  if (group.maxAttendees > 1) steps.push("guests");
  if (event.busRoutes.length > 0) steps.push("transport");
  steps.push("menu", "message", "summary");
  return steps;
}

export const attendingPeople = (draft: RsvpDraft) => draft.attendees.filter((a) => a.attending);

export function freeSeats(draft: RsvpDraft, group: GuestGroup) {
  return group.maxAttendees - attendingPeople(draft).length;
}

export function canAddExtra(draft: RsvpDraft, group: GuestGroup) {
  const extras = draft.attendees.filter((a) => a.isExtra).length;
  const namedSlots = group.maxAttendees - group.members.length;
  return extras < namedSlots && freeSeats(draft, group) > 0;
}

export function addExtra(draft: RsvpDraft): RsvpDraft {
  const used = new Set(draft.attendees.map((a) => a.guestId));
  let n = 1;
  while (used.has(`extra-${n}`)) n += 1;
  return {
    ...draft,
    attendees: [
      ...draft.attendees,
      {
        guestId: `extra-${n}`,
        name: "",
        isExtra: true,
        isChild: false,
        attending: true,
        menu: null,
        allergies: [],
        allergyNotes: "",
      },
    ],
  };
}

const menuIds = ["carne", "pescado", "vegetariano", "vegano", "infantil"] as const;
const allergyIds = ["gluten", "lactosa", "frutos-secos", "marisco", "huevo", "otros"] as const;

/** Esquema de una respuesta guardada. Valida datos no confiables (almacenamiento local, red). */
export const rsvpResponseSchema = z.object({
  groupId: z.string().min(1),
  status: z.enum(["attending", "declined"]),
  attendees: z
    .array(
      z.object({
        guestId: z.string().min(1),
        name: z.string().min(1).max(80),
        isExtra: z.boolean(),
        isChild: z.boolean(),
        menu: z.enum(menuIds).nullable(),
        allergies: z.array(z.enum(allergyIds)),
        allergyNotes: z.string().max(200),
      }),
    )
    .max(20),
  transport: z
    .object({
      needsBus: z.boolean(),
      routeId: z.string().nullable(),
      offersCarSeats: z.boolean(),
      carSeats: z.number().int().min(0).max(6),
    })
    .nullable(),
  message: z.string().max(500),
  updatedAt: z.iso.datetime(),
}) satisfies z.ZodType<RsvpResponse>;

/** Errores por campo: la clave es el id del control en el formulario. */
export type FieldErrors = Record<string, string>;

export function validateStep(step: RsvpStep, draft: RsvpDraft, group: GuestGroup): FieldErrors {
  const errors: FieldErrors = {};
  const people = attendingPeople(draft);

  switch (step) {
    case "attendance":
      if (!draft.status) errors.status = "Elige si podrás acompañarnos.";
      break;
    case "guests":
      if (people.length === 0) errors.guests = "Marca al menos a una persona que asistirá.";
      if (people.length > group.maxAttendees)
        errors.guests = `Tu invitación incluye ${group.maxAttendees} plazas como máximo.`;
      for (const a of draft.attendees) {
        if (a.isExtra && a.name.trim().length > 80)
          errors[`name-${a.guestId}`] = "Máximo 80 caracteres.";
        else if (a.isExtra && a.name.trim().length < 2)
          errors[`name-${a.guestId}`] = "Escribe el nombre de tu acompañante.";
      }
      break;
    case "transport":
      if (draft.needsBus === null) errors.needsBus = "Indica si necesitas plaza en el autobús.";
      if (draft.needsBus && !draft.routeId) errors.routeId = "Elige un punto de recogida.";
      if (draft.needsBus === false && draft.offersCarSeats === null)
        errors.offersCarSeats = "Indica si puedes ofrecer plazas en tu coche.";
      if (draft.offersCarSeats && (draft.carSeats < 1 || draft.carSeats > 6))
        errors.carSeats = "Entre 1 y 6 plazas.";
      break;
    case "menu":
      for (const a of people) {
        if (a.allergyNotes.length > 200) errors[`notes-${a.guestId}`] = "Máximo 200 caracteres.";
        if (!a.menu)
          errors[`menu-${a.guestId}`] = `Elige un menú para ${a.name || "tu acompañante"}.`;
        if (a.allergies.includes("otros") && a.allergyNotes.trim().length < 3)
          errors[`notes-${a.guestId}`] = "Cuéntanos qué alergia o intolerancia tiene.";
      }
      break;
    case "message":
      if (draft.message.length > 500) errors.message = "Máximo 500 caracteres.";
      break;
    case "summary":
      break;
  }
  return errors;
}

export function toResponse(draft: RsvpDraft, group: GuestGroup, now = new Date()): RsvpResponse {
  if (!draft.status) throw new Error("La respuesta no tiene estado");
  const attending = draft.status === "attending";
  return {
    groupId: group.id,
    status: draft.status,
    attendees: attending
      ? attendingPeople(draft).map((a) => ({
          guestId: a.guestId,
          name: a.name.trim(),
          isExtra: a.isExtra,
          isChild: a.isChild,
          menu: a.menu as MenuId,
          allergies: a.allergies as AllergyId[],
          allergyNotes: a.allergies.includes("otros") ? a.allergyNotes.trim() : "",
        }))
      : [],
    transport: attending
      ? {
          needsBus: Boolean(draft.needsBus),
          routeId: draft.needsBus ? draft.routeId : null,
          offersCarSeats: !draft.needsBus && Boolean(draft.offersCarSeats),
          carSeats: !draft.needsBus && draft.offersCarSeats ? draft.carSeats : 0,
        }
      : null,
    message: draft.message.trim(),
    updatedAt: now.toISOString(),
  };
}

export function isDeadlinePassed(event: WeddingEvent, group: GuestGroup, now = new Date()) {
  return Boolean(group.demo?.deadlinePassed) || now.getTime() > Date.parse(event.rsvpDeadline);
}
