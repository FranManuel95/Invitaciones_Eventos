"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getIn, type Path } from "@/lib/editor/draft";
import { useEditor } from "./fields";

/**
 * Lista editable (programa, lugares, rutas, preguntas…): añadir, quitar y mover con botones.
 * Cada elemento va en un fieldset con su nombre, para que los botones digan qué mueven.
 */
export function ListEditor<T>({
  path,
  max,
  min = 0,
  addLabel,
  itemName,
  create,
  children,
}: {
  path: Path;
  max: number;
  min?: number;
  addLabel: string;
  /** Nombre del elemento para la leyenda y los botones («Ceremonia», «Pregunta 2»). */
  itemName: (item: T, index: number) => string;
  create: () => T;
  children: (index: number, item: T) => ReactNode;
}) {
  const { draft, set } = useEditor();
  const items = (getIn(draft.content, path) as T[] | undefined) ?? [];

  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    if (item === undefined) return;
    next.splice(to, 0, item);
    set(path, next);
  };

  return (
    <div className="grid gap-4">
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-line px-4 py-5 text-center text-[0.875rem] text-muted">
          Todavía no hay ninguno.
        </p>
      ) : null}
      {items.map((item, index) => {
        const name = itemName(item, index);
        const key = (item as { id?: string }).id ?? index;
        return (
          <fieldset key={key} className="rounded-md border border-line bg-paper p-4 sm:p-5">
            {/* La leyenda tiene que ser el primer hijo del fieldset para darle nombre. */}
            <legend className="float-left max-w-[calc(100%-7.5rem)] truncate py-2 font-medium text-ink">
              {name}
            </legend>
            <div className="float-right flex gap-1">
              <IconButton
                label={`Subir «${name}»`}
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                <ArrowUp aria-hidden className="size-4" />
              </IconButton>
              <IconButton
                label={`Bajar «${name}»`}
                disabled={index === items.length - 1}
                onClick={() => move(index, index + 1)}
              >
                <ArrowDown aria-hidden className="size-4" />
              </IconButton>
              <IconButton
                label={`Quitar «${name}»`}
                disabled={items.length <= min}
                onClick={() =>
                  set(
                    path,
                    items.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 aria-hidden className="size-4" />
              </IconButton>
            </div>
            <div className="clear-both mt-4 grid gap-4 sm:grid-cols-2">{children(index, item)}</div>
          </fieldset>
        );
      })}
      <div>
        <Button
          variant="secondary"
          size="sm"
          disabled={items.length >= max}
          onClick={() => set(path, [...items, create()])}
        >
          <Plus aria-hidden className="size-4" />
          {addLabel}
        </Button>
        {items.length >= max ? (
          <span className="ml-3 text-[0.8125rem] text-muted">Has llegado al máximo ({max}).</span>
        ) : null}
      </div>
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-md text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/** Id corto para elementos nuevos (programa, lugares, rutas). */
export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
