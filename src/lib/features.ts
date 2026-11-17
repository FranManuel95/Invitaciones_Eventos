import type { WeddingEvent } from "@/lib/domain/types";
import type { SectionId } from "@/lib/theme";

/*
 * Funciones apagadas en todas las invitaciones (demo, vista previa y reales). Se pueden volver a
 * encender cambiando el valor: el código, los datos guardados y las pruebas siguen ahí.
 *
 * - `gifts`: la sección «Regalo» entera: la lista, las reservas, el número de cuenta y el Bizum.
 * - `dressCode`: la vestimenta (estilo, colores y figuras) de «Antes de venir».
 */
export const FEATURES = { gifts: false, dressCode: false } as const;

/** Secciones que no se pintan, ni se pueden elegir en el editor, aunque estén en el tema. */
export const DISABLED_SECTIONS: readonly SectionId[] = FEATURES.gifts ? [] : ["regalo"];

/** El evento sin lo que está apagado: los textos vacíos hacen que no se pinte. */
export function withFeatures(event: WeddingEvent): WeddingEvent {
  if (FEATURES.gifts && FEATURES.dressCode) return event;
  return {
    ...event,
    dressCode: FEATURES.dressCode
      ? event.dressCode
      : { title: "", detail: "", palette: [], examples: [] },
    gift: FEATURES.gifts ? event.gift : { message: "", holder: "", iban: "", bizum: "", items: [] },
  };
}
