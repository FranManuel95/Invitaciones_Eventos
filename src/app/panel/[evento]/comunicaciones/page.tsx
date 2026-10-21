import { Plus, Send } from "lucide-react";
import { Card, PageHeader } from "@/features/dashboard/ui";

export const metadata = { title: "Comunicaciones" };

// Historial ficticio: el envío real de mensajes llegará en una fase posterior.
const SENT = [
  {
    title: "Invitación inicial",
    date: "2026-09-01",
    delivered: 74,
    total: 74,
    channel: "WhatsApp y email",
  },
  { title: "Recordatorio RSVP", date: "2026-09-29", delivered: 69, total: 74, channel: "WhatsApp" },
  {
    title: "Información de transporte",
    date: "2026-10-12",
    delivered: 52,
    total: 55,
    channel: "Email",
  },
];

const DRAFTS = [
  "Última llamada para confirmar (antes del 15 de abril)",
  "Horarios definitivos de autobuses",
];

const fmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });

export default function CommunicationsPage() {
  return (
    <>
      <PageHeader
        title="Comunicaciones"
        description="Invitaciones, recordatorios y avisos enviados a los invitados."
        actions={
          <button
            type="button"
            disabled
            aria-describedby="comms-soon"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-ink/40 px-3.5 py-2 text-[0.8125rem] text-paper"
          >
            <Plus aria-hidden className="size-4" /> Nueva comunicación
          </button>
        }
      />
      <p id="comms-soon" className="-mt-5 mb-6 text-xs text-muted">
        Demo: el envío real (email o WhatsApp) se conectará en una fase posterior.
      </p>

      <Card title="Enviadas" icon={<Send aria-hidden className="size-4" />}>
        <ul className="divide-y divide-line">
          {SENT.map((c) => (
            <li
              key={c.title}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-ink">{c.title}</p>
                <p className="text-xs text-muted">
                  {fmt.format(new Date(c.date))}, por {c.channel.toLowerCase()}
                </p>
              </div>
              <p className="text-sm text-ink-soft tabular-nums">
                {c.delivered}/{c.total} <span className="text-xs text-muted">entregadas</span>
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Borradores" className="mt-4">
        <ul className="space-y-2">
          {DRAFTS.map((d) => (
            <li
              key={d}
              className="rounded-md border border-dashed border-line px-3 py-2.5 text-sm text-ink-soft"
            >
              {d}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
