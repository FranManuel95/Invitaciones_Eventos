import { ShieldAlert, UtensilsCrossed } from "lucide-react";
import { DonutChart } from "@/features/dashboard/charts";
import { Card, MENU_COLORS, MENU_ORDER, MenuDot, PageHeader } from "@/features/dashboard/ui";
import { getOrganizerData } from "@/lib/data/repository";
import { ALLERGIES, MENU_LABELS, allergyLabel } from "@/lib/domain/catalog";
import { buildGuestRows, countBy } from "@/lib/stats";

export const metadata = { title: "Menús y alergias" };

export default async function MenusPage() {
  const { event, groups, responses } = await getOrganizerData();
  const rows = buildGuestRows(groups, responses);
  const menus = countBy(rows, (r) => r.menu);
  const allergies = countBy(rows, (r) => r.allergies);
  const withAllergies = rows.filter((r) => r.status === "attending" && r.allergies.length);

  return (
    <>
      <PageHeader
        title="Menús y necesidades especiales"
        description="Resumen para el catering. Solo cuentan los invitados confirmados."
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <Card
          title="Reparto de menús"
          icon={<UtensilsCrossed aria-hidden className="size-4" />}
          className="xl:col-span-3"
        >
          <DonutChart
            centerLabel="menús"
            data={MENU_ORDER.map((id) => ({
              id,
              label: MENU_LABELS[id],
              value: menus.get(id) ?? 0,
              color: MENU_COLORS[id],
            }))}
          />
          <ul className="mt-6 divide-y divide-line border-t border-line text-sm">
            {event.menu.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2.5">
                <MenuDot menu={m.id} />
                <span className="w-24 font-medium text-ink">{m.label}</span>
                <span className="flex-1 text-xs text-muted">{m.description}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Alergias más comunes"
          icon={<ShieldAlert aria-hidden className="size-4" />}
          className="xl:col-span-2"
        >
          <ul className="space-y-2.5 text-sm">
            {ALLERGIES.map((a) => {
              const n = allergies.get(a.id) ?? 0;
              return (
                <li key={a.id} className="flex items-center justify-between gap-3">
                  <span className="text-ink-soft">{a.label}</span>
                  <span className="font-semibold text-ink tabular-nums">{n}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card title="Invitados con alergias o intolerancias" className="mt-4">
        <p className="-mt-2 mb-4 flex items-center gap-2 rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
          <ShieldAlert aria-hidden className="size-3.5 shrink-0" />
          Información de salud: en la versión real solo será visible para organizadores con permiso.
        </p>
        {withAllergies.length ? (
          <div
            role="region"
            aria-label="Tabla de alergias"
            tabIndex={0}
            className="relative -mx-5 overflow-x-auto sm:-mx-6"
          >
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead className="border-y border-line bg-ivory/60 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-5 py-2.5 font-medium sm:px-6">
                    Invitado
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-medium">
                    Menú
                  </th>
                  <th scope="col" className="px-5 py-2.5 font-medium sm:px-6">
                    Alergias
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {withAllergies.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-2.5 sm:px-6">
                      <span className="text-ink">{r.name}</span>
                      <span className="block text-xs text-muted">{r.groupName}</span>
                    </td>
                    <td className="px-3 py-2.5 text-ink-soft">
                      {r.menu ? MENU_LABELS[r.menu] : "—"}
                    </td>
                    <td className="px-5 py-2.5 text-ink-soft sm:px-6">
                      {r.allergies.map(allergyLabel).join(", ")}
                      {r.allergyNotes ? (
                        <span className="block text-xs text-muted">{r.allergyNotes}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted">Ningún invitado confirmado ha indicado alergias.</p>
        )}
      </Card>
    </>
  );
}
