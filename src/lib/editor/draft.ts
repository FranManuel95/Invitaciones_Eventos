import type { z } from "zod";
import { eventContentSchema, type EventContent } from "@/lib/domain/event-schema";
import type { Theme } from "@/lib/theme";
import { themeInputSchema } from "@/lib/theme/schema";

/*
 * Borrador del editor: el contenido del evento y su tema. Se edita por rutas
 * (["program", 0, "title"]) y se valida entero con los mismos esquemas que usa la invitación.
 */

export type Path = readonly (string | number)[];

export interface Draft {
  content: EventContent;
  theme: Theme;
}

export const pathKey = (path: Path) => path.join(".");

export function getIn(value: unknown, path: Path): unknown {
  let current = value;
  for (const key of path) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string | number, unknown>)[key];
  }
  return current;
}

/** Copia inmutable con el valor cambiado; solo se copian los objetos del camino. */
export function setIn<T>(value: T, path: Path, next: unknown): T {
  if (path.length === 0) return next as T;
  const [key, ...rest] = path as [string | number, ...(string | number)[]];
  const source = (value ?? (typeof key === "number" ? [] : {})) as Record<string | number, unknown>;
  const copy = (Array.isArray(source) ? [...source] : { ...source }) as Record<
    string | number,
    unknown
  >;
  copy[key] = setIn(source[key], rest, next);
  return copy as T;
}

/** Mensaje en español para un error de Zod. */
export function messageFor(issue: z.core.$ZodIssue): string {
  // Los mensajes propios del esquema (ya en español) se respetan; los de Zod se traducen.
  if (!/^(Too |Invalid|Expected)/.test(issue.message)) return issue.message;
  switch (issue.code) {
    case "too_small":
      return issue.origin === "string"
        ? "Este campo no puede quedar vacío."
        : `Tiene que ser como mínimo ${String(issue.minimum)}.`;
    case "too_big":
      return issue.origin === "string"
        ? `Es demasiado largo: máximo ${String(issue.maximum)} caracteres.`
        : issue.origin === "array"
          ? `Como máximo ${String(issue.maximum)} elementos.`
          : `Tiene que ser como máximo ${String(issue.maximum)}.`;
    case "invalid_format":
      return "El formato no es válido.";
    case "invalid_value":
      return "Elige una de las opciones.";
    default:
      return "Revisa este campo.";
  }
}

/** Errores por ruta («program.0.time» → mensaje). */
export function issuesByPath(issues: readonly z.core.$ZodIssue[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const issue of issues) {
    const key = pathKey(issue.path as Path);
    if (!map.has(key)) map.set(key, messageFor(issue));
  }
  return map;
}

/** Primer error de un campo o de algo que cuelga de él (p. ej. una vuelta de autobús). */
export function errorFor(errors: Map<string, string>, path: Path): string | undefined {
  const key = pathKey(path);
  for (const [k, message] of errors) {
    if (k === key || k.startsWith(`${key}.`)) return message;
  }
  return undefined;
}

export type DraftCheck = { ok: true; draft: Draft } | { ok: false; errors: Map<string, string> };

/** Valida un borrador completo (en el editor y, otra vez, en el servidor al guardar). */
export function validateDraft(input: { content: unknown; theme: unknown }): DraftCheck {
  const content = eventContentSchema.safeParse(input.content);
  const theme = themeInputSchema.safeParse(input.theme);
  if (content.success && theme.success) {
    return { ok: true, draft: { content: content.data, theme: theme.data } };
  }
  const errors = issuesByPath(content.success ? [] : content.error.issues);
  if (!theme.success) errors.set("theme", "El tema no es válido.");
  return { ok: false, errors };
}
