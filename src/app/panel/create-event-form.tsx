"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/fields";
import { EVENT_KINDS, KIND_WORDS, type EventKind } from "@/lib/event-kind";
import { createEvent, type ActionState } from "./actions";

const label = "mb-1.5 block text-[0.875rem] text-ink";

/** Alta de un evento: qué se celebra, quién y cuándo. Lo demás se cambia después. */
export function CreateEventForm({ minDate }: { minDate: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createEvent, {
    error: null,
  });
  const [kind, setKind] = useState<EventKind>("boda");
  const pair = KIND_WORDS[kind].pair;

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="kind" className={label}>
          Qué celebráis
        </label>
        <select
          id="kind"
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as EventKind)}
          className="h-11 w-full rounded-md border border-line bg-paper px-3 text-[0.9375rem] text-ink transition-colors hover:border-ink/30 focus:border-ink focus:outline-none sm:max-w-64"
        >
          {EVENT_KINDS.map((k) => (
            <option key={k} value={k}>
              {KIND_WORDS[k].label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="first" className={label}>
            {pair ? "Nombre de uno" : "Nombre"}
          </label>
          <TextInput
            id="first"
            name="first"
            required
            maxLength={40}
            autoComplete="off"
            placeholder={pair ? "Por ejemplo, María" : "Por ejemplo, Lucía"}
          />
        </div>
        <div>
          <label htmlFor="second" className={label}>
            {pair ? "Nombre del otro" : "Otro nombre (opcional)"}
          </label>
          <TextInput
            id="second"
            name="second"
            required={pair}
            maxLength={40}
            autoComplete="off"
            placeholder={pair ? "Por ejemplo, Daniel" : undefined}
            aria-describedby={pair ? undefined : "second-hint"}
          />
          {pair ? null : (
            <p id="second-hint" className="mt-1.5 text-[0.8125rem] text-muted">
              Si lo celebráis dos, por ejemplo unos mellizos.
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="date" className={label}>
          Fecha
        </label>
        <TextInput
          id="date"
          name="date"
          type="date"
          min={minDate}
          required
          aria-describedby="date-hint"
          className="sm:max-w-64"
        />
        <p id="date-hint" className="mt-1.5 text-[0.8125rem] text-muted">
          Si aún no es segura, poned una aproximada: se cambia en el editor.
        </p>
      </div>
      <label className="flex min-h-11 items-start gap-3 text-[0.9375rem] text-ink-soft">
        <input type="checkbox" name="sample" defaultChecked className="mt-1 size-4 accent-ink" />
        <span>
          Añadir invitados de ejemplo para probarlo
          <span className="block text-[0.8125rem] text-muted">
            Unas pocas invitaciones ficticias para ver cómo funciona. Se borran cuando queráis.
          </span>
        </span>
      </label>
      <p role="status" aria-live="polite" className="min-h-5 text-[0.875rem] text-danger">
        {state.error}
      </p>
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Creando…" : "Crear invitación"}
      </Button>
    </form>
  );
}
