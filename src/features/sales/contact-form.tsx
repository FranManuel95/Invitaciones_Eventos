"use client";

import { Check } from "lucide-react";
import { useActionState, type ReactNode } from "react";
import { requestContact, type ContactResult } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { FieldError, TextArea, TextInput } from "@/components/ui/fields";
import type { ContactInput } from "@/lib/sales/contact";

/** Formulario de la página de venta. Funciona también sin JavaScript (acción del servidor). */
export function ContactForm() {
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(
    requestContact,
    null,
  );

  if (state?.ok) {
    return (
      <div role="status" className="rounded-[3px] border border-line bg-paper p-6">
        <p className="flex items-center gap-2 font-display text-[1.75rem] leading-tight text-ink">
          <Check aria-hidden className="size-6 text-success" />
          Recibido
        </p>
        <p className="mt-2 max-w-[48ch] text-[0.9375rem] text-ink-soft">
          Os escribiremos al correo que nos habéis dado para preparar vuestra invitación.
        </p>
      </div>
    );
  }

  const values = state?.values;
  const errors = state?.ok === false ? state.errors : undefined;
  const field = (name: keyof ContactInput) => ({
    id: `contacto-${name}`,
    name,
    defaultValue: values?.[name] ?? "",
    "aria-invalid": errors?.[name] ? true : undefined,
    "aria-describedby": errors?.[name] ? `contacto-${name}-error` : undefined,
  });

  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Labeled label="Vuestros nombres" name="names" error={errors?.names}>
          <TextInput {...field("names")} autoComplete="name" required maxLength={120} />
        </Labeled>
        <Labeled label="Correo" name="email" error={errors?.email}>
          <TextInput {...field("email")} type="email" autoComplete="email" required />
        </Labeled>
      </div>
      <Labeled
        label="Fecha de la boda (si ya la tenéis)"
        name="weddingDate"
        error={errors?.weddingDate}
      >
        <TextInput {...field("weddingDate")} type="date" className="sm:max-w-60" />
      </Labeled>
      <Labeled label="Contadnos lo que queráis (opcional)" name="message" error={errors?.message}>
        <TextArea {...field("message")} rows={4} maxLength={2000} />
      </Labeled>
      {/* Campo trampa para robots: oculto a las personas y a los lectores de pantalla. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contacto-web">No rellenes este campo</label>
        <input id="contacto-web" name="web" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="text-[0.8125rem] text-muted">
        Solo usaremos estos datos para responderos. No los compartimos con nadie.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enviando…" : "Pedir nuestra invitación"}
        </Button>
        <p role="status" aria-live="polite" className="text-[0.875rem] font-medium text-danger">
          {state?.ok === false ? state.error : ""}
        </p>
      </div>
    </form>
  );
}

function Labeled({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: keyof ContactInput;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`contacto-${name}`} className="mb-1.5 block text-[0.875rem] text-ink">
        {label}
      </label>
      {children}
      <FieldError id={`contacto-${name}-error`} message={error} />
    </div>
  );
}
