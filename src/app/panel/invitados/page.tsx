import { GuestTable, type GuestFilters } from "@/features/dashboard/guest-table";
import { PageHeader } from "@/features/dashboard/ui";
import { getOrganizerData } from "@/lib/data/repository";
import { buildGuestRows } from "@/lib/stats";

export const metadata = { title: "Invitados" };

const STATUSES = ["all", "attending", "pending", "declined"] as const;

export default async function GuestsPage(props: PageProps<"/panel/invitados">) {
  const params = await props.searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const initial: GuestFilters = {
    q: first(params.q),
    estado: STATUSES.find((s) => s === first(params.estado)) ?? "all",
    grupo: "all",
    autobus: (["si", "no"] as const).find((b) => b === first(params.autobus)) ?? "all",
    agrupar: first(params.agrupar) === "1",
  };
  const { event, groups, responses } = await getOrganizerData();
  const rows = buildGuestRows(groups, responses);
  const categories = [...new Set(groups.map((g) => g.category))].sort();
  // Solo se acepta un grupo que exista; cualquier otro valor de la URL se ignora.
  if (categories.includes(first(params.grupo))) initial.grupo = first(params.grupo);
  const routes = Object.fromEntries(event.busRoutes.map((r) => [r.id, r.label.split(" →")[0]!]));

  return (
    <>
      <PageHeader
        title="Lista de invitados"
        description="Busca, filtra y agrupa por familia o invitación. Alta y edición llegarán con el backend."
      />
      <GuestTable rows={rows} categories={categories} routes={routes} initial={initial} />
    </>
  );
}
