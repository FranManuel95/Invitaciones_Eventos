import type { RsvpResponse, WeddingEvent } from "@/lib/domain/types";

export interface TransportSummary {
  /** null si no asisten (no aplica). */
  usesBus: boolean | null;
  /** «Sí» o «No», para mostrarlo destacado. */
  answer: "Sí" | "No" | null;
  /** Explicación en una frase, con plazas, recogida y horarios. */
  detail: string;
}

const listTimes = (times: string[]) =>
  times.length > 1 ? `${times.slice(0, -1).join(", ")} o a las ${times.at(-1)}` : (times[0] ?? "");

/**
 * Describe sin ambigüedad si la invitación usará el autobús. Es el mismo texto en la
 * confirmación, el pase, la sección «Cómo llegar» y el panel de los novios.
 */
export function describeTransport(response: RsvpResponse, event: WeddingEvent): TransportSummary {
  if (response.status !== "attending" || !response.transport) {
    return { usesBus: null, answer: null, detail: "No asistirán." };
  }
  const t = response.transport;
  const solo = response.attendees.length === 1;
  if (t.needsBus) {
    const route = event.busRoutes.find((r) => r.id === t.routeId);
    const seats = `${t.busSeats} ${t.busSeats === 1 ? "plaza" : "plazas"}`;
    return {
      usesBus: true,
      answer: "Sí",
      detail: route
        ? `${seats} desde ${route.pickupPoint}. Salida a las ${route.departure}; vuelta a las ${listTimes(route.returnTrips)}.`
        : `${seats} reservadas.`,
    };
  }
  if (t.offersCarSeats) {
    return {
      usesBus: false,
      answer: "No",
      detail: `${solo ? "Vas" : "Vais"} en coche y ${solo ? "ofreces" : "ofrecéis"} ${t.carSeats} ${t.carSeats === 1 ? "plaza" : "plazas"} a otros invitados.`,
    };
  }
  return {
    usesBus: false,
    answer: "No",
    detail: `${solo ? "Vas por tu cuenta" : "Vais por vuestra cuenta"}. Hay aparcamiento en la finca.`,
  };
}
