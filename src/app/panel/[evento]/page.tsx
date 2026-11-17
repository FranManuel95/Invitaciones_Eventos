import { eventNoun } from "@/lib/event-kind";
import { formatLongDate } from "@/lib/format";
import { openSummary } from "@/lib/guests/opened";
import Link from "next/link";
import { DEMO_REFERENCE_DATE, showcaseGroups } from "@/data/demo/guests";
import { ConfirmationsChart, DonutChart } from "@/features/dashboard/charts";
import { Card, MENU_COLORS, MENU_ORDER, Meter } from "@/features/dashboard/ui";
import { ALLERGIES, MENU_LABELS } from "@/lib/domain/catalog";
import {
  buildGuestRows,
  carOffers,
  confirmationsByDay,
  countBy,
  recentMessages,
  summarize,
  songRequests,
  transportStats,
} from "@/lib/stats";

import { nextSteps, songTally } from "@/lib/next-steps";
import { FirstStepsGuide } from "@/features/dashboard/first-steps-guide";
import { SinceLastVisit } from "@/features/dashboard/news";
import { firstSteps, showFirstSteps } from "@/lib/events/first-steps";
import { buildNewEventContent } from "@/lib/events/new-event";
import { repliesSince } from "@/lib/guests/news";
import { DEFAULT_THEME } from "@/lib/theme";
import { demoClock } from "./news-clock";

import { loadOrganizer } from "./load";
import { PublishBar } from "./publish-bar";

export const metadata = { title: "Inicio" };

const percent = new Intl.NumberFormat("es-ES", { style: "percent", maximumFractionDigits: 0 });
const share = (part: number, total: number) => percent.format(total ? part / total : 0);
const pctOf = (part: number, total: number) => `${total ? (part / total) * 100 : 0}%`;
const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Madrid",
});

const linkClass =
  "text-[0.875rem] text-ink underline decoration-gold underline-offset-4 transition-colors hover:decoration-ink";

export default async function PanelHome(props: PageProps<"/panel/[evento]">) {
  const { event, groups, responses, base, isDemo, meta, theme } = await loadOrganizer(props.params);
  const query = await props.searchParams;
  const summary = summarize(groups, responses);
  const rows = buildGuestRows(groups, responses);
  // En la demo, las fechas son ficticias; en un evento real, del primer envío a hoy.
  const today = new Date().toISOString().slice(0, 10);
  const firstReply = responses.map((r) => r.updatedAt.slice(0, 10)).sort()[0] ?? today;
  const daily = isDemo
    ? confirmationsByDay(responses, "2026-09-01", DEMO_REFERENCE_DATE)
    : confirmationsByDay(responses, firstReply, today);
  const menus = countBy(rows, (r) => r.menu);
  const allergies = countBy(rows, (r) => r.allergies);
  const transport = transportStats(event, groups, responses);
  const songs = songTally(songRequests(groups, responses));
  const songCount = songs.reduce((sum, s) => sum + s.count, 0);
  const offers = carOffers(groups, responses);
  const messages = recentMessages(groups, responses, 4);
  const reference = isDemo ? `${DEMO_REFERENCE_DATE}T12:00:00Z` : new Date().toISOString();
  const daysLeft = Math.ceil((Date.parse(event.date) - Date.parse(reference)) / 86_400_000);
  const opened = openSummary(groups, new Set(responses.map((r) => r.groupId)));
  const editorHref = `/editor/${isDemo ? "demo" : meta?.id}`;

  // Primeros pasos. En la demo (que ya está hecha) se ven con ?vista=nuevo, como un evento recién
  // creado con los mismos nombres y fecha.
  const previewNew = isDemo && query.vista === "nuevo";
  const guide = previewNew
    ? firstSteps({
        content: buildNewEventContent({
          first: event.couple.first,
          second: event.couple.second,
          date: event.date.slice(0, 10),
          kind: event.kind,
        }),
        theme: DEFAULT_THEME,
        groups: [],
        published: false,
        sampleNames: [],
      })
    : meta
      ? firstSteps({
          content: event,
          theme: theme ?? DEFAULT_THEME,
          groups,
          published: meta.status === "published",
          sampleNames: showcaseGroups.map((g) => g.displayName),
        })
      : null;
  const guideVisible = guide !== null && showFirstSteps(guide);
  // Con la guía a la vista, «Qué toca ahora» no repite lo de crear invitaciones.
  const steps = nextSteps(groups, responses, event.rsvpDeadline, reference).filter(
    (s) => !(guideVisible && s.id === "sin-invitaciones"),
  );
  const allReplies = repliesSince(groups, responses, "1970-01-01T00:00:00Z");

  return (
    <>
      {meta ? (
        <PublishBar
          eventId={meta.id}
          status={meta.status}
          phase={meta.phase}
          links={groups.map((g) => ({ name: g.displayName, token: g.token }))}
        />
      ) : null}
      {/* Cabecera: cuánto falta y cómo van las respuestas, de un vistazo. */}
      <section
        aria-labelledby="saludo"
        className="panel-dark relative overflow-hidden rounded-2xl px-5 py-7 shadow-[var(--shadow-lift)] sm:px-8 sm:py-9"
      >
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-12">
          <div>
            <h1 id="saludo" className="panel-title text-[2.75rem] leading-none sm:text-[3.5rem]">
              Hola, {event.couple.first}
            </h1>
            <p className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-[3.75rem] leading-none text-gold lining-nums tabular-nums sm:text-[4.5rem]">
                {Math.max(0, daysLeft)}
              </span>
              <span className="text-[1rem] leading-snug text-ink-soft">
                {daysLeft === 1 ? "día" : "días"} para {eventNoun(event)}
                <span className="block text-[0.875rem] text-muted">
                  {formatLongDate(event.date)}, en {event.city}
                </span>
              </span>
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href={editorHref}
                className="inline-flex h-11 items-center rounded-full bg-[#f4f2ed] px-5 text-[0.9375rem] font-medium text-[#1b2033] transition-colors hover:bg-white"
              >
                Editar la invitación
              </Link>
              <Link
                href={`${base}/invitados?estado=pending`}
                className="inline-flex h-11 items-center rounded-full border border-line px-5 text-[0.9375rem] text-ink transition-colors hover:border-gold"
              >
                Ver quién falta por responder
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[0.9375rem] text-ink-soft">
              Han respondido{" "}
              <strong className="font-medium text-ink">
                {summary.respondedGroups} de {summary.groups}
              </strong>{" "}
              invitaciones
              {opened["sin-abrir"] ? `; ${opened["sin-abrir"]} aún no la han abierto` : ""}.
            </p>
            {/* Barra de personas: confirmadas, sin responder y que no vienen. */}
            <div
              role="img"
              aria-label={`De ${summary.totalSeats} invitados: ${summary.attending} confirmados, ${summary.pending} sin responder y ${summary.declined} no asisten.`}
              className="mt-4 flex h-3 overflow-hidden rounded-full bg-paper"
            >
              <span
                className="bg-gold"
                style={{ width: pctOf(summary.attending, summary.totalSeats) }}
              />
              <span
                className="bg-[#a3a8ba]/45"
                style={{ width: pctOf(summary.pending, summary.totalSeats) }}
              />
              <span
                className="bg-[#c4515f]"
                style={{ width: pctOf(summary.declined, summary.totalSeats) }}
              />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {[
                {
                  label: "Invitados",
                  value: summary.totalSeats,
                  detail: `${summary.groups} invitaciones`,
                  dot: "",
                },
                {
                  label: "Confirmados",
                  value: summary.attending,
                  detail: `${share(summary.attending, summary.totalSeats)} del total`,
                  dot: "bg-gold",
                },
                {
                  label: "Sin responder",
                  value: summary.pending,
                  detail: `${share(summary.pending, summary.totalSeats)} del total`,
                  dot: "bg-[#a3a8ba]/60",
                },
                {
                  label: "No asisten",
                  value: summary.declined,
                  detail: `${share(summary.declined, summary.totalSeats)} del total`,
                  dot: "bg-[#c4515f]",
                },
              ].map((k) => (
                <div key={k.label}>
                  <dt className="flex items-center gap-2 text-[0.8125rem] text-muted">
                    {k.dot ? <span aria-hidden className={`size-2 rounded-full ${k.dot}`} /> : null}
                    {k.label}
                  </dt>
                  <dd className="mt-1 font-display text-[2.25rem] leading-none text-ink lining-nums tabular-nums">
                    {k.value}
                  </dd>
                  <dd className="mt-1.5 text-[0.75rem] text-muted">{k.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {guideVisible ? (
        <FirstStepsGuide
          className="mt-10"
          steps={guide}
          welcome={query.bienvenida === "1"}
          hrefs={{
            editor: editorHref,
            "/invitaciones": `${base}/invitaciones`,
            "#publicacion": meta ? "#publicacion" : editorHref,
          }}
        />
      ) : null}
      <SinceLastVisit
        className="mt-10"
        event={isDemo ? "demo" : (meta?.id ?? "demo")}
        replies={allReplies}
        clock={isDemo ? demoClock : undefined}
        invitationsHref={`${base}/invitaciones`}
      />
      {steps.length ? (
        <section aria-labelledby="que-toca" className="mt-10">
          <h2 id="que-toca" className="panel-title text-[1.875rem] leading-none text-ink">
            Qué toca ahora
          </h2>
          <ul className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3">
            {steps.map((step) => (
              <li
                key={step.id}
                className="flex flex-col rounded-xl border border-line bg-paper p-5 shadow-[var(--shadow-paper)] sm:p-6"
              >
                <p className="font-display text-[1.375rem] leading-tight text-ink">{step.title}</p>
                <p className="mt-1.5 flex-1 text-[0.875rem] leading-relaxed text-ink-soft">
                  {step.detail}
                </p>
                {step.path && step.action ? (
                  <Link href={`${base}${step.path}`} className={`${linkClass} mt-3 self-start`}>
                    {step.action}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Card title="Confirmaciones acumuladas" className="xl:col-span-2">
          <ConfirmationsChart points={daily} goal={summary.totalSeats} />
        </Card>
        <Card
          title="Menús elegidos"
          action={
            <Link href={`${base}/menus`} className={linkClass}>
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
            <Link href={`${base}/transporte`} className={linkClass}>
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
          <p className="mt-4 text-[0.875rem] text-ink-soft">
            Autobús: <strong className="font-semibold text-ink">sí</strong> en{" "}
            {transport.invitations.yes} invitaciones,{" "}
            <strong className="font-semibold text-ink">no</strong> en {transport.invitations.no} y{" "}
            {transport.invitations.pending} sin responder.
          </p>
          <p className="mt-2 text-[0.875rem] text-muted">
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

      <div className="mt-10">
        <Card
          variant="ruled"
          title={`Canciones pedidas (${songCount})`}
          action={
            songs.length ? (
              <Link href={`${base}/imprimir`} className={linkClass}>
                Imprimir para el DJ
              </Link>
            ) : undefined
          }
        >
          {songs.length ? (
            <ol className="columns-1 gap-10 text-[0.9375rem] sm:columns-2 xl:columns-3">
              {songs.map((s) => (
                <li
                  key={s.song}
                  className="mb-2.5 flex break-inside-avoid items-baseline justify-between gap-4 border-b border-line pb-2.5"
                >
                  <span className="min-w-0 text-ink">{s.song}</span>
                  <span className="shrink-0 text-[0.8125rem] text-muted tabular-nums">
                    {s.count === 1 ? s.askedBy[0] : `${s.count} veces`}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-[0.9375rem] text-muted">
              Cuando los invitados pidan canciones al confirmar, aparecerán aquí para el DJ.
            </p>
          )}
        </Card>
      </div>

      {isDemo ? (
        <p className="mt-12 text-[0.8125rem] text-muted">
          Datos ficticios generados para la demo, con fecha de referencia{" "}
          {dateFmt.format(new Date(DEMO_REFERENCE_DATE))}. Las respuestas que envíes desde las
          invitaciones de ejemplo se guardan solo en tu navegador y no aparecen aquí.
        </p>
      ) : null}
    </>
  );
}
