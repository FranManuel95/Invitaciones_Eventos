"use client";

import { Check, Copy, Link2, Trash2, UserMinus } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore, useTransition } from "react";
import {
  createInvite,
  deleteEvent,
  deleteInvite,
  removeMember,
} from "@/app/panel/[evento]/ajustes/actions";
import { Button, buttonClasses } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/fields";
import type { EventSettings } from "@/lib/data/repository";

const ROLE: Record<"owner" | "editor", string> = {
  owner: "Propietaria",
  editor: "Organiza",
};

const noopSubscribe = () => () => {};
const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long" });

/**
 * Ajustes del evento: quién lo organiza, invitar a alguien más con un enlace de un solo uso y,
 * para la propietaria, borrar el evento. En la demo se ve todo pero no hay acciones.
 */
export function EventSettingsPanel({
  eventId,
  settings,
  couple,
}: {
  eventId: string | null;
  settings: EventSettings;
  /** «María y Daniel»: hay que escribirlo para borrar el evento. */
  couple: string;
}) {
  const origin = useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => "",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [newLink, setNewLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [pending, start] = useTransition();
  const readOnly = eventId === null;
  const canManage = settings.isOwner && !readOnly;

  const invite = (role: "owner" | "editor") =>
    start(async () => {
      if (!eventId) return;
      const r = await createInvite(eventId, role);
      if (r.ok && r.token) {
        setNewLink(`${origin}/unirse/${r.token}`);
        setCopied(false);
        setMessage(null);
      } else if (!r.ok) setMessage(r.error);
    });

  return (
    <div className="grid max-w-3xl gap-10">
      {readOnly ? (
        <p className="text-[0.875rem] text-muted">
          Demo: así se ve la gestión del evento. Las acciones están desactivadas.
        </p>
      ) : null}

      <section aria-labelledby="miembros">
        <h2 id="miembros" className="font-display text-[1.75rem] text-ink">
          Quién organiza
        </h2>
        <ul className="mt-4 divide-y divide-line rounded-md border border-line bg-paper">
          {settings.members.map((m) => (
            <li
              key={m.userId}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem] text-ink">
                  {m.email}
                  {m.isMe ? <span className="text-muted"> (tú)</span> : null}
                </p>
                <p className="text-[0.8125rem] text-muted">{ROLE[m.role]}</p>
              </div>
              {canManage && m.role === "editor" ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(async () => {
                      const r = await removeMember(eventId!, m.userId);
                      setMessage(r.ok ? `${m.email} ya no organiza este evento.` : r.error);
                    })
                  }
                  className={buttonClasses("ghost", "sm")}
                >
                  <UserMinus aria-hidden className="size-4" />
                  Quitar
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="invitar">
        <h2 id="invitar" className="font-display text-[1.75rem] text-ink">
          Invitar a alguien
        </h2>
        <p className="mt-1 text-[0.9375rem] text-muted">
          Crea un enlace para tu pareja o para quien os ayude a organizar. Sirve una vez y caduca en
          7 días. Quien lo abra tendrá que crear su cuenta o entrar con la suya.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button disabled={!canManage || pending} onClick={() => invite("editor")}>
            <Link2 aria-hidden className="size-4" />
            Enlace para organizar
          </Button>
          <Button
            variant="secondary"
            disabled={!canManage || pending}
            onClick={() => invite("owner")}
          >
            Enlace con permisos de propietaria
          </Button>
        </div>
        {newLink ? (
          <div className="mt-4 rounded-md border border-line bg-paper p-4">
            <label htmlFor="enlace-nuevo" className="text-[0.875rem] font-medium text-ink">
              Enlace nuevo
            </label>
            <div className="mt-2 flex gap-2">
              <TextInput
                id="enlace-nuevo"
                readOnly
                value={newLink}
                onFocus={(e) => e.target.select()}
              />
              <Button
                variant="secondary"
                onClick={async () => {
                  await navigator.clipboard.writeText(newLink).catch(() => {});
                  setCopied(true);
                }}
              >
                {copied ? (
                  <Check aria-hidden className="size-4" />
                ) : (
                  <Copy aria-hidden className="size-4" />
                )}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </div>
        ) : null}
        {settings.invites.length ? (
          <>
            <h3 className="mt-6 text-[0.9375rem] font-medium text-ink">Enlaces sin usar</h3>
            <ul className="mt-2 divide-y divide-line">
              {settings.invites.map((i) => (
                <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="text-[0.875rem] text-ink-soft">
                    {ROLE[i.role]} · caduca el {dateFmt.format(new Date(i.expiresAt))}
                  </span>
                  <button
                    type="button"
                    disabled={!canManage || pending}
                    onClick={() =>
                      start(async () => {
                        const r = await deleteInvite(eventId!, i.id);
                        setMessage(r.ok ? "Enlace anulado." : r.error);
                      })
                    }
                    className={buttonClasses("ghost", "sm")}
                  >
                    Anular
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <p role="status" aria-live="polite" className="min-h-5 text-[0.875rem] text-ink-soft">
        {message}
      </p>

      <section aria-labelledby="mas-ajustes">
        <h2 id="mas-ajustes" className="font-display text-[1.75rem] text-ink">
          La invitación
        </h2>
        <p className="mt-1 text-[0.9375rem] text-muted">
          Estilo, textos, fotos, secciones y música se cambian en el editor.
        </p>
        <Link
          href={`/editor/${eventId ?? "demo"}`}
          className={buttonClasses("secondary", "md", "mt-4")}
        >
          Abrir el editor
        </Link>
      </section>

      {settings.isOwner ? (
        <section aria-labelledby="zona-peligro" className="rounded-md border border-danger/30 p-5">
          <h2 id="zona-peligro" className="font-display text-[1.5rem] text-danger">
            Borrar el evento
          </h2>
          <p className="mt-1 text-[0.9375rem] text-ink-soft">
            Se borran la invitación, los invitados, sus respuestas, las mesas, las tareas y el
            presupuesto. Los enlaces dejarán de funcionar. No se puede deshacer.
          </p>
          <Button
            className="mt-4 bg-danger hover:bg-danger/90"
            disabled={readOnly}
            onClick={() => setRemoving(true)}
          >
            <Trash2 aria-hidden className="size-4" />
            Borrar el evento
          </Button>
        </section>
      ) : null}

      <Dialog
        open={removing}
        onClose={() => setRemoving(false)}
        title="¿Borrar el evento?"
        description={
          <>
            Escribe <strong className="text-ink">{couple}</strong> para confirmar.
          </>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            start(async () => {
              const r = await deleteEvent(eventId!, confirmation, couple);
              if (!r.ok) setMessage(r.error);
            });
          }}
        >
          <label htmlFor="confirmar-borrado" className="sr-only">
            Nombres de la pareja
          </label>
          <TextInput
            id="confirmar-borrado"
            value={confirmation}
            autoComplete="off"
            onChange={(e) => setConfirmation(e.target.value)}
          />
          <p role="status" className="mt-2 min-h-5 text-[0.875rem] font-medium text-danger">
            {message}
          </p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRemoving(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-danger hover:bg-danger/90"
              disabled={pending || confirmation.trim().toLowerCase() !== couple.toLowerCase()}
            >
              {pending ? "Borrando…" : "Borrar para siempre"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
