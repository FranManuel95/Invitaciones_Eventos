"use client";

import { clsx } from "clsx";
import { Check, Copy, Printer } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "@/components/qr-code";
import { CsvButton } from "@/features/dashboard/csv-button";
import { Monogram } from "@/features/invitation/ornaments";
import {
  djSongsCsv,
  djSongsText,
  MENU_ORDER_PRINT,
  menuLabel,
  type cateringSheet,
  type djSongs,
  type PrintGuest,
} from "@/lib/print";

type DocId = "tarjetas" | "busca" | "qr" | "catering" | "canciones";

const DOCS: { id: DocId; label: string; description: string }[] = [
  {
    id: "tarjetas",
    label: "Tarjetas de mesa",
    description: "Una por invitado, para doblar y dejar en su sitio.",
  },
  {
    id: "busca",
    label: "Busca tu mesa",
    description: "La lista para la entrada, por orden alfabético.",
  },
  {
    id: "qr",
    label: "Carteles del álbum",
    description: "Un QR por mesa para que suban sus fotos.",
  },
  {
    id: "catering",
    label: "Hoja del catering",
    description: "Menús y alergias, mesa a mesa.",
  },
  {
    id: "canciones",
    label: "Canciones para el DJ",
    description: "Las que han pedido los invitados al confirmar.",
  },
];

export interface PrintData {
  couple: { first: string; second: string };
  dateText: string;
  guests: PrintGuest[];
  find: { seated: PrintGuest[]; unseated: PrintGuest[] };
  tables: string[];
  /** Token del álbum (null: sin álbum). */
  albumToken: string | null;
  catering: ReturnType<typeof cateringSheet>;
  songs: ReturnType<typeof djSongs>;
}

/** Elige un documento, lo ves tal cual y lo imprimes (o lo guardas en PDF desde el navegador). */
export function PrintCenter({ data }: { data: PrintData }) {
  const [doc, setDoc] = useState<DocId>("tarjetas");
  const couple = `${data.couple.first} & ${data.couple.second}`;
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const albumUrl = data.albumToken ? `${origin}/album/${data.albumToken}` : null;

  return (
    <div className="grid gap-6">
      <fieldset className="no-print">
        <legend className="mb-3 text-[0.9375rem] font-medium text-ink">Qué quieres imprimir</legend>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {DOCS.map((d) => (
            <label
              key={d.id}
              className={clsx(
                "cursor-pointer rounded-[3px] border bg-paper p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink",
                doc === d.id ? "border-ink" : "border-line hover:border-ink/40",
              )}
            >
              <input
                type="radio"
                name="documento"
                value={d.id}
                checked={doc === d.id}
                onChange={() => setDoc(d.id)}
                className="sr-only"
              />
              <span className="block font-medium text-ink">{d.label}</span>
              <span className="mt-0.5 block text-[0.8125rem] text-muted">{d.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="no-print flex flex-wrap items-center gap-3">
        <Button onClick={() => window.print()}>
          <Printer aria-hidden className="size-4" />
          Imprimir
        </Button>
        <p className="text-[0.8125rem] text-muted">
          Para guardarlo en PDF, elige «Guardar como PDF» en la ventana de imprimir.
        </p>
      </div>

      <div className="print-area overflow-x-auto rounded-[3px] border border-line bg-white p-4 sm:p-8 print:border-0 print:p-0">
        {doc === "tarjetas" ? (
          <PlaceCards guests={data.guests} couple={data.couple} />
        ) : doc === "busca" ? (
          <FindYourTable find={data.find} couple={couple} />
        ) : doc === "qr" ? (
          <AlbumPosters tables={data.tables} url={albumUrl} couple={data.couple} />
        ) : doc === "catering" ? (
          <Catering catering={data.catering} couple={couple} dateText={data.dateText} />
        ) : (
          <Songs songs={data.songs} couple={couple} />
        )}
      </div>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="py-10 text-center text-[0.9375rem] text-muted">{children}</p>;
}

function PlaceCards({
  guests,
  couple,
}: {
  guests: PrintGuest[];
  couple: { first: string; second: string };
}) {
  if (!guests.length) return <Empty>Todavía no hay invitados que vayan a venir.</Empty>;
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-0">
      {guests.map((g, i) => (
        // Tarjeta para doblar: la mitad de arriba queda detrás; el nombre, delante.
        <li
          key={`${g.name}-${i}`}
          className="grid h-[14rem] break-inside-avoid grid-rows-2 border border-dashed border-line text-center"
        >
          <span aria-hidden className="border-b border-dotted border-line" />
          <span className="grid content-center gap-0.5 px-4 py-2">
            <Monogram
              first={couple.first}
              second={couple.second}
              className="mx-auto size-6 text-gold"
            />
            <span className="font-display text-[1.625rem] leading-tight text-ink">{g.name}</span>
            <span className="text-[0.875rem] text-ink-soft">{g.table ?? "\u00a0"}</span>
            <span className="text-[0.75rem] text-muted">
              {g.menu ? `Menú: ${g.menu.toLowerCase()}` : "\u00a0"}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function FindYourTable({
  find,
  couple,
}: {
  find: { seated: PrintGuest[]; unseated: PrintGuest[] };
  couple: string;
}) {
  if (!find.seated.length && !find.unseated.length) {
    return <Empty>Todavía no hay invitados que vayan a venir.</Empty>;
  }
  return (
    <div>
      <p className="text-center font-display text-[1.25rem] text-muted">{couple}</p>
      <h2 className="mt-1 text-center font-display text-[2.75rem] leading-none text-ink">
        Busca tu mesa
      </h2>
      <ul className="mt-8 columns-1 gap-10 sm:columns-2 print:columns-2">
        {find.seated.map((g, i) => (
          <li
            key={`${g.name}-${i}`}
            className="flex break-inside-avoid items-baseline gap-2 border-b border-dotted border-line py-1.5"
          >
            <span className="text-ink">{g.name}</span>
            <span className="ml-auto shrink-0 font-display text-[1.125rem] text-ink-soft">
              {g.table}
            </span>
          </li>
        ))}
      </ul>
      {find.unseated.length ? (
        <p className="no-print mt-6 text-[0.875rem] text-warning">
          {find.unseated.length === 1
            ? "1 invitado aún no tiene mesa"
            : `${find.unseated.length} invitados aún no tienen mesa`}{" "}
          y no sale en la lista: {find.unseated.map((g) => g.name).join(", ")}.
        </p>
      ) : null}
    </div>
  );
}

function AlbumPosters({
  tables,
  url,
  couple,
}: {
  tables: string[];
  url: string | null;
  couple: { first: string; second: string };
}) {
  if (!url) return <Empty>El álbum no está disponible para este evento.</Empty>;
  // Sin mesas en el plano, un único cartel general.
  const labels = tables.length ? tables : [""];
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-0">
      {labels.map((table, i) => (
        <li
          key={`${table}-${i}`}
          className="grid break-inside-avoid justify-items-center gap-3 border border-dashed border-line px-6 py-8 text-center"
        >
          <Monogram first={couple.first} second={couple.second} className="size-8 text-gold" />
          <p className="font-display text-[1.75rem] leading-tight text-ink">
            Comparte tus fotos de hoy
          </p>
          <QrCode
            value={url}
            label={`Código QR del álbum${table ? `, ${table}` : ""}`}
            className="size-36"
          />
          <p className="max-w-[26ch] text-[0.875rem] text-ink-soft">
            Apunta con la cámara del móvil y sube las fotos que hagas. No hace falta instalar nada.
          </p>
          {table ? <p className="font-display text-[1.25rem] text-muted">{table}</p> : null}
        </li>
      ))}
    </ul>
  );
}

function Catering({
  catering,
  couple,
  dateText,
}: {
  catering: PrintData["catering"];
  couple: string;
  dateText: string;
}) {
  if (!catering.total) return <Empty>Todavía no hay invitados confirmados.</Empty>;
  const menus = MENU_ORDER_PRINT.filter((m) => catering.totals[m]);
  return (
    <div className="text-ink">
      <h2 className="font-display text-[2rem] leading-tight">Menús y alergias</h2>
      <p className="text-[0.875rem] text-muted">
        {couple}, {dateText}. {catering.total} comensales confirmados.
      </p>
      <table className="mt-6 w-full border-collapse text-left text-[0.875rem]">
        <caption className="sr-only">Menús por mesa</caption>
        <thead>
          <tr className="border-b border-ink/40">
            <th scope="col" className="py-2 pr-3 font-medium">
              Mesa
            </th>
            {menus.map((m) => (
              <th key={m} scope="col" className="px-2 py-2 text-right font-medium">
                {menuLabel(m)}
              </th>
            ))}
            <th scope="col" className="py-2 pl-2 font-medium">
              Alergias
            </th>
          </tr>
        </thead>
        <tbody>
          {catering.perTable.map((t) => (
            <tr key={t.table} className="break-inside-avoid border-b border-line align-top">
              <th scope="row" className="py-2 pr-3 font-medium">
                {t.table}
                <span className="block text-[0.75rem] font-normal text-muted">
                  {t.guests} {t.guests === 1 ? "persona" : "personas"}
                </span>
              </th>
              {menus.map((m) => (
                <td key={m} className="px-2 py-2 text-right tabular-nums">
                  {t.menus[m] ?? "–"}
                </td>
              ))}
              <td className="py-2 pl-2">
                {t.allergies.length ? (
                  <ul>
                    {t.allergies.map((a, i) => (
                      <li key={`${a.name}-${i}`}>
                        <span className="font-medium">{a.name}</span>: {a.detail}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted">Ninguna</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink/40 font-medium">
            <th scope="row" className="py-2 pr-3">
              Total
            </th>
            {menus.map((m) => (
              <td key={m} className="px-2 py-2 text-right tabular-nums">
                {catering.totals[m]}
              </td>
            ))}
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Songs({ songs, couple }: { songs: PrintData["songs"]; couple: string }) {
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");
  if (!songs.length) return <Empty>Todavía nadie ha pedido canciones al confirmar.</Empty>;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(djSongsText(songs));
      setCopied("ok");
    } catch {
      setCopied("error");
    }
  };
  return (
    <div className="text-ink">
      <div className="no-print mb-6 flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={copy}>
          {copied === "ok" ? (
            <Check aria-hidden className="size-4" />
          ) : (
            <Copy aria-hidden className="size-4" />
          )}
          {copied === "ok" ? "Copiada" : "Copiar la lista"}
        </Button>
        <CsvButton csv={djSongsCsv(songs)} filename="canciones.csv" label="Descargar CSV" />
        <p role="status" className="text-[0.8125rem] text-muted">
          {copied === "ok"
            ? "Lista copiada: pégala en un mensaje al DJ."
            : copied === "error"
              ? "No se ha podido copiar. Selecciona la lista y cópiala a mano."
              : ""}
        </p>
      </div>
      <h2 className="font-display text-[2rem] leading-tight">Canciones para el DJ</h2>
      <p className="text-[0.875rem] text-muted">
        {couple}: {songs.length} {songs.length === 1 ? "canción" : "canciones"}.
      </p>
      <ol className="mt-6 grid list-decimal gap-1.5 pl-6 text-[0.9375rem]">
        {songs.map((s) => (
          <li key={s.song}>
            {s.song}
            <span className="text-[0.8125rem] text-muted"> (pedida por {s.from.join(", ")})</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
