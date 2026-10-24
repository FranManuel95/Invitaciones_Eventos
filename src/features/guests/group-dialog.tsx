"use client";

import { Plus, Trash2 } from "lucide-react";
import { useId, useState, useTransition, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/fields";
import { saveGroup } from "@/app/panel/[evento]/invitaciones/actions";
import type { GuestGroup } from "@/lib/domain/types";
import { validateGroup, type GroupInput } from "@/lib/guests/group-input";

type FormState = Omit<GroupInput, "maxAttendees"> & { maxAttendees: string };

const emptyMember = () => ({ firstName: "", lastName: "", isChild: false });

function fromGroup(group?: GuestGroup): FormState {
  if (!group) {
    return {
      displayName: "",
      category: "Familia",
      maxAttendees: "1",
      phone: "",
      members: [emptyMember()],
    };
  }
  return {
    id: group.id,
    displayName: group.displayName,
    category: group.category,
    maxAttendees: String(group.maxAttendees),
    phone: group.phone ?? "",
    members: group.members.map((m) => ({
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      isChild: Boolean(m.isChild),
    })),
  };
}

function Labeled({
  id,
  label,
  error,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      {children}
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

/** Alta o edición de una invitación: nombre, categoría, plazas, teléfono y personas. */
export function GroupDialog({
  eventId,
  group,
  categories,
  open,
  onClose,
}: {
  eventId: string;
  /** Sin grupo: alta de una invitación nueva. */
  group?: GuestGroup;
  categories: string[];
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => fromGroup(group));
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const field = (name: string) => ({
    id: id(name),
    "aria-invalid": errors.has(name),
    "aria-describedby": errors.has(name) ? `${id(name)}-error` : undefined,
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const updateMember = (index: number, patch: Partial<FormState["members"][number]>) =>
    setForm((f) => ({
      ...f,
      members: f.members.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));

  function submit() {
    const input = { ...form, maxAttendees: Number(form.maxAttendees) };
    const check = validateGroup(input);
    if (!check.ok) {
      setErrors(check.errors);
      // Lleva el foco al primer campo con error.
      const [first] = check.errors.keys();
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    setErrors(new Map());
    start(async () => {
      const result = await saveGroup(eventId, check.group);
      if (result.ok) onClose();
      else setServerError(result.error);
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={group ? `Editar «${group.displayName}»` : "Nueva invitación"}
      description="Una invitación por familia, pareja o persona: todos comparten el mismo enlace."
      wide
    >
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="grid gap-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Labeled
            id={id("displayName")}
            label="Nombre de la invitación"
            hint="Así se saluda en el sobre: «Familia García», «Lucía y Pablo»…"
            error={errors.get("displayName")}
            className="sm:col-span-2"
          >
            <TextInput
              {...field("displayName")}
              value={form.displayName}
              maxLength={120}
              onChange={(e) => update("displayName", e.target.value)}
            />
          </Labeled>
          <Labeled id={id("category")} label="Categoría" error={errors.get("category")}>
            <TextInput
              {...field("category")}
              list={id("categorias")}
              value={form.category}
              maxLength={60}
              onChange={(e) => update("category", e.target.value)}
            />
            <datalist id={id("categorias")}>
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Labeled>
          <Labeled
            id={id("maxAttendees")}
            label="Plazas"
            hint="Incluye acompañantes sin nombre todavía."
            error={errors.get("maxAttendees")}
          >
            <TextInput
              {...field("maxAttendees")}
              type="number"
              inputMode="numeric"
              min={1}
              max={20}
              value={form.maxAttendees}
              onChange={(e) => update("maxAttendees", e.target.value)}
            />
          </Labeled>
          <Labeled
            id={id("phone")}
            label="Teléfono (opcional)"
            hint="Para abrir su chat de WhatsApp directamente."
            error={errors.get("phone")}
            className="sm:col-span-2"
          >
            <TextInput
              {...field("phone")}
              type="tel"
              autoComplete="off"
              value={form.phone}
              maxLength={30}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Labeled>
        </div>

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-[0.875rem] font-medium text-ink">Personas</legend>
          {errors.get("members") ? (
            <p className="text-[0.8125rem] font-medium text-danger">{errors.get("members")}</p>
          ) : null}
          {form.members.map((m, i) => (
            <div
              key={m.id ?? `nueva-${i}`}
              className="grid gap-3 rounded-md border border-line p-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
            >
              <Labeled
                id={id(`members.${i}.firstName`)}
                label={i === 0 ? "Nombre (principal)" : "Nombre"}
                error={errors.get(`members.${i}.firstName`)}
              >
                <TextInput
                  {...field(`members.${i}.firstName`)}
                  value={m.firstName}
                  maxLength={80}
                  onChange={(e) => updateMember(i, { firstName: e.target.value })}
                />
              </Labeled>
              <Labeled id={id(`members.${i}.lastName`)} label="Apellidos">
                <TextInput
                  {...field(`members.${i}.lastName`)}
                  value={m.lastName}
                  maxLength={120}
                  onChange={(e) => updateMember(i, { lastName: e.target.value })}
                />
              </Labeled>
              <label className="flex h-11 items-center gap-2 text-[0.875rem] text-ink">
                <input
                  type="checkbox"
                  checked={m.isChild}
                  onChange={(e) => updateMember(i, { isChild: e.target.checked })}
                  className="size-4 accent-[var(--color-ink)]"
                />
                Niño o niña
              </label>
              <button
                type="button"
                aria-label={`Quitar a ${m.firstName || `la persona ${i + 1}`}`}
                disabled={form.members.length === 1}
                onClick={() =>
                  setForm((f) => ({ ...f, members: f.members.filter((_, j) => j !== i) }))
                }
                className="grid size-11 place-items-center rounded-md text-ink-soft hover:bg-ink/5 hover:text-ink disabled:opacity-30"
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            </div>
          ))}
          <div>
            <Button
              variant="secondary"
              size="sm"
              disabled={form.members.length >= 20}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  members: [...f.members, emptyMember()],
                  // Si no caben, se amplían las plazas a la vez.
                  maxAttendees: String(Math.max(Number(f.maxAttendees) || 1, f.members.length + 1)),
                }))
              }
            >
              <Plus aria-hidden className="size-4" />
              Añadir persona
            </Button>
          </div>
        </fieldset>

        <p role="status" aria-live="polite" className="text-[0.875rem] font-medium text-danger">
          {serverError ?? (errors.size ? "Revisa los campos marcados." : "")}
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : group ? "Guardar cambios" : "Crear invitación"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
