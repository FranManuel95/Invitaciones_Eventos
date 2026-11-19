"use client";

import { CloudSun, Eye, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { fetchClimate } from "@/app/editor/climate";
import { Button } from "@/components/ui/button";
import { climateText, FORECAST_DAYS } from "@/lib/weather";
import { useEditor } from "./fields";

/** Tiempo para el que se calculó: si cambian la ciudad o la fecha, se vuelve a calcular. */
const keyOf = (city: string, region: string, date: string) =>
  `${city.trim().toLowerCase()}|${region.trim().toLowerCase()}|${date.slice(0, 10)}`;

/**
 * El tiempo: se calcula solo con la ciudad y la fecha (la media de los últimos diez años) y,
 * cuando faltan dos semanas, la invitación enseña la previsión real del día. La pareja solo
 * decide si se muestra. En la demo (sin red) se calcula con el botón.
 */
export function ClimateField() {
  const { draft, set, eventId } = useEditor();
  const { city, region, date } = draft.content;
  const climate = draft.content.climate;
  const hidden = climate === null;
  const [message, setMessage] = useState("");
  const [busy, start] = useTransition();
  const key = keyOf(city, region, date);
  // Lo ya calculado con coordenadas vale para la ciudad y la fecha con las que se abre el editor.
  const done = useRef(climate?.lat != null ? key : null);

  const calculate = () => {
    done.current = key;
    start(async () => {
      setMessage("Consultando los últimos diez años…");
      const r = await fetchClimate(city, region, date);
      if (r.ok) {
        set(["climate"], r.climate);
        setMessage(`Calculado con los datos de ${r.climate.place}.`);
      } else {
        setMessage(r.error);
      }
    });
  };

  // Al poner o cambiar la ciudad o la fecha, se recalcula solo (con una pausa, mientras se escribe).
  useEffect(() => {
    if (!eventId || hidden || !city.trim() || done.current === key) return;
    const timer = setTimeout(calculate, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambiar el lugar o la fecha
  }, [eventId, hidden, key]);

  if (hidden) {
    return (
      <div className="grid gap-3">
        <p className="text-[0.875rem] text-muted">No se enseña en la invitación.</p>
        <div>
          <Button variant="secondary" size="sm" onClick={calculate} disabled={busy}>
            <Eye aria-hidden className="size-4" />
            {busy ? "Calculando…" : "Mostrar el tiempo"}
          </Button>
        </div>
        <p role="status" aria-live="polite" className="min-h-5 text-[0.8125rem] text-muted">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {climate ? (
        <p className="rounded-[3px] border border-line bg-paper p-3.5 text-[0.9375rem] text-ink">
          {climateText(climate)}
        </p>
      ) : null}
      <p className="text-[0.875rem] text-muted">
        Se calcula solo con vuestra ciudad y vuestra fecha: la media de los últimos diez años.{" "}
        {FORECAST_DAYS} días antes, la invitación pasa a enseñar la previsión real del día y se
        actualiza sola cada pocas horas.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {!eventId || !climate ? (
          <Button variant="secondary" size="sm" onClick={calculate} disabled={busy}>
            {climate ? (
              <RotateCcw aria-hidden className="size-4" />
            ) : (
              <CloudSun aria-hidden className="size-4" />
            )}
            {busy ? "Calculando…" : climate ? "Volver a calcular" : "Calcular el tiempo habitual"}
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" onClick={() => set(["climate"], null)}>
          <Trash2 aria-hidden className="size-4" />
          No mostrarlo
        </Button>
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-[0.8125rem] text-muted">
        {message}
      </p>
    </div>
  );
}
