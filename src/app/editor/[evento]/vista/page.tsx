import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventDraft } from "@/lib/data/repository";
import { PreviewClient } from "./preview-client";

export const metadata: Metadata = { title: "Vista previa" };

/** Vista previa del editor: la invitación real con el borrador, dentro de un iframe. */
export default async function PreviewPage(props: PageProps<"/editor/[evento]/vista">) {
  const { evento } = await props.params;
  const draft = await getEventDraft(evento);
  if (!draft) notFound();
  return <PreviewClient initialContent={draft.content} initialTheme={draft.theme} />;
}
