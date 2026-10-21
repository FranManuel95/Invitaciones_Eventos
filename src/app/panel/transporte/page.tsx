import { Bus, Car } from "lucide-react";
import { Card, Meter, PageHeader } from "@/features/dashboard/ui";
import { getOrganizerData } from "@/lib/data/repository";
import { buildGuestRows, carOffers, transportStats } from "@/lib/stats";

export const metadata = { title: "Transporte" };

export default async function TransportPage() {
  const { event, groups, responses } = await getOrganizerData();
  const rows = buildGuestRows(groups, responses);
  const { routes, busSeatsNeeded, busSeatsTotal, byCar } = transportStats(event, rows);
  const offers = carOffers(groups, responses);

  return (
    <>
      <PageHeader
        eyebrow="Logística"
        title="Transporte"
        description={`${busSeatsNeeded} de ${busSeatsTotal} plazas de autobús reservadas · ${byCar} invitados llegan en coche.`}
      />

      <Card title="Rutas" icon={<Bus aria-hidden className="size-4" />}>
        <div className="relative -mx-5 overflow-x-auto sm:-mx-6">
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
          <Card key={r.id} title={`Pasajeros · ${r.label}`}>
            {r.passengers.length ? (
              <ul className="max-h-72 divide-y divide-line overflow-y-auto text-sm">
                {r.passengers.map((p) => (
                  <li key={p.id} className="flex justify-between gap-3 py-2">
                    <span className="text-ink">{p.name}</span>
                    <span className="text-xs text-muted">{p.groupName}</span>
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
