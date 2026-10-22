import { Gift } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClasses } from "@/components/ui/button";
import { Card, KpiStrip, PageHeader } from "@/features/dashboard/ui";
import { getGiftClaims } from "@/lib/data/repository";
import { formatNumericDate } from "@/lib/format";
import { summarizeGifts } from "@/lib/gifts";
import { loadOrganizer } from "../load";

export const metadata = { title: "Regalos" };

export default async function GiftsPage(props: PageProps<"/panel/[evento]/regalos">) {
  const { evento } = await props.params;
  const [{ event }, claims] = await Promise.all([
    loadOrganizer(props.params),
    getGiftClaims(evento),
  ]);
  if (!claims) notFound();
  const items = event.gift.items ?? [];
  const { rows, reserved, free, orphaned } = summarizeGifts(items, claims);

  return (
    <>
      <PageHeader
        title="Lista de regalos"
        description="Quién ha reservado cada regalo. Los invitados solo ven si está libre o reservado, nunca quién lo regala."
        actions={
          <Link href={`/editor/${evento}`} className={buttonClasses("secondary")}>
            Editar la lista
          </Link>
        }
      />
      {items.length === 0 ? (
        <Card>
          <p className="text-[0.9375rem] text-ink-soft">
            Todavía no hay regalos en la lista. Añadidlos desde el editor, en la pestaña Textos.
          </p>
        </Card>
      ) : (
        <>
          <KpiStrip
            items={[
              { label: "Regalos", value: items.length },
              { label: "Con alguna reserva", value: reserved },
              { label: "Libres", value: free },
              { label: "Reservas", value: claims.length },
            ]}
          />
          <Card title="Regalos" icon={<Gift aria-hidden className="size-4" />} className="mt-6">
            <ul className="divide-y divide-line">
              {rows.map(({ item, claims }) => (
                <li
                  key={item.id}
                  className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-[0.8125rem] text-muted">
                      {[item.price, item.shared ? "Entre varios" : null].filter(Boolean).join(". ")}
                    </p>
                  </div>
                  {claims.length ? (
                    <ul className="text-[0.9375rem] text-ink-soft">
                      {claims.map((c) => (
                        <li key={`${c.groupName}-${c.createdAt}`}>
                          {c.groupName}
                          <span className="text-[0.8125rem] text-muted">
                            {" "}
                            el {formatNumericDate(c.createdAt)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[0.9375rem] text-muted">Libre</p>
                  )}
                </li>
              ))}
            </ul>
          </Card>
          {orphaned.length ? (
            <p className="mt-4 text-[0.875rem] text-muted">
              {orphaned.length === 1
                ? "Hay 1 reserva de un regalo que ya no está en la lista."
                : `Hay ${orphaned.length} reservas de regalos que ya no están en la lista.`}{" "}
              Avisad a esas personas si hace falta.
            </p>
          ) : null}
        </>
      )}
    </>
  );
}
