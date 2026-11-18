# Pedido completo a Higgsfield (15/11/2026)

Todo lo que el usuario ha pedido desde el 14/11 y no se ha generado, en un solo texto. Sustituye a
los bloques sueltos de `TANDA-APERTURAS.md` (que queda como referencia de por qué es así cada cosa).

**Dónde se pega**: en la app de Claude, pestaña **Chat** (no «Code»), en un chat nuevo con el
conector de Higgsfield activado. Las sesiones de Code no pueden usar la prueba gratuita: por eso no
se generó nada el 14/11. No hace falta adjuntar ninguna imagen: todas están ya subidas a la cuenta
y el texto las cita por su identificador.

**La prueba gratuita acaba el 15/11/2026.** El texto va por prioridad: lo primero es lo que más
importa.

```
Contexto: tengo una web de invitaciones de boda digitales. Al abrir la invitación se reproduce un
vídeo vertical de un sobre (o una caja) que se abre y termina en un destello cálido del que sale la
carta. Con el conector de Higgsfield vas a generar vídeos de varias formas de apertura en varios
colores, y otros recursos. No conoces el proyecto: todo lo que necesitas está en este mensaje.

REGLAS (valen para todo)
- Usa SIEMPRE mi prueba ilimitada: use_unlim: true y count: 1. No gastes créditos nunca. Si algo no
  lo cubre la prueba, sáltalo y apúntalo para el resumen final.
- No me preguntes nada ni esperes mi visto bueno en ningún paso: hazlo todo seguido, en el orden
  de los bloques.
- Ninguna imagen ni vídeo puede llevar texto, letras, números, monogramas, logotipos, marcas de
  agua, personas ni manos.
- Si recibes un 429 o un error de cola, espera 3 minutos y reintenta una vez; si vuelve a fallar,
  sigue con lo siguiente y apúntalo.
- No esperes a que termine un vídeo para lanzar el siguiente: encola todo lo que la prueba permita
  a la vez y ve lanzando lo demás según haya hueco.
- Vídeos: seedance_2_5, 720p, 9:16. Imágenes de partida y recoloreados: gpt_image_2_5, 2K, 9:16.
  Recursos sueltos: seedream_v5_pro, 2K.
- Imágenes que ya están en mi cuenta (úsalas por su id, no hace falta adjuntar nada):
  - REF = media_id 2138cc24-325f-4ae5-8d6c-19c52c7feb8c: foto cenital 9:16 de un sobre blanco
    cerrado con lacre dorado sobre una mesa de lino beige, con paniculata y eucalipto a la
    izquierda y abajo a la derecha, y luz cálida de ventana desde la izquierda con sombras de hojas.
  - CAJA = job_id ad2c247c-d3a3-4eba-bed5-1ea37d6d3576: la misma escena con una caja marfil con
    lazo burdeos. Ya está hecha: no la repitas.
  - AZUL = job_id 4321b5ca-76f4-446f-b04a-f2ba65bcaf80: la misma escena con el sobre azul empolvado
    y lacre plateado.
  - FINAL-BLANCO = media_id 770157a6-a13d-4bf7-b99a-8cbe0db5b765, FINAL-BURDEOS = media_id
    f775bafb-90e0-4d4a-9d25-97b0e4d4c749 y FINAL-SALVIA = media_id
    ca392f1f-1ddb-4c30-a29e-abb01e1ef626: el sobre de cada color ya abierto, con un destello dentro.

PIEZAS DE TEXTO que se repiten en los vídeos de apertura
- {CAM}: "One single continuous take, no cuts. Top-down view, locked camera with a very slow,
  gentle push-in toward the centre."
- {FIN}: "8-10s: a warm golden glow rises from the inside and grows until it softly fills the
  centre of the frame. The final frame is steady."
- {NO}: "The table, the flowers and the light stay exactly where they are and never move or
  change. The paper never tears, bends unnaturally or duplicates. Realistic paper physics,
  temporal consistency, no morphing. No text, no letters, no monogram, no logos, no captions, no
  watermarks, no people, no hands."
- {LACRE}: "The wax seal breaks into exactly two halves before the flap moves; both halves stay on
  the lower part and no wax remains on the flap."
- {AUD}: "Audio: quiet room ambience and the soft sounds of the action. No music, no voice."
Cada vídeo de apertura = {CAM} + la acción de su forma + {FIN} + {NO} + {LACRE} (si lleva lacre) +
{AUD}; 10 s, modo omni_reference, con audio, con su imagen de partida como start_image.

Imagen de partida de una forma = editar REF con: "Edit the reference photo. Keep the same beige
linen table, the same white gypsophila sprigs and eucalyptus leaves, the same warm window light
from the left and the same soft diagonal leaf shadows, in a vertical 9:16 top-down view. Replace
the closed white envelope with {objeto}, centred, in the same position. No text, no letters, no
monograms, no logos, no watermarks, no people, no hands."

BLOQUE 1 · LAS SEIS FORMAS (lo más importante)
En cuanto tengas la imagen de una forma, lanza su vídeo sin esperar a las demás. Empieza ya por el
vídeo de la caja, que tiene la imagen hecha.

1. Caja con lazo. Imagen: CAJA. Acción: "0-2s: a thin trail of golden light glides once around the
   box and settles on the bow. 2-4s: the bow slowly unties itself and the ribbon ends slide away
   across the lid and fall to either side. 4-8s: the lid lifts straight up in one piece and rises
   out of the top of the frame, revealing ivory tissue paper with a blank ivory card standing in
   it, lit from within."
2. Díptico. {objeto}: "a closed ivory textured-paper folded card, a diptych of two portrait leaves
   meeting at a vertical centre seam, with a round gold wax seal embossed with a small tree sitting
   exactly on the seam, about 50% of the frame width". Acción: "0-2s: a thin trail of golden light
   glides once around the card and settles on the seal. 2-4s: the wax seal cracks cleanly in two
   halves along the seam; each half stays on its own leaf. 4-8s: the two leaves swing open outward
   like double doors, hinged at their outer edges, revealing an inner panel of warm ivory paper
   with a soft golden light." (Aquí no pongas {LACRE}.)
3. Sobre en la mesa. {objeto}: "the same closed ivory envelope rotated about 12 degrees, with a
   small olive sprig tucked under a round burgundy wax seal embossed with a small tree at the centre
   of the flap". Acción: "0-2s: a thin trail of golden light glides once around the envelope and
   settles on the seal. 2-4s: the seal cracks cleanly in two halves that stay on the paper; the
   olive sprig stays in place. 4-8s: the top flap slowly lifts open in one smooth piece, revealing
   an inner lining of olive leaves in soft watercolor."
4. Sobre kraft con cordel. {objeto}: "a closed kraft brown paper envelope with a pointed flap, tied
   around its middle with natural jute twine in a small bow, a tiny dried flower tucked under the
   knot, no wax seal, landscape orientation, same size as the original envelope". Acción: "0-2s: a
   thin trail of golden light glides once around the envelope and settles on the knot. 2-4s: the
   twine bow unties itself and the twine slides off and falls beside the envelope. 4-8s: the flap
   lifts open in one smooth piece, revealing an ivory lining and the edge of a blank ivory card,
   lit from within."
5. Sobre a pantalla completa. Imagen nueva (no edites REF; úsala solo como referencia de color y
   luz): "Vertical 9:16 photo. Extreme macro close-up: an ivory cotton-paper envelope fills the
   entire frame edge to edge; the edges of its flap form a V that meets at the centre, where a
   large round burgundy wax seal embossed with a small tree sits. Visible paper fibres, warm window
   light with soft leaf shadows, no table visible. No text, no letters, no monogram, no logos, no
   watermarks, no people, no hands." En el vídeo cambia {CAM} por "One single continuous take, no
   cuts. Front-on view, locked camera with a very slow, gentle push-in." Acción: "0-2s: a thin
   trail of golden light glides once across the paper and settles on the seal. 2-4s: the seal
   cracks cleanly in two halves that stay on the paper and a few tiny gold crumbs jump. 4-8s: the
   flap peels up and back toward the top of the frame in one smooth piece, revealing a lining of
   olive leaves in soft watercolor, lit from within."
6. Sobre junto a la ventana. Imagen nueva (REF solo como referencia de tonos): "Vertical 9:16
   photo. A low three-quarter view, about 30 degrees above the table: a closed ivory envelope with
   a round burgundy wax seal lies on a white linen tablecloth right next to a tall window with a
   sheer curtain. Soft sunlight casts shadows of branches across the cloth and the envelope. A few
   white gypsophila sprigs at the left, shallow depth of field. No text, no letters, no monogram,
   no logos, no watermarks, no people, no hands." En el vídeo cambia {CAM} por "One single
   continuous take, no cuts. A low three-quarter view; the camera dollies in very slowly." Acción:
   "0-2s: the sheer curtain stirs slightly and the branch shadows drift across the cloth. 2-4s:
   the seal cracks cleanly in two halves that stay on the envelope. 4-8s: the flap lifts open in
   one smooth piece, revealing an ivory lining and the edge of a blank ivory card rising slightly,
   lit by the window."

BLOQUE 2 · LA TARJETA SALE DEL SOBRE (3 vídeos)
Uno con cada imagen FINAL-BLANCO, FINAL-BURDEOS y FINAL-SALVIA como start_image. seedance_2_5,
omni_reference, 6 s, con audio:
"One single continuous take, no cuts. Top-down view, completely locked camera. The scene starts
exactly as the reference image: an open envelope on a linen table with a warm glow inside. 0-1s:
the golden glow softens and fades to normal warm light. 1-4s: a single blank ivory cotton-paper
card with a thin gold border slides smoothly up and out of the envelope, rising toward the camera.
4-6s: the card settles perfectly flat, centred and facing the camera, upright in portrait
orientation, filling about 70% of the frame width, covering most of the envelope. It stays
completely still for the last second. The card is completely blank: no text, no letters, no
monogram, no pattern. Only one card, never duplicated, never bent. The envelope, the broken seal
halves and the flowers stay where they are. Realistic paper physics, no morphing. No logos, no
watermarks, no people, no hands. Audio: quiet room ambience and a soft paper slide. No music."

BLOQUE 3 · COLORES DE CADA FORMA
Para cada variante: (a) recolorea la imagen de partida de esa forma con "Edit the reference photo.
Keep it the exact same photograph: identical framing, same table, same flowers in the same
positions, same light and shadows, same object in the same position and size. The ONLY change:
{cambio}. Do not move, add or remove anything. No text, no letters, no logos, no watermarks, no
people, no hands."; (b) genera el mismo vídeo de esa forma con la imagen recoloreada como
start_image, cambiando en el texto solo los colores. Ve por rondas, en este orden.

RONDA 1
- Caja con lazo: caja verde esmeralda oscuro con lazo de seda dorado.
- Díptico: papel verde salvia con lacre dorado.
- Sobre en la mesa: papel verde salvia con lacre dorado.
- Sobre kraft: el mismo kraft atado con una cinta de seda burdeos en vez de cordel.
- Sobre a pantalla completa: papel burdeos con lacre dorado.
- Sobre junto a la ventana: papel azul empolvado con lacre plateado.
- Sobre azul de película: con la imagen AZUL como start_image, el vídeo del sobre en la mesa pero
  con "a dusty-blue cotton-paper envelope with a silver wax seal" y sin la ramita de olivo.

RONDA 2
- Caja con lazo: caja azul noche con lazo de seda dorado.
- Díptico: papel burdeos con lacre dorado.
- Sobre en la mesa: papel rosa empolvado con lacre dorado.
- Sobre kraft: el mismo kraft atado con una cinta de seda verde salvia.
- Sobre a pantalla completa: papel verde salvia con lacre dorado.
- Sobre junto a la ventana: papel verde salvia con lacre dorado.

RONDA 3
- Caja con lazo: caja rosa empolvado con lazo de seda marfil.
- Díptico: papel azul empolvado con lacre plateado.
- Sobre en la mesa: papel azul empolvado con lacre plateado.
- Sobre a pantalla completa: papel azul noche con lacre dorado.

BLOQUE 4 · EFECTOS Y CLIPS (vídeos cortos, seedance_2_5, 9:16)
1. Pétalos (5 s, sin audio): "Completely static locked camera, plain solid pure black background
   for overlay compositing. Many small, sharp, in-focus white and blush rose petals fall
   continuously from the top of the frame to the bottom, drifting and rotating gently, at a slow
   natural speed. The petals are tiny, each one smaller than 3% of the frame width, with more of
   them near the left and right edges and very few in the centre. Every petal keeps moving
   downward during the whole clip. No large petals, no blurred foreground petals, no glow."
2. Luces (5 s, sin audio): "Completely static locked camera, plain solid pure black background for
   overlay compositing. Tiny soft glowing points of warm golden light drift slowly and fade in and
   out, out of focus. No insects, no bodies, no wings."
3. Lacre (6 s, con audio): "Extreme macro, locked camera. A brass seal stamp presses by itself into
   a pool of molten burgundy wax on ivory paper, holds for a moment and lifts away, leaving a
   glossy embossed round seal. Warm window light, shallow depth of field. No hands, no people."
4. Cinta (6 s, con audio): "Locked camera, top-down. A wide burgundy silk ribbon slowly unfurls and
   slides across a white linen cloth from left to right, catching the warm window light. No hands."
5. Tarjeta (6 s, con audio): "Locked camera, top-down. Warm golden light slowly sweeps across a
   blank ivory invitation card resting among white gypsophila sprigs and eucalyptus leaves on beige
   linen, with soft leaf shadows moving. No hands, no people, no text."
6. Sobre blanco en horizontal (10 s, 16:9, con audio): el vídeo del sobre en la mesa, pero con
   "a white cotton-paper envelope with a gold wax seal embossed with a small tree", sin la ramita
   de olivo, y como imagen de partida una versión 16:9 de REF (amplía REF a 16:9 con la misma mesa
   y flores).

BLOQUE 5 · RECURSOS SUELTOS (imágenes con seedream_v5_pro, 2K)
A. Ornamentos botánicos (6, 1:1): "A single botanical watercolor illustration on a plain pure white
   background, centred, with a generous margin around it: {motivo}. Delicate, elegant, realistic
   hand-painted style, soft colours, tiny gold flecks. No text." Motivos: an olive branch with a
   few ripe olives; a silver-dollar eucalyptus sprig; a baby's breath sprig; a lavender stem; a
   bougainvillea twig with fuchsia bracts; a pampas grass plume.
B. Lacres (6, 1:1): "A top-down product photo of a single round wax seal, perfectly centred, on a
   plain pure white background, with a soft shadow. Glossy wax with a slightly irregular realistic
   edge, {lacre}. No letters, no text." Lacres: gold wax embossed with an almond blossom branch;
   dusty rose wax embossed with a simple heart; navy blue wax embossed with a five-pointed star;
   sage green wax embossed with a eucalyptus leaf; terracotta wax embossed with a sun with rays;
   silver wax embossed with a scallop shell.
C. Forros de sobre (6, 1:1): "A seamless flat pattern for the lining of an envelope, seen straight
   on, with no shadows and no folds, evenly lit: {forro}. No text." Forros: olive leaves in
   watercolor green on ivory; a classic blue toile on cream with branches and small birds; tiny
   wild flowers in dusty rose and sage green; fine gold pinstripes on off-white paper; emerald
   green tropical leaves with gold outlines on a dark background; gold stars and constellations on
   midnight blue.
D. Si la prueba lo cubre, quita el fondo (remove_background) a los ornamentos y a los lacres.
E. Audio, solo si la prueba cubre algún modelo de audio (compruébalo con models_explore, type
   audio, unlim true): dos músicas instrumentales de 60 s que puedan sonar en bucle (piano y
   cuerdas suaves, romántica; guitarra española suave, mediterránea) y cuatro efectos de 1 a 3 s
   sin música (lacre de cera que se rompe; papel grueso que se desliza; cinta de seda que se
   desata; tapa de una caja de cartón que se levanta).

RESUMEN FINAL
Cuando termines, o si la prueba se acaba antes, dame una tabla con bloque, nombre, color, estado y
job_id de cada imagen y cada vídeo, y la lista de lo que ha quedado sin hacer y por qué.
```

## Después

En Claude Code, decir «ya hay cosas generadas»: la sesión las descarga de la cuenta
(`show_generations`), las revisa fotograma a fotograma y las monta. No hace falta esperar a que
termine todo.
