import { z } from "zod";

/*
 * Libro de firmas: mensajes que los invitados dejan a la vista de los demás (si la pareja lo
 * activa), y las canciones pedidas al confirmar, sin autor. Los mensajes viven en la tabla
 * guestbook_messages; la pareja los modera desde el panel ocultándolos.
 */

export const GUESTBOOK_MAX_LENGTH = 400;
/** Mensajes que puede dejar cada invitación. */
export const GUESTBOOK_MAX_PER_GROUP = 3;

export interface GuestbookMessage {
  id: string;
  /** Nombre de la invitación que firma («Familia García»). */
  name: string;
  body: string;
  createdAt: string;
  mine: boolean;
}

/** Lo que ve una invitación: los mensajes visibles (el más reciente primero) y las canciones. */
export interface GuestbookState {
  messages: GuestbookMessage[];
  songs: string[];
}

export const EMPTY_GUESTBOOK: GuestbookState = { messages: [], songs: [] };

const stateSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string(),
      name: z.string().max(200),
      body: z.string().max(GUESTBOOK_MAX_LENGTH),
      createdAt: z.string(),
      mine: z.boolean(),
    }),
  ),
  songs: z.array(z.string().max(120)),
});

/** Lee lo que devuelve la base de datos; si no cuadra (o aún no existe), libro vacío. */
export function parseGuestbook(raw: unknown): GuestbookState {
  const parsed = stateSchema.safeParse(raw);
  return parsed.success ? parsed.data : EMPTY_GUESTBOOK;
}

/** El mensaje tal como se guarda: sin espacios de más ni saltos de línea. */
export const cleanMessage = (text: string) => text.replace(/\s+/g, " ").trim();

/** Por qué no se puede firmar con ese texto (null si se puede). */
export function messageError(text: string, state: GuestbookState): string | null {
  const body = cleanMessage(text);
  if (!body) return "Escribe unas palabras antes de firmar.";
  if (body.length > GUESTBOOK_MAX_LENGTH) return `Máximo ${GUESTBOOK_MAX_LENGTH} caracteres.`;
  if (state.messages.filter((m) => m.mine).length >= GUESTBOOK_MAX_PER_GROUP) {
    return `Ya habéis dejado ${GUESTBOOK_MAX_PER_GROUP} mensajes.`;
  }
  return null;
}

/** Añade un mensaje propio en local (demo y vista previa). */
export function addOwnMessage(
  state: GuestbookState,
  name: string,
  text: string,
  now: Date,
): GuestbookState {
  const message: GuestbookMessage = {
    id: `local-${now.getTime()}`,
    name,
    body: cleanMessage(text),
    createdAt: now.toISOString(),
    mine: true,
  };
  return { ...state, messages: [message, ...state.messages] };
}

/** Un mensaje visto desde el panel: quién lo dejó y si está oculto. */
export interface GuestbookEntry {
  id: string;
  groupName: string;
  body: string;
  createdAt: string;
  hidden: boolean;
}
