import type { Stage } from "@/features/invitation/experience";
import type { GuestGroup } from "@/lib/domain/types";

/*
 * Mensajes entre el editor y su vista previa (un iframe del mismo origen). La vista previa
 * comprueba el origen y vuelve a validar el borrador antes de pintarlo.
 */

export type ToPreview =
  { type: "draft"; content: unknown; theme: unknown } | { type: "stage"; stage: Stage };

export type FromPreview = { type: "ready" };

export const PREVIEW_STAGES: { stage: Stage; label: string }[] = [
  { stage: "cover", label: "Portada" },
  { stage: "envelope", label: "Sobre" },
  { stage: "letter", label: "Carta" },
  { stage: "content", label: "Invitación" },
];

/** Invitado ficticio de la vista previa: sus respuestas no se guardan en ninguna parte real. */
export const PREVIEW_GROUP: GuestGroup = {
  id: "vista-previa",
  token: "vista-previa",
  displayName: "Familia Ejemplo",
  category: "Familia",
  maxAttendees: 2,
  members: [
    { id: "vp-1", firstName: "Ana", lastName: "Ejemplo", isPrimary: true },
    { id: "vp-2", firstName: "Luis", lastName: "Ejemplo", isPrimary: false },
  ],
};
