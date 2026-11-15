import type { WeddingEvent } from "@/lib/domain/types";

/**
 * Para grabar la demo (`?grabar=1`) se esconde lo que no queda bien en un vídeo: la vestimenta
 * (con sus colores y figuras) y los datos de pago del regalo (Bizum y cuenta). Los textos vacíos
 * hacen que esas secciones no se pinten; las invitaciones reales no pasan por aquí.
 */
export function forRecording(event: WeddingEvent): WeddingEvent {
  return {
    ...event,
    dressCode: { title: "", detail: "", palette: [], examples: [] },
    gift: { ...event.gift, iban: "", bizum: "" },
  };
}
