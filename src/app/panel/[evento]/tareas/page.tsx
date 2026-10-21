import { DEMO_REFERENCE_DATE } from "@/data/demo/guests";
import { PageHeader } from "@/features/dashboard/ui";
import { TasksBoard } from "@/features/planning/tasks-board";
import { loadOrganizer, loadPlanning } from "../load";

export const metadata = { title: "Tareas" };

export default async function TasksPage(props: PageProps<"/panel/[evento]/tareas">) {
  const [{ event, meta, isDemo }, { tasks }] = await Promise.all([
    loadOrganizer(props.params),
    loadPlanning(props.params),
  ]);
  return (
    <>
      <PageHeader
        title="Tareas"
        description="Lo que queda por hacer hasta la boda, con su fecha y quién se encarga."
      />
      {/* Al guardar en el servidor llegan los ids reales: la lista se vuelve a montar. */}
      <TasksBoard
        key={tasks.map((t) => t.id).join()}
        eventId={meta?.id ?? null}
        tasks={tasks}
        weddingDate={event.date}
        referenceDate={isDemo ? DEMO_REFERENCE_DATE : undefined}
      />
    </>
  );
}
