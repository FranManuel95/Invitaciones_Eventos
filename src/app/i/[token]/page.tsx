import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationExperience } from "@/features/invitation/experience";
import { getInvitation } from "@/lib/data/repository";
import { parseTheme } from "@/lib/theme";

// Las invitaciones reales viven en la base de datos (y su respuesta puede cambiar), así que se
// pintan en cada petición. Los tokens desconocidos devuelven 404.
export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/i/[token]">): Promise<Metadata> {
  const { token } = await props.params;
  const invitation = await getInvitation(token);
  if (!invitation) return {};
  const { couple } = invitation.event;
  return {
    title: `${couple.first} & ${couple.second}`,
    description: `Invitación para ${invitation.group.displayName}`,
  };
}

export default async function InvitationPage(props: PageProps<"/i/[token]">) {
  const { token } = await props.params;
  const invitation = await getInvitation(token);
  if (!invitation) notFound();
  // En la demostración se pueden probar los temas desde la URL: ?estilo=noche&sobre=kraft…
  const query = await props.searchParams;
  const pick = (key: string) => (typeof query[key] === "string" ? query[key] : undefined);
  const theme = invitation.group.persisted
    ? invitation.theme
    : parseTheme({
        ...invitation.theme,
        ...Object.fromEntries(
          Object.entries({
            style: pick("estilo"),
            envelope: pick("sobre"),
            wax: pick("lacre"),
            calendar: pick("calendario"),
          }).filter(([, v]) => v !== undefined),
        ),
      });
  return (
    <InvitationExperience
      event={invitation.event}
      group={invitation.group}
      initialResponse={invitation.response}
      theme={theme}
    />
  );
}
