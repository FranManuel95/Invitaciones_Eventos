import { hostNames } from "@/lib/event-kind";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlbumView } from "@/features/album/album-view";
import { getAlbum } from "@/lib/data/album";
import { STYLES, themeVars } from "@/lib/theme";

// Las fotos aprobadas cambian mientras dura la boda: se pinta en cada petición.
export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/album/[token]">): Promise<Metadata> {
  const { token } = await props.params;
  const album = await getAlbum(token);
  if (!album) return {};
  return { title: `Álbum de ${hostNames(album.couple)}` };
}

export default async function AlbumPage(props: PageProps<"/album/[token]">) {
  const { token } = await props.params;
  const found = await getAlbum(token);
  if (!found) notFound();
  // Solo en la demo: «?al-momento=1» enseña el álbum como si la pareja publicara las fotos al momento.
  const query = await props.searchParams;
  const album = found.demo && query["al-momento"] === "1" ? { ...found, autoApprove: true } : found;
  return (
    <div
      data-style={album.theme.style}
      data-dark={STYLES[album.theme.style].dark ? "" : undefined}
      className="min-h-dvh bg-ivory text-ink"
      style={themeVars(album.theme)}
    >
      <AlbumView album={album} />
    </div>
  );
}
