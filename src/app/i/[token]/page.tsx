import { hostNames } from "@/lib/event-kind";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationExperience } from "@/features/invitation/experience";
import { getInvitation } from "@/lib/data/repository";
import { applyTemplate, TEMPLATE_IDS, type TemplateId } from "@/lib/theme";
import { parseTheme } from "@/lib/theme/schema";

// Las invitaciones reales viven en la base de datos (y su respuesta puede cambiar), así que se
// pintan en cada petición. Los tokens desconocidos devuelven 404.
export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/i/[token]">): Promise<Metadata> {
  const { token } = await props.params;
  const invitation = await getInvitation(token);
  if (!invitation) return {};
  const { couple } = invitation.event;
  return {
    title: hostNames(couple),
    description: `Invitación para ${invitation.group.displayName}`,
  };
}

export default async function InvitationPage(props: PageProps<"/i/[token]">) {
  const { token } = await props.params;
  const invitation = await getInvitation(token);
  if (!invitation) notFound();
  // En la demostración se pueden probar los temas desde la URL: ?plantilla=costa, o pieza a
  // pieza con ?estilo=noche&sobre=kraft…
  const query = await props.searchParams;
  const pick = (key: string) => (typeof query[key] === "string" ? query[key] : undefined);
  const template = pick("plantilla");
  const base =
    template && (TEMPLATE_IDS as readonly string[]).includes(template)
      ? applyTemplate(invitation.theme, template as TemplateId)
      : invitation.theme;
  const theme = invitation.group.persisted
    ? invitation.theme
    : parseTheme({
        ...base,
        ...Object.fromEntries(
          Object.entries({
            style: pick("estilo"),
            envelope: pick("sobre"),
            wax: pick("lacre"),
            calendar: pick("calendario"),
            opening: pick("apertura"),
            cover: pick("portada"),
            // ?carta=si muestra la carta de bienvenida antes de la invitación.
            welcome: pick("carta") === undefined ? undefined : pick("carta") === "si",
          }).filter(([, v]) => v !== undefined),
        ),
      });
  // En la demo también se puede ver la fase de «save the date»: ?fase=save-the-date.
  const phase = invitation.group.persisted
    ? invitation.phase
    : pick("fase") === "save-the-date"
      ? "save_the_date"
      : invitation.phase;
  return (
    <InvitationExperience
      event={invitation.event}
      group={invitation.group}
      initialResponse={invitation.response}
      theme={theme}
      phase={phase}
      albumToken={invitation.albumToken}
      gifts={invitation.gifts}
    />
  );
}
