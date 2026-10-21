"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Diálogo modal nativo (<dialog> con showModal): el navegador encierra el foco, cierra con
 * Escape y devuelve el foco al botón que lo abrió.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Un clic en el fondo (fuera de la caja) cierra.
        if (e.target === e.currentTarget) onClose();
      }}
      className={`m-auto max-h-[min(90dvh,48rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-lg border border-line bg-paper p-0 text-ink shadow-[var(--shadow-lift)] backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] ${wide ? "max-w-3xl" : "max-w-lg"}`}
    >
      {open ? (
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="font-display text-[1.625rem] leading-tight text-ink">
                {title}
              </h2>
              {description ? (
                <div className="mt-1 text-[0.875rem] text-muted">{description}</div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="-mt-1 -mr-1 grid size-9 shrink-0 place-items-center rounded-md text-ink-soft hover:bg-ink/5 hover:text-ink"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
