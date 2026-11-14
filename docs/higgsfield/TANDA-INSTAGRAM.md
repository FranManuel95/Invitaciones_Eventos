# Tanda de Higgsfield para las tres plantillas de Instagram

Plantillas (decidido el 13/11): **Arcilla** (sobre burdeos), **Buganvilla** (sobre blanco) y
**Olivar** (sobre verde salvia). Los tres sobres ya existen: no hay que generar ninguno. Reglas,
modelos y optimización: `docs/HIGGSFIELD.md`.

Se genera **desde un chat de claude.ai** con el conector de Higgsfield, nunca desde Claude Code.
Cada bloque de abajo se pega tal cual en ese chat, adjuntando la imagen que indica (están en esta
carpeta). Un bloque cada vez, y se revisa el resultado antes de pasar al siguiente.

Orden recomendado: 1 → 2 → 3. Los pasos 1 y 2 son los que más cambian lo que se graba.

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

## 2. Fotos de las dos parejas nuevas

Cada plantilla enseña una boda ficticia distinta (`src/data/demo/variants.ts`): Arcilla sigue con
María y Daniel (Chinchón); **Buganvilla** es Carmen y Álvaro (Altea) y **Olivar** es Elena y Hugo
(Baeza). Hasta que existan sus fotos, las dos nuevas usan las de María y Daniel.

Son 9 fotos por pareja. Primero la portada (2a), y con ella como referencia, el resto (2b), para
que la pareja sea la misma en todas.

**2a. Portada** (una por pareja; cambia lo que va entre llaves)

```
Usa Higgsfield con use_unlim: true y count: 1. Con seedream_v5_pro, 2K, 2:3 vertical, genera:

Candid editorial wedding-engagement photograph, vertical. A couple in their early thirties,
{pareja}, close together and laughing, {escena}. Shot on a 50 mm lens, shallow depth of field,
natural light, soft film grain, warm and true-to-life skin tones. Their heads are in the upper
half of the frame; the lower third is calmer, with room for text. Not posed, not retouched-looking.
No text, no letters, no logos, no watermark.
```

- Buganvilla — `{pareja}`: «a woman with long dark wavy hair in a white linen dress and a man with
  short brown hair and light stubble in a pale blue linen shirt»; `{escena}`: «in a whitewashed
  Mediterranean village street with fuchsia bougainvillea, late afternoon sun».
- Olivar — `{pareja}`: «a woman with shoulder-length auburn hair in a sage-green dress and a tall
  man with dark curly hair and glasses in a cream shirt»; `{escena}`: «in an olive grove at golden
  hour, silvery leaves around them».

**2b. El resto** (adjuntando la portada de esa pareja como referencia; un mensaje por pareja)

```
Usa Higgsfield con use_unlim: true. Con nano_banana_pro, 2K, y la foto adjunta como referencia de
la pareja (mismas caras, mismo pelo, misma complexión), genera estas 8 fotos, una por una
(count: 1 cada una). Todas con luz natural, grano suave de película, sin texto, sin logos y sin
marcas de agua:

1. pareja (4:5 vertical): the same couple, half-length portrait, looking at each other, {sitio}.
2. ceremonia (3:2 horizontal): {ceremonia}. No people.
3. finca (3:2 horizontal): {finca}. No people.
4. banquete (3:2 horizontal): {banquete}. No people.
5. historia 1 (4:5 vertical): the same couple seen from behind, {historia1}.
6. historia 2 (4:5 vertical): the same couple seen from behind, {historia2}.
7. historia 3 (4:5 vertical): close-up of an engagement ring, {historia3}. No people.
8. historia 4 (4:5 vertical): the same couple seen from behind, {historia4}.
```

Buganvilla (Carmen y Álvaro, Altea):

- `{sitio}`: against a whitewashed wall with bougainvillea
- `{ceremonia}`: a small whitewashed hermitage with a blue-tiled dome above the Mediterranean sea,
  late afternoon light
- `{finca}`: a seaside finca terrace at sunset with long tables, string lights and the sea behind
- `{banquete}`: a long outdoor dinner table under bougainvillea, linen, candles, ceramic plates
- `{historia1}`: sitting on rocks facing a small turquoise cove in summer
- `{historia2}`: standing on a cliff looking at the Atlantic, an old camper van beside them
- `{historia3}`: in an open box on a weathered wooden boat bench, at sunrise
- `{historia4}`: walking barefoot along the shoreline at sunset

Olivar (Elena y Hugo, Baeza):

- `{sitio}`: among olive trees, soft overcast light
- `{ceremonia}`: a small golden-stone Andalusian hermitage surrounded by olive trees, midday light
- `{finca}`: the courtyard of a whitewashed Andalusian cortijo with long tables under old olive trees
- `{banquete}`: a long lunch table inside an old stone olive mill, linen, olive branches, bottles of
  olive oil
- `{historia1}`: walking between rows of olive trees during harvest, nets on the ground
- `{historia2}`: on a small city terrace full of tomato plants, looking at rooftops
- `{historia3}`: on a linen cloth among olive branches and a wicker basket of olives
- `{historia4}`: watching the sun go down over rolling hills of olive groves

## 3. La tarjeta sale del sobre (tramo 2)

Uno por sobre. Adjuntar `final-blanco.jpg` (Buganvilla), `final-burdeos.jpg` (Arcilla) o
`final-salvia.jpg` (Olivar).

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

## Después, en Claude Code

Decir «ya están generados» y la sesión los descarga (`show_generations` → `rawUrl`), los revisa
fotograma a fotograma, los optimiza y los monta:

- pétalos → `public/portadas/efectos/petalos.*`;
- fotos → `public/fotos/buganvilla/` y `public/fotos/olivar/` (reducidas a ~540 px de ancho, como
  las actuales), el mapa de profundidad de cada portada con `scripts/depth-map.py`, y las rutas en
  el mapa `PHOTOS` de `src/data/demo/variants.ts`;
- tarjeta → se une al vídeo de cada sobre y se pega el saludo con `src/lib/quad.ts`.
