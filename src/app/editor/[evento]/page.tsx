import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Editor } from "@/features/editor/editor";
import { getEventDraft } from "@/lib/data/repository";
import "../../marca.css";
import "./editor.css";

export const metadata: Metadata = { title: "Editor" };

// La barra del navegador del móvil, del color de la tinta del editor (como en el panel).
export const viewport: Viewport = { themeColor: "#1b2033" };

/** Editor de la invitación: /editor/demo (sin guardado) o /editor/<id> (eventos propios). */
export default async function EditorPage(props: PageProps<"/editor/[evento]">) {
  const { evento } = await props.params;
  const { pestana } = await props.searchParams;
  const draft = await getEventDraft(evento);
  if (!draft) notFound();
  return (
    <Editor
      eventKey={evento}
      initial={{ content: draft.content, theme: draft.theme }}
      meta={draft.meta}
      initialTab={typeof pestana === "string" ? pestana : undefined}
    />
  );
}
