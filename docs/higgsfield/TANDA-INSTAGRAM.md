# Tanda de Higgsfield para las tres plantillas de Instagram

Plantillas: **Arcilla** (sobre burdeos), **Buganvilla** (sobre blanco) y **Noche dorada** (hoy con
sobre 3D; pasa a un sobre azul medianoche en vídeo). Reglas, modelos y optimización:
`docs/HIGGSFIELD.md`.

Se genera **desde un chat de claude.ai** con el conector de Higgsfield, nunca desde Claude Code.
Cada bloque de abajo se pega tal cual en ese chat, adjuntando la imagen que indica (están en esta
carpeta). Un bloque cada vez, y se revisa el resultado antes de pasar al siguiente.

Orden recomendado: 1 → 2 → 3 → 4. Los pasos 1 y 2 son los que más cambian lo que se graba.

## 1. Pétalos nuevos (portada de Arcilla)

Los actuales salen como manchas grandes y borrosas que tapan los nombres. No hace falta adjuntar
nada.

```
Usa Higgsfield con use_unlim: true y count: 1. Genera un vídeo con seedance_2_5, 720p, 9:16, 5 s,
sin audio (generate_audio: false), con este texto:

Completely static locked camera, plain solid pure black background for overlay compositing. Many
small, sharp, in-focus white and blush rose petals fall continuously from the top of the frame to
the bottom, drifting and rotating gently, at a slow natural speed. The petals are tiny, each one
smaller than 3% of the frame width, evenly scattered, with more of them near the left and right
edges and very few in the centre. Every petal keeps moving downward during the whole clip; none
hovers in place. No large petals, no blurred foreground petals, no bokeh, no glow. No text, no
logos, no watermarks, no people.
```

## 2. Sobre azul medianoche (Noche dorada)

Dos pasos. Adjuntar `inicio-blanco.jpg`.

**2a. Imagen de partida**

```
Usa Higgsfield con use_unlim: true y count: 1. Con gpt_image_2_5 (2K, 9:16) y la foto adjunta como
referencia, genera:

Edit the reference photo. Keep it the exact same photograph: identical top-down vertical 9:16
framing and crop, same landscape closed envelope in the same position and size, same paper texture,
same round wax seal in the center with the same engraved little tree design, same white gypsophila
sprigs and eucalyptus leaves in exactly the same positions. Two changes only: the envelope paper is
now deep midnight blue (dark navy, matte) instead of white, and the table is now dark charcoal-blue
linen lit by warm candlelight from the left, with the same soft diagonal leaf shadows. The wax seal
stays gold. Do not move, add or remove anything. No text, no letters, no logos, no watermarks, no
people, no hands.
```

**2b. Vídeo** (con la imagen de 2a como `start_image`)

```
Usa Higgsfield con use_unlim: true y count: 1. Genera un vídeo con seedance_2_5, modo
omni_reference, 10 s, 720p, 9:16, con audio, usando la imagen anterior como start_image:

One single continuous take, no cuts, no scene changes. Top-down view, locked camera with a very
slow, gentle push-in toward the envelope. A deep midnight-blue paper envelope with a gold wax seal
embossed with a small tree lies on a dark linen table, surrounded by baby's breath and eucalyptus,
warm candlelight from the left with soft moving leaf shadows.
0-2s: a thin trail of golden light glides once around the envelope and settles on the seal.
2-4s: the wax seal cracks cleanly into exactly two halves along a single line; both halves stay on
the lower body of the envelope, below the flap, and slide slightly apart, and a few tiny gold
crumbs jump and land on the envelope. The seal stays the same size, never floats and never slides
under the flap.
4-8s: the top flap slowly lifts open in one smooth piece, hinged along the top edge, revealing an
inner lining of midnight blue with fine gold stars. The broken seal halves remain where they fell.
8-10s: a warm golden glow rises from inside the envelope, growing until it softly fills the centre
of the frame. The final frame is steady.
The envelope stays in the same place and the flowers never move or change. The envelope paper stays
perfectly intact and never tears or splits. Only the wax seal cracks. The seal is never duplicated.
Realistic paper physics, temporal consistency, no morphing. No card, no text, no letters, no logos,
no captions, no watermarks, no people, no hands.
Audio: quiet room ambience, a soft crack when the seal breaks, gentle paper rustle as the flap
lifts, a warm shimmer at the end. No music, no voice.
```

Aviso: un azul empolvado anterior se descartó porque el lacre se deslizaba bajo la solapa. Si
vuelve a pasar, repetir 2b una vez antes de cambiar el texto.

## 3. La tarjeta sale del sobre (tramo 2)

Uno por sobre. Adjuntar `final-blanco.jpg` (Buganvilla) o `final-burdeos.jpg` (Arcilla); para
Noche dorada, el último fotograma del vídeo de 2b.

```
Usa Higgsfield con use_unlim: true y count: 1. Genera un vídeo con seedance_2_5, modo
omni_reference, 6 s, 720p, 9:16, con audio, usando la imagen adjunta como start_image:

One single continuous take, no cuts. Top-down view, completely locked camera. The scene starts
exactly as the reference image: an open envelope on a linen table with a warm glow inside.
0-1s: the golden glow softens and fades to normal warm light.
1-4s: a single blank ivory cotton-paper card with a thin gold border slides smoothly up and out of
the envelope, rising toward the camera.
4-6s: the card settles perfectly flat, centred and facing the camera, upright in portrait
orientation, filling about 70% of the frame width, covering most of the envelope. It stays
completely still for the last second. The final frame is steady.
The card is completely blank: no text, no letters, no monogram, no pattern, no printing. Only one
card, never duplicated, never bent or folded. The envelope, the broken seal halves and the flowers
stay where they are. Realistic paper physics, temporal consistency, no morphing. No logos, no
captions, no watermarks, no people, no hands.
Audio: quiet room ambience and a soft paper slide. No music, no voice.
```

## 4. Opcional

- **Vídeo horizontal (16:9)** del sobre blanco: el texto de `docs/HIGGSFIELD.md` con 16:9 y «exactly
  two halves, both on the lower part of the envelope». Para Instagram (vertical) no hace falta.
- **Polvo de oro** de Noche dorada: el actual funciona; no repetir.

## Después, en Claude Code

Decir «ya están generados» y la sesión los descarga (`show_generations` → `rawUrl`), los revisa
fotograma a fotograma, los optimiza y los monta:

- pétalos → `public/portadas/efectos/petalos.*`;
- sobre medianoche → color nuevo en `FILM_IDS` (`src/lib/theme/schema.ts`), sus tiempos en `TIMING`
  (`envelope/video-envelope.tsx`) y `opening: "pelicula"` en la plantilla Noche dorada;
- tarjeta → se une al vídeo de cada sobre y se pega el saludo con `src/lib/quad.ts`.
