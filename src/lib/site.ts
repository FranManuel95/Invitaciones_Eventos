import "server-only";

/*
 * Ajustes del sitio que dependen del despliegue (variables de entorno de Vercel, nunca en el
 * repositorio). Cambiarlos requiere volver a desplegar.
 *
 * - SITE_URL: dirección pública con vuestro dominio (https://…). Mientras no esté, nada se indexa:
 *   las direcciones de prueba de Vercel no deben aparecer en buscadores.
 * - SIGNUP_OPEN: «false» cierra el alta libre de cuentas en /entrar (las parejas la piden por el
 *   formulario). Para cerrarla de verdad, desactivad también el alta en Supabase.
 * - LEGAL_*: datos del titular para el aviso legal y la política de privacidad.
 */

export function siteUrl(): string | null {
  const url = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  return url && /^https:\/\/[^\s/]+$/.test(url) ? url : null;
}

export const isIndexable = () => siteUrl() !== null;

export const signupOpen = () => process.env.SIGNUP_OPEN?.trim().toLowerCase() !== "false";

export interface LegalInfo {
  holder: string | null;
  taxId: string | null;
  address: string | null;
  email: string | null;
}

export function legalInfo(): LegalInfo {
  const read = (v: string | undefined) => v?.trim() || null;
  return {
    holder: read(process.env.LEGAL_TITULAR),
    taxId: read(process.env.LEGAL_NIF),
    address: read(process.env.LEGAL_DOMICILIO),
    email: read(process.env.LEGAL_EMAIL),
  };
}

/** Los textos legales solo están completos cuando están todos los datos del titular. */
export const legalComplete = (info: LegalInfo) => Object.values(info).every(Boolean);
