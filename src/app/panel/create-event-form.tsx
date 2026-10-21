"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/fields";
import { createEvent, type ActionState } from "./actions";

export function CreateEventForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createEvent, {
    error: null,
  });
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first" className="mb-1.5 block text-[0.875rem] text-ink">
            Nombre de uno
          </label>
          <TextInput id="first" name="first" required maxLength={40} autoComplete="off" />
        </div>
        <div>
          <label htmlFor="second" className="mb-1.5 block text-[0.875rem] text-ink">
            Nombre del otro
          </label>
          <TextInput id="second" name="second" required maxLength={40} autoComplete="off" />
        </div>
      </div>
      <div>
        <label htmlFor="date" className="mb-1.5 block text-[0.875rem] text-ink">
          Fecha de la boda
        </label>
        <TextInput id="date" name="date" type="date" required className="sm:max-w-56" />
      </div>
      <label className="flex items-start gap-3 text-[0.9375rem] text-ink-soft">
        <input type="checkbox" name="sample" defaultChecked className="mt-1 size-4 accent-ink" />
        Añadir invitados de ejemplo para probarlo (se pueden borrar después)
      </label>
      <p role="status" aria-live="polite" className="min-h-5 text-[0.875rem] text-danger">
        {state.error}
      </p>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creando…" : "Crear invitación"}
      </Button>
    </form>
  );
}
