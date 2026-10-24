"use server";

import { validateContact, type ContactErrors, type ContactInput } from "@/lib/sales/contact";
import { createAnonClient } from "@/lib/supabase/server";

export type ContactResult =
  { ok: true } | { ok: false; error: string; errors?: ContactErrors; values: ContactInput };

/**
 * Guarda una solicitud de la página de venta. Se valida aquí (frontera de confianza) y la
 * función request_contact limita los envíos por correo y por día. «web» es un campo trampa:
 * las personas no lo ven; si llega relleno, se da por buena sin guardar nada.
 */
export async function requestContact(
  _prev: ContactResult | null,
  form: FormData,
): Promise<ContactResult> {
  const values: ContactInput = {
    names: String(form.get("names") ?? ""),
    email: String(form.get("email") ?? ""),
    weddingDate: String(form.get("weddingDate") ?? ""),
    message: String(form.get("message") ?? ""),
  };
  if (String(form.get("web") ?? "")) return { ok: true };
  const valid = validateContact(values);
  if (!valid.ok) {
    return {
      ok: false,
      error: "Revisad los campos marcados.",
      errors: valid.errors,
      values,
    };
  }
  const supabase = createAnonClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Ahora mismo no podemos recibir mensajes. Probad más tarde.",
      values,
    };
  }
  const { error } = await supabase.rpc("request_contact", {
    p_names: valid.data.names,
    p_email: valid.data.email,
    p_wedding_date: valid.data.weddingDate || null,
    p_message: valid.data.message,
  });
  if (error) {
    return {
      ok: false,
      error: error.message.includes("Demasiadas")
        ? "Ya hemos recibido vuestros mensajes de hoy. Os escribiremos pronto."
        : "No hemos podido enviarlo. Comprobad la conexión y probad otra vez.",
      values,
    };
  }
  return { ok: true };
}
