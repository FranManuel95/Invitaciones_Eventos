import { DEMO_REFERENCE_DATE } from "@/data/demo/guests";
import { PageHeader } from "@/features/dashboard/ui";
import { AgendaCalendar } from "@/features/planning/agenda-calendar";
import { agendaEntries } from "@/lib/planning/agenda";
import { loadOrganizer, loadPlanning } from "../load";

export const metadata = { title: "Agenda" };

export default async function AgendaPage(props: PageProps<"/panel/[evento]/agenda">) {
  const [{ event, base, isDemo }, { tasks, budget }] = await Promise.all([
    loadOrganizer(props.params),
    loadPlanning(props.params),
  ]);
  const today = isDemo ? DEMO_REFERENCE_DATE : new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHeader
        title="Agenda"
        description="Tareas, pagos, el plazo de respuesta y el gran día, en un solo calendario."
      />
      <AgendaCalendar entries={agendaEntries(event, tasks, budget)} base={base} today={today} />
    </>
  );
}
