import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Editor } from "@/features/editor/editor";
import { getEventDraft } from "@/lib/data/repository";

export const metadata: Metadata = { title: "Editor" };

/** Editor de la invitación: /editor/demo (sin guardado) o /editor/<id> (eventos propios). */
export default async function EditorPage(props: PageProps<"/editor/[evento]">) {
  const { evento } = await props.params;
  const draft = await getEventDraft(evento);
  if (!draft) notFound();
  return (
    <Editor
      eventKey={evento}
      initial={{ content: draft.content, theme: draft.theme }}
      meta={draft.meta}
    />
  );
}
