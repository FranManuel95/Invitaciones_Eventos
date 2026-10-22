"use client";

import Image from "next/image";

/*
 * Escena «película»: la foto de la pareja a cámara lenta (un acercamiento de veinte segundos con
 * un leve desplazamiento), etalonada en cálido, con viñeta, grano, bandas de cine y un destello
 * de luz que la cruza de vez en cuando. Todo con CSS (transform y opacity); con movimiento
 * reducido la foto se queda quieta.
 */
export function CineScene({ photo }: { photo: string | null }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#0a0806]">
      {photo ? (
        <div className="cine-kenburns absolute -inset-[4%]">
          <Image
            src={photo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover [filter:sepia(0.18)_saturate(0.85)_contrast(1.06)_brightness(0.82)]"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,#3a2f24,#0a0806)]" />
      )}
      {/* Viñeta: los bordes caen a negro, como una lente antigua. */}
      <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_45%,transparent_40%,rgb(5_4_3/0.85)_100%)]" />
      {/* Destello cálido que cruza la imagen. */}
      <div className="cine-leak absolute -inset-y-[10%] -left-1/2 w-1/2 bg-[linear-gradient(100deg,transparent,rgb(255_190_120/0.16),transparent)]" />
      {/* Grano de película. */}
      <div className="cine-grain absolute -inset-[50%] opacity-[0.13]" />
      {/* Bandas de cine. */}
      <div className="absolute inset-x-0 top-0 h-[7svh] bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-[7svh] bg-black" />
    </div>
  );
}
