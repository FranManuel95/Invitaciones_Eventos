import { PageHeader } from "@/features/dashboard/ui";
import { InvitationsManager } from "@/features/guests/invitations-manager";
import type { AttendanceStatus } from "@/lib/domain/types";
import { loadOrganizer } from "../load";

export const metadata = { title: "Invitaciones" };

export default async function InvitationsPage(props: PageProps<"/panel/[evento]/invitaciones">) {
  const { event, groups, responses, meta } = await loadOrganizer(props.params);
  const statuses: Record<string, AttendanceStatus> = Object.fromEntries(
    responses.map((r) => [r.groupId, r.status]),
  );
  return (
    <>
      <PageHeader
        title="Invitaciones"
        description="Cada invitación tiene su enlace personal. Envíalo por WhatsApp, cópialo o imprime su QR."
      />
      {meta && meta.status !== "published" ? (
        <p className="-mt-4 mb-6 rounded-md border border-warning/30 bg-warning/5 px-4 py-3 text-[0.875rem] text-ink">
          La invitación aún no está publicada: los enlaces funcionarán cuando la publiquéis.
        </p>
      ) : null}
      <InvitationsManager
        eventId={meta?.id ?? null}
        groups={groups}
        statuses={statuses}
        couple={event.couple}
      />
    </>
  );
}
