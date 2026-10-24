"use client";

import { CloudSun, RotateCcw, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { fetchClimate } from "@/app/editor/climate";
import { Button } from "@/components/ui/button";
import { climateText } from "@/lib/weather";
import { NumberField, useEditor } from "./fields";

/** Tiempo habitual: se calcula con un botón y luego se puede retocar o quitar. */
export function ClimateField() {
  const { draft, set } = useEditor();
  const climate = draft.content.climate ?? null;
  const [message, setMessage] = useState("");
  const [busy, start] = useTransition();

  const calculate = () =>
    start(async () => {
      setMessage("Consultando los últimos diez años…");
      const r = await fetchClimate(draft.content.city, draft.content.region, draft.content.date);
      if (r.ok) {
        set(["climate"], r.climate);
        setMessage(`Calculado con los datos de ${r.climate.place}.`);
      } else {
        setMessage(r.error);
      }
    });

  return (
    <div className="grid gap-4">
      {climate ? (
        <>
          <p className="rounded-[3px] border border-line bg-paper p-3.5 text-[0.9375rem] text-ink">
            {climateText(climate)}
          </p>
          <div className="grid grid-cols-3 gap-3 sm:max-w-md">
            <NumberField label="Mínima (°C)" path={["climate", "min"]} min={-50} max={45} />
            <NumberField label="Máxima (°C)" path={["climate", "max"]} min={-40} max={55} />
            <NumberField label="Lluvia (%)" path={["climate", "rainChance"]} min={0} max={100} />
          </div>
        </>
      ) : (
        <p className="text-[0.875rem] text-muted">
          Calculamos la media de los últimos diez años para vuestra fecha y vuestra ciudad, y la
          enseñamos en «Antes de venir» para que los invitados elijan bien la ropa.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={calculate} disabled={busy}>
          {climate ? (
            <RotateCcw aria-hidden className="size-4" />
          ) : (
            <CloudSun aria-hidden className="size-4" />
          )}
          {busy ? "Calculando…" : climate ? "Volver a calcular" : "Calcular el tiempo habitual"}
        </Button>
        {climate ? (
          <Button variant="ghost" size="sm" onClick={() => set(["climate"], null)}>
            <Trash2 aria-hidden className="size-4" />
            No mostrarlo
          </Button>
        ) : null}
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-[0.8125rem] text-muted">
        {message}
      </p>
    </div>
  );
}
