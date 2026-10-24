/*
 * Música de la apertura: cuatro estilos compuestos en el navegador (sin archivos ni licencias) o
 * una canción propia que sube la pareja.
 */

export const MUSIC_IDS = ["piano", "cajita", "guitarra", "cuerdas", "propia"] as const;
export type MusicId = (typeof MUSIC_IDS)[number];

export const MUSICS: Record<MusicId, { label: string; description: string }> = {
  piano: { label: "Piano", description: "Acordes lentos de piano sobre cuerdas suaves." },
  cajita: {
    label: "Caja de música",
    description: "Un arpegio dulce y brillante, como una cajita.",
  },
  guitarra: { label: "Guitarra", description: "Punteo de guitarra española, cálido y tranquilo." },
  cuerdas: { label: "Cuerdas", description: "Un colchón de cuerdas que crece despacio." },
  propia: { label: "Vuestra canción", description: "Subís una canción vuestra (MP3 o M4A)." },
};
