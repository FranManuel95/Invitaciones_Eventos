import type { WeddingEvent } from "@/lib/domain/types";

/*
 * Lo que empieza apagado y cada cliente puede encender al editar su invitación:
 *
 * - La lista de regalos (con la cuenta y el Bizum): es la sección «Regalo». Los temas nuevos y las
 *   plantillas la llevan oculta (`DEFAULT_THEME.hidden`); se enciende en Estilo → Secciones.
 * - La vestimenta («Antes de venir»): se ve solo si `dressCode.enabled` es verdadero; se enciende
 *   en Textos → Código de vestimenta.
 *
 * Los datos, las acciones y los controles del editor y del panel están siempre ahí.
 */

/** El evento tal como lo ve el invitado: sin vestimenta si el cliente no la ha encendido. */
export function withFeatures(event: WeddingEvent): WeddingEvent {
  if (event.dressCode.enabled === true) return event;
  return { ...event, dressCode: { title: "", detail: "", palette: [], examples: [] } };
}
