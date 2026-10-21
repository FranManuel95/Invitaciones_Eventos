import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationExperience } from "@/features/invitation/experience";
import { getInvitation, listAllTokens } from "@/lib/data/repository";

export async function generateStaticParams() {
  const tokens = await listAllTokens();
  return tokens.map((token) => ({ token }));
}

// Solo existen las invitaciones de la demo; cualquier otro token devuelve 404.
export const dynamicParams = false;

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
  return <InvitationExperience event={invitation.event} group={invitation.group} />;
}
