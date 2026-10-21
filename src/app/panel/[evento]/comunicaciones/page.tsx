import { PageHeader } from "@/features/dashboard/ui";
import { Reminders } from "@/features/guests/reminders";
import { formatLongDate } from "@/lib/format";
import { loadOrganizer } from "../load";

export const metadata = { title: "Recordatorios" };

/**
 * Recordatorios a las invitaciones sin respuesta, uno a uno por WhatsApp. El envío masivo por
 * email llegará cuando haya un proveedor de correo.
 */
export default async function RemindersPage(props: PageProps<"/panel/[evento]/comunicaciones">) {
  const { event, groups, responses, base } = await loadOrganizer(props.params);
  const answered = new Set(responses.map((r) => r.groupId));
  const pending = groups.filter((g) => !answered.has(g.id) && !g.demo);
  return (
    <>
      <PageHeader
        title="Recordatorios"
        description="Escribe a quien aún no ha respondido. El mensaje se prepara para cada invitación con su enlace personal."
      />
      <Reminders
        eventKey={base}
        groups={pending}
        couple={`${event.couple.first} y ${event.couple.second}`}
        deadline={formatLongDate(event.rsvpDeadline)}
      />
    </>
  );
}
