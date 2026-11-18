"use client";

import { ArrowUpRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { RsvpResponse } from "@/lib/domain/types";
import type { CSSProperties } from "react";

const NO_SONGS: string[] = [];
/** Cuántas canciones pedidas se enseñan antes de resumir el resto. */
const SHOWN = 8;

/**
 * «La música la ponéis vosotros»: la lista de la fiesta, con un vinilo que gira. Enseña la
 * canción que pidió el invitado al confirmar, las que han pedido los demás (sin autor) y, si la pareja ha puesto el enlace de su lista
 * (Spotify, Apple Music, YouTube…), el botón para abrirla y añadir más.
 */
export function PlaylistBand({
  url,
  response,
  songs = NO_SONGS,
  fadeTo = "var(--color-ivory)",
}: {
  /** Enlace https a la lista colaborativa, o vacío. */
  url: string;
  response: RsvpResponse | null;
  /** Canciones que ya han pedido los invitados, sin decir quién. */
  songs?: string[];
  /** Color de fondo de la sección siguiente, para fundir la salida. */
  fadeTo?: string;
}) {
  const song = response?.status === "attending" ? response.song.trim() : "";
  return (
    <section aria-labelledby="musica-title" className="overflow-hidden bg-night text-white">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-20 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-14 sm:px-10">
        {/* El vinilo: gira despacio; la galleta lleva el color del lacre. */}
        <div data-view aria-hidden className="vinyl-in mx-auto size-56 sm:size-64">
          <div className="vinyl relative size-full rounded-full">
            <span className="absolute inset-[33%] rounded-full bg-wax" />
            <span className="absolute inset-[48.5%] rounded-full bg-night" />
          </div>
        </div>
        <div>
          <h2
            id="musica-title"
            className="reveal-title font-display text-[2.5rem] leading-[1.05] sm:text-[3rem]"
          >
            La música la ponéis vosotros
          </h2>
          {song ? (
            <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-white/85">
              Ya está apuntada vuestra canción:{" "}
              <span className="font-display text-[1.25rem] text-white italic">«{song}»</span>.
            </p>
          ) : (
            <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-white/85">
              {url
                ? "Añade a la lista la canción con la que no vas a poder quedarte en la silla."
                : "Al confirmar, dinos qué canción no puede faltar: sonará en la fiesta."}
            </p>
          )}
          {songs.length ? (
            <div className="mt-6">
              <p className="text-[0.8125rem] text-white/70">Ya han pedido</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {songs.slice(0, SHOWN).map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/25 px-3.5 py-1.5 font-display text-[1.0625rem] leading-tight text-white italic"
                  >
                    {item}
                  </li>
                ))}
                {songs.length > SHOWN ? (
                  <li className="px-1 py-1.5 text-[0.9375rem] text-white/75">
                    y {songs.length - SHOWN} más
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "lg", "mt-7 border-transparent")}
            >
              Abrir la lista de la fiesta
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          ) : null}
        </div>
      </div>
      <div
        aria-hidden
        className="scene-out h-[12svh]"
        style={{ "--fade-to": fadeTo } as CSSProperties}
      />
    </section>
  );
}
