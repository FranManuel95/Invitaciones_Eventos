"use client";

import { TextInput } from "@/components/ui/fields";
import { madridIso, splitIso } from "@/lib/events/datetime";
import { ClimateField } from "../climate-field";
import { EVENT_KINDS, KIND_WORDS } from "@/lib/event-kind";
import { Field, Group, SelectField, TextField, useEditor } from "../fields";

/** Nombres, fecha y datos de contacto. */
export function BasicsTab() {
  const { draft, set } = useEditor();
  const when = splitIso(draft.content.date);
  const deadline = splitIso(draft.content.rsvpDeadline);
  return (
    <div className="grid gap-8">
      <Group title="Quién lo celebra">
        <SelectField
          label="Qué celebráis"
          path={["kind"]}
          options={EVENT_KINDS.map((k) => ({ value: k, label: KIND_WORDS[k].label }))}
          className="max-w-56"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Primer nombre" path={["couple", "first"]} maxLength={40} />
          <TextField
            label="Segundo nombre"
            hint={
              KIND_WORDS[draft.content.kind ?? "boda"].pair
                ? undefined
                : "Opcional: déjalo vacío si es una sola persona."
            }
            path={["couple", "second"]}
            maxLength={40}
          />
        </div>
        <TextField
          label="Iniciales del monograma"
          hint="Van en el lacre y en el sello dorado. Hasta 4 letras."
          path={["couple", "monogram"]}
          maxLength={4}
          className="max-w-48"
        />
      </Group>
      <Group title="Cuándo y dónde">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Día" path={["date"]} htmlFor="campo-fecha-dia">
            {(props) => (
              <TextInput
                {...props}
                type="date"
                value={when.date}
                onChange={(e) =>
                  e.target.value && set(["date"], madridIso(e.target.value, when.time))
                }
              />
            )}
          </Field>
          <Field label="Hora de la ceremonia" path={["date-hora"]} htmlFor="campo-fecha-hora">
            {(props) => (
              <TextInput
                {...props}
                type="time"
                value={when.time}
                onChange={(e) =>
                  e.target.value && set(["date"], madridIso(when.date, e.target.value))
                }
              />
            )}
          </Field>
          <TextField label="Localidad" path={["city"]} maxLength={80} />
          <TextField label="Provincia" path={["region"]} maxLength={80} />
        </div>
      </Group>
      <Group title="Tiempo habitual">
        <ClimateField />
      </Group>
      <Group title="Respuestas">
        <Field
          label="Último día para confirmar"
          hint="Después de ese día el formulario se cierra."
          path={["rsvpDeadline"]}
          htmlFor="campo-plazo"
          className="max-w-64"
        >
          {(props) => (
            <TextInput
              {...props}
              type="date"
              value={deadline.date}
              max={when.date}
              onChange={(e) =>
                e.target.value && set(["rsvpDeadline"], madridIso(e.target.value, "23:59"))
              }
            />
          )}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Hashtag" path={["hashtag"]} maxLength={60} />
          <TextField
            label="Teléfono de contacto"
            hint="Aparece el gran día por si alguien se pierde."
            path={["contactPhone"]}
            type="tel"
            maxLength={30}
          />
        </div>
      </Group>
    </div>
  );
}
