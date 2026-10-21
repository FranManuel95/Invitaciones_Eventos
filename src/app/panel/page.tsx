import {
  ArrowRight,
  Bus,
  Car,
  CircleAlert,
  MessageSquareQuote,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { DEMO_REFERENCE_DATE } from "@/data/demo/guests";
import { ConfirmationsChart, DonutChart } from "@/features/dashboard/charts";
import { Card, Kpi, MENU_COLORS, MENU_ORDER, Meter, PageHeader } from "@/features/dashboard/ui";
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

const pct = (part: number, total: number) =>
  total ? `${Math.round((part / total) * 100)}%` : "0%";
const dateFmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" });

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

  return (
    <>
      <PageHeader
        eyebrow="Resumen"
        title={`Hola, ${event.couple.first}`}
        description={`Faltan ${daysLeft} días para la boda · ${summary.respondedGroups} de ${summary.groups} invitaciones respondidas.`}
        actions={
          <Link
            href="/panel/invitados?estado=pending"
            className="inline-flex items-center gap-2 rounded-md border border-ink/20 bg-paper px-3.5 py-2 text-[0.8125rem] text-ink transition-colors hover:border-ink"
          >
            Ver pendientes <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi
          label="Total invitados"
          value={summary.totalSeats}
          detail={`${summary.groups} invitaciones`}
        />
        <Kpi
          label="Confirmados"
          value={summary.attending}
          detail={`${pct(summary.attending, summary.totalSeats)} del total`}
        />
        <Kpi
          label="Pendientes"
          value={summary.pending}
          detail={`${pct(summary.pending, summary.totalSeats)} del total`}
        />
        <Kpi
          label="No asisten"
          value={summary.declined}
          detail={`${pct(summary.declined, summary.totalSeats)} del total`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card
          title="Confirmaciones por día"
          icon={<Users aria-hidden className="size-4" />}
          className="xl:col-span-2"
        >
          <ConfirmationsChart points={daily} goal={summary.totalSeats} />
        </Card>
        <Card
          title="Menús"
          icon={<UtensilsCrossed aria-hidden className="size-4" />}
          action={
            <Link
              href="/panel/menus"
              className="text-xs text-ink-soft underline-offset-4 hover:underline"
            >
              Detalle
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

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Transporte"
          icon={<Bus aria-hidden className="size-4" />}
          action={
            <Link
              href="/panel/transporte"
              className="text-xs text-ink-soft underline-offset-4 hover:underline"
            >
              Rutas
            </Link>
          }
        >
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-muted">Plazas de autobús pedidas</dt>
              <dd className="mt-1 font-display text-3xl text-ink lining-nums">
                {transport.busSeatsNeeded}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Plazas libres</dt>
              <dd className="mt-1 font-display text-3xl text-ink lining-nums">
                {transport.busSeatsTotal - transport.busSeatsNeeded}
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <Meter
              value={transport.busSeatsNeeded}
              max={transport.busSeatsTotal}
              label="Ocupación total de autobuses"
            />
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <Car aria-hidden className="size-3.5" />
            {offers.length} invitaciones ofrecen {offers.reduce((s, o) => s + o.seats, 0)} plazas en
            coche
          </p>
        </Card>

        <Card
          title="Alergias e intolerancias"
          icon={<CircleAlert aria-hidden className="size-4" />}
        >
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            {ALLERGIES.map((a) => (
              <li key={a.id}>
                <p className="text-xs text-muted">{a.label}</p>
                <p className="font-display text-2xl text-ink lining-nums">
                  {allergies.get(a.id) ?? 0}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Datos sensibles: en producción solo los verá el organizador.
          </p>
        </Card>

        <Card
          title="Últimos mensajes"
          icon={<MessageSquareQuote aria-hidden className="size-4" />}
          className="lg:col-span-2 xl:col-span-1"
        >
          {messages.length ? (
            <ul className="divide-y divide-line">
              {messages.map((m) => (
                <li key={m.groupName + m.date} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-display text-[1.0625rem] leading-snug text-ink italic">
                    “{m.message}”
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {m.groupName} · {dateFmt.format(new Date(m.date))}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              Aún no hay mensajes. Aparecerán aquí cuando los invitados respondan.
            </p>
          )}
        </Card>
      </div>

      <p className="mt-8 text-xs text-muted">
        Datos ficticios generados para la demo, con fecha de referencia{" "}
        {dateFmt.format(new Date(DEMO_REFERENCE_DATE))}. Las respuestas que envíes desde las
        invitaciones de ejemplo se guardan solo en tu navegador y no aparecen aquí.
      </p>
    </>
  );
}
