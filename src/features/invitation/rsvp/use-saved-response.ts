"use client";

import { useSyncExternalStore } from "react";
import { getSavedResponse, subscribeResponses } from "@/lib/data/rsvp-store";

/** Respuesta guardada de esta invitación (null en el servidor y si aún no ha respondido). */
export function useSavedResponse(token: string) {
  return useSyncExternalStore(
    subscribeResponses,
    () => getSavedResponse(token),
    () => null,
  );
}
