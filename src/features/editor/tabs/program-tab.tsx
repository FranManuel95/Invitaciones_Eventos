"use client";

import type { ProgramItem, Venue } from "@/lib/domain/types";
import { Group, SelectField, TextField, useEditor } from "../fields";
import { ListEditor, newId } from "../list-editor";
import { PhotoField } from "../photo-field";

const ICONS = [
  { value: "ceremony", label: "Ceremonia (anillos)" },
  { value: "cocktail", label: "Cóctel (copa)" },
  { value: "banquet", label: "Banquete (plato)" },
  { value: "party", label: "Fiesta (notas)" },
  { value: "bus", label: "Autobús" },
];

/** Programa del día y lugares. */
export function ProgramTab() {
  const { draft } = useEditor();
  const venues = [
    { value: "", label: "Ninguno" },
    ...draft.content.venues.map((v) => ({ value: v.id, label: v.name || "Lugar sin nombre" })),
  ];
  return (
    <div className="grid gap-8">
      <Group title="Programa" description="Los actos del día, en orden.">
        <ListEditor<ProgramItem>
          path={["program"]}
          max={12}
          addLabel="Añadir acto"
          itemName={(item, i) => item.title || `Acto ${i + 1}`}
          create={() => ({
            id: newId("acto"),
            time: "20:00",
            title: "",
            venueId: "",
            place: "",
            description: "",
            icon: "party",
          })}
        >
          {(i) => (
            <>
              <TextField label="Hora" path={["program", i, "time"]} type="time" />
              <TextField label="Título" path={["program", i, "title"]} maxLength={80} />
              <SelectField label="Icono" path={["program", i, "icon"]} options={ICONS} />
              <SelectField label="Lugar" path={["program", i, "venueId"]} options={venues} />
              <TextField
                label="Dónde, en pocas palabras"
                path={["program", i, "place"]}
                maxLength={120}
                className="sm:col-span-2"
              />
              <TextField
                label="Descripción"
                path={["program", i, "description"]}
                multiline
                maxLength={400}
                className="sm:col-span-2"
              />
            </>
          )}
        </ListEditor>
      </Group>
      <Group title="Lugares">
        <ListEditor<Venue>
          path={["venues"]}
          max={6}
          addLabel="Añadir lugar"
          itemName={(v, i) => v.name || `Lugar ${i + 1}`}
          create={() => ({
            id: newId("lugar"),
            name: "",
            kind: "",
            address: "",
            city: "",
            mapsQuery: "",
            note: "",
            photo: null,
            photoAlt: "",
          })}
        >
          {(i) => (
            <>
              <TextField label="Nombre" path={["venues", i, "name"]} maxLength={120} />
              <TextField
                label="Qué se celebra"
                placeholder="Ceremonia, banquete…"
                path={["venues", i, "kind"]}
                maxLength={80}
              />
              <TextField label="Dirección" path={["venues", i, "address"]} maxLength={200} />
              <TextField label="Localidad" path={["venues", i, "city"]} maxLength={120} />
              <TextField
                label="Búsqueda en mapas"
                hint="Lo que escribirías en Google Maps para encontrarlo."
                path={["venues", i, "mapsQuery"]}
                maxLength={200}
                className="sm:col-span-2"
              />
              <TextField
                label="Nota para los invitados"
                path={["venues", i, "note"]}
                multiline
                maxLength={400}
                className="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <PhotoField label="Foto del lugar" path={["venues", i, "photo"]} />
              </div>
              <TextField
                label="Descripción de la foto"
                hint="Para quien no puede verla. Por ejemplo: «Fachada de piedra con campanario»."
                path={["venues", i, "photoAlt"]}
                maxLength={200}
                className="sm:col-span-2"
              />
            </>
          )}
        </ListEditor>
      </Group>
    </div>
  );
}
