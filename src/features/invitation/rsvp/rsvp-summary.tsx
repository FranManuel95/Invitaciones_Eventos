import { MENU_LABELS, allergyLabel } from "@/lib/domain/catalog";
import type { RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import { describeTransport } from "@/lib/rsvp/summary";
import { attendingPeople, toResponse, type RsvpDraft, type RsvpStep } from "@/lib/rsvp/draft";
import type { GuestGroup } from "@/lib/domain/types";

function Row({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <dt className="text-[0.875rem] text-muted">{label}</dt>
        <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">{children}</dd>
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-sm text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          Editar<span className="sr-only"> {label.toLowerCase()}</span>
        </button>
      ) : null}
    </div>
  );
}

/** Lista de respuestas, usada en el último paso del formulario y en la confirmación final. */
export function ResponseDetails({
  event,
  response,
  onEdit,
}: {
  event: WeddingEvent;
  response: RsvpResponse;
  onEdit?: (step: RsvpStep) => void;
}) {
  const transport = describeTransport(response, event);
  const edit = (step: RsvpStep) => (onEdit ? () => onEdit(step) : undefined);
  return (
    <dl className="divide-y divide-line">
      <Row label="Asistencia" onEdit={edit("attendance")}>
        {response.status === "attending"
          ? `Sí, ${response.attendees.length} ${response.attendees.length === 1 ? "persona" : "personas"}`
          : "No podrá asistir"}
      </Row>
      {response.status === "attending" ? (
        <>
          <Row label="Menús y alergias" onEdit={edit("menu")}>
            <ul className="space-y-1">
              {response.attendees.map((a) => (
                <li key={a.guestId}>
                  <span className="font-medium">{a.name}</span>:{" "}
                  {a.menu ? MENU_LABELS[a.menu].toLowerCase() : "sin menú"}
                  {a.allergies.length ? (
                    <span className="text-muted">
                      {" "}
                      (alergia:{" "}
                      {a.allergies
                        .map((x) =>
                          x === "otros" && a.allergyNotes ? a.allergyNotes : allergyLabel(x),
                        )
                        .join(", ")}
                      )
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Row>
          {response.transport ? (
            <Row label="Autobús" onEdit={edit("transport")}>
              <strong className="font-semibold">{transport.answer}</strong>. {transport.detail}
            </Row>
          ) : null}
        </>
      ) : null}
      <Row label="Mensaje" onEdit={edit("message")}>
        {response.message ? (
          <q className="font-display text-lg italic">{response.message}</q>
        ) : (
          <span className="text-muted">Sin mensaje</span>
        )}
      </Row>
      {response.status === "attending" ? (
        <Row label="Canción" onEdit={edit("message")}>
          {response.song ? response.song : <span className="text-muted">Sin canción</span>}
        </Row>
      ) : null}
    </dl>
  );
}

export function DraftSummary({
  event,
  group,
  draft,
  onEdit,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  draft: RsvpDraft;
  onEdit: (step: RsvpStep) => void;
}) {
  const preview = toResponse(draft, group);
  return (
    <div>
      <p className="text-sm text-muted">
        Revisa tu respuesta antes de enviarla.
        {draft.status === "attending" && attendingPeople(draft).length < group.maxAttendees
          ? " Puedes cambiarla más adelante si cambian vuestros planes."
          : null}
      </p>
      <div className="mt-2">
        <ResponseDetails event={event} response={preview} onEdit={onEdit} />
      </div>
    </div>
  );
}
