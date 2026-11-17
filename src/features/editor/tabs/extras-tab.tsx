"use client";

import type { Accommodation, Faq } from "@/lib/domain/types";
import { Group, TextField } from "../fields";
import { ListEditor } from "../list-editor";

/** Preguntas frecuentes y alojamiento. */
export function ExtrasTab() {
  return (
    <div className="grid gap-8">
      <Group title="Preguntas frecuentes">
        <ListEditor<Faq>
          path={["faqs"]}
          max={20}
          addLabel="Añadir pregunta"
          empty="Aún no hay preguntas. Las de siempre: si hay aparcamiento, si pueden ir niños y a qué hora acaba."
          itemName={(f, i) => f.question || `Pregunta ${i + 1}`}
          create={() => ({ question: "", answer: "" })}
        >
          {(i) => (
            <>
              <TextField
                label="Pregunta"
                path={["faqs", i, "question"]}
                maxLength={200}
                className="sm:col-span-2"
              />
              <TextField
                label="Respuesta"
                path={["faqs", i, "answer"]}
                multiline
                maxLength={800}
                className="sm:col-span-2"
              />
            </>
          )}
        </ListEditor>
      </Group>
      <Group title="Alojamiento">
        <ListEditor<Accommodation>
          path={["accommodation"]}
          max={8}
          addLabel="Añadir alojamiento"
          empty="Aún no hay alojamientos. Si vienen invitados de fuera, añadid un par de hoteles cercanos."
          itemName={(a, i) => a.name || `Alojamiento ${i + 1}`}
          create={() => ({ name: "", distance: "", detail: "" })}
        >
          {(i) => (
            <>
              <TextField label="Nombre" path={["accommodation", i, "name"]} maxLength={120} />
              <TextField
                label="Distancia"
                placeholder="A 5 min de la iglesia"
                path={["accommodation", i, "distance"]}
                maxLength={60}
              />
              <TextField
                label="Detalles"
                path={["accommodation", i, "detail"]}
                multiline
                maxLength={300}
                className="sm:col-span-2"
              />
            </>
          )}
        </ListEditor>
      </Group>
    </div>
  );
}
