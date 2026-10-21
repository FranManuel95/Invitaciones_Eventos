import { z } from "zod";
import { issuesByPath } from "@/lib/editor/draft";

/*
 * Datos de una invitación (grupo) tal como llegan del formulario o del CSV. Los límites son los
 * de la base de datos (supabase/migrations). La primera persona es la principal.
 */

export const memberInputSchema = z.object({
  id: z.uuid().optional(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().max(120),
  isChild: z.boolean(),
});

export const groupInputSchema = z
  .object({
    id: z.uuid().optional(),
    displayName: z.string().trim().min(1).max(120),
    category: z.string().trim().max(60),
    maxAttendees: z.number().int().min(1).max(20),
    phone: z
      .string()
      .trim()
      .max(30)
      .regex(/^[+0-9 ().-]*$/, "Escribe solo números, espacios y el prefijo con +."),
    members: z.array(memberInputSchema).min(1, "Añade al menos una persona.").max(20),
  })
  .refine((g) => g.maxAttendees >= g.members.length, {
    message: "Las plazas no pueden ser menos que las personas de la invitación.",
    path: ["maxAttendees"],
  });

export type GroupInput = z.infer<typeof groupInputSchema>;
export type MemberInput = z.infer<typeof memberInputSchema>;

export type GroupCheck =
  { ok: true; group: GroupInput } | { ok: false; errors: Map<string, string> };

export function validateGroup(input: unknown): GroupCheck {
  const result = groupInputSchema.safeParse(input);
  if (result.success) return { ok: true, group: result.data };
  return { ok: false, errors: issuesByPath(result.error.issues) };
}
