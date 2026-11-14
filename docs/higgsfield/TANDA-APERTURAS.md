# Tanda de Higgsfield: vídeos de las otras formas de apertura y más recursos

Escrita el 14/11/2026. Hasta ahora solo la apertura «Sobre de película» tiene vídeo real (sobre
blanco, salvia y burdeos). Las demás formas que tiene la app (caja con lazo, díptico, sobre a
pantalla completa, sobre en la mesa y sobre junto a la ventana) están hechas con código. Aquí se
generan sus versiones en vídeo, más un sobre nuevo (kraft con cordel) y otros recursos.

**Urgente: la prueba gratuita de Higgsfield acaba el 15/11/2026.** Lo que no se genere antes
costaría créditos (quedan unos 50, que dan para unas 20 imágenes y ningún vídeo). Se generan
**desde un chat de claude.ai** con el conector de Higgsfield, nunca desde Claude Code. Reglas,
modelos y optimización: `docs/HIGGSFIELD.md`.

Se usan **tres chats a la vez**, uno por bloque, y cada uno con un modelo de imagen distinto para
no chocar con el límite de peticiones (que se cuenta por cuenta y modelo):

| Chat | Qué genera                                                | Modelos                                                     | Adjuntar                                          |
| ---- | --------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| 1    | Seis formas de apertura en vídeo                          | `gpt_image_2_5` + `seedance_2_5`                            | `inicio-blanco.jpg`                               |
| 2    | La tarjeta que sale del sobre (tres sobres) y el 16:9     | `seedance_2_5`                                              | `final-blanco.jpg`, `-burdeos.jpg`, `-salvia.jpg` |
| 3    | Ornamentos, lacres, forros, audio y material de Instagram | `seedream_v5_pro`, audio y (solo la tanda E) `seedance_2_5` | nada                                              |

Todas las imágenes de referencia están en esta carpeta.

Si el tiempo apremia, el orden de valor es: **chat 1 (caja, díptico, pantalla) → chat 2 → chat 3
(ornamentos y lacres) → el resto**.

## Chat 1. Seis formas de apertura en vídeo

Adjuntar `inicio-blanco.jpg` (el primer fotograma del sobre blanco: da el ambiente). Pegar:

```
Contexto: tengo una web de invitaciones de boda digitales. Al abrir la invitación se reproduce un
vídeo vertical de un sobre (o una caja) que se abre y termina en un destello cálido del que sale
la carta. Con el conector de Higgsfield vas a generar vídeos de SEIS FORMAS de apertura distintas,
todas con el mismo ambiente que la foto que te adjunto: mesa de lino beige, ramitas de paniculata
y hojas de eucalipto, luz cálida de ventana desde la izquierda con sombras suaves de hojas.

Reglas:
- Usa SIEMPRE mi prueba ilimitada (use_unlim: true) y count: 1. No gastes créditos: si algo no lo
  cubre la prueba, para y dímelo antes de generar.
- Ninguna imagen ni vídeo puede llevar texto, letras, monogramas, logotipos, marcas de agua,
  personas ni manos.
- Si recibes un 429, espera 3 minutos y reintenta una vez; si vuelve a fallar, sigue con la
  siguiente forma y avísame al final.
- No esperes mi visto bueno entre pasos. Primero genera las 6 imágenes de partida, una a una, con
  gpt_image_2_5 a 2K, 9:16, usando la foto adjunta como referencia. Después lanza los 6 vídeos a
  la vez con seedance_2_5, modo omni_reference, 10 s, 720p, 9:16, con audio, cada uno con su
  imagen como start_image.
- Al final, enséñame cada imagen y cada vídeo con su nombre y su job_id.

IMAGEN DE PARTIDA. Para las formas 1, 2, 4 y 6 usa este texto, cambiando {objeto}:
"Edit the reference photo. Keep the same beige linen table, the same white gypsophila sprigs and
eucalyptus leaves (left side and bottom right), the same warm window light from the left and the
same soft diagonal leaf shadows, in a vertical 9:16 top-down view. Replace the closed white
envelope with {objeto}, centred, in the same position. No text, no letters, no monograms, no
logos, no watermarks, no people, no hands."

TEXTO DE LOS VÍDEOS. Cada vídeo es: {CÁMARA} + {ACCIÓN} + {FINAL} + {RESTRICCIONES} + {AUDIO}.
- {CÁMARA}: "One single continuous take, no cuts. Top-down view, locked camera with a very slow,
  gentle push-in toward the centre."
- {FINAL}: "8-10s: a warm golden glow rises from the inside and grows until it softly fills the
  centre of the frame. The final frame is steady."
- {RESTRICCIONES}: "The table, the flowers and the light stay exactly where they are and never
  move or change. The paper never tears, bends unnaturally or duplicates. Realistic paper
  physics, temporal consistency, no morphing. No text, no letters, no monogram, no logos, no
  captions, no watermarks, no people, no hands."
- {AUDIO}: "Audio: quiet room ambience and the sounds described. No music, no voice."

FORMA 1 · Caja con lazo
- {objeto}: "an ivory cotton-paper rectangular gift box with a flat lid, tied crosswise with a wide
  burgundy silk ribbon and a neat bow at the centre, in portrait orientation, about 55% of the
  frame width"
- {ACCIÓN}: "0-2s: a thin trail of golden light glides once around the box and settles on the bow.
  2-4s: the bow slowly unties itself and the two ribbon ends slide away across the lid and fall
  to either side. 4-7s: the lid lifts straight up in one piece and rises out of the top of the
  frame, revealing ivory tissue paper with a blank ivory card standing in it, lit from within.
  7-8s: the tissue settles."
- Sonidos: "soft silk ribbon sliding, a gentle lid lift".

FORMA 2 · Díptico
- {objeto}: "a closed ivory textured-paper folded card, a diptych of two portrait leaves meeting at
  a vertical centre seam, with a round gold wax seal embossed with a small tree sitting exactly on
  the seam, about 50% of the frame width"
- {ACCIÓN}: "0-2s: a thin trail of golden light glides once around the card and settles on the
  seal. 2-4s: the wax seal cracks cleanly in two halves along the seam; each half stays on its own
  leaf. 4-8s: the two leaves swing open outward like double doors, hinged at their outer edges,
  revealing an inner panel of warm ivory paper with a soft golden light."
- Sonidos: "a soft wax crack, paper doors swinging open".

FORMA 3 · Sobre a pantalla completa (no usa la foto como edición: parte de un plano muy cercano)
- Imagen de partida: "Generate a new photo, vertical 9:16, using the reference only for the
  paper colour, the warm light and the soft leaf shadows. Extreme macro close-up: an ivory
  cotton-paper envelope fills the entire frame edge to edge; the edges of its flap form a V that
  meets at the centre, where a large round burgundy wax seal embossed with a small tree sits.
  Visible paper fibres, shallow depth of field, no table visible. No text, no letters, no
  monogram, no logos, no watermarks, no people, no hands."
- {CÁMARA}: "One single continuous take, no cuts. Front-on view, locked camera with a very slow,
  gentle push-in."
- {ACCIÓN}: "0-2s: a thin trail of golden light glides once across the paper and settles on the
  seal. 2-4s: the seal cracks cleanly in two halves along one line; the halves stay on the paper
  and a few tiny gold crumbs jump. 4-8s: the flap peels up and back toward the top of the frame
  in one smooth piece, revealing a lining of olive leaves in soft watercolor, lit from within."
- Sonidos: "a soft wax crack, a paper rustle".

FORMA 4 · Sobre en la mesa
- {objeto}: "the same closed ivory envelope rotated about 12 degrees, with a small olive sprig
  tucked under a round burgundy wax seal embossed with a small tree at the centre of the flap"
- {ACCIÓN}: "0-2s: a thin trail of golden light glides once around the envelope and settles on the
  seal. 2-4s: the seal cracks cleanly in two halves that stay on the paper; the olive sprig stays
  in place. 4-8s: the top flap slowly lifts open in one smooth piece, revealing an inner lining of
  olive leaves in soft watercolor."
- Sonidos: "a soft wax crack, gentle paper rustle".

FORMA 5 · Sobre junto a la ventana (cambia el plano: ligeramente desde un lado)
- Imagen de partida: "Generate a new photo, vertical 9:16, with the same warm tones and soft light
  as the reference. A low three-quarter view, about 30 degrees above the table: a closed ivory
  envelope with a round burgundy wax seal lies on a white linen tablecloth right next to a tall
  window with a sheer curtain. Strong soft sunlight enters and casts soft shadows of branches
  across the cloth and the envelope. A few white gypsophila sprigs at the left, shallow depth of
  field. No text, no letters, no monogram, no logos, no watermarks, no people, no hands."
- {CÁMARA}: "One single continuous take, no cuts. A low three-quarter view; the camera dollies in
  very slowly."
- {ACCIÓN}: "0-2s: the sheer curtain stirs slightly and the branch shadows drift across the cloth.
  2-4s: the seal cracks cleanly in two halves that stay on the envelope. 4-8s: the flap lifts
  open in one smooth piece, revealing an ivory lining and the edge of a blank ivory card rising
  slightly, lit by the window."
- Sonidos: "a light breeze, the curtain rustling, a soft wax crack".

FORMA 6 · Sobre kraft con cordel (forma nueva, rústica)
- {objeto}: "a closed kraft brown paper envelope with a pointed flap, tied around its middle with
  natural jute twine in a small bow, a tiny dried flower tucked under the knot, no wax seal,
  landscape orientation, same size as the original envelope"
- {ACCIÓN}: "0-2s: a thin trail of golden light glides once around the envelope and settles on the
  knot. 2-4s: the twine bow unties itself and the twine slides off and falls beside the envelope.
  4-8s: the flap lifts open in one smooth piece, revealing an ivory lining and the edge of a
  blank ivory card, lit from within."
- Sonidos: "twine rustling, a gentle paper rustle".
```

Al terminar, apuntar los `job_id` de cada vídeo para pedirlos en Claude Code.

## Chat 2. La tarjeta que sale del sobre, y el 16:9

No hace falta redactar nada nuevo: ya está en `docs/higgsfield/TANDA-INSTAGRAM.md`.

- **Bloque 3 (tres veces)**: un vídeo por sobre, adjuntando `final-blanco.jpg`, `final-burdeos.jpg` y
  `final-salvia.jpg`. Es lo que une el vídeo del sobre con la carta (el sobre se abre y la tarjeta
  sale). Es lo que falta para recuperar la tarjeta que salía en la primera versión del sobre blanco.
- **Bloque 4 (opcional)**: el 16:9 del sobre blanco.

Si ya están hechos, saltar este chat.

## Chat 3. Más recursos

Las imágenes con `seedream_v5_pro` a 2K, para no chocar con el chat 1. La tanda E usa Seedance, como los chats 1 y 2: va la última y conviene lanzarla cuando esos terminen. No hace falta adjuntar nada. Pegar:

```
Contexto: tengo una web de invitaciones de boda digitales y necesito recursos gráficos para ella.

Reglas:
- Usa SIEMPRE mi prueba ilimitada (use_unlim: true) y count: 1. No gastes créditos: si algo no lo
  cubre la prueba, para y dímelo antes de generar.
- Ninguna imagen ni vídeo puede llevar texto, letras, números, monogramas, logotipos, marcas de
  agua ni personas.
- Usa seedream_v5_pro a 2K para las imágenes. Si recibes un 429, espera 3 minutos y reintenta una
  vez; si vuelve a fallar, sigue con lo siguiente y avísame al final.
- No esperes mi visto bueno entre tandas. Haz la tanda E la última. Al final, enséñame todo con su
  nombre y su job_id.

TANDA A · Ornamentos botánicos (6 imágenes, 1:1). Texto, cambiando {motivo}:
"A single botanical watercolor illustration on a plain pure white background, centred, with a
generous margin around it: {motivo}. Delicate, elegant, realistic hand-painted style, soft
colours, tiny gold flecks. No text."
Motivos: (1) an olive branch with a few ripe olives; (2) a silver-dollar eucalyptus sprig;
(3) a baby's breath sprig; (4) a lavender stem; (5) a bougainvillea twig with fuchsia bracts;
(6) a pampas grass plume.
Después, si la prueba lo cubre, pasa remove_background a cada una y dime si lo has podido hacer.

TANDA B · Lacres (6 imágenes, 1:1). Texto, cambiando {lacre}:
"A top-down product photo of a single round wax seal, perfectly centred, on a plain pure white
background, with a soft shadow. Glossy wax with a slightly irregular realistic edge, {lacre}. No
letters, no text."
Lacres: (1) gold wax embossed with an almond blossom branch; (2) dusty rose wax embossed with a
simple heart; (3) navy blue wax embossed with a five-pointed star; (4) sage green wax embossed
with a eucalyptus leaf; (5) terracotta wax embossed with a sun with rays; (6) silver wax embossed
with a scallop shell.
Después, si la prueba lo cubre, pasa remove_background a cada una.

TANDA C · Forros de sobre (6 imágenes, 1:1). Patrón plano, visto de frente, sin sombras ni
pliegues, que se pueda repetir como papel pintado. Texto, cambiando {forro}:
"A seamless flat pattern for the lining of an envelope, seen straight on, with no shadows and no
folds, evenly lit: {forro}. No text."
Forros: (1) olive leaves in watercolor green on ivory; (2) a classic blue toile on cream with
branches and small birds; (3) tiny wild flowers in dusty rose and sage green; (4) fine gold
pinstripes on off-white paper; (5) emerald green tropical leaves with gold outlines on a dark
background; (6) gold stars and constellations on midnight blue.

TANDA D · Audio. Solo si la prueba cubre algún modelo de audio (compruébalo con models_explore,
type audio, unlim true). Si no lo cubre, dímelo y no generes nada de esta tanda.
- Música instrumental de 60 s, piano y cuerdas suaves, romántica y tranquila, que pueda sonar en
  bucle.
- Música instrumental de 60 s, guitarra española suave, cálida y mediterránea.
- Efectos cortos, de 1 a 3 s, sin música: un lacre de cera que se rompe; papel grueso que se
  desliza; una cinta de seda que se desata; la tapa de una caja de cartón que se levanta.

TANDA E · Material para Instagram (3 vídeos). seedance_2_5, 720p, 9:16, 6 s, con audio, un
vídeo cada uno:
(1) "Extreme macro, locked camera. A brass seal stamp presses by itself into a pool of molten
burgundy wax on ivory paper, holds for a moment and lifts away, leaving a glossy embossed round
seal. Warm window light, shallow depth of field. No hands, no people, no text. Audio: a soft wax
squeeze."
(2) "Locked camera, top-down. A wide burgundy silk ribbon slowly unfurls and slides across a white
linen cloth from left to right, catching the warm window light. No hands, no people, no text.
Audio: silk sliding."
(3) "Locked camera, top-down. Warm golden light slowly sweeps across a blank ivory invitation card
resting among white gypsophila sprigs and eucalyptus leaves on beige linen, with soft leaf
shadows moving. No hands, no people, no text. Audio: quiet room ambience."
```

## Después, en Claude Code

Decir «ya están generados» (y qué chats han terminado). La sesión los descarga con
`show_generations` → `rawUrl`, los revisa fotograma a fotograma, los optimiza con ffmpeg (ver
`docs/HIGGSFIELD.md`) y los monta:

- **Formas de apertura (chat 1)**: hoy `theme.film` solo elige el color del sobre de película. Se
  ampliará a «forma y color» (caja, díptico, pantalla, mesa, ventana y kraft), cada una con su vídeo
  en `public/aperturas/sobre-dorado/`. Cada vídeo solo necesita sus tiempos de vibración y de
  destello (`TIMING` en `envelope/video-envelope.tsx`), porque todos acaban en el mismo destello
  del que sale la carta. Cada uno pesa unos 2,7 MB y solo se descarga si se elige.
- **Tarjeta que sale (chat 2)**: se une al vídeo de cada sobre y se pega el saludo con
  `src/lib/quad.ts`.
- **Ornamentos y lacres (chat 3)**: PNG con fondo transparente en `public/`; hay que decidir dónde
  entran en el diseño (esquinas, separadores, sello del sobre).
- **Forros**: sustituirían a los que hoy se dibujan con CSS (`LINER_IDS`).
- **Audio**: la app hoy sintetiza la música y los sonidos (`effects/ambient.ts`, `effects/sound.ts`);
  los archivos reales se sumarían como opción.
- **Material de Instagram**: no entra en la app; son clips para publicar.

Nada de esto está montado todavía: son recursos por generar.
