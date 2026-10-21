/*
 * Envío de invitaciones: el enlace personal, el mensaje de WhatsApp y el número de teléfono.
 * WhatsApp se abre con wa.me (no hace falta ninguna cuenta de empresa ni API).
 */

/** «1 invitación», «3 invitaciones». */
export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Deja solo dígitos con prefijo de país; los móviles y fijos españoles de 9 cifras ganan el 34. */
export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (/^[6-9]\d{8}$/.test(digits)) digits = `34${digits}`;
  digits = digits.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

export function invitationUrl(origin: string, token: string) {
  return `${origin}/i/${token}`;
}

/** Mensaje cercano, en singular o plural según cuántas personas haya en la invitación. */
export function inviteMessage(
  couple: { first: string; second: string },
  group: { displayName: string; members: unknown[]; maxAttendees: number },
  url: string,
) {
  const plural = group.members.length > 1 || group.maxAttendees > 1;
  return [
    `¡Hola, ${group.displayName}!`,
    `${couple.first} y ${couple.second} nos casamos y ${plural ? "queremos que estéis" : "queremos que estés"} con nosotros.`,
    `Aquí ${plural ? "tenéis vuestra" : "tienes tu"} invitación, con todos los detalles y para confirmar asistencia:`,
    url,
  ].join("\n\n");
}

export function whatsappUrl(text: string, phone?: string | null) {
  const number = normalizePhone(phone);
  return `https://wa.me/${number ?? ""}?text=${encodeURIComponent(text)}`;
}
