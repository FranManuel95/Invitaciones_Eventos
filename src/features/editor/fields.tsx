"use client";

import { clsx } from "clsx";
import { createContext, use, useId, useState, type ReactNode } from "react";
import { TextArea, TextInput } from "@/components/ui/fields";
import type { Stage } from "@/features/invitation/experience";
import { errorFor, getIn, type Draft, type Path } from "@/lib/editor/draft";

/*
 * Campos del editor enlazados al borrador por ruta. Cada campo lee su valor, escribe con
 * `set` y muestra el error de validación de su ruta (o de lo que cuelga de ella).
 */

interface EditorContextValue {
  draft: Draft;
  set: (path: Path, value: unknown) => void;
  setTheme: (theme: Draft["theme"]) => void;
  errors: Map<string, string>;
  /** Id del evento real (para subir fotos); null en la demo. */
  eventId: string | null;
  /** Lleva la vista previa a una pantalla (p. ej. al sobre mientras se elige el papel). */
  showStage: (stage: Stage) => void;
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor() {
  const value = use(EditorContext);
  if (!value) throw new Error("useEditor fuera del editor");
  return value;
}

const fieldId = (path: Path) => `campo-${path.join("-")}`;

export function Field({
  label,
  hint,
  path,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  path: Path;
  htmlFor?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
  className?: string;
}) {
  const { errors } = useEditor();
  const id = htmlFor ?? fieldId(path);
  const error = errorFor(errors, path);
  const describedBy = [hint ? `${id}-ayuda` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy || undefined,
      })}
      {hint ? (
        <p id={`${id}-ayuda`} className="mt-1.5 text-[0.8125rem] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Texto de una línea o de varias, enlazado a una ruta del contenido. */
export function TextField({
  label,
  hint,
  path,
  multiline = false,
  maxLength,
  type = "text",
  placeholder,
  className,
}: {
  label: string;
  hint?: string;
  path: Path;
  multiline?: boolean;
  maxLength?: number;
  type?: "text" | "time" | "tel";
  placeholder?: string;
  className?: string;
}) {
  const { draft, set } = useEditor();
  const value = String(getIn(draft.content, path) ?? "");
  return (
    <Field label={label} hint={hint} path={path} className={className}>
      {(props) =>
        multiline ? (
          <TextArea
            {...props}
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e) => set(path, e.target.value)}
          />
        ) : (
          <TextInput
            {...props}
            type={type}
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e) => set(path, e.target.value)}
          />
        )
      }
    </Field>
  );
}

/** Número entero. */
export function NumberField({
  label,
  path,
  min,
  max,
  className,
}: {
  label: string;
  path: Path;
  min: number;
  max: number;
  className?: string;
}) {
  const { draft, set } = useEditor();
  const value = Number(getIn(draft.content, path) ?? 0);
  return (
    <Field label={label} path={path} className={className}>
      {(props) => (
        <TextInput
          {...props}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => set(path, Math.round(Number(e.target.value) || 0))}
        />
      )}
    </Field>
  );
}

/** Lista de valores separados por comas (p. ej. las vueltas de un autobús). */
export function CommaListField({
  label,
  hint,
  path,
  className,
}: {
  label: string;
  hint?: string;
  path: Path;
  className?: string;
}) {
  const { draft, set } = useEditor();
  const current = (getIn(draft.content, path) as string[] | undefined) ?? [];
  // El texto se guarda aparte para no perder la coma mientras se escribe.
  const [text, setText] = useState(current.join(", "));
  return (
    <Field label={label} hint={hint} path={path} className={className}>
      {(props) => (
        <TextInput
          {...props}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            set(
              path,
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            );
          }}
        />
      )}
    </Field>
  );
}

/** Desplegable con opciones fijas. */
export function SelectField({
  label,
  path,
  options,
  className,
}: {
  label: string;
  path: Path;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const { draft, set } = useEditor();
  const value = String(getIn(draft.content, path) ?? "");
  return (
    <Field label={label} path={path} className={className}>
      {(props) => (
        <select
          {...props}
          value={value}
          onChange={(e) => set(path, e.target.value)}
          className="h-11 w-full rounded-md border border-line bg-paper px-3 text-[0.9375rem] text-ink transition-colors hover:border-ink/30 focus:border-ink focus:outline-none aria-[invalid=true]:border-danger"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/** Bloque con título dentro de una pestaña. */
export function Group({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={clsx("border-t border-line pt-6 first:border-t-0 first:pt-0", className)}
    >
      <h3 id={id} className="font-display text-[1.375rem] leading-tight text-ink">
        {title}
      </h3>
      {description ? <p className="mt-1 text-[0.875rem] text-muted">{description}</p> : null}
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}
