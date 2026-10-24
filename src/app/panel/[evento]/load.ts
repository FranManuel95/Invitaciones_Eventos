import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getOrganizerData, getPlanningData } from "@/lib/data/repository";

// Una sola consulta por petición aunque la usen el layout y la página.
const organizer = cache(getOrganizerData);

/** Datos del evento de la URL (/panel/demo o /panel/<id>); 404 si no existe o no es tuyo. */
export async function loadOrganizer(params: Promise<{ evento: string }>) {
  const { evento } = await params;
  const data = await organizer(evento);
  if (!data) notFound();
  return { ...data, base: `/panel/${evento}`, isDemo: evento === "demo" };
}

/** Tareas y presupuesto del evento de la URL. */
export async function loadPlanning(params: Promise<{ evento: string }>) {
  const { evento } = await params;
  const data = await getPlanningData(evento);
  if (!data) notFound();
  return data;
}
