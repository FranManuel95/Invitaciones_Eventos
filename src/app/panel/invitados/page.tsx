import { GuestTable } from "@/features/dashboard/guest-table";
import { PageHeader } from "@/features/dashboard/ui";
import { getOrganizerData } from "@/lib/data/repository";
import { buildGuestRows } from "@/lib/stats";

export const metadata = { title: "Invitados" };

const STATUSES = ["all", "attending", "pending", "declined"] as const;

export default async function GuestsPage(props: PageProps<"/panel/invitados">) {
  const { estado } = await props.searchParams;
  const initialStatus = STATUSES.find((s) => s === estado) ?? "all";
  const { event, groups, responses } = await getOrganizerData();
  const rows = buildGuestRows(groups, responses);
  const categories = [...new Set(groups.map((g) => g.category))].sort();
  const routes = Object.fromEntries(event.busRoutes.map((r) => [r.id, r.label.split(" →")[0]!]));

  return (
    <>
      <PageHeader
        eyebrow="Gestión"
        title="Lista de invitados"
        description="Busca, filtra y agrupa por familia o invitación. Alta y edición llegarán con el backend."
      />
      <GuestTable
        rows={rows}
        categories={categories}
        routes={routes}
        initialStatus={initialStatus}
      />
    </>
  );
}
