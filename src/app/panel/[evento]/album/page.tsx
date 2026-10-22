import { notFound } from "next/navigation";
import { PageHeader } from "@/features/dashboard/ui";
import { AlbumModeration } from "@/features/album/album-moderation";
import { getAlbumModeration } from "@/lib/data/album";
import { loadOrganizer } from "../load";

export const metadata = { title: "Álbum" };

export default async function AlbumPanelPage(props: PageProps<"/panel/[evento]/album">) {
  const { evento } = await props.params;
  const [{ event, meta }, album] = await Promise.all([
    loadOrganizer(props.params),
    getAlbumModeration(evento),
  ]);
  if (!album) notFound();
  return (
    <>
      <PageHeader
        title="Álbum de los invitados"
        description="Las fotos que suben los invitados esperan aquí hasta que las aprobéis. Imprimid el QR para las mesas."
      />
      <AlbumModeration
        eventId={meta?.id ?? null}
        token={album.token}
        photos={album.photos}
        couple={`${event.couple.first} & ${event.couple.second}`}
      />
    </>
  );
}
