import "server-only";
import { notFound } from "next/navigation";
import { getOrganizerData } from "@/lib/data/repository";

/** Datos del evento de la URL (/panel/demo o /panel/<id>); 404 si no existe o no es tuyo. */
export async function loadOrganizer(params: Promise<{ evento: string }>) {
  const { evento } = await params;
  const data = await getOrganizerData(evento);
  if (!data) notFound();
  return { ...data, base: `/panel/${evento}`, isDemo: evento === "demo" };
}
