"use client";

import { AlertCircle, Download, FileUp } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { importGroups } from "@/app/panel/[evento]/invitaciones/actions";
import { Button, buttonClasses } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CSV_COLUMNS, CSV_TEMPLATE, csvToGroups, type CsvResult } from "@/lib/guests/csv";
import { plural } from "@/lib/guests/share";

/**
 * Importa invitaciones desde una hoja de cálculo. Se lee en el navegador y se enseña lo que se
 * va a crear (y los errores con su línea) antes de guardar nada.
 */
export function CsvImport({
  eventId,
  open,
  onClose,
}: {
  eventId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<string | null>(null);
  const [result, setResult] = useState<CsvResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const inputId = useId();
  const people = result?.groups.reduce((n, g) => n + g.members.length, 0) ?? 0;

  const close = () => {
    setFile(null);
    setResult(null);
    setMessage(null);
    onClose();
  };

  const templateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(`﻿${CSV_TEMPLATE}`)}`;

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Importar invitados"
      description={
        <>
          Una fila por persona. Las filas con la misma <em>invitación</em> forman un grupo con un
          solo enlace. Columnas: {CSV_COLUMNS.join(", ")}.
        </>
      }
      wide
    >
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className={buttonClasses(
            "primary",
            "md",
            "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2",
          )}
        >
          <FileUp aria-hidden className="size-4" />
          Elegir archivo CSV
          <input
            id={inputId}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={async (e) => {
              const chosen = e.target.files?.[0];
              e.target.value = "";
              if (!chosen) return;
              setMessage(null);
              setFile(chosen.name);
              setResult(csvToGroups(await chosen.text()));
            }}
          />
        </label>
        <a
          href={templateHref}
          download="plantilla-invitados.csv"
          className={buttonClasses("secondary", "md")}
        >
          <Download aria-hidden className="size-4" />
          Descargar plantilla
        </a>
      </div>
      <p className="mt-3 text-[0.8125rem] text-muted">
        Desde Excel o Google Sheets: Archivo → Descargar → CSV. Vale con coma o con punto y coma.
      </p>

      {result ? (
        <section aria-label={`Vista previa de ${file ?? "el archivo"}`} className="mt-6">
          {result.errors.length ? (
            <div role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-4">
              <p className="flex items-center gap-2 font-medium text-danger">
                <AlertCircle aria-hidden className="size-4" />
                {result.errors.length === 1
                  ? "Hay 1 línea por revisar"
                  : `Hay ${result.errors.length} líneas por revisar`}
              </p>
              <ul className="mt-2 space-y-1 text-[0.875rem] text-ink">
                {result.errors.slice(0, 20).map((e, i) => (
                  <li key={i}>
                    <span className="font-medium">Línea {e.line}:</span> {e.message}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[0.8125rem] text-muted">
                Corrige el archivo y vuelve a elegirlo. No se importa nada hasta que esté todo bien.
              </p>
            </div>
          ) : null}
          {result.groups.length ? (
            <>
              <h3 className="mt-5 font-medium text-ink">
                {plural(result.groups.length, "invitación", "invitaciones")} ·{" "}
                {plural(people, "persona", "personas")}
              </h3>
              <ul className="mt-2 max-h-64 divide-y divide-line overflow-y-auto rounded-md border border-line">
                {result.groups.map((g) => (
                  <li
                    key={g.displayName}
                    className="flex flex-wrap justify-between gap-2 px-3 py-2 text-[0.875rem]"
                  >
                    <span className="font-medium text-ink">{g.displayName}</span>
                    <span className="text-muted">
                      {g.members.map((m) => m.firstName).join(", ")} · {g.maxAttendees} plazas
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      <p
        role="status"
        aria-live="polite"
        className="mt-4 text-[0.875rem] font-medium text-ink-soft"
      >
        {message}
      </p>
      <div className="mt-2 flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={close}>
          Cerrar
        </Button>
        <Button
          disabled={!eventId || !result?.groups.length || Boolean(result?.errors.length) || pending}
          onClick={() =>
            start(async () => {
              if (!eventId || !result) return;
              const r = await importGroups(eventId, result.groups);
              if (r.ok) {
                const n = r.created ?? result.groups.length;
                setMessage(`${plural(n, "invitación importada", "invitaciones importadas")}.`);
                setResult(null);
                setFile(null);
              } else setMessage(r.error);
            })
          }
        >
          {pending ? "Importando…" : eventId ? "Importar" : "Importar (no disponible en la demo)"}
        </Button>
      </div>
    </Dialog>
  );
}
