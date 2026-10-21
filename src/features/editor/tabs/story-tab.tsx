"use client";

import type { StoryMoment } from "@/lib/domain/types";
import { Group, TextField } from "../fields";
import { ListEditor } from "../list-editor";
import { PhotoField } from "../photo-field";

/** Portada, fotos y la historia de la pareja. */
export function StoryTab() {
  return (
    <div className="grid gap-8">
      <Group
        title="Portada"
        description="Mejor vertical y sin personas en primer plano: se mueve en 3D al inclinar el móvil."
      >
        <PhotoField label="Foto de portada" path={["coverPhoto"]} depthPath={["coverDepthMap"]} />
      </Group>
      <Group title="Otras fotos">
        <PhotoField label="Foto de la pareja" path={["story", "couplePhoto"]} />
        <PhotoField
          label="Foto del banquete"
          hint="Se ve al terminar de confirmar."
          path={["banquetPhoto"]}
        />
      </Group>
      <Group title="Nuestra historia">
        <TextField label="Entradilla" path={["story", "intro"]} multiline maxLength={400} />
        <ListEditor<StoryMoment>
          path={["story", "moments"]}
          max={8}
          addLabel="Añadir momento"
          itemName={(m, i) => m.title || `Momento ${i + 1}`}
          create={() => ({ year: "", title: "", text: "", photo: null, photoAlt: "" })}
        >
          {(i) => (
            <>
              <TextField label="Año" path={["story", "moments", i, "year"]} maxLength={12} />
              <TextField label="Título" path={["story", "moments", i, "title"]} maxLength={80} />
              <TextField
                label="Texto"
                path={["story", "moments", i, "text"]}
                multiline
                maxLength={400}
                className="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <PhotoField label="Foto" path={["story", "moments", i, "photo"]} />
              </div>
              <TextField
                label="Descripción de la foto"
                path={["story", "moments", i, "photoAlt"]}
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
