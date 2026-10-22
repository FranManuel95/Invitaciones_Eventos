import { PageHeader } from "@/features/dashboard/ui";
import { PrintCenter } from "@/features/print/print-center";
import { getAlbumModeration } from "@/lib/data/album";
import { formatLongDate } from "@/lib/format";
import { cateringSheet, djSongs, findYourTable, seatedGuests } from "@/lib/print";
import { loadOrganizer } from "../load";

export const metadata = { title: "Imprimir" };

export default async function PrintPage(props: PageProps<"/panel/[evento]/imprimir">) {
  const { evento } = await props.params;
  const [{ event, groups, responses, tables }, album] = await Promise.all([
    loadOrganizer(props.params),
    getAlbumModeration(evento),
  ]);
  const guests = seatedGuests(groups, responses, tables);
  return (
    <>
      <div className="no-print">
        <PageHeader
          title="Imprimir"
          description="Tarjetas de mesa, la lista para la entrada, los carteles del álbum, la hoja del catering y las canciones para el DJ, con los datos de hoy."
        />
      </div>
      <PrintCenter
        data={{
          couple: { first: event.couple.first, second: event.couple.second },
          dateText: formatLongDate(event.date),
          guests,
          find: findYourTable(guests),
          tables: tables.map((t) => t.name),
          albumToken: album?.token ?? null,
          catering: cateringSheet(groups, responses, tables),
          songs: djSongs(groups, responses),
        }}
      />
    </>
  );
}
