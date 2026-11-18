"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { setMessageHidden } from "@/app/actions/guestbook";
import { Button } from "@/components/ui/button";

/** Botón para ocultar un mensaje del libro o volver a mostrarlo. En la demo solo cambia aquí. */
export function HideToggle({
  eventId,
  messageId,
  author,
  hidden: initial,
  demo,
}: {
  eventId: string;
  messageId: string;
  author: string;
  hidden: boolean;
  demo: boolean;
}) {
  const [hidden, setHidden] = useState(initial);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const toggle = () => {
    const next = !hidden;
    if (demo) {
      setHidden(next);
      return;
    }
    start(async () => {
      const result = await setMessageHidden(eventId, messageId, next);
      if (result.ok) {
        setHidden(next);
        setError("");
      } else setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <p className="text-[0.8125rem] text-muted">
        {hidden ? "Oculto: los invitados no lo ven." : "A la vista de los invitados."}
      </p>
      <Button variant="secondary" size="sm" disabled={pending} onClick={toggle}>
        {hidden ? (
          <Eye aria-hidden className="size-4" />
        ) : (
          <EyeOff aria-hidden className="size-4" />
        )}
        {hidden ? "Volver a mostrar" : "Ocultar"}
        <span className="sr-only">: mensaje de {author}</span>
      </Button>
      <p role="status" className="text-[0.8125rem] text-danger">
        {error}
      </p>
    </div>
  );
}
