"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { requestContact, type ContactResult } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { FieldError, TextArea, TextInput } from "@/components/ui/fields";
import type { ContactInput } from "@/lib/sales/contact";
import { PLAN_IDS, PLANS, type PlanId } from "@/lib/sales/plans";
import { PLAN_EVENT } from "./plan-event";

type Choice = PlanId | "no-se";

/** Formulario de la página de venta. Funciona también sin JavaScript (acción del servidor). */
export function ContactForm() {
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(
    requestContact,
    null,
  );
  const [plan, setPlan] = useState<Choice>("no-se");
  // Las tarjetas de precio dejan elegido su paquete al pulsar «Pedir».
  useEffect(() => {
    const pick = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if ((PLAN_IDS as readonly string[]).includes(id)) setPlan(id as PlanId);
    };
    window.addEventListener(PLAN_EVENT, pick);
    return () => window.removeEventListener(PLAN_EVENT, pick);
  }, []);

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
      <fieldset>
        <legend className="mb-2 block text-[0.875rem] text-ink">¿Qué os interesa?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ...PLANS.map((p) => ({ id: p.id as Choice, label: `${p.name} · ${p.price} €` })),
            { id: "no-se" as Choice, label: "Aún no lo sé" },
          ].map((o) => (
            <label
              key={o.id}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[3px] border border-line bg-paper px-3.5 py-2 text-[0.9375rem] text-ink has-[:checked]:border-gold has-[:checked]:bg-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold"
            >
              <input
                type="radio"
                name="plan"
                value={o.id}
                checked={plan === o.id}
                onChange={() => setPlan(o.id)}
                className="size-4 accent-[var(--oro-tinta,#8a6d2f)]"
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
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
        Solo usaremos estos datos para responderos. No los compartimos con nadie. Más detalles en la{" "}
        <Link href="/privacidad" className="text-ink underline decoration-gold underline-offset-4">
          política de privacidad
        </Link>
        .
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
