---
name: apertura-en-video
description: Cómo crear con Higgsfield (vídeo e imagen con IA) una apertura en vídeo para la invitación —sobre que se abre, lacre, tarjeta— gastando los mínimos créditos, revisarla toma a toma y montarla en la app. Úsala para cualquier vídeo o fotograma realista de papelería (sobres, lacres, tarjetas) que vaya a la invitación o a la página de venta.
---

# Apertura en vídeo

Guía propia del proyecto. Recoge lo aprendido al hacer la apertura «Sobre de película» y las buenas
prácticas de producción de vídeo con IA (guion por tomas, continuidad, revisión de calidad). El
usuario paga los créditos: cada paso se justifica, se cotiza y se revisa antes del siguiente.

## 1. Herramientas

- Conector **Higgsfield** personalizado (`https://mcp.higgsfield.ai/mcp`). El del catálogo de
  Claude solo lee; si faltan `generate_video` o `media_upload`, pide al usuario el personalizado.
- Guías del propio conector: `get_workflow_instructions` (lista) y `product-photoshoot` para
  fotogramas de producto. Las recetas de `get_preset_instructions` (`/impact`, `/light-sweep`…)
  ponen el producto sobre fondo liso de estudio y piden modos de plan superior: úsalas como
  inspiración de redacción, no tal cual.
- Subir una imagen local: `media_upload` → `curl -X PUT` (desde el sandbox) → `media_confirm`.
- Esperar: `jobs_wait` (máx. 15 s por llamada) y descargar el resultado con `curl`.

## 2. Gasto mínimo (regla de oro)

1. **Cotiza siempre** con `get_cost: true` antes de generar y di el precio al usuario.
2. **Primero barato, luego bueno**: una prueba a 720p (o borrador) y solo si gusta, la versión final.
3. **Un intento cada vez.** Nunca `count > 1` ni lotes de vídeo sin permiso.
4. No reintentes un envío dudoso: espera al `job_id` devuelto.

Modelos y precios orientativos (plan Lite, octubre de 2026):

| Para qué | Modelo | Coste aprox. |
| --- | --- | --- |
| Fotograma clave 2K | `nano_banana_pro` (`resolution: "2k"`) | 2 |
| Prueba con inicio y final | `minimax_hailuo`, `variant: "minimax"`, 6 s, 768 | 6 |
| Varias tomas en un vídeo | `kling3_0`, `mode: "std"`, 10 s, `sound: "off"` | 12,5 |
| Inicio y final, 8 s | `seedance1_5`, 720p / 1080p | 9,6 / 24 |
| Solo si sobra presupuesto | `seedance_2_5` 1080p | ~190 |

`minimax-2.3` no admite imagen final. `seedance1_5` tiende a rajar el sobre siguiendo la grieta
del lacre.

## 3. Guion por tomas (antes de gastar)

Escribe la lista de tomas con: número, qué pasa, encuadre y movimiento de cámara, y qué debe
seguir igual que en la anterior (continuidad). Ejemplo de la apertura de sobre:

1. Sobre cerrado sobre mantel de lino con paniculata y eucalipto, vista cenital; cámara se acerca.
2. Una estela dorada recorre el sobre.
3. Primer plano a cámara lenta: el lacre se parte y saltan migas de oro.
4. La solapa se levanta de una pieza y sale luz cálida del interior.
5. Se ve el forro de hojas de olivo en acuarela.
6. La tarjeta sale y flota entre pétalos; termina estable.

Continuidad: mismo sobre, mismo lacre (rama de olivo), misma luz cálida desde la izquierda, mismo
mantel. Formato vertical 9:16 en todas.

## 4. Fotogramas clave

- Parte de imágenes del usuario cuando las haya; si son pequeñas, úsalas como **referencia** y
  genera el fotograma a 2K con `nano_banana_pro`, rol `image_references`.
- **La tarjeta, siempre en blanco**: los textos los pone la app (saludo al invitado). Si una
  referencia trae nombres («Laura & Martín»), pide expresamente que no aparezca texto.
- Retoques pequeños (partir un lacre, quitar un detalle) se pueden hacer en local con OpenCV
  sobre la imagen: así el resto queda idéntico píxel a píxel.

## 5. Cómo escribir la instrucción del vídeo

En inglés, en este orden: cámara → acción por tomas → luz y estética → restricciones.
Incluye siempre las restricciones aprendidas:

```
The envelope paper stays perfectly intact and never tears or splits. Only the wax seal cracks.
The seal is never duplicated. The flap lifts open in one smooth piece. The card is completely
blank. Realistic paper physics, temporal consistency, no morphing. No text, no logos, no
captions, no watermarks, no people, no hands.
```

Para un vídeo de varias tomas, numera las tomas en la instrucción («Shot 1: … Shot 2: …») y
termina en un fotograma estable que coincida con la imagen final.

## 6. Revisión de calidad (antes de aceptar)

1. Descarga el vídeo y saca una tira de fotogramas:
   `ffmpeg -i v.mp4 -vf "fps=2,scale=200:-1,tile=8x2" -frames:v 1 tira.png`.
2. Amplía los momentos críticos (rotura del lacre, apertura, final) a tamaño real.
3. Comprueba esta lista:
   - [ ] El papel no se raja ni se deforma.
   - [ ] El lacre no se duplica ni cambia de dibujo.
   - [ ] No aparece texto, letras inventadas ni marcas de agua.
   - [ ] Sin saltos de cámara bruscos entre tomas (salvo cortes buscados).
   - [ ] El final coincide con la imagen final y está quieto.
   - [ ] Vertical, sin bandas negras, sin audio.
4. Enseña al usuario el vídeo y los fotogramas, con lo que está bien y lo que falla, y propón la
   corrección más barata (tapar un fallo breve con un destello en la app antes que regenerar).

## 7. Montaje en la app

- Archivos en `public/aperturas/<nombre>/`: `sobre.webm` (VP9, primero), `sobre.mp4` (H.264 con
  `+faststart`, respaldo) e `inicio.webp` / `final.webp` (primer y último fotograma).
  - `ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 33 sobre.webm`
  - `ffmpeg -i in.mp4 -an -c:v libx264 -crf 23 -preset slow -movflags +faststart sobre.mp4`
- Componente de referencia: `src/features/invitation/envelope/video-envelope.tsx` (apertura
  `pelicula`). El vídeo llena el móvil (`.video-envelope-frame`); al acabar, la tarjeta hace de
  carta: saludo «Hola, {grupo}:», mensaje y botón «Descubrir la invitación» (los nombres de los
  novios ya salen en la portada). Con movimiento reducido o sin vídeo, se muestra el último
  fotograma con el texto.
- Mide las cuatro esquinas de la tarjeta en el último fotograma (rejilla sobre la imagen) y pega
  el texto con `quadToMatrix3d` (`src/lib/quad.ts`): se maqueta en una tarjeta plana y una
  transformación proyectiva la lleva a esas esquinas, con su perspectiva.
- Montaje entre clips con ffmpeg: zoom (`zoompan` sobre el vídeo ampliado a 4K para que no
  tiemble) que cae en el mismo objeto del clip siguiente, con fundido corto (0,15 s); y
  `xfade=fadewhite` para pasar a una escena con luz. Evita `tmix` en zooms rápidos: duplica objetos.
- Añade la apertura a `OPENING_IDS`, al mapa de `experience.tsx`, a la muestra del editor y a
  `tests/e2e/aperturas.spec.ts`. Comprueba en Playwright que el vídeo se reproduce
  (`currentSrc`, `ended`).
- Apunta en `docs/DECISIONS.md` el modelo, los créditos gastados y los fallos encontrados.

## 8. Sobre renderizado en Blender (sin IA, sin créditos)

Para un sobre fotorrealista que se abre con el dedo («Sobre junto a la ventana», id `ventana`):

- Blender como módulo de Python: `python3 -m venv env && env/bin/pip install bpy` (versión 5.x).
- Guion: `sobre-ventana.py` (en esta carpeta). Construye la escena (mantel de lino, sobre de algodón
  con forro, tarjeta, sol con sombra de ramas, luz de relleno y cámara con desenfoque), renderiza
  la secuencia con Cycles y exporta `meta.json` con las esquinas de la tarjeta en cada fotograma,
  el borde del bolsillo y la punta de la solapa (para el lacre).
  - `env/bin/python sobre-ventana.py salida all 40` (40 muestras, ~1,5 min por fotograma con 4 CPU).
  - `env/bin/python sobre-ventana.py salida none`: solo los datos, sin renderizar.
  - Texturas de ambientCG (CC0): `Paper002` y `Fabric036` en la carpeta `TEXTURAS`; `forro.png` y
    `ramas.png` se dibujan con OpenCV (rayas doradas y siluetas de hojas).
- Sobre y tarjeta verticales (15 × 21,5 cm): la tarjeta lleva la carta completa de la invitación
  impresa encima (solo la tinta), así que tiene que ser vertical como ella.
- Encuadre: el sobre no debe pasar del 72 % del ancho del fotograma (en un iPhone se recorta un
  20 % de cada lado al cubrir la pantalla).
- Fotogramas a WebP (`ffmpeg -i f00.png -quality 72 f00.webp`) en `public/aperturas/sobre-ventana/`
  y los datos a `window-frames.ts` (el texto y el lacre se ponen encima en la app).
- Lecciones del primer render (aplicando los criterios de Blender Expert Skills, edemaistre):
  - Color: «Khronos PBR Neutral», no AgX. AgX desvía los colores de producto y el marfil salía gris.
  - Separar el sujeto por valor: oscurecer la mesa en vez de subir luces. El brillo general se
    ajusta con `exposure`, no escalando las luces.
  - Cycles de producto: 3 rebotes, sin cáusticas, 32 muestras con eliminación de ruido.
  - Orden en profundidad: la tarjeta va entre el fondo y el bolsillo hasta que su borde de abajo
    sale; la solapa abierta queda tendida y plana (ángulo π) por debajo de la tarjeta. Revisa los
    fotogramas del cruce (tarjeta saliendo sobre la solapa) antes de renderizarlo todo.
  - Sombra de ramas: una lámina recortada (`ramas.png`) a 22 cm de la mesa, en la dirección de un
    sol de 3,5°. Con una luz de área grande la sombra se emborrona del todo.
