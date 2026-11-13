# Higgsfield: cómo se generan vídeos e imágenes para la invitación

Guía para repetir o ampliar los recursos con IA (sobres en vídeo, portadas pintadas, bucles de
efectos). Recoge lo que se hizo entre el 11 y el 13 de noviembre de 2026 y lo que se aprendió. La
guía corta para el sobre en vídeo está en `.claude/skills/apertura-en-video/SKILL.md`; esta añade
lo ocurrido con la prueba gratuita, los modelos que funcionaron y los textos exactos.

No hay claves ni datos personales aquí: los identificadores de archivos subidos (`media_id`) son
de cada cuenta de Higgsfield y no sirven en otra. Los recursos ya generados viven en `public/`.

## Reglas que ahorran créditos

1. **La prueba de 3 días con generaciones ilimitadas solo funciona desde un chat de Claude
   (claude.ai), Cowork o ChatGPT, nunca desde Claude Code.** Desde Claude Code, Higgsfield rechaza
   `use_unlim: true` y cada generación cuesta créditos (un vídeo de 10 s a 1080p con Seedance 2.5
   costaba 128). Por eso el trabajo se reparte:
   - **En el chat de claude.ai** (con el conector de Higgsfield activo): se generan imágenes y
     vídeos, siempre con `use_unlim: true` y sin gastar créditos.
   - **En Claude Code** (esta sesión): se descargan los resultados desde la cuenta
     (`show_generations` devuelve la URL `rawUrl` de cada uno; `curl` los baja), se revisan
     fotograma a fotograma, se optimizan con ffmpeg y se montan en la app.
2. **La prueba cubre hasta 720p en vídeo y 2K en imagen** (no 1080p, no 4K). Modelos comprobados:
   `seedance_2_5` a 720p (hasta 30 s), `seedream_v5_pro` 2K, `gpt_image_2_5`, `nano_banana_pro`.
3. **Quién puede tener la prueba**: solo cuentas que nunca han tenido suscripción ni otra prueba;
   se puede usar una vez y no se reactiva ni se mueve a otra cuenta (lo confirmó el soporte de
   Higgsfield). Al terminar renueva sola a un plan de pago: hay que cancelar la renovación
   («Cancel auto-renewal» en el perfil) y la prueba sigue activa hasta su fecha. Conectar el
   conector no activa la prueba: se activa en higgsfield.ai/mcp.
4. **Antes de gastar créditos**: `get_cost: true` y un intento cada vez (`count: 1`).
5. **Límite de peticiones (429)**: se cuenta por cuenta y modelo, no por chat. Con dos chats usando
   el mismo modelo a la vez, uno se bloquea. Repartir modelos (por ejemplo, un chat con Nano
   Banana Pro y otro con Seedream) o esperar unos minutos.
6. **La cola de vídeo puede tardar** (un Seedance de 10 s llegó a esperar más de 10 minutos). No
   se relanza: se espera al mismo identificador.
7. Un recoloreo con `nano_banana_2` fue marcado como `nsfw` sin motivo; con `gpt_image_2_5` salió
   bien.

## Cómo se hizo cada recurso

### Sobre de película, una sola toma (`public/aperturas/sobre-dorado/`)

1. Primer fotograma: el del vídeo anterior (`ffmpeg -ss 0 -i vertical.mp4 -frames:v 1 inicio.png`),
   subido con `media_upload`, `curl -X PUT` y `media_confirm`.
2. Vídeo con `seedance_2_5`, modo `omni_reference`, 10 s, 720p, 9:16, con audio, esta imagen como
   `start_image`. Texto (en inglés; para otros colores solo cambia el sobre y el lacre):

```
One single continuous take, no cuts, no scene changes. Top-down view, locked camera with a very
slow, gentle push-in toward the envelope. A white cotton-paper envelope with a gold wax seal
embossed with a small tree lies on a linen table, surrounded by baby's breath and eucalyptus, warm
window light from the left with soft moving leaf shadows.
0-2s: a thin trail of golden light glides once around the envelope and settles on the seal.
2-4s: the wax seal cracks cleanly in two halves along a single line; the two halves stay on the
paper and slide slightly apart, and a few tiny gold crumbs jump and land on the envelope. The seal
stays the same size and never floats.
4-8s: the top flap slowly lifts open in one smooth piece, hinged along the top edge, revealing an
inner lining of olive leaves in soft watercolor. The broken seal halves remain where they fell.
8-10s: a warm golden glow rises from inside the envelope, growing until it softly fills the centre
of the frame. The final frame is steady.
The envelope stays in the same place and the flowers never move or change. The envelope paper stays
perfectly intact and never tears or splits. Only the wax seal cracks. The seal is never duplicated.
Realistic paper physics, temporal consistency, no morphing. No card, no text, no letters, no logos,
no captions, no watermarks, no people, no hands.
Audio: quiet room ambience, a soft crack when the seal breaks, gentle paper rustle as the flap
lifts, a warm shimmer at the end. No music, no voice.
```

3. Resultado: 720 × 1280, 10 s. Se amplía a 900 × 1600 y se codifica (ver «Optimización»).
   Fallo conocido: un trozo pequeño del lacre sube pegado a la solapa. En el horizontal (16:9) se
   pidió «exactly two halves, both on the lower part of the envelope» y aún no está hecho.

### Sobres de color (`salvia.*`, `burdeos.*`)

1. Imagen de partida recoloreada con `gpt_image_2_5` (modelo `flare`, calidad media, 2K, 9:16),
   con la foto del primer fotograma como referencia:

```
Edit the reference photo. Keep it the exact same photograph: identical top-down vertical 9:16
framing and crop, same beige linen table, same white gypsophila sprigs and eucalyptus leaves in
exactly the same positions (left side and bottom right), same warm window light coming from the
left, same soft diagonal leaf shadows on the table, same landscape closed envelope in the same
position and size, same cotton paper texture, same round wax seal in the center with the same
engraved little tree design. The ONLY change: the envelope paper is now sage green (soft, muted,
greyish green) instead of white. The wax seal stays gold. Do not move, add or remove anything. No
text, no letters, no logos, no watermarks, no people, no hands.
```

2. El mismo vídeo de arriba cambiando «white cotton-paper envelope» por «sage-green …» o
   «burgundy …». Hay también un azul empolvado con lacre plateado **descartado**: el lacre no se
   parte, se desliza bajo la solapa.

### Portadas pintadas (`public/portadas/*.webp`, 1080 px)

`seedream_v5_pro`, 2K, 9:16. Plantilla del texto (cambia el tema entre llaves):

```
Vertical background for a wedding invitation cover. {tema}, arranged only along the outer edges
and corners of the frame. The entire central area is completely empty, clean and calm with
generous negative space, reserved for text to be added later. Elegant, refined, high detail. No
people, no text, no letters, no numbers, no logos, no watermark, no signature.
```

Temas usados: `ramas` (acuarela de olivo y eucalipto sobre papel de algodón, con toques de oro),
`buganvilla` (buganvilla fucsia y pared encalada, luz de tarde), `medianoche` (azul profundo con
estrellas finas y niebla dorada abajo), `arcilla` (papel artesanal color arcilla con flores secas
y hierba de la pampa), `orilla` (acuarela de mar en calma, arena clara y conchas). Hay un sexto,
**esmeralda** (terciopelo verde con hojas tropicales y filos dorados), que se quedó en cola y no
se ha usado.

### Bucles de efecto (`public/portadas/efectos/`)

`seedance_2_5`, 720p, 9:16, 5 s, sin audio (`generate_audio: false`):

```
Completely static locked camera, very slow motion, plain solid dark background for overlay
compositing. {efecto}. No text, no logos, no watermarks, no people.
```

- `petalos`: «White petals falling slowly». Salen grandes y desenfocados, casi quietos: conviene
  repetirlo con pétalos pequeños que caigan de verdad.
- `oro`: «golden dust floating with soft sparkles». Muy bien sobre fondos oscuros.
- **Luciérnagas descartado**: salieron insectos literales. Repetir con «tiny soft glowing points
  of warm light, out of focus, no insects, no bodies, no wings».

## Optimización con ffmpeg

Vídeo del sobre (900 × 1600, con audio):

```bash
F="scale=900:1600:flags=lanczos,unsharp=3:3:0.4"
ffmpeg -i in.mp4 -vf "$F" -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -crf 22 \
  -preset slow -c:a aac -b:a 96k -movflags +faststart salida.mp4
ffmpeg -i in.mp4 -vf "$F" -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -c:a libopus -b:a 64k salida.webm
ffmpeg -i salida.mp4 -frames:v 1 -quality 80 salida.webp   # imagen de portada del vídeo
```

Bucle sin salto (el último segundo se funde con el primero y se aplastan los negros con `curves`;
el segundo parámetro de `curves` cambia por efecto):

```bash
ffmpeg -i loop.mp4 -filter_complex "[0:v]fps=24,scale=540:960,curves=all='0/0 0.24/0 1/1',split[a][b];[a]trim=1:5,setpts=PTS-STARTPTS[m];[b]trim=0:1,setpts=PTS-STARTPTS[h];[m][h]xfade=transition=fade:duration=1:offset=3,format=yuv420p[v]" -map "[v]" -an -c:v libx264 -crf 26 -preset slow -movflags +faststart petalos.mp4
```

Fondos: `ffmpeg -i fondo.png -vf "scale=1080:-2:flags=lanczos" -quality 80 fondo.webp`.

## Revisión de calidad (antes de montar)

Sacar una tira (`fps=2,scale=220:-1,tile=10x2`) y ampliar los momentos clave. Comprobar: el papel
no se rompe; el lacre no se duplica; sin texto ni marcas de agua; sin cortes ni imagen doble;
el final está quieto; vertical y sin bandas. Ver la lista completa en la skill `apertura-en-video`.

## Pendiente con Higgsfield

- **Vídeo horizontal (16:9) del sobre blanco** de una sola toma: sin él, en pantallas anchas
  sigue el vídeo antiguo. Los sobres de color no tienen horizontal (se recorta el vertical).
- **Tramo 2: la tarjeta sale del sobre** (ver `docs/TRASPASO.md`): 6 s, 720p, mismo plano, la tarjeta
  en blanco sube y queda de frente; después se pega el saludo con `src/lib/quad.ts`.
- Repetir los pétalos y las luciérnagas; generar la portada esmeralda.
- No generados todavía: fotos de ejemplo para la página de venta, forros de sobre, lacres con
  distintos dibujos, música y sonidos, material para Instagram. Los textos de esas tandas están
  propuestos en el historial de la sesión; se redactan igual que los de arriba.

## Con otra cuenta de Higgsfield

1. Conectar el conector personalizado `https://mcp.higgsfield.ai/mcp` en un chat de claude.ai.
2. Los recursos ya generados están en `public/`; no hace falta regenerar nada para ver la app.
3. Para generar con la misma estética, subir el primer fotograma (extraído del vídeo vigente con
   ffmpeg) y usar los textos de este documento; los `media_id` serán distintos.
