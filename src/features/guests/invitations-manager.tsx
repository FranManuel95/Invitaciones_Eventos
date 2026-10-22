"use client";

import type { Hosts } from "@/lib/event-kind";
import { Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { useDeferredValue, useState, useSyncExternalStore, useTransition } from "react";
import { deleteGroup } from "@/app/panel/[evento]/invitaciones/actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { OpenedBadge, StatusBadge } from "@/features/dashboard/ui";
import type { AttendanceStatus, GuestGroup } from "@/lib/domain/types";
import { plural } from "@/lib/guests/share";
import { CsvImport } from "./csv-import";
import { GroupDialog } from "./group-dialog";
import { ShareActions } from "./share-actions";

const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const noopSubscribe = () => () => {};

type Editing = { mode: "new" } | { mode: "edit"; group: GuestGroup } | null;

/**
 * Invitaciones del evento: alta, edición, borrado e importación (eventos reales) y, en todos,
 * el enlace personal de cada una para copiar, enviar por WhatsApp o enseñar en QR.
 */
export function InvitationsManager({
  eventId,
  groups,
  statuses,
  couple,
}: {
  /** null en la demo: se ven los enlaces, pero no se guardan cambios. */
  eventId: string | null;
  groups: GuestGroup[];
  statuses: Record<string, AttendanceStatus>;
  couple: Hosts;
}) {
  const origin = useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => "",
  );
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [editing, setEditing] = useState<Editing>(null);
  const [importing, setImporting] = useState(false);
  const [removing, setRemoving] = useState<GuestGroup | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const readOnly = eventId === null;

  const categories = [...new Set(groups.map((g) => g.category))].sort();
  const visible = groups.filter((g) => {
    const q = normalize(deferred.trim());
    if (!q) return true;
    return normalize(
      [g.displayName, g.category, ...g.members.map((m) => `${m.firstName} ${m.lastName}`)].join(
        " ",
      ),
    ).includes(q);
  });
  const people = groups.reduce((n, g) => n + g.members.length, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 basis-64">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone"
          />
          <input
            type="search"
            aria-label="Buscar invitación o persona"
            placeholder="Buscar invitación o persona"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-md border border-line bg-paper pr-3 pl-9 text-[0.9375rem] text-ink placeholder:text-stone focus:border-ink focus:outline-none"
          />
        </div>
        <Button variant="secondary" onClick={() => setImporting(true)}>
          <Upload aria-hidden className="size-4" />
          Importar CSV
        </Button>
        <Button onClick={() => setEditing({ mode: "new" })} disabled={readOnly}>
          <Plus aria-hidden className="size-4" />
          Nueva invitación
        </Button>
      </div>
      {readOnly ? (
        <p className="mt-3 text-[0.8125rem] text-muted">
          Demo: puedes copiar enlaces, abrir WhatsApp y ver los QR, pero no guardar cambios.
        </p>
      ) : null}

      <p aria-live="polite" className="mt-6 text-[0.875rem] text-muted">
        {visible.length === groups.length
          ? `${plural(groups.length, "invitación", "invitaciones")} · ${plural(people, "persona", "personas")}`
          : `${visible.length} de ${groups.length} invitaciones`}
      </p>

      {groups.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-line px-6 py-10 text-center">
          <p className="font-display text-[1.5rem] text-ink">Todavía no hay invitaciones</p>
          <p className="mt-1 text-[0.9375rem] text-muted">
            Crea la primera o importa vuestra lista desde una hoja de cálculo.
          </p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-md border border-line bg-paper">
          {visible.map((g) => (
            <li
              key={g.id}
              className="grid gap-3 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-display text-[1.375rem] leading-tight text-ink">
                    {g.displayName}
                  </h3>
                  <StatusBadge status={statuses[g.id] ?? "pending"} />
                  {(statuses[g.id] ?? "pending") === "pending" ? (
                    <OpenedBadge openedAt={g.openedAt} />
                  ) : null}
                </div>
                <p className="mt-1 text-[0.875rem] text-muted">
                  {g.category} · {g.members.map((m) => m.firstName).join(", ")} ·{" "}
                  {g.maxAttendees === 1 ? "1 plaza" : `${g.maxAttendees} plazas`}
                  {g.phone ? ` · ${g.phone}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <ShareActions group={g} couple={couple} origin={origin} />
                {readOnly ? null : (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditing({ mode: "edit", group: g })}
                      aria-label={`Editar ${g.displayName}`}
                      className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-ink/5 hover:text-ink"
                    >
                      <Pencil aria-hidden className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRemoveError(null);
                        setRemoving(g);
                      }}
                      aria-label={`Borrar ${g.displayName}`}
                      className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
          {visible.length === 0 ? (
            <li className="p-6 text-center text-[0.9375rem] text-muted">
              Ninguna invitación coincide con «{query}».
            </li>
          ) : null}
        </ul>
      )}

      {eventId && editing ? (
        <GroupDialog
          key={editing.mode === "edit" ? editing.group.id : "nueva"}
          eventId={eventId}
          group={editing.mode === "edit" ? editing.group : undefined}
          categories={categories}
          open
          onClose={() => setEditing(null)}
        />
      ) : null}

      <CsvImport eventId={eventId} open={importing} onClose={() => setImporting(false)} />

      <Dialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={`¿Borrar «${removing?.displayName ?? ""}»?`}
        description="Se borran también sus personas y, si ya respondió, su respuesta. Su enlace dejará de funcionar."
      >
        <p role="status" className="text-[0.875rem] font-medium text-danger">
          {removeError}
        </p>
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setRemoving(null)}>
            Cancelar
          </Button>
          <Button
            className="bg-danger hover:bg-danger/90"
            disabled={pending}
            onClick={() =>
              start(async () => {
                if (!eventId || !removing) return;
                const result = await deleteGroup(eventId, removing.id);
                if (result.ok) setRemoving(null);
                else setRemoveError(result.error);
              })
            }
          >
            {pending ? "Borrando…" : "Borrar"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
