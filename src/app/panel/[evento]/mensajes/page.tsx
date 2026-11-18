import { MessageSquareHeart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClasses } from "@/components/ui/button";
import { Card, KpiStrip, PageHeader } from "@/features/dashboard/ui";
import { getGuestbookEntries } from "@/lib/data/repository";
import { formatNumericDate } from "@/lib/format";
import { loadOrganizer } from "../load";
import { HideToggle } from "./moderation";

export const metadata = { title: "Libro de firmas" };

export default async function GuestbookPage(props: PageProps<"/panel/[evento]/mensajes">) {
  const { evento } = await props.params;
  const [{ event, isDemo }, entries] = await Promise.all([
    loadOrganizer(props.params),
    getGuestbookEntries(evento),
  ]);
  if (!entries) notFound();
  const hidden = entries.filter((entry) => entry.hidden).length;

  return (
    <>
      <PageHeader
        title="Libro de firmas"
        description="Los mensajes que han dejado vuestros invitados. Los ven todos los invitados; si alguno no os convence, ocultadlo."
        actions={
          <Link href={`/editor/${evento}`} className={buttonClasses("secondary")}>
            {event.guestbook ? "Ajustes del libro" : "Activar el libro"}
          </Link>
        }
      />
      {!event.guestbook ? (
        <Card>
          <p className="text-[0.9375rem] text-ink-soft">
            El libro de firmas está apagado. Activadlo desde el editor, en la pestaña Textos, y
            publicad los cambios para que aparezca en las invitaciones.
          </p>
        </Card>
      ) : null}
      {entries.length ? (
        <>
          <KpiStrip
            items={[
              { label: "Mensajes", value: entries.length },
              { label: "A la vista", value: entries.length - hidden },
              { label: "Ocultos", value: hidden },
            ]}
          />
          <Card
            title="Mensajes"
            icon={<MessageSquareHeart aria-hidden className="size-4" />}
            className="mt-6"
          >
            <ul className="divide-y divide-line">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink">
                      {entry.groupName}
                      <span className="text-[0.8125rem] font-normal text-muted">
                        {" "}
                        el {formatNumericDate(entry.createdAt)}
                      </span>
                    </p>
                    <p className="mt-1 max-w-prose text-[0.9375rem] leading-relaxed text-ink-soft">
                      {entry.body}
                    </p>
                  </div>
                  <HideToggle
                    eventId={evento}
                    messageId={entry.id}
                    author={entry.groupName}
                    hidden={entry.hidden}
                    demo={isDemo}
                  />
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : event.guestbook ? (
        <Card>
          <p className="text-[0.9375rem] text-ink-soft">
            Todavía no ha firmado nadie. Los mensajes aparecerán aquí según lleguen.
          </p>
        </Card>
      ) : null}
    </>
  );
}
