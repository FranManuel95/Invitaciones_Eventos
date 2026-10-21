import { Bus, Car } from "lucide-react";
import { CsvButton } from "@/features/dashboard/csv-button";
import { Card, KpiStrip, Meter, PageHeader } from "@/features/dashboard/ui";
import { getOrganizerData } from "@/lib/data/repository";
import { carOffers, passengersCsv, transportStats } from "@/lib/stats";

export const metadata = { title: "Transporte" };

export default async function TransportPage() {
  const { event, groups, responses } = await getOrganizerData();
  const { routes, busSeatsNeeded, busSeatsTotal, byCar, invitations } = transportStats(
    event,
    groups,
    responses,
  );
  const offers = carOffers(groups, responses);

  return (
    <>
      <PageHeader
        title="Transporte"
        description={`${busSeatsNeeded} de ${busSeatsTotal} plazas de autobús reservadas. ${byCar} invitados llegan por su cuenta.`}
        actions={
          <CsvButton
            csv={passengersCsv(routes)}
            filename="pasajeros-autobus.csv"
            label="Descargar pasajeros (CSV)"
          />
        }
      />

      <div className="mb-8">
        <KpiStrip
          items={[
            { label: "Usan el autobús", value: invitations.yes, detail: "invitaciones" },
            { label: "No usan el autobús", value: invitations.no, detail: "invitaciones" },
            { label: "Sin responder", value: invitations.pending, detail: "invitaciones" },
            {
              label: "Plazas reservadas",
              value: busSeatsNeeded,
              detail: `de ${busSeatsTotal} disponibles`,
            },
          ]}
        />
      </div>

      <Card title="Rutas" icon={<Bus aria-hidden className="size-4" />}>
        <div
          role="region"
          aria-label="Tabla de rutas"
          tabIndex={0}
          className="relative -mx-5 overflow-x-auto sm:-mx-6"
        >
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-y border-line bg-ivory/60 text-xs text-muted">
              <tr>
                <th scope="col" className="px-5 py-2.5 font-medium sm:px-6">
                  Ruta
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Salida
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Plazas
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Confirmadas
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Disponibles
                </th>
                <th scope="col" className="w-40 px-5 py-2.5 font-medium sm:px-6">
                  <span className="sr-only">Ocupación</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {routes.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3 sm:px-6">
                    <span className="font-medium text-ink">{r.label}</span>
                    <span className="block text-xs text-muted">{r.pickupPoint}</span>
                  </td>
                  <td className="px-3 py-3 text-ink-soft tabular-nums">{r.departure}</td>
                  <td className="px-3 py-3 text-right text-ink tabular-nums">{r.seats}</td>
                  <td className="px-3 py-3 text-right text-ink tabular-nums">{r.requested}</td>
                  <td className="px-3 py-3 text-right font-semibold text-ink tabular-nums">
                    {r.available}
                  </td>
                  <td className="px-5 py-3 sm:px-6">
                    <Meter value={r.requested} max={r.seats} label={`Ocupación ${r.label}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {routes.map((r) => (
          <Card key={r.id} title={`Pasajeros de ${r.label}`}>
            {r.bookings.length ? (
              <ul
                tabIndex={0}
                aria-label={`Pasajeros de ${r.label}`}
                className="max-h-72 divide-y divide-line overflow-y-auto rounded-sm text-sm"
              >
                {r.bookings.map((b) => (
                  <li key={b.groupId} className="py-2">
                    <span className="flex justify-between gap-3">
                      <span className="font-medium text-ink">{b.groupName}</span>
                      <span className="text-xs text-muted tabular-nums">
                        {b.seats} {b.seats === 1 ? "plaza" : "plazas"}
                      </span>
                    </span>
                    <span className="block text-xs text-muted">{b.names.join(", ")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">Nadie ha reservado plaza en esta ruta todavía.</p>
            )}
          </Card>
        ))}
      </div>

      <Card
        title="Coches compartidos"
        icon={<Car aria-hidden className="size-4" />}
        className="mt-4"
      >
        {offers.length ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o) => (
              <li
                key={o.groupName}
                className="flex items-center justify-between rounded-md bg-ivory/70 px-3 py-2 text-sm"
              >
                <span className="text-ink">{o.groupName}</span>
                <span className="text-xs text-muted">
                  {o.seats} {o.seats === 1 ? "plaza" : "plazas"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nadie ha ofrecido plazas en coche todavía.</p>
        )}
      </Card>
    </>
  );
}
