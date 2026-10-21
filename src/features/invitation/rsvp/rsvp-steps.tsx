"use client";

import { Plus, X } from "lucide-react";
import {
  ChoiceCard,
  CheckChip,
  Counter,
  FieldError,
  TextArea,
  TextInput,
} from "@/components/ui/fields";
import { ALLERGIES } from "@/lib/domain/catalog";
import type { AllergyId, GuestGroup, MenuId, WeddingEvent } from "@/lib/domain/types";
import {
  addExtra,
  attendingPeople,
  canAddExtra,
  type AttendeeDraft,
  type FieldErrors,
  type RsvpDraft,
} from "@/lib/rsvp/draft";

export interface StepProps {
  event: WeddingEvent;
  group: GuestGroup;
  draft: RsvpDraft;
  errors: FieldErrors;
  update: (patch: Partial<RsvpDraft>) => void;
}

const errId = (key: string) => `rsvp-error-${key}`;
const invalid = (errors: FieldErrors, key: string) =>
  errors[key] ? { "aria-invalid": true as const, "aria-describedby": errId(key) } : {};
/** Para fieldset: asocia el error al grupo sin aria-invalid (no permitido en role=group). */
const groupError = (errors: FieldErrors, key: string) =>
  errors[key] ? { "aria-describedby": errId(key) } : {};

function Legend({ children, hint }: { children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <legend className="mb-4">
      <span className="block text-[0.9375rem] font-semibold text-ink">{children}</span>
      {hint ? <span className="mt-1 block text-sm text-muted">{hint}</span> : null}
    </legend>
  );
}

export function AttendanceStep({ draft, errors, update }: StepProps) {
  return (
    <fieldset {...groupError(errors, "status")}>
      <Legend>¿Podrás acompañarnos?</Legend>
      <div className="grid gap-3">
        <ChoiceCard
          id="status"
          name="status"
          label="Sí, allí estaré"
          description="Te haremos unas preguntas rápidas sobre acompañantes, transporte y menú."
          checked={draft.status === "attending"}
          onChange={() => update({ status: "attending" })}
        />
        <ChoiceCard
          name="status"
          label="No podré asistir"
          description="Te echaremos de menos. Puedes dejarnos un mensaje."
          checked={draft.status === "declined"}
          onChange={() => update({ status: "declined" })}
        />
      </div>
      <FieldError id={errId("status")} message={errors.status} />
    </fieldset>
  );
}

export function GuestsStep({ group, draft, errors, update }: StepProps) {
  const people = attendingPeople(draft).length;
  const setAttendee = (guestId: string, patch: Partial<AttendeeDraft>) =>
    update({
      attendees: draft.attendees.map((a) => (a.guestId === guestId ? { ...a, ...patch } : a)),
    });

  return (
    <div className="space-y-8">
      <fieldset {...groupError(errors, "guests")}>
        <Legend
          hint={`Tu invitación incluye ${group.maxAttendees} ${group.maxAttendees === 1 ? "plaza" : "plazas"}.`}
        >
          ¿Quién vendrá?
        </Legend>
        <div className="grid gap-3">
          {draft.attendees
            .filter((a) => !a.isExtra)
            .map((a, i) => (
              <ChoiceCard
                key={a.guestId}
                id={i === 0 ? "guests" : undefined}
                type="checkbox"
                label={a.name}
                description={a.isChild ? "Niño/a" : undefined}
                checked={a.attending}
                onChange={(e) => setAttendee(a.guestId, { attending: e.target.checked })}
              />
            ))}
        </div>
        <FieldError id={errId("guests")} message={errors.guests} />
      </fieldset>

      {draft.attendees.some((a) => a.isExtra) || canAddExtra(draft, group) ? (
        <div>
          <p className="text-[0.9375rem] font-semibold text-ink">Acompañantes</p>
          <ul className="mt-3 space-y-3">
            {draft.attendees
              .filter((a) => a.isExtra)
              .map((a, i) => (
                <li key={a.guestId}>
                  <label
                    htmlFor={`name-${a.guestId}`}
                    className="mb-1.5 block text-sm text-ink-soft"
                  >
                    Nombre del acompañante {i + 1}
                  </label>
                  <div className="flex gap-2">
                    <TextInput
                      id={`name-${a.guestId}`}
                      value={a.name}
                      autoComplete="off"
                      placeholder="Nombre y apellido"
                      maxLength={80}
                      onChange={(e) => setAttendee(a.guestId, { name: e.target.value })}
                      {...invalid(errors, `name-${a.guestId}`)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          attendees: draft.attendees.filter((x) => x.guestId !== a.guestId),
                        })
                      }
                      className="grid size-11 shrink-0 place-items-center rounded-md border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
                      aria-label={`Quitar acompañante ${i + 1}`}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <FieldError
                    id={errId(`name-${a.guestId}`)}
                    message={errors[`name-${a.guestId}`]}
                  />
                </li>
              ))}
          </ul>
          {canAddExtra(draft, group) ? (
            <button
              type="button"
              onClick={() => update(addExtra(draft))}
              className="mt-3 inline-flex items-center gap-2 rounded-md border border-dashed border-ink/30 px-4 py-2.5 text-sm text-ink transition-colors hover:border-ink"
            >
              <Plus aria-hidden className="size-4" /> Añadir acompañante
            </button>
          ) : null}
        </div>
      ) : null}

      <p aria-live="polite" className="rounded-md bg-cream/70 px-4 py-3 text-sm text-ink-soft">
        {people === 0
          ? "Nadie marcado todavía."
          : `${people} de ${group.maxAttendees} ${group.maxAttendees === 1 ? "plaza ocupada" : "plazas ocupadas"}.`}
      </p>
    </div>
  );
}

export function TransportStep({ event, draft, errors, update }: StepProps) {
  const people = attendingPeople(draft).length;
  const route = event.busRoutes.find((r) => r.id === draft.routeId);
  return (
    <div className="space-y-8">
      <fieldset {...groupError(errors, "needsBus")}>
        <Legend hint="Hay autobuses desde Madrid, Valencia y Barcelona.">
          ¿Necesitáis plaza en el autobús?
        </Legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <ChoiceCard
            id="needsBus"
            name="needsBus"
            label="Sí, necesitamos plaza"
            checked={draft.needsBus === true}
            onChange={() => update({ needsBus: true, offersCarSeats: null })}
          />
          <ChoiceCard
            name="needsBus"
            label="No, gracias"
            checked={draft.needsBus === false}
            onChange={() => update({ needsBus: false, routeId: null })}
          />
        </div>
        <FieldError id={errId("needsBus")} message={errors.needsBus} />
      </fieldset>

      {draft.needsBus ? (
        <div>
          <label htmlFor="routeId" className="block text-[0.9375rem] font-semibold text-ink">
            Punto de recogida
          </label>
          <select
            id="routeId"
            value={draft.routeId ?? ""}
            onChange={(e) => update({ routeId: e.target.value || null })}
            className="mt-3 h-11 w-full appearance-none rounded-md border border-line bg-paper bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%231e2a28%22%20stroke-width=%221.5%22%3E%3Cpath%20d=%22m2%204%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat px-3.5 pr-10 text-[0.9375rem] text-ink focus:border-ink focus:outline-none aria-[invalid=true]:border-danger"
            {...invalid(errors, "routeId")}
          >
            <option value="">Elige una opción</option>
            {event.busRoutes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.pickupPoint} — salida {r.departure}
              </option>
            ))}
          </select>
          <FieldError id={errId("routeId")} message={errors.routeId} />
          {route ? (
            <p className="mt-3 text-sm text-muted">
              Reservaremos {people} {people === 1 ? "plaza" : "plazas"}. Vuelta a las{" "}
              {route.returnTrips.join(" o a las ")}.
            </p>
          ) : null}
        </div>
      ) : null}

      {draft.needsBus === false ? (
        <fieldset {...groupError(errors, "offersCarSeats")}>
          <Legend hint="Nos ayuda a organizar coches compartidos entre invitados.">
            ¿Podéis ofrecer plazas en vuestro coche?
          </Legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <ChoiceCard
              id="offersCarSeats"
              name="offersCarSeats"
              label="Sí, tenemos plazas"
              checked={draft.offersCarSeats === true}
              onChange={() => update({ offersCarSeats: true })}
            />
            <ChoiceCard
              name="offersCarSeats"
              label="No"
              checked={draft.offersCarSeats === false}
              onChange={() => update({ offersCarSeats: false })}
            />
          </div>
          <FieldError id={errId("offersCarSeats")} message={errors.offersCarSeats} />
          {draft.offersCarSeats ? (
            <div className="mt-5 flex items-center justify-between gap-4 rounded-md bg-cream/70 px-4 py-3">
              <span className="text-sm text-ink-soft">Plazas libres</span>
              <Counter
                id="carSeats"
                label="Plazas libres en el coche"
                value={draft.carSeats}
                min={1}
                max={6}
                onChange={(carSeats) => update({ carSeats })}
              />
            </div>
          ) : null}
        </fieldset>
      ) : null}
    </div>
  );
}

export function MenuStep({ event, draft, errors, update }: StepProps) {
  const people = attendingPeople(draft);
  const setAttendee = (guestId: string, patch: Partial<AttendeeDraft>) =>
    update({
      attendees: draft.attendees.map((a) => (a.guestId === guestId ? { ...a, ...patch } : a)),
    });
  const toggleAllergy = (a: AttendeeDraft, id: AllergyId, on: boolean) =>
    setAttendee(a.guestId, {
      allergies: on ? [...a.allergies, id] : a.allergies.filter((x) => x !== id),
    });

  return (
    <div className="space-y-6">
      {people.map((a) => {
        const options = event.menu.filter((m) => a.isChild || !m.childrenOnly);
        const menuKey = `menu-${a.guestId}`;
        const notesKey = `notes-${a.guestId}`;
        return (
          <div key={a.guestId} className="rounded-lg border border-line bg-paper/60 p-4 sm:p-5">
            <fieldset {...groupError(errors, menuKey)}>
              <Legend>Menú para {a.name || "tu acompañante"}</Legend>
              <div className="grid gap-2">
                {options.map((m, i) => (
                  <ChoiceCard
                    key={m.id}
                    id={i === 0 ? menuKey : undefined}
                    name={menuKey}
                    label={m.label}
                    description={m.description}
                    checked={a.menu === m.id}
                    onChange={() => setAttendee(a.guestId, { menu: m.id as MenuId })}
                    className="py-3"
                  />
                ))}
              </div>
              <FieldError id={errId(menuKey)} message={errors[menuKey]} />
            </fieldset>
            <fieldset className="mt-5">
              <legend className="text-sm font-medium text-ink">
                ¿Alguna alergia o intolerancia?
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {ALLERGIES.map((al) => (
                  <CheckChip
                    key={al.id}
                    label={al.label}
                    checked={a.allergies.includes(al.id)}
                    onChange={(e) => toggleAllergy(a, al.id, e.target.checked)}
                  />
                ))}
              </div>
            </fieldset>
            {a.allergies.includes("otros") ? (
              <div className="mt-4">
                <label htmlFor={notesKey} className="mb-1.5 block text-sm text-ink-soft">
                  Cuéntanos cuál
                </label>
                <TextInput
                  id={notesKey}
                  value={a.allergyNotes}
                  maxLength={200}
                  placeholder="Por ejemplo: intolerancia al melocotón"
                  onChange={(e) => setAttendee(a.guestId, { allergyNotes: e.target.value })}
                  {...invalid(errors, notesKey)}
                />
                <FieldError id={errId(notesKey)} message={errors[notesKey]} />
              </div>
            ) : null}
          </div>
        );
      })}
      <p className="text-xs leading-relaxed text-muted">
        Solo los organizadores y el catering verán esta información, y únicamente para preparar tu
        menú.
      </p>
    </div>
  );
}

export function MessageStep({ draft, errors, update }: StepProps) {
  return (
    <div>
      <label htmlFor="message" className="block text-[0.9375rem] font-semibold text-ink">
        {draft.status === "declined"
          ? "¿Quieres dejarnos unas palabras?"
          : "Un mensaje o petición especial"}
      </label>
      <p className="mt-1 text-sm text-muted">Opcional. Lo leeremos con mucho cariño.</p>
      <TextArea
        id="message"
        className="mt-3"
        rows={5}
        maxLength={500}
        value={draft.message}
        placeholder={
          draft.status === "declined"
            ? "Escribe aquí…"
            : "Una canción, una sorpresa, una necesidad…"
        }
        onChange={(e) => update({ message: e.target.value })}
        aria-describedby="message-count"
        {...invalid(errors, "message")}
      />
      <p id="message-count" className="mt-1.5 text-right text-xs text-muted tabular-nums">
        {draft.message.length}/500
      </p>
      <FieldError id={errId("message")} message={errors.message} />
    </div>
  );
}
