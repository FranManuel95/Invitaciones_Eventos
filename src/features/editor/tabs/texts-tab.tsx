"use client";

import { TextInput } from "@/components/ui/fields";
import { getIn } from "@/lib/editor/draft";
import { Field, Group, TextField, useEditor } from "../fields";
import { ListEditor } from "../list-editor";

/** Textos de la carta y de la invitación. */
export function TextsTab() {
  const { draft, set } = useEditor();
  return (
    <div className="grid gap-8">
      <Group title="La carta" description="Lo primero que leen al abrir el sobre.">
        <TextField label="Mensaje de la carta" path={["cardMessage"]} multiline maxLength={400} />
      </Group>
      <Group title="Bienvenida">
        <TextField
          label="Texto de bienvenida"
          path={["welcomeMessage"]}
          multiline
          maxLength={1200}
        />
      </Group>
      <Group title="Código de vestimenta">
        <TextField label="Estilo" path={["dressCode", "title"]} maxLength={80} />
        <TextField label="Detalles" path={["dressCode", "detail"]} multiline maxLength={400} />
        <ListEditor<{ name: string; hex: string }>
          path={["dressCode", "palette"]}
          max={8}
          addLabel="Añadir color"
          itemName={(c, i) => c.name || `Color ${i + 1}`}
          create={() => ({ name: "", hex: "#d3c08f" })}
        >
          {(i) => (
            <>
              <TextField label="Nombre" path={["dressCode", "palette", i, "name"]} maxLength={40} />
              <Field label="Color" path={["dressCode", "palette", i, "hex"]}>
                {(props) => (
                  <TextInput
                    {...props}
                    type="color"
                    className="w-24 p-1"
                    value={String(getIn(draft.content, ["dressCode", "palette", i, "hex"]))}
                    onChange={(e) => set(["dressCode", "palette", i, "hex"], e.target.value)}
                  />
                )}
              </Field>
            </>
          )}
        </ListEditor>
        <ListEditor<{ who: string; text: string }>
          path={["dressCode", "examples"]}
          max={4}
          addLabel="Añadir sugerencia"
          itemName={(e, i) => e.who || `Sugerencia ${i + 1}`}
          create={() => ({ who: "", text: "" })}
        >
          {(i) => (
            <>
              <TextField
                label="Para quién"
                hint="Por ejemplo: Ellas, Ellos o Niños."
                path={["dressCode", "examples", i, "who"]}
                maxLength={40}
              />
              <TextField
                label="Sugerencia"
                path={["dressCode", "examples", i, "text"]}
                multiline
                maxLength={200}
              />
            </>
          )}
        </ListEditor>
      </Group>
      <Group title="Regalo">
        <TextField label="Mensaje" path={["gift", "message"]} multiline maxLength={600} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Titular de la cuenta" path={["gift", "holder"]} maxLength={120} />
          <TextField label="Número de cuenta (IBAN)" path={["gift", "iban"]} maxLength={40} />
        </div>
      </Group>
    </div>
  );
}
