import { z } from "zod";

/*
 * Solicitud de la página de venta: una pareja deja sus datos para que le preparemos la
 * invitación. Se guarda en contact_requests (solo se lee desde el panel de Supabase).
 */

/** Precio de partida: pago único por boda. */
export const PRICE_EUR = 129;

export const contactSchema = z.object({
  names: z.string().trim().min(1, "Escribid vuestros nombres.").max(120, "Es demasiado largo."),
  email: z
    .string()
    .trim()
    .max(200, "Es demasiado largo.")
    .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Revisad el correo: le falta algo."),
  weddingDate: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Elegid la fecha en el calendario."),
  message: z.string().trim().max(2000, "El mensaje es demasiado largo (2000 caracteres)."),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

/** Valida el formulario y devuelve los datos limpios o un error por campo. */
export function validateContact(
  input: ContactInput,
): { ok: true; data: z.output<typeof contactSchema> } | { ok: false; errors: ContactErrors } {
  const parsed = contactSchema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: ContactErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof ContactInput;
    errors[field] ??= issue.message;
  }
  return { ok: false, errors };
}
