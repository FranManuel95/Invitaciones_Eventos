import { hostNames } from "@/lib/event-kind";
import { notFound } from "next/navigation";
import { PageHeader } from "@/features/dashboard/ui";
import { EventSettingsPanel } from "@/features/settings/event-settings";
import { getEventSettings } from "@/lib/data/repository";
import { loadOrganizer } from "../load";

export const metadata = { title: "Ajustes" };

export default async function SettingsPage(props: PageProps<"/panel/[evento]/ajustes">) {
  const { evento } = await props.params;
  const [{ event, meta }, settings] = await Promise.all([
    loadOrganizer(props.params),
    getEventSettings(evento),
  ]);
  if (!settings) notFound();
  return (
    <>
      <PageHeader
        title="Ajustes"
        description="Quién organiza el evento, invitar a alguien más y borrar el evento."
      />
      <EventSettingsPanel
        eventId={meta?.id ?? null}
        settings={settings}
        couple={hostNames(event.couple, " y ")}
      />
    </>
  );
}
