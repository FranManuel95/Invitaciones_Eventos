import { PageHeader } from "@/features/dashboard/ui";
import { SeatingPlanner } from "@/features/seating/seating-planner";
import { loadOrganizer } from "../load";

export const metadata = { title: "Mesas" };

export default async function TablesPage(props: PageProps<"/panel/[evento]/mesas">) {
  const { groups, responses, tables, meta } = await loadOrganizer(props.params);
  return (
    <>
      <PageHeader
        title="Mesas"
        description="Coloca las mesas en el plano y sienta a cada invitación. Avisa si una mesa se llena de más y de las alergias de cada una."
      />
      <SeatingPlanner
        eventId={meta?.id ?? null}
        tables={tables}
        groups={groups}
        responses={responses}
      />
    </>
  );
}
