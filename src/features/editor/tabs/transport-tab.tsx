"use client";

import { ChoiceCard } from "@/components/ui/fields";
import type { BusRoute, MenuId, MenuOption } from "@/lib/domain/types";
import { CommaListField, Group, NumberField, TextField, useEditor } from "../fields";
import { ListEditor, newId } from "../list-editor";

const MENUS: { id: MenuId; label: string; childrenOnly?: boolean }[] = [
  { id: "carne", label: "Carne" },
  { id: "pescado", label: "Pescado" },
  { id: "vegetariano", label: "Vegetariano" },
  { id: "vegano", label: "Vegano" },
  { id: "infantil", label: "Infantil", childrenOnly: true },
];

/** Autobuses y menús. */
export function TransportTab() {
  const { draft, set } = useEditor();
  const menu = draft.content.menu;

  const toggleMenu = (id: MenuId, on: boolean) => {
    const base = MENUS.find((m) => m.id === id);
    const next: MenuOption[] = on
      ? [
          ...menu,
          {
            id,
            label: base?.label ?? id,
            description: "",
            ...(base?.childrenOnly ? { childrenOnly: true } : {}),
          },
        ]
      : menu.filter((m) => m.id !== id);
    // Siempre en el mismo orden que en el formulario de respuesta.
    set(
      ["menu"],
      MENUS.flatMap((m) => next.filter((n) => n.id === m.id)),
    );
  };

  return (
    <div className="grid gap-8">
      <Group
        title="Autobuses"
        description="Cada invitado dirá si los usa y desde qué punto. Sin rutas, no se pregunta."
      >
        <ListEditor<BusRoute>
          path={["busRoutes"]}
          max={8}
          addLabel="Añadir ruta"
          itemName={(r, i) => r.label || `Ruta ${i + 1}`}
          create={() => ({
            id: newId("ruta"),
            label: "",
            pickupPoint: "",
            departure: "15:00",
            returnTrips: ["01:30"],
            seats: 50,
          })}
        >
          {(i) => (
            <>
              <TextField
                label="Nombre de la ruta"
                placeholder="Madrid → Finca"
                path={["busRoutes", i, "label"]}
                maxLength={120}
              />
              <TextField
                label="Punto de recogida"
                path={["busRoutes", i, "pickupPoint"]}
                maxLength={200}
              />
              <TextField label="Salida" path={["busRoutes", i, "departure"]} type="time" />
              <CommaListField
                label="Vueltas"
                hint="Horas separadas por comas, por ejemplo: 01:30, 03:30"
                path={["busRoutes", i, "returnTrips"]}
              />
              <NumberField label="Plazas" path={["busRoutes", i, "seats"]} min={0} max={500} />
            </>
          )}
        </ListEditor>
      </Group>
      <Group title="Menús" description="Los invitados eligen uno por persona al confirmar.">
        <div className="grid gap-3">
          {MENUS.map((m) => {
            const index = menu.findIndex((x) => x.id === m.id);
            return (
              <div key={m.id} className="grid gap-3">
                <ChoiceCard
                  type="checkbox"
                  checked={index >= 0}
                  onChange={(e) => toggleMenu(m.id, e.target.checked)}
                  label={m.label}
                  description={m.childrenOnly ? "Solo para niños" : undefined}
                />
                {index >= 0 ? (
                  <div className="grid gap-4 border-l-2 border-line pl-4 sm:grid-cols-2">
                    <TextField label="Nombre" path={["menu", index, "label"]} maxLength={60} />
                    <TextField
                      label="Descripción del plato"
                      path={["menu", index, "description"]}
                      maxLength={200}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Group>
    </div>
  );
}
