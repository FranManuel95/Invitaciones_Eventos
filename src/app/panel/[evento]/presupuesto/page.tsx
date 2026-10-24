import { PageHeader } from "@/features/dashboard/ui";
import { BudgetBoard } from "@/features/planning/budget-board";
import { summarize } from "@/lib/stats";
import { loadOrganizer, loadPlanning } from "../load";

export const metadata = { title: "Presupuesto" };

export default async function BudgetPage(props: PageProps<"/panel/[evento]/presupuesto">) {
  const [{ groups, responses, meta }, { budget }] = await Promise.all([
    loadOrganizer(props.params),
    loadPlanning(props.params),
  ]);
  return (
    <>
      <PageHeader
        title="Presupuesto"
        description="Lo previsto, lo pagado y lo que queda, con los próximos pagos."
      />
      <BudgetBoard
        key={budget.map((b) => b.id).join()}
        eventId={meta?.id ?? null}
        items={budget}
        confirmedGuests={summarize(groups, responses).attending}
      />
    </>
  );
}
