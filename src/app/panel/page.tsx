import Link from "next/link";
import { DEMO_REFERENCE_DATE } from "@/data/demo/guests";
import { ConfirmationsChart, DonutChart } from "@/features/dashboard/charts";
import {
  Card,
  KpiStrip,
  MENU_COLORS,
  MENU_ORDER,
  Meter,
  PageHeader,
} from "@/features/dashboard/ui";
import { getOrganizerData } from "@/lib/data/repository";
import { ALLERGIES, MENU_LABELS } from "@/lib/domain/catalog";
import {
  buildGuestRows,
  carOffers,
  confirmationsByDay,
  countBy,
  recentMessages,
  summarize,
  transportStats,
} from "@/lib/stats";

export const metadata = { title: "Inicio" };

const percent = new Intl.NumberFormat("es-ES", { style: "percent", maximumFractionDigits: 0 });
const share = (part: number, total: number) => percent.format(total ? part / total : 0);
const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Madrid",
});

const linkClass =
  "text-[0.875rem] text-ink underline decoration-gold underline-offset-4 transition-colors hover:decoration-ink";

export default async function PanelHome() {
  const { event, groups, responses } = await getOrganizerData();
  const summary = summarize(groups, responses);
  const rows = buildGuestRows(groups, responses);
  const daily = confirmationsByDay(responses, "2026-09-01", DEMO_REFERENCE_DATE);
  const menus = countBy(rows, (r) => r.menu);
  const allergies = countBy(rows, (r) => r.allergies);
  const transport = transportStats(event, rows);
  const offers = carOffers(groups, responses);
  const messages = recentMessages(groups, responses, 4);
  const daysLeft = Math.ceil(
    (Date.parse(event.date) - Date.parse(`${DEMO_REFERENCE_DATE}T12:00:00Z`)) / 86_400_000,
  );
  const pendingGroups = summary.groups - summary.respondedGroups;

  return (
    <>
      <PageHeader
        title={`Hola, ${event.couple.first}`}
        description={`Faltan ${daysLeft} días para la boda. Han respondido ${summary.respondedGroups} de ${summary.groups} invitaciones; quedan ${pendingGroups} por contestar.`}
        actions={
          <Link
            href="/panel/invitados?estado=pending"
            className="inline-flex h-10 items-center rounded-md border border-ink/25 bg-paper px-4 text-[0.875rem] text-ink transition-colors hover:border-ink"
          >
            Ver quién falta por responder
          </Link>
        }
      />

      <KpiStrip
        items={[
          {
            label: "Invitados",
            value: summary.totalSeats,
            detail: `${summary.groups} invitaciones`,
          },
          {
            label: "Confirmados",
            value: summary.attending,
            detail: `${share(summary.attending, summary.totalSeats)} del total`,
          },
          {
            label: "Sin responder",
            value: summary.pending,
            detail: `${share(summary.pending, summary.totalSeats)} del total`,
          },
          {
            label: "No asisten",
            value: summary.declined,
            detail: `${share(summary.declined, summary.totalSeats)} del total`,
          },
        ]}
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Card title="Confirmaciones acumuladas" className="xl:col-span-2">
          <ConfirmationsChart points={daily} goal={summary.totalSeats} />
        </Card>
        <Card
          title="Menús elegidos"
          action={
            <Link href="/panel/menus" className={linkClass}>
              Ver detalle
            </Link>
          }
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
        </Card>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <Card
          variant="ruled"
          title="Transporte"
          action={
            <Link href="/panel/transporte" className={linkClass}>
              Ver rutas
            </Link>
          }
        >
          <p className="font-display text-[2.25rem] leading-none text-ink lining-nums">
            {transport.busSeatsNeeded}
            <span className="ml-2 font-sans text-[0.9375rem] text-muted">
              de {transport.busSeatsTotal} plazas de autobús reservadas
            </span>
          </p>
          <div className="mt-4">
            <Meter
              value={transport.busSeatsNeeded}
              max={transport.busSeatsTotal}
              label="Ocupación total de autobuses"
            />
          </div>
          <p className="mt-4 text-[0.875rem] text-muted">
            {offers.length} invitaciones ofrecen {offers.reduce((s, o) => s + o.seats, 0)} plazas en
            su coche.
          </p>
        </Card>

        <Card variant="ruled" title="Alergias e intolerancias">
          <ul className="grid grid-cols-3 gap-x-4 gap-y-3">
            {ALLERGIES.map((a) => (
              <li key={a.id}>
                <p className="text-[0.8125rem] text-muted">{a.label}</p>
                <p className="font-display text-[1.75rem] leading-tight text-ink lining-nums">
                  {allergies.get(a.id) ?? 0}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.8125rem] text-muted">
            Datos de salud: en producción solo los verán los novios.
          </p>
        </Card>

        <Card variant="ruled" title="Últimos mensajes">
          {messages.length ? (
            <ul className="space-y-4">
              {messages.map((m) => (
                <li key={m.groupName + m.date}>
                  <p className="font-display text-[1.0625rem] leading-snug text-ink italic">
                    “{m.message}”
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-muted">
                    {m.groupName}, {dateFmt.format(new Date(m.date))}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.9375rem] text-muted">
              Cuando los invitados dejen un mensaje al confirmar, aparecerá aquí.
            </p>
          )}
        </Card>
      </div>

      <p className="mt-12 text-[0.8125rem] text-muted">
        Datos ficticios generados para la demo, con fecha de referencia{" "}
        {dateFmt.format(new Date(DEMO_REFERENCE_DATE))}. Las respuestas que envíes desde las
        invitaciones de ejemplo se guardan solo en tu navegador y no aparecen aquí.
      </p>
    </>
  );
}
