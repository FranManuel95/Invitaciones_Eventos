# Decisiones del prototipo

Registro de las decisiones tomadas en el primer hito (prototipo visual). Cada una está pensada para
ser sencilla y reversible.

## Stack

| Pieza                   | Versión                                    | Motivo                                                                                        |
| ----------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Next.js (App Router)    | 16.4                                       | Rutas estáticas por invitación (`generateStaticParams`), metadatos y listo para Vercel        |
| React                   | 19.3                                       | —                                                                                             |
| TypeScript              | 6.0, `strict` + `noUncheckedIndexedAccess` | —                                                                                             |
| Tailwind CSS            | 4.3                                        | Tokens como variables CSS en `@theme`, que se pueden sobrescribir por evento                  |
| Motion (`motion/react`) | 14.5                                       | Coreografía del sobre (`useAnimate`), presencia entre pantallas, gestos y movimiento reducido |
| Zod                     | 4.6                                        | Valida las respuestas guardadas (datos no confiables). Se reutilizará en el servidor          |
| lucide-react            | 1.61                                       | Iconos                                                                                        |

**Descartados por ahora:**

- React Hook Form: el RSVP es un asistente con validación por pasos que vive en `src/lib/rsvp/draft.ts`
  y se prueba sin React. Además, `@hookform/resolvers@6` tenía un conflicto de dependencias.
- shadcn/Radix: los controles son nativos (radio, checkbox, select, `details`), accesibles por defecto.
- Librerías de gráficos: son dos gráficos SVG pequeños hechos a mano.
- Supabase y la autenticación: quedan fuera de este hito.

## Ronda 12 · Tres plantillas para grabar y subir a Instagram (13–14/11/2026)

Objetivo del usuario: grabar 2–3 plantillas con todas las mejoras y subirlas a su Instagram.
Se eligen las que más se distinguen entre sí: **Arcilla** (cálida, sobre burdeos), **Buganvilla**
(clara, sobre blanco) y **Olivar** (clara, sobre salvia). **Noche dorada** queda fuera porque su
sobre es 3D y no un vídeo de Higgsfield.

- **Una boda de ejemplo distinta por plantilla** (`src/data/demo/variants.ts`, elegida con
  `?plantilla=`): Arcilla enseña a María y Daniel (Chinchón), Buganvilla a Carmen y Álvaro (Altea)
  y Olivar a Elena y Hugo (Baeza). Cambian nombres, fecha, sitios, programa, autobuses, menú,
  dress code, alojamiento, historia, regalos, preguntas, libro de firmas y canciones. Solo en la
  demo: las invitaciones reales no usan variantes. Las fotos (generadas con IA, no personas
  reales) están en `public/fotos/buganvilla/` y `public/fotos/olivar/`; las rutas, en el mapa
  `PHOTOS` del mismo archivo.
- **Modo de grabación** (`?grabar=1`, solo en la demo): oculta «Demo con datos ficticios»,
  «Saltar intro» y el aviso «Prototipo de demostración» del cierre; el botón de sonido se queda.
- **Revisión de diseño** con las skills `web-design-guidelines` (Vercel) y `frontend-design`:
  - Los pétalos de la portada se apagan en la franja de los nombres (máscara CSS) en vez de
    repetir el vídeo.
  - El «negro» de las escenas de cine (`--color-night`, calculado en `themeVars`) se tiñe con el
    lacre y la tinta de la plantilla; la barra del navegador (`theme-color`) sigue a la pantalla.
  - El papel de regalo sin foto usa colores del tema, no un verde y un azul fijos.
  - Las etiquetas del dress code van sin numeración «01» ni mayúsculas (no son una secuencia).
  - El titular de la cuenta de la demo ya no dice «(cuenta de demostración)».
- **Tras ver la vista previa en el móvil**:
  - La foto de la carta se encuadra arriba (`object-[50%_10%]`): los retratos son verticales y se
    cortaba la cara.
  - El pase del dress code y el del libro de firmas llevan botones «anterior / siguiente» y un
    contador (`content/rail-controls.tsx`), solo en el móvil; deslizar con el dedo sigue valiendo.
  - Transiciones oscuro ↔ claro: «¿Venís?» enlaza con la música sin franja clara, la música se
    funde con la sección siguiente (`fadeTo`) y «Nuestra historia» entra con degradado
    (`.story-in`).
- **Música de fondo apagada por defecto** (`theme.music` pasa a `false`, también en `parseTheme`):
  el usuario no quedó convencido. Se activa en el editor («Música al abrir»); los efectos
  sonoros del vídeo del sobre siguen y el botón del altavoz se queda. Los temas ya guardados
  conservan su valor.
- **Un solo PR** ([#6](https://github.com/FranManuel95/Invitaciones_Eventos/pull/6)): la rama
  lleva 85+ archivos y las uniones entre ramas entrelazan el historial; partirla exigiría
  reescribirlo. Sigue abierto y sin fusionar a la espera de que el usuario vea la vista previa.

## Ronda 13 · Dos plantillas más con las aperturas nuevas en vídeo (15/11/2026)

El usuario pidió un par de plantillas más con los recursos ya generados, además de las tres de
Instagram (Arcilla, Buganvilla y Olivar).

- **La apertura «película» ya no es solo un sobre**: `theme.film` suma `caja` (caja marfil con lazo
  burdeos que se desata) y `diptico` (tarjeta de dos hojas con lacre dorado que se abre como
  puertas). Son vídeos de Seedance 2.5 hechos como los sobres (`docs/higgsfield/PEDIDO-COMPLETO.md`)
  y acaban en el mismo destello, así que solo cambian sus tiempos (`TIMING`) y lo que se le pide al
  invitado (`FILMS[…].action` y `.name`: «Toca el lazo para abrir la caja»).
- **Portada «Terciopelo»** (`terciopelo`, oscura): terciopelo verde con marco dorado art déco. Es la
  imagen «esmeralda» de la ronda 11; se llama distinto porque ya hay un estilo y una plantilla
  «Esmeralda».
- **Plantilla «Terciopelo»** (gala): portada Terciopelo, polvo de oro y la caja con lazo. Boda de
  ejemplo: Irene y Tomás, Aranjuez.
- **Plantilla «Orilla»** (mar): portada Orilla y el díptico. Boda de ejemplo: Paula y Jaime, Vejer
  de la Frontera. Se descartó ponerle el sobre azul: su lacre no se parte bien.
- **Fotos**: no hay retratos propios de estas dos parejas, así que se reutilizan los de otras
  bodas de ejemplo (decisión del usuario): Orilla usa los de Buganvilla, que son de costa, y
  Terciopelo los de María y Daniel. Las fotos de los sitios sí son distintas (iglesia, banquete,
  cortijo y pista de baile de la ronda 11, en `public/fotos/orilla/` y `public/fotos/terciopelo/`).
  Si se quieren parejas distintas, basta cambiar el mapa `PHOTOS` de `variants.ts`.

- **Las tres de Instagram se distinguían poco después del sobre** (el usuario lo notó): Arcilla,
  Buganvilla y Olivar usaban Terracota, Mediterráneo y Botánico, tres tintes casi iguales de crema, y
  la composición de la carta (marco, borde, adorno) solo cambia la pantalla de la carta. Lo que se
  ve al bajar por la invitación sale del estilo de color, la letra y el calendario. Ahora cada una
  tiene el suyo, como Terciopelo y Orilla:
  - **Arcilla** → estilo nuevo `arcilla` (oscuro: marrón de arcilla cocida, letras en cobre y
    marfil), letra orgánica, calendario de taco.
  - **Olivar** → estilo nuevo `olivar` (verde salvia con tinta verde oscuro), letra clásica
    (garalda; antes romántica, igual que Orilla), calendario a mano.
  - **Buganvilla** → estilo nuevo `cal` (blanco de cal, tinta de ciruela y fucsia), calendario
    mínimo (antes a mano, igual que Olivar) y lacre rosa para el acento.
    Los tres estilos nuevos pasan la misma prueba de contraste (AA) que los demás y aparecen también
    en el editor, en la paleta. Las imágenes de `/ejemplos` de estas tres plantillas se volvieron a
    sacar.

- **Ajustes pedidos tras ver las cinco plantillas** (15/11):
  - **Modo de grabación sin vestimenta ni datos de pago**: con `?grabar=1`, `forRecording`
    (`src/lib/recording.ts`) vacía el dress code (título, detalle, colores y figuras) y el Bizum y la
    cuenta; las secciones vacías no se pintan (`PracticalSection` comprueba que haya vestimenta).
    «Antes de venir» se queda con el tiempo y «Dónde dormir». Sin `grabar`, la demo los sigue
    enseñando, porque son parte del producto. Las invitaciones reales nunca pasan por ahí.
  - **Regalos y notas de una en una en el móvil**: las tarjetas ocupan todo el ancho del pase
    (`max-sm:w-full`, separación de 1,5 rem para que no asome la siguiente) y los regalos llevan
    las flechas «Regalo anterior/siguiente» y el contador de `RailControls`, como las notas.
  - **Fotos nuevas en toda la demo**: las de María y Daniel eran de 533 px y se veían granulosas
    (y la «portada» ni era una pareja). La demo por defecto (`demoEvent`, que usan Arcilla y las
    trece plantillas sin variante, y el móvil de la página de ventas) pasa a las del juego de Olivar,
    con la historia reescrita para casar con ellas (el primer paseo entre olivos, la terraza, la
    pedida, el atardecer). Terciopelo usa el de Buganvilla y Orilla ya usaba el suyo. Las cuatro
    fotos de sitios (iglesia, cortijo, banquete y pista) están en `public/fotos/lugares/` a 1280 px,
    sacadas de originales de 2496 px; se borraron `public/fotos/orilla/` y `terciopelo/`. Los
    retratos nuevos son de 720 px: más nítidos que los antiguos, pero no para pantallas grandes. Las
    fotos antiguas de `public/fotos/` (`pareja.jpg`, `historia-*.jpg`…) ya no se usan y se pueden
    borrar; `scripts/depth-map.py` las cita solo como ejemplo.

## Ronda 11 · Recursos con Higgsfield (11–13/11/2026)

- **Sobre de película en una sola toma** (vertical, 10 s, sin imagen doble ni corte) y **color
  del sobre** (`theme.film`: blanco, salvia, burdeos), cada uno un vídeo en
  `public/aperturas/sobre-dorado/`. Un sobre azul empolvado se descartó: el lacre se deslizaba
  bajo la solapa en vez de partirse.
- **Cinco portadas pintadas** (`PAINTED_COVERS` en `src/lib/theme/cover.ts`): las claras llevan
  los nombres en tinta y un halo del color del papel.
- **Efectos sobre la portada** (`theme.coverEffect`: pétalos y polvo de oro): bucles de 4 s con
  `mix-blend-mode: screen`; no se pintan con movimiento reducido.
- **Plantillas Arcilla, Olivar, Noche dorada y Buganvilla**.
- Modelos, textos y trucos: `docs/HIGGSFIELD.md`.

## Ronda 10 · Más cine y más papelería de lujo

Plan visual a partir del análisis de reels de invitaciones premium (fuera quedan las ideas solo
para promoción, ver «Para más adelante»).

- **Sobre**: el lacre «respira» mientras espera, se hunde al tocarlo y la carta aparece como si
  se escribiera (recorte que avanza); el botón dice «Descubrir la invitación».
- **Estilo y plantilla «Cine»** (portada `cine`): fundido desde negro, la foto en sepia a cámara
  lenta, bandas negras, grano y un destello de luz. Los nombres entran letra a letra como créditos
  (GSAP con SplitText, que solo se descarga en esta portada; el texto accesible es una copia
  oculta, no la versión partida). En esta plantilla la invitación se desliza con inercia (Lenis);
  con movimiento reducido no se activa.
- **Plantilla «Herbario»** (portada `herbario`; «jardin» ya existía): ramas de olivo y eucalipto
  en oro sobre verde botella y un marco doble que se trazan solos. La geometría (curvas y hojas)
  está en `src/lib/botanical.ts`; el dibujo es CSS (`stroke-dashoffset` con `pathLength=1`), sin
  librerías. Con movimiento reducido se ve ya dibujado.
- **XV años**: nuevo tipo de evento (`quince`), de un solo nombre. No necesita SQL: el tipo va
  dentro del contenido del evento.
- **Dress code de revista**: cada sugerencia lleva un figurín dibujado (vestido, traje, niños o
  percha), teñido con un color de la paleta de la pareja (`dress-figures.tsx`).
- **Programa**: además del hilo que crece con el scroll, cada parada se enciende en oro al llegar
  a media pantalla (`program-dot`, CSS nativo; donde no hay animaciones por scroll queda quieto).
- **Pase de fotos** del álbum (`/album/<token>`, botón «Ver el pase de fotos»): pantalla
  completa, fundido entre fotos y zoom lento distinto en cada una (`src/lib/slideshow.ts`), fondo
  desenfocado para fotos verticales, pausa, flechas del teclado y Escape. Sirve para proyectarlo
  en la fiesta. Solo se descarga al abrirlo.
- **Apertura «Sobre de película»** (`pelicula`): vídeo real de 6 s generado con Higgsfield
  (Minimax Hailuo, 6 créditos) a partir de dos fotos del usuario: sobre cerrado y el mismo con la
  tarjeta fuera y el lacre partido (retocado aquí). Antes se probó Seedance 1.5 (9,6 créditos),
  que rajaba el sobre. Un destello dorado al romperse el lacre tapa el instante en que el vídeo
  duplica el sello; al acabar, los nombres y la fecha se escriben sobre la tarjeta, inclinados
  como ella, y se pasa a la carta. WebM (VP9) primero y MP4 de respaldo, en
  `public/aperturas/sobre-video/`. Una primera versión con cuatro fotos fijas no gustó y se quitó.
- **Sobre de película, versión 2** (mismo id `pelicula`): siguiendo el guion del usuario, imagen
  final 2K con `nano_banana_pro` (tarjeta en blanco flotando entre pétalos, 2 créditos), vídeo de
  10 s con Kling 3.0 (12,5), primer plano del lacre (imagen 2K + Hailuo 2.3, 8) y montaje aquí con
  ffmpeg: zoom que cae en el lacre y enlaza con el primer plano, y destello de luz hacia el sobre
  abierto. El texto de la tarjeta (saludo, mensaje y botón) se pega a sus cuatro esquinas con una
  transformación proyectiva (`src/lib/quad.ts`, `matrix3d`). Gasto total de la sesión: 38,1
  créditos. Guía para repetirlo: `.claude/skills/apertura-en-video`.
- **Aperturas hechas con código, más reales** (mesa y pantalla): el lacre se raja con un destello,
  las dos mitades aguantan un instante y caen con su peso girando, con migas que saltan en arco
  (`envelope/seal-break.tsx`, común a ambos sobres). La solapa se curva al levantarse y el forro
  sale de la sombra poco a poco. Al irse el sobre, la carta pasa por delante del bolsillo (mesa) o
  el bolsillo cae entero por abajo (pantalla): antes se transparentaba encima. La carta grande se
  «imprime» con animaciones CSS, que empiezan al montarse; las de Motion esperaban a que acabase
  el relevo y la carta salía en blanco medio segundo. El fundido de la carta a la invitación es
  más corto y escalonado para que no se vean textos dobles.
- **Apertura «Sobre en 3D»** (`sobre3d`): el sobre del tema (papel, forma de la solapa, forro y
  lacre con su marca) dibujado con three.js, con luz, reflejos y sombras reales. La solapa es una
  malla que se curva al levantarse (la punta se queda atrás y vuelve plana), el lacre tiene volumen
  y se parte por una grieta en zigzag en dos mitades que caen con peso y rozamiento, y la luz sigue
  la inclinación del móvil, así que el brillo recorre la cera y el oro. Texturas de papel de
  ambientCG (Paper002, licencia CC0) en `public/texturas/` (230 KB). Cálculos sin React en
  `src/lib/envelope-3d.ts`, con pruebas. La escena solo se descarga para esta apertura, mientras el
  invitado ve la portada. Al final, una carta de papel de la página releva a la carta 3D en su mismo
  sitio y se transforma en la carta grande. Sin WebGL, con movimiento reducido o si la escena falla
  (p. ej., no llegan las texturas), se usa el sobre en la mesa.
  - Sombras: las del sobre sobre el fondo y la del borde de la solapa son manchas suaves pintadas
    (un mapa de sombras daba bordes duros); el papel proyecta sombra por las dos caras
    (`shadowSide`), sin lo que las láminas no daban sombra.
- **Apertura «Sobre junto a la ventana»** (`ventana`, prototipo para comparar): 40 fotogramas
  renderizados en Blender (Cycles) con papel de algodón, mantel de lino, forro rayado en oro y sol
  de ventana con sombra de ramas (texturas de ambientCG, CC0). Se abre con el dedo: al deslizar
  hacia arriba se rompe el lacre y el recorrido del dedo lleva la solapa y la tarjeta (si se suelta
  pronto, vuelve); con un toque se abre sola. El lacre del tema y el texto de la tarjeta van encima
  de la foto: el texto sigue las cuatro esquinas de la tarjeta en cada fotograma (`quadToMatrix3d`)
  y se mezcla en «multiplicar», así la sombra de las ramas también lo oscurece. La tarjeta final se
  transforma en la carta grande con una copia recortada del último fotograma. 600 KB de WebP en
  `public/aperturas/sobre-ventana/`; guion de Blender en `.claude/skills/apertura-en-video/`.
  Criterios de luz y color de Blender Expert Skills (edemaistre): «Khronos PBR Neutral» en vez de
  AgX (el marfil salía gris), separar el sobre del fondo oscureciendo la mesa y 3 rebotes. Limitación:
  el color del sobre y del forro va en la foto (no cambia con el tema); para otros colores hay que
  renderizar otra secuencia.
- **Sobre de película, versión 3** (mismo id `pelicula`): dos vídeos nuevos del usuario hechos con
  Higgsfield (sobre blanco, lacre dorado con un árbol, paniculata y luz de ventana; 8 s), uno
  vertical para el móvil y otro horizontal para pantallas anchas (se elige con
  `min-aspect-ratio: 1/1`). Traen su propio sonido (ambiente, golpe del lacre a los 2,5 s, papel y
  brillo), que respeta el botón de silencio; la vibración va con el golpe. Ya no se pega texto a
  una tarjeta del vídeo: en el destello final (7,1 s) el papel llena la pantalla y entra la carta
  de la invitación. MP4 (H.264 + AAC) y WebM (VP9 + Opus) en `public/aperturas/sobre-dorado/`
  (0,7 a 1,6 MB). Los vídeos de la versión 2 se borraron con el permiso del usuario. Se ofrece como
  apertura «Premium» (marca `premium` en `OPENINGS`, visible en el editor y en los ejemplos); las
  demás aperturas siguen disponibles.
- **Sobre de película, versión 4** (solo el encuadre vertical, de momento): el vídeo de la
  versión 3 tenía una imagen doble al pasar al primer plano del lacre (2,7 s), el lacre saltaba
  entero y flotaba, y a los 4,6 s cortaba a otra escena con el sobre ya abierto. Se regeneró en
  una sola toma continua de 10 s con Seedance 2.5 a 720p, partiendo del primer fotograma del vídeo
  anterior (mismo sobre, lacre y luz), con la prueba ilimitada de Higgsfield (0 créditos; solo
  funciona desde el chat de Claude, no desde Claude Code, y cubre hasta 720p). El lacre se parte
  y sus trozos se quedan en el sobre, la solapa se levanta entera y se ve el forro de olivo. Fallo
  menor: un trozo pequeño de lacre sube pegado a la solapa. Ampliado aquí a 900 × 1600 con
  ffmpeg. Los tiempos de la vibración y del destello van ahora por encuadre (`TIMING`): vertical
  2,2 s y 8,9 s; el horizontal sigue con el vídeo de la versión 3 (2,5 s y 7,1 s).
- **Portadas pintadas y efectos** (ronda 11): cinco fondos nuevos (`ramas`, `buganvilla`,
  `medianoche`, `arcilla`, `orilla`) generados con Seedream 5.0 Pro a 2K con la prueba ilimitada
  de Higgsfield (0 créditos), con el centro despejado para los nombres; van en
  `public/portadas/` a 1080 px. Los claros llevan los nombres en tinta y un halo del color del
  papel, sin el velo oscuro (`PAINTED_COVERS` en `src/lib/theme/cover.ts`). Campo nuevo del tema,
  `coverEffect` (`ninguno`, `petalos`, `oro`): un bucle de 4 s (Seedance 2.5, 720p) sobre negro
  que se suma con `mix-blend-mode: screen`; solo luce en fondos oscuros y no se pinta con
  movimiento reducido. Para que repita sin salto, el último segundo se funde con el primero
  (ffmpeg `xfade`) y los negros se aplastan con `curves`. Un tercer bucle, de luciérnagas, se
  descartó: salían insectos. En la demo: `?portada=medianoche&efecto=oro`.
- **Sobre de película en colores y tres plantillas para enseñar** (ronda 11): campo nuevo del
  tema, `film` (`blanco`, `salvia`, `burdeos`): cada color es un vídeo propio, generado como el
  blanco a partir de su primer fotograma recoloreado (GPT Image 2.5 + Seedance 2.5, 0 créditos
  con la prueba). Solo tienen encuadre vertical; en pantallas anchas se recorta. El azul con
  lacre plateado se descartó: el lacre no se parte, se desliza bajo la solapa. Plantillas nuevas
  que juntan portada, efecto y sobre: «Arcilla» (portada arcilla, pétalos, sobre burdeos),
  «Olivar» (ramas de olivo, sobre salvia), «Noche dorada» (medianoche, polvo de oro, sobre 3D)
  y «Buganvilla» (pared encalada y el sobre blanco de una sola toma).
  En las portadas pintadas en claro, los botones de arriba («Saltar intro», sonido) van en tinta.
- **Del sobre sale la carta completa** (petición del usuario): en las aperturas mesa y pantalla,
  la tarjeta del sobre ya no es una tarjetita con nombres y fecha. Es la misma carta de la
  invitación (saludo, mensaje, nombres, fecha y botón, con la composición y el borde del tema)
  maquetada al ancho de la carta grande y reducida entera (`LetterMiniature`), así que al crecer
  no cambia nada de sitio y la carta grande no se vuelve a «escribir» (`printed`). La carta es más
  alta que el sobre: lo que sobresale por abajo se recorta mientras está dentro
  (`data-letter-clip`) y se libera cuando el sobre se va. `LetterPaper` es el papel de la carta,
  compartido por la pantalla de la carta y la miniatura (ésta, decorativa: sin título ni botón).
  Un primer intento quitó la carta intermedia y llevó directo al contenido; no era lo pedido y se
  deshizo.
  - Después, en todas las aperturas: díptico y caja (se adaptan al alto de la carta), película (la
    carta sale del destello dorado al final del vídeo), sobre 3D (la carta 3D es vertical, con la
    proporción medida en la de papel; se dibuja en un lienzo y un plano de recorte que sigue al
    borde del sobre la oculta por debajo mientras está dentro) y sobre junto a la ventana
    (secuencia de Blender rehecha con sobre y tarjeta verticales; la carta se imprime entera sobre
    la tarjeta, solo la tinta: `LetterPaper bare`). La carta grande ya no se vuelve a escribir en
    ninguna apertura.
- **Dependencias nuevas**: `gsap` 3.13 (gratuita, incluidos sus plugins) y `lenis` 1.3.

### Para más adelante

- **Vídeo promocional para Instagram** (del mismo análisis): un generador de reels con Remotion
  que grabe la apertura del sobre y la portada de cada plantilla. Es para promoción, no para la
  app; se hará cuando el usuario lo pida.

## Ronda 9 · Lo que facilita los meses antes y el día después

- **Imprimir** (`/panel/<evento>/imprimir`, lógica en `src/lib/print.ts`): tarjetas de mesa para
  doblar, «Busca tu mesa» (alfabético, avisa de quién no tiene mesa), carteles del álbum con QR
  por mesa, hoja del catering (menús por mesa y alergias con nombre, solo confirmados) y
  canciones para el DJ sin repetir (copiar o CSV). Al imprimir solo sale el documento elegido
  (`.print-area`).
- **Después de la boda** (`isAfterEvent`, desde las 06:00 del día siguiente; demo `?dia=despues`):
  la invitación da las gracias (`thankYouMessage`, opcional) y lleva al álbum; deja de pedir
  confirmación. El panel descarga las fotos aprobadas en un zip montado en el navegador
  (`fflate`, sin recomprimir).
- **Duplicar evento** («Mis eventos»): copia contenido y diseño, sin invitados, y las fotos a la
  carpeta del nuevo (`rewriteMediaRefs` + `storage.copy`), para que borrar o limpiar el
  original no deje la copia sin ellas.
- **Aperturas** (migración `aperturas_invitacion`: `opened_at`, `last_opened_at` y
  `mark_invitation_opened`, como mucho una escritura por minuto y token): lo apunta el
  navegador del invitado una vez por sesión, nunca el servidor, para que las vistas previas de
  WhatsApp no cuenten. El panel lee la columna aparte y tolera que no exista.
- **Tiempo habitual** (`src/lib/weather.ts`): media de los últimos diez años ±3 días con
  Open-Meteo (sin cuenta), calculada desde el editor y guardada en `content.climate`. No se
  consulta al abrir la invitación: el servicio tiene un límite diario por IP.
- **Tipos de evento** (`src/lib/event-kind.ts`, `content.kind`; sin tipo, boda): boda, bautizo,
  primera comunión, cumpleaños y aniversario. Bautizo, comunión y cumpleaños admiten un solo
  nombre (el `refine` del esquema pide dos en bodas y aniversarios). Las frases (portada,
  calendario, pase, WhatsApp, recordatorio, save the date, agradecimiento, álbum) salen de ahí;
  las que no dependen del tipo dicen «el gran día».
- **Velocidad** (móvil con 4G lenta y CPU ×4): la portada de venta carga la invitación de
  ejemplo solo al tocar el móvil (2,1 MB → 0,9 MB); la invitación ya no carga Zod al abrir
  (esquemas del tema en `lib/theme/schema.ts`, caché de la respuesta en
  `lib/data/rsvp-cache.ts`): 889 → 776 KB de JavaScript, contenido principal en ~1,2 s.

## Ronda 8 · Regalos, limpieza de fotos y página de venta

- **Borrar un evento borra sus archivos** (`src/lib/data/event-files.ts`): antes de borrar el
  evento se vacían sus carpetas de `event-media` y `guest-photos`, de cien en cien. Primero se
  comprueba que quien borra es propietario (después ya no sería miembro y el almacenamiento no le
  dejaría). El almacenamiento exige permiso de lectura para borrar, así que los miembros ven ya
  los archivos de su evento; sin ese permiso, quitar una foto del álbum dejaba el archivo.
- **Lista de regalos**: los regalos van en el contenido (`gift.items`, opcional para el
  contenido de antes) y las reservas en `gift_claims`. Los invitados reservan con
  `gift_claim(token, regalo, reservar)`; un regalo normal es de una sola invitación (bloqueo
  `pg_advisory_xact_lock` mientras se comprueba) y uno compartido admite a varias. Deshacer no
  borra la fila: la marca con `released_at` (queda registro y no hace falta borrar). Los
  invitados ven cuántas reservas hay, nunca quién; el panel (`/panel/<evento>/regalos`) sí.
  Máximo de 10 reservas vigentes por invitación. En la demo, las reservas propias se guardan
  en el navegador.
- **Página de venta** (`/`): un móvil con una invitación de ejemplo real (iframe escalado), lo
  que vive el invitado (numerado, porque es una secuencia), lo que tiene la pareja, el precio
  (`PRICE_EUR` en `src/lib/sales/contact.ts`, 129 €), preguntas con `details` y un formulario.
  Sin cobro automático: la pareja deja sus datos y se le escribe. La demo pasa a `/ejemplos`.
- **Solicitudes** (`contact_requests`): solo se crean con `request_contact`, que limita a 3 por
  correo y 200 al día. Nadie las lee desde la API (sin políticas): se consultan en el panel de
  Supabase (Table Editor → `contact_requests`). Campo trampa contra robots en el formulario.

### Después de probarlo en un iPhone

- **Crear un evento real fallaba** (desde la ronda 5): la inserción pedía el evento de vuelta,
  pero quien lo crea pasa a ser miembro en un disparador posterior y la RLS rechazaba la lectura
  y con ella toda la inserción. El id se genera ahora en el servidor y no se pide de vuelta. La
  prueba real (`tests/e2e/real.spec.ts`) lo habría visto, pero no se ejecutaba nunca: ahora hay
  una tarea de GitHub Actions (`prueba-real.yml`) que se lanza a mano con los secretos del
  usuario de prueba.
- **Vista previa del editor**: si el iframe se recargaba (el móvil puede descartarlo), volvía a
  la portada con lo último guardado y no recibía más cambios, porque el aviso de «lista» solo se
  atendía una vez. Ahora cada aviso reenvía borrador y pantalla. Con campos por revisar, la
  vista previa dice que está en pausa.
- **Vídeos del iPhone**: la portada admite `.mov` (`video/quicktime`) además de MP4 y WebM. Si un
  navegador no lo reproduce, se ve la foto de portada (`poster`). Sin vídeo subido, el editor
  avisa de que se ve la foto.
- **Ejemplos**: enlaces directos a cada apertura, portada y momento (las invitaciones de ejemplo
  abren siempre con el sobre en la mesa y la foto).
- **Fotos sustituidas**: al publicar se borran los archivos de `event-media` que ni el borrador
  ni lo publicado nombran y que tienen más de una hora (`removeUnusedEventFiles`). Si falla, la
  publicación sigue.
- **Venta lista para el público**, todo por variables de entorno de Vercel (cambiar exige volver
  a desplegar): `LEGAL_TITULAR`, `LEGAL_NIF`, `LEGAL_DOMICILIO` y `LEGAL_EMAIL` para el aviso legal
  y la privacidad (mientras falten se marcan como pendientes; son datos reales, nunca van al
  repositorio); `SITE_URL` (dominio propio) para indexar la portada, los ejemplos y los textos
  legales (sin él, `robots.txt` lo prohíbe todo; Vercel ya marca las vistas previas como no
  indexables); `SIGNUP_OPEN=false` para ocultar «Crear cuenta» (cerrar el alta de verdad se hace
  en Supabase → Authentication → Sign In / Providers → «Allow new users to sign up»).

## Ronda 7 · Aperturas, portadas animadas y extras

- **Aperturas** (`theme.opening`): sobre en la mesa, sobre a pantalla completa (como los anuncios
  de referencia: el móvil entero es el sobre y se toca el lacre), díptico y caja con lazo. Todas
  reciben las mismas props, comparten la guarda de `use-opening.ts` (una sola apertura aunque se
  toque varias veces) y acaban en el mismo relevo `ViewTransition name="carta"`. El botón de cada
  apertura es una capa vacía sobre el dibujo: así su nombre accesible no compite con los textos
  de la carta (axe lo marcaba de forma intermitente).
- **Portadas** (`theme.cover`): foto en 3D, luces y mariposas, acuarela floral, cielo estrellado o
  vídeo propio. Las escenas son SVG y CSS propios (sin lienzos ni recursos de terceros), con
  posiciones deterministas (`seeded`) y cada una en su trozo de JavaScript. Con movimiento
  reducido se quedan quietas.
- **Música** (`theme.musicStyle`): piano, caja de música, guitarra y cuerdas generados con Web
  Audio, o una canción propia que pasa por el mismo volumen de Web Audio para tener fundidos
  también en iOS. El editor avisa de los derechos de la canción.
- **Almacenamiento**: el bucket del evento admite vídeo (MP4, WebM) y audio (MP3, M4A) hasta
  30 MB; las fotos siguen reduciéndose en el navegador.
- **Save the date** (`events.phase`): primero se publica un aviso con la fecha y el calendario y
  después la invitación completa, con el mismo enlace. `submit_rsvp` rechaza respuestas en esa
  fase; el botón del editor mantiene la fase publicada.
- **Álbum de los invitados**: un token de álbum por evento (el QR de las mesas no puede llevar el
  token de cada invitación). Los invitados piden un hueco de subida de un solo uso y 10 minutos
  (`album_upload_slot`), suben la foto ya reducida al bucket `guest-photos` (la política solo
  deja escribir en un hueco vigente) y la confirman (`album_confirm`). Las fotos quedan
  pendientes hasta que la pareja las aprueba en el panel; el álbum solo lista las aprobadas. El
  bucket es público por URL, pero las rutas llevan un uuid imposible de adivinar y no se pueden
  listar. Los huecos no se borran (sirven de registro y para el límite de 300 al día).
- **Dress code**: muestras de color con nombre y sugerencias por persona con pictograma
  (`dressKind`).

## Ronda 6 · Personalización premium

- **Plantillas y ajuste fino.** Ocho plantillas completas (`TEMPLATES` en `src/lib/theme`) como
  punto de partida; cada detalle se cambia después por separado. Aplicar una plantilla conserva
  las secciones ocultas, su orden y la música. El editor reconoce si el tema sigue siendo una
  plantilla o ya está personalizado (`templateOf`).
- **Color libre con red de seguridad.** Ocho paletas cerradas (revisadas con la prueba de
  contraste) y un color propio para el lacre. El acento de los textos sale de ese color y
  `readableOn` lo intensifica lo justo hasta el contraste AA sobre el papel elegido. Así el cliente
  tiene libertad, pero no puede dejar un texto ilegible.
- **Tipografías.** Ocho pares con licencia OFL vía `next/font`, todos sin precarga: `@font-face`
  solo descarga la letra que usa la invitación. Las caligráficas (Pinyon Script, Great Vibes) se
  usan solo en los nombres (`--font-names`, utilidad `font-names`), donde se leen bien.
- **Sobre a medida.** Forma de la solapa, gramaje (canto, sombra y ritmo de la apertura),
  textura, forro y lacre (forma y grabado). La geometría y los fondos son funciones puras en
  `src/lib/theme/envelope.ts` (`flapGeometry`, `linerBackground`, `sealOutline`) con pruebas. Con
  solapas que no son en pico, el bolsillo sube hasta el borde de la solapa para que no asome la
  carta. El canto se dibuja con una copia desplazada de la solapa, no con `filter`, para que la
  animación siga siendo solo de `transform`.
- **Carta.** Cinco composiciones, tres bordes y cinco ornamentos (`src/lib/theme/letter.ts`). Sin
  foto de la pareja, la composición «con foto» cae a la clásica.
- **Calendarios y secciones.** Seis calendarios (taco, minimal, a pluma, corazón, semana y
  cartel) y orden de las secciones elegido en el editor (`order`, normalizado con
  `normalizeOrder` para que una sección nueva aparezca aunque el orden se guardara antes).
- **Compatibilidad.** Todo vive en `events.theme` (jsonb), sin migración. Cada campo nuevo tiene
  un valor por defecto que reproduce el aspecto anterior; los temas «Clásico» guardados antes
  conservan su garalda.
- **Editor.** La pestaña Estilo se divide en apartados; al abrir Sobre, Carta o Calendario, la
  vista previa salta a esa pantalla.

## Ronda 5 · De prototipo a producto

**Backend con Supabase** (proyecto `invitaciones`, París).

- Esquema versionado en `supabase/migrations/`:
  - eventos con borrador (`content`, `theme`) y versión publicada (`published_*`);
  - miembros (`owner` y `editor`);
  - invitaciones (grupos) con token aleatorio de 22 caracteres;
  - personas, respuestas, mesas, tareas, partidas de presupuesto;
  - invitaciones para organizar;
  - el _bucket_ `event-media`.
- **RLS en todas las tablas:** cada miembro ve y cambia solo sus eventos.
- **Los invitados no leen tablas.** Usan dos funciones `security definer` con su token:
  - `get_invitation` devuelve solo lo publicado de su evento y su propio grupo;
  - `submit_rsvp` comprueba el token, el estado publicado y el plazo.
- Las funciones auxiliares van en el esquema `private`, que no se expone en la API.
- Los avisos de seguridad de Supabase solo señalan las funciones públicas intencionadas.
- **Dos fuentes de datos** en `src/lib/data/repository.ts`: la demo en memoria (`/panel/demo`, `/editor/demo` y las invitaciones de ejemplo) o Supabase. Sin variables de entorno, todo sigue funcionando en modo demostración; así las E2E no necesitan red.
- **Acceso:** email y contraseña. `src/proxy.ts` (el _middleware_ de Next 16) renueva la sesión y manda a `/entrar` a quien no la tiene. La autorización real la hace RLS.

**Temas** (`src/lib/theme`).

- **Lista cerrada de opciones:** estilo (Mediterráneo, Clásico, Noche), sobre (olivo, lino, kraft), lacre (4 colores), calendario (taco o minimal), secciones ocultas y música.
- **Por qué cerrada y no colores libres:** una prueba unitaria garantiza contraste AA en todas las combinaciones.
- Se aplica sobrescribiendo las variables CSS de `globals.css` en la raíz de la invitación.
- En los estilos oscuros, el acento del texto se aclara a partir del color del lacre.

**Editor.**

- **Vista previa en un iframe** (`/editor/[evento]/vista`): la invitación usa pantallas `position: fixed` que taparían el editor. El iframe le da su propia ventana y se reutilizan los mismos componentes.
- **Cómo llega el borrador:** por `postMessage`, solo desde el mismo origen. La vista lo vuelve a validar con Zod.
- **Validación:** los mismos esquemas que la invitación, con mensajes en español por campo.
- **Guardado:** automático del borrador (1,5 s); «Publicar» copia el borrador a la versión publicada.
- **Fotos:**
  - se reducen a 2000 px en WebP en el navegador, que al recodificar elimina el EXIF y el GPS;
  - suben a Storage;
  - la portada genera un mapa de profundidad aproximado para el efecto 3D.
- **Fechas:** en ISO con el desfase de Madrid de cada día (horario de verano).

**Invitaciones, mesas y recordatorios.**

- **Alta y edición por grupo.** Las personas se actualizan por id para no perder respuestas.
- **Importación CSV** con coma o punto y coma, y vista previa con errores por línea.
- **Envío:**
  - por WhatsApp con `wa.me` (sin API de empresa), con el texto ya escrito y el teléfono si lo hay;
  - con QR generado en local (`uqr`).
- **Mesas por invitación**, no por persona:
  - la familia se sienta junta;
  - cuentan los acompañantes que añade el invitado (no tienen fila propia);
  - un _trigger_ impide usar una mesa de otro evento.
- **Plano:** las mesas se arrastran con eventos de puntero, sin librerías, y siempre hay alternativa con teclado (flechas y desplegables).

**Organización.**

- **Tareas:** con las 14 sugeridas, calculadas hacia atrás desde la boda.
- **Presupuesto:** estimado, pagado, pendiente y coste por invitado confirmado.
- **Agenda:** junta tareas, pagos, el plazo y la boda.
- **Ajustes:**
  - enlaces de un solo uso (7 días) para unirse a la organización, con `accept_event_invite`;
  - los miembros y su email los devuelve `event_member_list`, solo a miembros del mismo evento;
  - borrar el evento exige escribir los nombres de la pareja.

## Ronda 2 · Dirección de arte y calidad (skills de referencia)

La segunda ronda se ha guiado por cuatro skills públicas, que se leyeron completas antes de aplicarlas:

- **Frontend Design**, de Anthropic (Apache-2.0)
- **Web Interface Guidelines** y **React Best Practices**, de Vercel (MIT)
- La documentación y los ejemplos de **Motion** (MIT)

No se ha copiado código de ninguna de ellas.

### Plan de diseño

| Eje         | Decisión                                                                                                                                                                                                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Concepto    | Papelería de una boda entre almendros. El motivo son las ramas con almendras verdes de mayo y la flor de almendro.                                                                                                                                                                           |
| Color       | Marfil hueso `#efebe1`, papel `#faf8f3`, tinta de olivo `#23271e`, oro viejo `#a3874e`, lacre burdeos `#6b1e2a`                                                                                                                                                                              |
| Tipografía  | **Bodoni Moda** (didona con eje de tamaño óptico) para los nombres y titulares, y **Jost** (geométrica de la línea Futura) para la interfaz. Es la pareja clásica de la papelería y las revistas de lujo, y sustituye a Cormorant + Manrope, la combinación por defecto de las webs de boda. |
| Maquetación | Editorial y alineada a la izquierda. En escritorio, el título de cada sección va en una columna de margen. Los nombres de la portada son el único elemento grande.                                                                                                                           |
| Movimiento  | Un solo momento coreografiado: la apertura del sobre. El resto del movimiento responde a acciones del invitado (cambio de paso, confirmación).                                                                                                                                               |

### Cambios aplicados al revisar contra los «tics» de plantilla

- Se eliminan las etiquetas en mayúsculas espaciadas sobre cada título, las cadenas «A · B · C», los separadores ornamentales bajo cada título y la palabra destacada en cursiva.
- Se eliminan las apariciones con fundido y desplazamiento en cada sección.
- Las tarjetas idénticas se sustituyen por listas con filetes. En el panel, las métricas van en una sola banda y solo los datos interactivos están en superficies de papel.
- El lacre pasa de terracota a burdeos con monograma en oro, y el forro del sobre es de tinta de olivo con raya dorada.
- El emblema geométrico genérico se sustituye por un monograma propio.
- La cuenta atrás de números grandes se sustituye por una frase («Faltan 214 días.»).
- Las fechas se forman con `Intl` en la zona horaria del evento («sábado, 22 de mayo de 2027»). Ya no existe una cadena de fecha escrita a mano.
- El mapa decorativo de cada lugar se sustituye por un único plano ilustrado que sí informa del trayecto iglesia → finca.

### Interfaz y accesibilidad (Web Interface Guidelines)

- Los botones de avance del RSVP nombran su destino («Siguiente: transporte», «Revisar respuesta»).
- Aviso `beforeunload` si se abandona una respuesta a medias.
- Los campos llevan `name`, `autocomplete="off"`, `spellCheck` y marcadores de posición con ejemplo terminados en «…».
- Los filtros de la lista de invitados se guardan en la URL (`?q=&estado=&grupo=&agrupar=`).
- Enlace «Saltar al contenido» en el panel.
- `scroll-padding-top` para que las barras fijas no tapen el foco.
- `touch-action: manipulation`, `text-wrap: balance/pretty` y `translate="no"` en los nombres propios.
- Se elimina `transition-all`. Los bucles decorativos (flotación del sobre, indicación de gesto) se detienen tras unos ciclos y desaparecen con movimiento reducido.
- Las tablas desplazables son regiones enfocables, y los colores de vestimenta tienen nombre accesible.

### Rendimiento (React Best Practices y Motion)

- `LazyMotion` + `m` con `domAnimation` en lugar del paquete completo de Motion. El gesto de deslizar usa eventos de puntero nativos, para no depender de `domMax`.
- El contenido y el RSVP (con Zod) se cargan con `next/dynamic` y se precargan en cuanto el invitado empieza a abrir el sobre. Las utilidades de sesión van en un módulo sin Zod.
- `content-visibility: auto` en las filas de la lista de invitados (más de 150).
- **JS inicial de la invitación: de 238 KB a 203 KB comprimidos con gzip (−15 %).** El panel se mantiene en 141 KB.

### Para más adelante

- **React Three Fiber** (MIT): un sobre con volumen y reflejos reales es viable, pero añade unos 150 KB y obliga a ofrecer otra alternativa accesible. Conviene evaluarlo cuando el sobre CSS esté probado en iOS.

## Ronda 4 · Una invitación cinematográfica

- **Portada «foto 3D».**
  - El mapa de profundidad se genera una vez con MiDaS small (MIT) y `scripts/depth-map.py`. Como MiDaS confunde los cielos luminosos con objetos cercanos, el cielo se fija como lo más lejano.
  - Un shader OGL (Unlicense, ~30 KB, carga dinámica) aplica el paralaje por profundidad, el Ken Burns, el grano, la viñeta y un destello.
  - La foto con next/image sigue debajo: es el LCP y la alternativa sin WebGL o con movimiento reducido.
  - La apertura parte de negro y el título aparece letra a letra con `SplitText`, legible para lectores de pantalla.
- **Scroll.** Animaciones nativas (`animation-timeline: view()`), con `@supports` y solo sin «reducir movimiento»: fotos que se descubren, paralaje, titulares que suben e hilos dorados en la historia y el programa. No añaden JavaScript.
- **Historia.** `RollingYear` hace girar el año como un contador.
- **Calendario de taco.**
  - Las hojas de los meses que faltan se levantan cada vez más rápido (`pagesUntil`).
  - Hay una cuenta atrás de aeropuerto (`FlipCountdown`, `countdownParts`).
  - El 22 vuela hasta el botón de calendario.
- **Programa y mapa.**
  - Iconos con microanimaciones.
  - El camino se dibuja con una máscara y lo recorre un autobús con SMIL `animateMotion`, sin JavaScript por fotograma.
- **Música generativa** (`effects/ambient.ts`), hecha con Web Audio: piano y cuerdas sobre Fa maj7, La m7, Re m9 y Do maj7, con reverberación hecha con ruido. No hay archivos ni licencias. Entra al levantar la portada, sale al llegar al contenido y respeta el silencio.
- **Apertura corta** (`BriefStage`) al volver en la misma sesión: foto y nombres durante 1,9 s. Con movimiento reducido se va directo al contenido.
- **Al confirmar:** lluvia rápida de pétalos y una franja holográfica en el pase.
- **Sin GSAP ni Rive:** duplicarían peso o necesitan un editor de pago.
- **Peso de JavaScript** (gzip, medido en el navegador): invitación 226 KB, incluido OGL bajo demanda (antes 204). Presupuesto: 240 KB.

## Ronda 3 · Realismo y una invitación más completa

Skills nuevas en `.claude/skills` (copiadas literalmente, con su licencia): react-view-transitions,
composition-patterns y writing-guidelines (Vercel, MIT), y webapp-testing (Anthropic, Apache-2.0).

### Realismo de la apertura (versión CSS, la de la invitación)

- La portada sigue al dedo y sale con inercia. El paisaje está en cinco capas con paralaje, que
  responde también al giroscopio (en iOS el permiso se pide en el mismo toque que abre).
- Sobre: compresión al presionar; lacre partido en dos mitades más ocho migas de cera; solapa con
  sombra que depende del ángulo; carta que sale con fricción y una flexión mínima del papel.
- Continuidad sin cortes con `<ViewTransition name="carta">`: la carta del sobre se transforma en
  la tarjeta y esta en la cabecera. El contenido se precarga para no suspender en mitad de la
  transición.
- Materiales: papel con fibras, borde barbado, relieve _letterpress_ y oro con brillo que se mueve.
- Pétalos (12 SVG con CSS, una sola vez). Sonido sintetizado con Web Audio, sin archivos con
  licencia, con botón de silencio que se recuerda. Vibración corta en Android.
- Con movimiento reducido: fundidos, sin pétalos, sin arrastre obligatorio y sin giroscopio.

### Contenido nuevo

- Calendario de mayo con el 22 rodeado a mano, Google Calendar y `.ics`, antes de confirmar.
- Autobús sí/no sin ambigüedad: plazas por invitación, una línea clara en la confirmación, en el
  pase, en «Cómo llegar» y en el estado de «tu respuesta». En el panel: columna y filtro, totales
  sí/no/sin responder y CSV de pasajeros por ruta.
- Pase personal tras confirmar, con QR local (`uqr`, MIT, cargado bajo demanda), compartir e imprimir.
- Nuestra historia (cuatro momentos), regalo con IBAN de demostración y canción en el RSVP.
- Modo «día de la boda»: se activa solo el día del evento (hora de Madrid) o con
  `?dia=boda&hora=19:10`. Muestra el acto actual y el siguiente, los autobuses de vuelta y accesos
  directos.
- Pasos del RSVP y secciones del panel con `<ViewTransition>`.

### Laboratorio 3D (`/laboratorio/sobre-3d`)

- `three@0.186` y `@react-three/fiber@9.8` (MIT), sin `drei`. Geometría, texturas de papel y
  lacre generadas en un canvas: no hay recursos externos.
- Se carga solo en esa ruta con `next/dynamic` sin SSR. Sin WebGL o con movimiento reducido se
  muestra una alternativa que remite al sobre CSS. El lienzo es `aria-hidden` y se controla con un
  botón.
- Peso de JavaScript (gzip, medido en el navegador): invitación 204 KB (sin cambios); laboratorio
  454 KB. En Chromium sin GPU (renderizado por software) va a ~10 fps, lo que no es representativo:
  hay que medirlo en un móvil real.
- Recomendación provisional: mantener el sobre CSS en la invitación. Pesa 250 KB menos, funciona en
  cualquier navegador y la diferencia visual (luz y sombras reales) no compensa el coste en móviles
  modestos. Decide tras probar ambos en el iPhone.

### Fotos

Mientras no lleguen las fotos reales, los huecos llevan una ilustración del mismo formato
(`PhotoSlot`), así que la maquetación no cambiará al ponerlas.

## Aperturas rodadas como una película

- **Sobre en 3D, rehecho como una escena de cine** (`envelope/three/envelope-scene.tsx`): el
  sobre descansa en una mesa a contraluz, con la sombra de unas ramas que se mecen (una lámina
  de hojas invisible delante del sol). Al tocarlo, la cámara baja en grúa hasta el lacre; se
  parte a cámara lenta, las mitades saltan y resbalan por la mesa y las migas botan; la solapa
  se curva al abrirse y del sobre sale luz y chispas; la carta sale entera por la boca del sobre
  y sube hacia la cámara, que acaba mirando desde arriba con la mesa desenfocada.
- La cámara se describe con planos (a qué mira, distancia, altura y lado) y los recorre en un
  solo movimiento continuo (curva de Hermite: no frena al pasar por cada plano). Dura unos 7 s. La imagen pasa por un «objetivo» (`postprocessing`): profundidad de campo con el foco en
  lo que importa en cada plano, brillo, viñeta, curva de color y grano.
- El final no es un corte: la carta sube plana hasta el sitio, el tamaño y el giro exactos de la
  carta de la pantalla siguiente y, en el último tramo, esa pantalla (su fondo, su foco y su
  carta: `LETTER_SET`, `LETTER_SPOTLIGHT` y `letterFrame` de `letter-stage.tsx`) se funde encima
  de la escena. Al cambiar de pantalla ya no cambia nada a la vista.
- Todo va por tiempo, no por fotogramas. Si el equipo va justo en reposo se quita el desenfoque
  (lo más caro). Sin WebGL o con movimiento reducido se usa el sobre en la mesa, como antes.
- Para revisar la película plano a plano: `window.__cine = { t: 1.2, alta: true }` fija el
  instante y fuerza la calidad alta (así se sacan las capturas y el vídeo de la venta).
- **El díptico, en el mismo plató** (`object: "diptico"` en la escena y `Diptych3D`): cartón
  con la carta encima y dos hojas sujetas por su borde exterior, cerradas con el lacre. Cada
  mitad del lacre se queda pegada a su hoja y se va con ella, como en un díptico de verdad; las
  hojas se abren cuando la cámara ya ha retrocedido (si no, se le echan encima) y la luz es más
  suave para no borrar el texto. Sin 3D o con movimiento reducido, el díptico dibujado.
- **El sobre de película** termina igual que el 3D: el destello se funde con la pantalla de la
  carta (fondo, foco y carta en su sitio e inclinación) y el relevo no cambia nada a la vista.
- **Capa común para las aperturas dibujadas** (`envelope/cinema.tsx`, con GSAP): cámara que se
  acerca y acusa el golpe, foco, luz de dentro y polvo. De momento la usa el sobre en la mesa.
- Pendiente: llevar la escena de cine al díptico y a la caja (mismo plató, otro objeto) y decidir
  si el sobre en la mesa y el de pantalla completa pasan a ser dos planos de esta misma escena.

## Después de la carta: escenas que avanzan con el dedo

- **Cómo se mueven**: `effects/scroll-progress.ts` escribe en una variable CSS (`--p`, de 0 a 1)
  cuánto se ha bajado por un elemento; los estilos (`globals.css`: `.hero-*`, `.day-*`,
  `.story-*`) calculan lo demás. No hay renders de React al bajar y funciona en cualquier
  navegador (no depende de las animaciones de scroll nativas, que Safari solo tiene desde la 26).
- **Portada con foto** (A1): la foto de la pareja a pantalla completa con los nombres; al bajar se
  queda atrás y se oscurece. Sin foto, la cabecera de papel de antes.
- **El día** (A2, `content/program-scene.tsx`): escena fija, un acto por pantalla; el cielo pasa
  de la tarde a la noche, el sol se pone, sale la luna y se encienden las luces. Al acabar,
  amanece hacia la sección siguiente.
- **Nuestra historia** (A3, `content/story-scene.tsx`): un capítulo por pantalla con la foto a
  sangre. Solo si todos los momentos tienen foto.
- **Confirmar** (A5): al decir que sí, el lacre del tema cae y sella la respuesta (con vibración,
  sonido y pétalos).
- **Cierre** (A8): termina con la foto de portada, los nombres y la fecha.
- **Barra de secciones** (A9): se retira dentro de las escenas a pantalla completa.
- Con movimiento reducido, y el día de la boda para el programa, se usan las listas de siempre.
- **Lo que se descubre al llegar** (`useViewProgress`): un solo escuchador escribe `--v` y `--c`
  en fotos, titulares y tarjetas. Sustituye a las animaciones de scroll nativas de esas piezas,
  que en iPhones sin Safari 26 no se movían.
- **Bienvenida**: se enciende palabra a palabra (sin bajar del contraste mínimo de texto grande).
- **Dónde** (A4): el camino del plano se dibuja al cruzar la pantalla; las fotos de los sitios van
  grandes, con el nombre encima, y se desplazan dentro de su marco.
- **Regalos** (A7): las tarjetas llegan una a una y «Reservado a vuestro nombre» cae como un sello.
- **Guarda la fecha** (A6): la cuenta atrás pone los días en grande y las horas y los minutos,
  al lado, en pequeño (el calendario, ver más abajo).
- **Cómo llegar**: cada autobús es un billete (la hora de salida en el resguardo, con su línea de
  corte). Sustituye a la tabla, que en el móvil obligaba a desplazarse de lado para ver la vuelta.
- **Antes de venir**: los colores del código de vestimenta son muestras de tela, algo torcidas.
- **El álbum**: tres fotos del evento (las que haya) llegan apiladas y se abren en abanico.
- **Barra de secciones en el móvil** (`content/section-dock.tsx`): una píldora flotante abajo, al
  alcance del pulgar, en lugar de la barra de arriba (que sigue en pantallas anchas). Muestra por
  dónde vas con un anillo que se completa al bajar, despliega el índice al tocarla y lleva
  siempre lo importante: «Confirmar» o, si ya se ha confirmado, «Tu pase». Aparece al dejar la
  portada y se retira en las escenas, en el formulario y en el cierre.
- **Bienvenida**: empieza con el nombre del invitado («Familia García:»).
- **Código de vestimenta en el móvil**: las figuras son un pase que se desliza con el dedo.
- **Responder desde la píldora**: si aún no se ha contestado, «Confirmar» pregunta ahí mismo
  («¿Venís?», «Sí» o «No puedo») y abre el formulario ya en el paso siguiente (evento
  `RSVP_START_EVENT`). No se salta ningún dato: menús y autobús se siguen pidiendo.
- **Transiciones entre secciones**: las secciones con otro tono entran y salen en degradado
  (`.tone-tinted`), «Nuestra historia» se funde con el papel al terminar (`.story-out`) y una raya
  dorada se traza antes de cada titular (`.title-rule`).
- **Dónde y regalos en el móvil**: se pasan de lado con el dedo. Cada sitio lleva «Cómo llegar»
  (ruta en Google Maps) y Apple Maps al lado; los regalos sin foto llevan su papel de regalo.
- **Carruseles**: el contenedor que se desliza lleva `relative`. Sin él, los textos solo para
  lectores de pantalla (`sr-only`, en posición absoluta) de las tarjetas que quedan fuera
  ensanchaban la página entera en el móvil.
- **Alojamiento y preguntas**: fichas de papel; cada alojamiento, con su enlace al mapa.
- **Vibración y sonido al bajar**: cada hoja del calendario suena a papel, y cada acto de «El día»
  y cada capítulo de la historia dan un toque (`playTick`). Solo suena si el invitado no ha
  silenciado; la vibración no existe en iPhone (Safari no la ofrece).
- **Bienvenida como título de película**: con foto de portada, la bienvenida sigue sobre negro
  (la foto se ha oscurecido al bajar), se enciende palabra a palabra en grande y después amanece
  hacia el papel (`.scene-out`). El aviso «Tu respuesta» va detrás, ya sobre papel.
- **«Dónde», escena** (`content/venue-scene.tsx`): con dos o más sitios, todos con foto, cada uno
  ocupa la pantalla y su foto se funde con la del siguiente (estilos `.story-*`); abajo, un punto
  viaja de un sitio a otro. Solo el sitio que se ve recibe toques (`inert` en los demás). Sin
  fotos o con movimiento reducido, las tarjetas de `VenuesSection`. Si va justo después de «El
  día», la noche enlaza con ella sin amanecer.
- **«¿Venís?» sobre la foto del banquete**: la pregunta, en grande y a toda pantalla, con los dos
  botones encima. Sin foto, la tarjeta de papel de antes.
- **Lo que tiene la competencia y faltaba** (repaso del 11/11/2026 a proveedores españoles de
  Bodas.net y a Joy, Greenvelope y similares; son fichas comerciales, no comparativas neutrales):
  - **Bizum** en los regalos (`gift.bizum`, opcional): el teléfono en grande y «Copiar teléfono».
  - **La lista de la fiesta** (`playlistUrl`, opcional; `content/playlist-band.tsx`): banda oscura
    con un vinilo que gira, la canción que pidió el invitado al confirmar y el botón a la lista
    colaborativa de la pareja. Solo se aceptan enlaces https.
  - **Waze** junto a Google Maps y Apple Maps en cada sitio.
  - Los dos campos nuevos van dentro de `events.content` (JSON): no hacen falta migraciones.
- **Libro de firmas** (12/11/2026; `content/guestbook-section.tsx`, `src/lib/guestbook.ts`): los
  invitados dejan hasta tres mensajes por invitación (400 caracteres), firmados con el nombre de
  la invitación, que ven los demás invitados. Solo aparece si la pareja lo activa en el editor
  (`guestbook`, apagado por defecto: enseña nombres de invitados a otros invitados). La pareja
  modera en el panel (`/panel/<evento>/mensajes`) ocultando mensajes; no se borra nada.
  - Base de datos: migración `20261112100000_libro_de_firmas.sql` (tabla `guestbook_messages`
    con RLS, `guestbook_sign` con token y `get_invitation` ampliada). Los miembros solo pueden
    cambiar `hidden_at`. Aplicada el 12/11/2026 y probada con transacciones que se deshacen:
    `anon` y los usuarios sin ser miembros no pueden leer ni escribir en la tabla.
  - **Canciones pedidas a la vista de todos**: salen en la banda de música, sin decir quién las
    pidió. Van en la misma migración.
- **Calendario**: se probó a ligar las hojas al dedo y se descartó (caían de golpe al deslizar
  rápido). Vuelven a caer solas al llegar, una tras otra y con más calma que al principio.
- Pendiente: la reconfirmación de asistencia, que depende del correo.
- **Prioridad**: el móvil. El escritorio se mantiene correcto, pero las mejoras se piensan y se
  revisan primero a 390 px de ancho.
- Pendiente del plan (`docs/PLAN-CINE.md`): la parte B (resto de aperturas).

## Página de venta y ejemplos con imágenes reales

- La venta y `/ejemplos` enseñan el producto en vez de describirlo: cada apertura se ve en marcha
  dentro de un móvil, cada plantilla por el sobre con el que llega (es lo que más cambia entre
  ellas) y cada portada en su móvil. El panel aparece en una captura.
- Todo sale de la invitación de ejemplo con `scripts/capturas-venta.mjs` (build local, Playwright
  y ffmpeg) y se guarda en `public/venta/`: si cambia una apertura o una plantilla, se vuelve a
  ejecutar. Los vídeos (MP4 y WebM, unos 250 KB) no se descargan hasta que se ven, se paran al
  salir de la pantalla, tienen botón para pausarlos y con movimiento reducido no arrancan solos.
- Las aperturas van sobre el color de la mesa del sobre y alternan la altura, como sobres dejados
  en una mesa; en el móvil se deslizan de lado. La primera plantilla va en grande para que la
  rejilla quede completa con trece.

## Experiencia del invitado

- **Orden de pantallas:** portada → sobre → carta → contenido, como en la imagen de referencia. Hay un
  botón «Saltar intro» siempre visible y la introducción no se repite en la misma sesión
  (`sessionStorage`).
- **Sobre 3D:**
  - Todas las piezas (fondo, carta, bolsillo, solapa y lacre) son hermanas dentro de un mismo contexto
    de apilamiento, para poder intercalar la carta entre el fondo y el bolsillo.
  - La solapa gira con `rotateX` y una perspectiva propia (`transformPerspective`). No usa
    `preserve-3d`, que da problemas en Safari.
  - Al pasar de 90° cambia de cara (exterior → forro) y de `z-index`, y queda detrás de la carta.
  - Solo se animan `transform` y `opacity`.
  - El lacre se rompe en dos mitades recortadas con `clip-path`.
  - Con el ratón, el sobre se inclina siguiendo el puntero.
  - Con movimiento reducido, todo se resuelve con fundidos.
- **Imagen de portada:** el proxy del entorno de desarrollo bloquea Unsplash, así que el paisaje es
  una ilustración SVG original. Pesa pocos KB, no tiene problemas de licencia y escala sin pérdida.
  Se puede sustituir por una foto (`next/image` con `priority`) sin cambiar el resto.
- **Textura de papel:** ruido `feTurbulence` en un SVG usado como imagen de fondo. El navegador lo
  rasteriza una vez; no es un filtro en vivo.
- **Token por grupo** (familia, pareja o individual) con `maxAttendees`, miembros con nombre y plazas
  libres para acompañantes. En producción el token debería tener 16 caracteres o más y ser aleatorio;
  los de la demo son legibles a propósito.
- **RSVP:**
  - Los pasos se calculan según la respuesta: si no asiste, se pasa directamente al mensaje.
  - En una invitación individual se omite el paso «quién viene».
  - Al pulsar «Sí» o «No» en la tarjeta se entra ya en el segundo paso.
  - El foco va al título de cada paso, y cuando hay un error, al primer campo con error.
- **Fecha de la demo:** 22-05-2027 (futura), para que funcionen la cuenta atrás y el plazo
  (15-04-2027).

## Panel

- Los datos se generan con un PRNG con semilla: siempre son los mismos, y las pruebas son estables.
  La fecha de referencia es el 20-10-2026.
- Las métricas cuentan **plazas**:
  - Confirmados: personas que asisten.
  - Pendientes: plazas de invitaciones sin respuesta.
  - No asisten: plazas rechazadas.
  - Además se calculan las plazas de acompañante sin usar.
- **Paleta de menús** (`MENU_COLORS`): se validó con el script del sistema de visualización (banda de
  luminosidad, croma, separación para daltonismo ≥ 8, separación normal ≥ 15 y contraste ≥ 3:1 sobre
  `#fbf8f2`). El orden es carne, pescado, vegano, vegetariano e infantil. Cambiar el orden puede
  juntar dos colores parecidos.
- **Gráficos:** una sola serie sin leyenda (la nombra el título), tooltip con puntero y teclado, y
  vista de tabla. El anillo lleva una leyenda con valores y porcentajes, así que el color nunca es el
  único indicador.
- **Estados** (confirmado, pendiente, no asiste): siempre con icono y texto.

## Accesibilidad

- Gestión del foco al cambiar de pantalla, enlace «Ir a confirmar asistencia» y `aria-live` en los
  contadores y resultados.
- axe-core en las pruebas E2E. Se corrigieron contrastes (color `warning`) y regiones desplazables no
  enfocables.
- `prefers-reduced-motion` se respeta tanto en CSS como en Motion (`MotionConfig reducedMotion="user"`).

## Seguridad y datos

- No hay secretos, claves ni datos personales reales en el repositorio. `.env.local` (no se sube)
  solo lleva la URL de Supabase y la clave _publishable_, que es pública por diseño.
- Las respuestas leídas de `localStorage` se validan con Zod antes de usarse.
- Todo el sitio lleva `robots: noindex`.
- Ver «Ronda 5» para el modelo de permisos con Supabase (RLS y funciones con token).
- `npm audit --omit=dev`: 0 vulnerabilidades. Las alertas de `npm audit` vienen de dependencias de
  desarrollo de ESLint (`eslint-config-next` → `fast-glob` → `micromatch`) y no se incluyen en el
  bundle.

## Ronda 14: venta con cinco plantillas y panel más accionable

- **La página de venta y `/ejemplos` enseñan solo cinco plantillas** (`FEATURED_TEMPLATE_IDS` en
  `src/lib/theme/index.ts`): Arcilla, Olivar, Buganvilla, Terciopelo y Orilla, las que tienen
  portada pintada y apertura en vídeo. Cada una se ve con su portada real en un móvil y, delante,
  lo que se abre después; debajo se nombra con qué se abre. El resto de plantillas sigue en el
  editor. Las siete aperturas se siguen enseñando, como opciones que se cambian en el editor.
- Las portadas del escaparate (`public/venta/plantilla-<id>-portada.webp`) son capturas de
  `/i/familia-garcia?plantilla=<id>&grabar=1` a 390 × 844.
- **Inicio del panel, «Qué toca ahora»** (`src/lib/next-steps.ts`, con pruebas): invitaciones sin
  abrir, abiertas sin responder, confirmadas sin mesa y aviso del plazo cuando faltan 14 días o
  menos. Cada aviso lleva a la sección donde se resuelve.
- **Canciones agrupadas**: la misma canción sale una vez con las veces que se ha pedido.
- **Invitaciones con filtro por estado** (todas, sin abrir, abiertas sin responder, confirmadas,
  no asisten), con el número de cada uno.

## Ronda 15: la portada explica el producto con capturas; buscador de mesas y CSV del catering

- **Página de venta**: fuera la rama de flores de la cabecera y la sección de aperturas en marcha
  (sigue en `/ejemplos`; en la portada las aperturas solo se nombran, bajo la captura del editor).
  Entran cuatro bloques con capturas reales: lo que recibe cada invitado (cinco secciones, en
  Orilla, Olivar y Buganvilla), confirmar paso a paso (en Arcilla), el editor y el panel
  (inicio, invitaciones, mesas y menús). Las capturas están en `public/venta/` (`seccion-*`,
  `confirmar-*`, `editor`, `panel-*`), a 600 px las de móvil y 1280 px las de escritorio.
- **El editor ofrece solo las cinco plantillas**; si un evento usa una anterior, se sigue viendo
  la suya para no perderla.
- **Mesas**: buscador por invitación o por persona; encuentra también a quien ya está sentado,
  para cambiarlo de mesa desde la lista.
- **Menús**: «Descargar para el catering» (`cateringCsv` en `src/lib/print.ts`: una fila por
  comensal confirmado con mesa, menú y alergias) y enlace a la hoja imprimible por mesas.
- **Carencias del panel detectadas y no hechas**: recordatorios por correo (falta proveedor),
  control de llegada el día de la boda (el QR del pase no se valida), notas privadas por
  invitado, sentar por persona y no solo por invitación, exportar presupuesto y tareas, historial
  de cambios de respuesta y aviso a los novios cuando alguien responde.

## Ronda 16: siete vídeos de apertura más y cinco plantillas nuevas (16/11/2026)

- **Vídeos nuevos** (Higgsfield, 720p, 10 s) en `public/aperturas/sobre-dorado/`: `azul` (sobre
  azul empolvado, lacre plateado), `kraft` (kraft con lazo burdeos), `ventana` (marfil junto a
  la ventana), `cielo` (azul junto a la ventana), `granate` (burdeos a pantalla completa),
  `esmeralda` (caja verde con lazo dorado) y `eucalipto` (díptico verde salvia). Son opciones
  de `film` en la apertura «película» y se eligen en el editor.
- **Plantillas nuevas**, cada una con estilo de color y portada pintada propios (una primera
  versión reciclaba estilos y portadas antiguos y no se distinguía; se rehízo):
  - Lavanda: estilo `lavanda` (lila y añil), portada de tallos de lavanda, sobre azul.
  - Cortijo: estilo `trigo` (trigo, nogal y burdeos), plumeros de la pampa y lacre de sol, kraft.
  - Lino: estilo `lino` (blanco de lino y rosa viejo), paniculata con filete, sobre en la ventana.
  - Granada: estilo `granate` (vino oscuro y oro), olivo en oro y lacre de almendro, sobre burdeos.
  - Eucalipto: estilo `eucalipto` (verde gris frío), ramas de eucalipto y lacre de hoja, díptico.
    Terciopelo pasa a la caja esmeralda, que casa con su verde. Ya son diez las que se enseñan.
- **Portadas compuestas** con las acuarelas y los lacres sueltos de Higgsfield: las ramas se
  multiplican sobre un papel teñido (en Granada, la silueta se tiñe de oro sobre el vino). Se
  generan a 1080 × 1920 en `public/portadas/`. No están en el repositorio ni el guion ni los
  originales: para rehacerlas, bajar las imágenes de la cuenta y recomponer.
- **Bodas de ejemplo**: cada plantilla nueva reutiliza una ya escrita cambiando nombres y fecha
  (`retitle` en `src/data/demo/variants.ts`); las fotos son las de siempre.
- **No usados**: los bucles nuevos de pétalos y de luces (no enlazan el final con el principio),
  el sobre salvia con ramita (casi igual al de Olivar), el lacre que se estampa, el lazo que
  se desliza, y de las imágenes sueltas, la ramita de buganvilla y los lacres de estrella y corazón.
- **Next.js 16.4.2 → 16.4.6**: parche de seguridad; la versión anterior paraba una de cada dos
  compilaciones con un aviso.

## Ronda 17: motivo de acuarela en toda la invitación y colinas del color de la plantilla

- **Colinas de «El día»**: toman `--color-hill` (mezcla del neutro y el acento del estilo) en vez
  de un verde oliva fijo.
- **Motivo de acuarela** (`theme.motif`: lavanda, pampa u olivo; `MOTIF_IDS` en
  `src/lib/theme/cover.ts`). Prueba en tres plantillas (Lavanda, Cortijo y Granada) para que la
  portada pintada no se quede en la portada:
  - la cabecera y el cierre del contenido van pintados (la pintura de la portada sin lacre,
    `public/portadas/<portada>-fondo.webp`) en lugar de una foto; el cierre lleva dos ramas
    enfrentadas y el lacre de la plantilla;
  - cada sección se anuncia con su ramita en vez de la raya dorada;
  - la carta lleva una rama en la esquina y un lacre fotografiado bajo el botón;
  - los colores de vestimenta de la boda de ejemplo casan con la plantilla.
    Casi todo es CSS sobre `[data-motif]` (final de `globals.css`); las imágenes, recortadas con
    transparencia, están en `public/acuarelas/`. El lacre lila es el de hoja, virado de color.
    Lino y Eucalipto no llevan motivo todavía: es fácil añadirlo si la prueba gusta.

## Ronda 18: tres plantillas de concepto (Gaceta, Embarque y Premio)

Se pidió explorar más allá de «fondo bonito con los nombres encima». Tres portadas que son un
objeto entero, cada una con una interacción nueva, y que visten también el interior:

- **Gaceta** (portada `gaceta`, estilo `prensa`): la portada de un periódico con cabecera,
  titular («… se casan»), foto en trama de puntos, entradilla con capitular y sumario con el
  programa. Dentro, cada sección es una «Página N» (contador CSS) y las fotos van en gris.
- **Embarque** (`embarque`, `aeropostal`): tarjeta de embarque a nombre de la invitación
  (origen «Soltería», destino las tres primeras letras de la ciudad), panel de salidas con el
  programa y un resguardo que se arranca para abrir. Dentro, borde de correo aéreo y matasellos
  con la fecha en cada sección.
- **Premio** (`premio`, `decimo`): un décimo con filigrana (rosetas de hipotrocoide dibujadas
  por código) y la fecha bajo una capa dorada que se rasca en un lienzo; al quitar el 42 % se
  retira sola. La fecha está siempre en la página y hay un botón «Descubrir sin rascar».
- Código: `src/features/invitation/cover/concepts.tsx` (portadas), `CONCEPT_COVERS` e
  `isLightCover` en `cover.ts`, y los motivos de tipo «concepto» al final de `globals.css`.
  El rótulo de cada sección (`.motif-sprig`) sirve para las ramas de acuarela y para estos.
- Sus bodas de ejemplo reutilizan otras con `retitle`, como las anteriores.

## Ronda 19: Telegrama y Postal (17/11/2026)

Las dos primeras de la lista de `docs/CONCEPTOS.md`, hechas con su receta.

- **Telegrama** (estilo `telegrafo`, portada y motivo `telegrama`): el impreso de telégrafos con
  los nombres como remitente, la invitación como destinatario y la ciudad como origen. El mensaje
  sale del evento (`announcement()`, fecha y ciudad, cada frase con su STOP) y se teclea solo en
  tiras de papel, con un chasquido por letra (`playKey`). Tocar el telegrama lo termina de golpe;
  «Arrancar la tira» abre. Con movimiento reducido llega ya escrito, y el mensaje completo está
  siempre en la página para los lectores de pantalla. Dentro: sello «Telegrama urgente», cada
  sección en su tira («MENSAJE 3 STOP») y cierre «FIN DEL MENSAJE STOP».
- **Postal** (estilo `postal`, portada y motivo `postal`): anverso con la foto, «Recuerdo de
  [ciudad]» y los nombres; al girarla, matasellos con la fecha, sello con las iniciales, «Para
  [invitación]» y el mensaje de la carta a mano. El giro no usa caras traseras en 3D (problemas
  en Safari): gira hasta ponerse de canto, cambia de cara y termina. Dentro: matasellos en la
  cabecera y en el cierre, y un sello dentado por sección con su valor (5, 10, 15…) y tres
  colores que rotan.
- **Paletas**: las de las fichas se ajustaron al esquema de quince colores y pasan las pruebas de
  contraste. En Postal el acento es el verde del sello (no el rojo) y la escena es un atardecer,
  para que no se confunda con Embarque, que también es azul y rojo.
- **Letra nueva**: Courier Prime (`--font-courier`), solo para Telegrama.
- **Sello dentado** (`.stamp-teeth`): una máscara de puntos en los bordes; sirve para más sellos.
- Bodas de ejemplo: Irene y Guille (Telegrama) y Vera y Nico (Postal). Ya son quince plantillas
  destacadas y veintidós portadas.
- Trampas nuevas: el contenido calculado de `counter()` no trae el número (las pruebas miran el
  nombre del contador); axe mide mal el contraste a mitad de un giro (esperar a que acabe); el
  sobre «en la mesa» no lleva `data-opening`.
- Pendiente en estas dos, igual que en las tres primeras: carta y pase del concepto, apertura
  propia y prueba con el dedo en un móvil real.

## Ronda 20: las diez plantillas de concepto que faltaban (17/11/2026)

Con esto quedan hechas las doce ideas de `docs/CONCEPTOS.md`: quince plantillas de concepto en
total, veinticinco destacadas y treinta y dos portadas.

| Plantilla    | Estilo      | Qué se hace en la portada                                       | Rótulo de cada sección             |
| ------------ | ----------- | --------------------------------------------------------------- | ---------------------------------- |
| Vinilo       | `vinilo`    | Sacar el disco de la funda (o «Poner el disco»)                 | «Pista 03» con su surco            |
| Pasaporte    | `pasaporte` | Abrirlo: hoja de datos a nombre del invitado                    | Sello de visado con la fecha       |
| Carta        | `mantel`    | Levantar la campana: debajo, la fecha (o «Destapar»)            | Aperitivo, Entrantes, Postres…     |
| Mapa         | `pergamino` | Seguir la ruta con el dedo hasta la X (o «Ir a la X»)           | Número de parada y línea de puntos |
| Constelación | `celeste`   | Tocar el cielo para unir las estrellas (o «Unir las estrellas») | Coordenadas de la estrella         |
| Cómic        | `tebeo`     | Pasar tres viñetas; la última trae la fecha                     | Cartela «Mientras tanto…»          |
| Cosecha      | `bodega`    | Tirar del corcho (o «Descorchar»)                               | «Botella n.º 3 · Cosecha 2027»     |
| Tarot        | `arcano`    | Girar la carta: VI, los enamorados                              | Arcano con su número romano        |
| Arcade       | `arcade`    | Pulsar el botón rojo                                            | «FASE 3» con barra de progreso     |
| Semillas     | `vivero`    | «Sembrar»: brotan flores alrededor de la fecha                  | Pictogramas de siembra y «Ficha 3» |

- **Código**: las piezas comunes están en `cover/concept-kit.tsx` (props, letras, fechas, números
  romanos, `OpenHint` y `ActionButton`); las portadas, en `concepts.tsx` (las cinco primeras),
  `concepts-more.tsx` (vinilo, pasaporte, carta, cosecha, tarot) y `concepts-play.tsx` (mapa,
  constelación, cómic, arcade, semillas). `usePull` sirve para todo lo que se saca tirando;
  `useFlip`, para lo que se gira.
- **Portadas oscuras**: Constelación, Tarot y Arcade llevan `tone: "oscuro"` en `CONCEPT_COVERS`
  para que los botones de arriba vayan en blanco (`isDarkConcept`).
- **Letras nuevas**: Bangers (Cómic) y Press Start 2P (Arcade, solo en rótulos cortos; el cuerpo
  sigue en Jost). Pasaporte usa la monoespaciada del sistema, sin cargar nada.
- **Sonidos nuevos**: `playNotes` (recreativa y estrellas) y `playPop` (corcho).
- **Decisiones**: el mapa perdona el pulso (40 unidades de margen) pero no los atajos (solo
  cuentan los tres puntos siguientes); en la constelación basta tocar el cielo, sin acertar en
  cada estrella; el tarot no usa imagen generada, sino sol, luna y dos alianzas en SVG; las
  semillas no dependen del sensor de movimiento (en iOS pide permiso).
- **Contraste**: el naranja de la funda del vinilo se oscureció (`#ad4418`) para que el texto
  pequeño pase AA; Arcade usa calendario de cartel porque la píldora del semanal no se leía.
- **Pruebas**: `tests/e2e/conceptos.spec.ts` recorre las diez (título, fecha, axe, abrir y rótulo
  interior) y prueba cada interacción. Total: 653 unitarias y 340 E2E.
- **Pendiente en las quince**: carta y pase del invitado con el aspecto del concepto, apertura
  propia, y probarlas con el dedo en un móvil real. Avisos de la ficha que siguen valiendo: Tarot
  no gusta a todas las familias y Arcade es para un público muy concreto.

## Ronda 21: carta, pase y apertura de las plantillas de concepto (17/11/2026)

Lo que quedaba pendiente en las quince: hasta ahora solo la portada y el interior eran del
concepto; la apertura, la carta y el pase eran los comunes.

- **Textos de cada concepto** en `src/lib/theme/concept-kit.ts` (`CONCEPT_KITS`, `conceptKit`):
  el objeto que trae la carta, su rótulo, el membrete y la despedida de la carta y las etiquetas
  del pase. El aspecto va en `globals.css` por `data-motif`.
- **Apertura «concepto»** (`envelope/concept-opening.tsx`, id `concepto`): la carta llega dentro
  del objeto de la plantilla y, al tocarlo, el objeto se levanta y deja la carta. Es una sola
  pieza vestida quince veces (`.concept-carrier`): periódico doblado, sobre de correo aéreo, sobre
  de la administración, telegrama, postal, funda del disco, tapa del pasaporte, carta del
  restaurante, pergamino, carta celeste, tebeo, caja de la botella, baraja, máquina y sobre de
  semillas. El botón dice qué se abre («Abrir el telegrama»). Las quince plantillas la usan. No
  sale en la venta ni en los ejemplos (`SHOWN_OPENING_IDS`): no tiene grabación y sin plantilla de
  concepto es solo un sobre de papelería. Sí se puede elegir en el editor.
- **Carta**: membrete arriba y despedida abajo («La Gaceta · Noticia breve» / «Sigue en la página
  2», «Etiqueta de equipaje · Prioridad» / «Buen vuelo»…), con la letra del concepto (máquina de
  escribir, píxeles, rotulación de tebeo). Van ocultos para lectores de pantalla: son decoración.
- **Pase del invitado**: encima del título, lo que es en ese mundo («Tarjeta de embarque»,
  «Décimo premiado», «Ficha de jugador»…), y quienes vienen se llaman pasajeros, agraciados,
  comensales… El título sigue siendo «Pase de …» y las etiquetas que importan siguen diciendo
  «mesa» y «autobús» (una prueba unitaria lo vigila). Algunos llevan además su borde: correo aéreo
  en Embarque, filete doble en Gaceta, orla en Carta, roseta en Premio, tinta y sombra plana en
  Cómic.
- Decisión: una apertura común vestida en vez de quince bespoke. Quince aperturas distintas
  eran semanas de trabajo; esta da a cada plantilla su objeto ya, y deja sitio para que las que
  más se vendan tengan una propia (en vídeo con Higgsfield, como `film`).
- Pruebas (654 unitarias y 346 E2E en verde): `tests/e2e/conceptos.spec.ts` (apertura, membrete y pase de embarque), la de concepto
  añadida a `tests/e2e/aperturas.spec.ts` y la unitaria de los textos en `theme.test.ts`.

## Ronda 22: repaso de diseño de las plantillas de concepto (17/11/2026)

El usuario vio que las doce nuevas no llegaban al nivel de Gaceta, Embarque y Premio. Repaso
con la skill `frontend-design`, comparando las quince en el mismo móvil.

- **Qué tenían las tres de referencia**: el objeto llena la pantalla o un segundo objeto la
  completa (el panel de salidas de Embarque); materia (grano, inclinación, sombra real, una mesa
  debajo); una sola llegada orquestada; y todo dato sale de la boda.
- **Reglas que se aplicaron a las doce**: ninguna banda vacía de más del 15 % de la pantalla;
  cada objeto llega con `Arrive` (sube y se asienta inclinado) y lo secundario con `After`
  (`cover/concept-kit.tsx`); fondo de superficie propio (mantel de lino, estante de bodega,
  tapete de terciopelo, mueble de recreativa, pergamino tostado).
- **Cambios por plantilla**:
  - Vinilo: funda grande con pegatina de la tienda, el disco asoma solo para invitar a sacarlo y
    la contraportada lleva lista de canciones, notas y créditos («Colaboración especial:» el
    invitado).
  - Pasaporte: tapa de piel con oro estampado y filete hundido (`.passport-cover`), un visado
    asomando entre las hojas y tres sellos de tinta en la mesa.
  - Carta: la carta sobre un mantel de lino (`.tablecloth`), cada acto con su nombre de plato
    (Para empezar, Entrante, Principal…) y un cartel de «Reservado» con el invitado.
  - Cosecha: luz de bodega, estante, reflejos del vidrio, cápsula dorada y una etiqueta colgada
    del cuello con el nombre del invitado.
  - Tarot: tirada de tres cartas sobre terciopelo («Lo que fue · Lo que es · Lo que será»); la
    del centro es la vuestra.
  - Telegrama: el pie del impreso con la firma del remitente y el matasellos de telégrafos.
  - Constelación: borde de planisferio con los meses (el de la boda en oro) y el catálogo de esa
    noche con cada acto y su hora.
  - Arcade: mueble con pantalla de tubo (`.arcade-screen`), corazón de píxeles entre los
    jugadores, tabla de récords con el programa y panel de mandos (palanca, botón y moneda).
  - Mapa: bordes tostados, mar grabado, aguas someras, retícula, barco y palmeras.
  - Postal: otra postal debajo, de otro viaje. Semillas: el sobre inclinado y semillas
    derramadas.
- **Apertura «concepto»**: cada objeto tiene su emblema (cabecera de La Gaceta, sello de correos,
  número del décimo, «TELEGRAMA», disco, «Menú», carta celeste, ruta con su X, «¡Boda!»,
  «FRÁGIL», sol del tarot, «1UP», la variedad de las semillas) y su forma de abrirse: se levanta,
  se desliza de lado (correo aéreo, telegrama, disco, tebeo) o gira como una tapa (pasaporte,
  postal, tarot). Sin plantilla de concepto, el monograma de siempre.
- Pruebas: 654 unitarias y 346 E2E en verde. Imágenes de la venta regeneradas con las portadas
  nuevas.

## Ronda 23: auditoría en móviles reales y vuelta a los sobres (17/11/2026)

El usuario notó que había cosas que fallaban y que la calidad estaba bajando. Auditoría con la
skill `webapp-testing`: las quince recorridas en iPhone SE (375 × 667), iPhone con las barras de
Safari visibles (390 × 664) e iPhone 13 (390 × 844), midiendo errores, botones fuera de pantalla,
textos cortados, solapes y desbordes.

- **Lo que fallaba**:
  - En pantallas bajas, el botón de abrir de Telegrama y de Vinilo quedaba fuera de la vista.
    Ahora el disco se limita por altura (`w-[min(80%,36svh)]`) y lo accesorio (firma y matasellos
    del telegrama, créditos del disco) se retira bajo 720 px de alto (`.short-hide`). Hay una
    prueba que lo vigila en las quince.
  - El membrete de la carta de Premio salía cortado: ahora es «Bases del sorteo».
- **Lo que bajaba la calidad**: la apertura «concepto» (ronda 21) había sustituido a los sobres
  de las quince, también a los de las tres de referencia. Puestos lado a lado, el sobre a pantalla
  completa con lacre y el sobre sobre la mesa son muy superiores a la tarjeta que se levanta.
  Cada plantilla vuelve al sobre que tenía; «concepto» queda como opción en el editor
  (`?apertura=concepto` en la demo).
- Resultado de la auditoría tras los cambios: sin fallos en las 45 combinaciones.
- Lección: antes de sustituir una pieza que ya funciona, compararla con la nueva en el mismo
  móvil; y auditar siempre en pantalla baja (Safari con barras), no solo a 390 × 844.

## Ronda 24: regalos, pago y vestimenta apagados por defecto (17/11/2026)

El usuario no quiere que salgan ni la cuenta bancaria, ni el Bizum, ni la vestimenta, ni los
regalos **en las plantillas**; pero cada cliente puede encenderlos al editar su invitación. (Una
primera versión los apagaba para todos con un interruptor global y quitaba los controles del
editor; se corrigió el mismo día.)

- **Regalos**: la sección «Regalo» empieza oculta. `DEFAULT_THEME.hidden` es `["regalo"]` y
  `parseTheme` usa ese valor cuando el tema no trae la lista (un evento nuevo). Un tema ya
  guardado desde el editor conserva lo que eligió el cliente, también «nada oculto». Se enciende
  en Estilo → Secciones, como cualquier otra sección. `applyTemplate` respeta esa elección al
  cambiar de plantilla. Con la sección oculta tampoco salen la cuenta ni el Bizum.
- **Vestimenta**: aparece solo si `dressCode.enabled` es verdadero (campo opcional del contenido).
  Sin él, `withFeatures` (`src/lib/features.ts`) entrega el evento sin vestimenta. Se enciende en
  Textos → Código de vestimenta. Los datos de la demo se conservan: encenderlo los muestra.
- En el editor están siempre los grupos «Código de vestimenta», «Regalo» y «Lista de regalos»,
  y en el panel, «Regalos».
- En la demo, `?regalos=1` enciende la sección «Regalo» (lo usan las pruebas de la lista).
- «Antes de venir» sigue con «Dónde dormir» y las preguntas frecuentes. Se quitó de la demo la
  pregunta «¿Hay lista de bodas?», que remitía a la cuenta.
- La página de venta puede seguir anunciando la lista de regalos y la vestimenta: son cosas que el
  cliente puede activar.
- Los eventos que ya tenían el tema guardado sin «regalo» oculto siguen mostrándolos; no cambia
  nada para ellos.

## Ronda 25: la vista previa del editor ya no se queda sin borrador (17/11/2026)

La prueba «el sobre a medida se ve en la vista previa» fallaba a ratos y se daba por
intermitente. Midiéndola en paralelo (60 ejecuciones, 6 a la vez), 2 de cada 60 perdían el
cambio **para siempre** aunque se esperasen 25 s: era un fallo real, no lentitud.

- **Causa**: el editor solo enviaba el borrador cuando la vista previa le avisaba con «ready».
  Si el iframe cargaba antes de que el editor empezase a escuchar (un móvil o un equipo lento
  hidratando), ese aviso se perdía y no volvía a enviarse nada: la vista previa se quedaba con
  el tema de partida.
- **Arreglo**: saludo en los dos sentidos. El editor llama a la vista previa (`hello`, cada
  400 ms) hasta que contesta con `ready`, y la vista previa responde `ready` a cada `hello`.
- Comprobado: 120 de 120 ejecuciones correctas en paralelo.
- Lección: una intermitencia que se repite no es ruido. Medirla (cuántas veces, con qué margen de
  tiempo) antes de darla por intermitente.

## Ronda 26: revisión de la tanda de conceptos y ajustes (17/11/2026)

Revisión de `claude/exciting-franklin-43k083` (las doce plantillas de concepto, sus cartas, pases
y aperturas) integrada en la rama de trabajo, con estos cambios:

- **Venta**: en la portada, ocho plantillas de familias distintas (`SALES_TEMPLATE_IDS`: Arcilla,
  Olivar, Terciopelo, Lavanda, Gaceta, Embarque, Vinilo y Tarot), en dos filas de cuatro, con un
  enlace a las veinticinco en `/ejemplos`. La página baja de unos 10.300 a unos 8.800 px.
  `FEATURED_TEMPLATE_IDS` sigue siendo el catálogo completo (editor y `/ejemplos`).
- **Miniaturas de la venta**: en las plantillas de concepto, el sobre al que llega cada una (a
  pantalla completa, con su lacre), como en las diez primeras, y no un trozo del interior.
- **CSS por plantilla**: las pieles de motivo (acuarela y concepto, unas 1.350 líneas) salen de
  `globals.css` a `src/features/invitation/skins/skins.css`, que `experience.tsx` carga con
  `next/dynamic` solo si `theme.motif` no es «ninguno». El CSS llega en la primera respuesta
  (sin parpadeo) y las demás páginas no lo descargan: el CSS global baja de 214 a 183 KB. En
  `globals.css` queda solo la regla que oculta los rótulos del motivo cuando no hay motivo.
- Regalos y vestimenta: ver la ronda 24.

## Ronda 27: rediseño de la página de venta (17/11/2026)

La venta caía en el tópico de crema cálido con Bodoni, con ocho secciones iguales (título, texto,
rejilla de móviles) y sin usar el mejor recurso: el vídeo real del sobre.

- **Paleta propia de la venta** (`src/app/venta.css`, solo se carga en `/`): tinta de estilográfica
  `#1b2033` como campo, oro de estampación `#c8a45c` para filetes (y `#86662a` cuando es texto
  sobre papel, por contraste), lacre `#8a2433` para la acción principal y papel `#f4f2ed`.
- **Letra**: Italiana para los titulares (didona fina, como de grabado) y Jost para el texto.
  Las cifras van en Bodoni (`.v-num`): en Italiana el «1» parece una «I».
- **Portada**: el vídeo del sobre blanco abriéndose en bucle, sin sonido, que entra y sale
  fundiéndose con la tinta (`public/venta/portada-sobre.*`, sacado de
  `aperturas/sobre-dorado/vertical.mp4`). Se puede parar; con movimiento reducido no arranca.
- **Recorrido del invitado** (`features/sales/journey.tsx`): siete pasos numerados, todos en la
  plantilla Arcilla. En escritorio el móvil se queda fijo y cambia de pantalla según el paso que
  se lee; el paso activo lleva un filete de oro (no se atenúan los demás: perdían contraste). En
  el móvil, cada paso lleva su pantalla. Al final, la invitación de ejemplo para probarla.
- **Muestrario** (`features/sales/sample-book.tsx`): las veinticinco plantillas en dos pestañas
  (Papel y acuarela, Objetos), en un carril que llega al borde de la pantalla, con flechas y
  teclado. Sustituye a las ocho destacadas (se quitó `SALES_TEMPLATE_IDS`).
- **Precio**: una tarjeta impresa con filete doble y un lacre dorado fotografiado
  (`public/venta/lacre-oro.webp`, recortado de la imagen de Higgsfield).
- Preguntas y formulario, juntos al final; el formulario va en una tarjeta con el borde de lacre.

## Ronda 28: rediseño del panel de los novios (17/11/2026)

El panel tenía la identidad de la invitación de ejemplo (crema y Bodoni) y en el móvil era
incómodo: una fila de pastillas que se desplazaba de lado, tablas que se salían, la lista de
invitados con tarjetas en blanco, la vista previa de Imprimir de 35.000 px y las mesas pisadas.

- **Identidad de la marca** (`src/app/panel/[evento]/panel.css`): la misma de la venta (tinta
  `#1b2033`, papel, oro y lacre), con Italiana en los títulos. Se redefinen los colores del tema
  dentro de `.panel`, así que todas las pantallas cambian sin tocar sus clases. `.panel-dark` da
  los mismos nombres de color en claro para las zonas de tinta.
- **Navegación** (`features/dashboard/panel-nav.tsx`): las secciones agrupadas por lo que se hace
  (Invitados, El día, Organización). En escritorio, menú lateral de tinta fijo. En el móvil,
  barra inferior con Inicio, Invitaciones, Invitados, Mesas y «Más», que abre todas las secciones
  en una hoja (`<dialog>` nativo: atrapa el foco y se cierra con Escape).
- **Inicio**: la cabecera es una tarjeta de tinta con el saludo, los días que faltan en grande y
  una barra de personas (confirmadas, sin responder y que no vienen) con sus cifras.
- **Móvil**: rutas de autobús e invitados con alergias en fichas en lugar de tablas; la vista
  previa de Imprimir en una ventana desplazable; las mesas, proporcionales al plano (`cqi`) y el
  plano más alto; la lista de invitados sin `content-visibility` (dejaba tarjetas en blanco);
  las cifras se ajustan al ancho para que los euros no se corten.
- Tarjetas, cifras, estados y medidores con el mismo acabado (esquinas, sombra y oro).

## Ronda 29: bodas de ejemplo propias y prueba de movimiento reducido estable (18/11/2026)

Agente D de `docs/PLAN-EQUIPO.md`.

- **Una boda por plantilla** (`src/data/demo/template-weddings.ts`, montadas con
  `wedding-builder.ts`): se quita `retitle`, que repetía ciudad, lugares, historia, programa y
  libro de firmas entre veinte plantillas. Cada una tiene los suyos, a juego con el concepto
  (Embarque en Teguise, Vinilo en Valencia, Cosecha en una bodega del Priorat, Telegrama en
  Almagro…). Se mantienen nombres y fechas de las parejas. Solo fotos de `public/fotos/`, una
  pareja por boda. Ciudades reales; sitios, hoteles y personas inventados.
- `tests/unit/demo-variants.test.ts` comprueba el esquema, que no se repitan ciudades, parejas,
  historias, sitios ni mensajes, que el programa apunte a sitios propios, plazos y horas
  coherentes y que existan las fotos.
- **Prueba intermitente de movimiento reducido**: la causa era un desajuste de hidratación. El
  servidor pinta la versión con movimiento; el cliente, en su primer render, la quitaba (error
  #418 de React y página montada de nuevo), y la prueba a veces leía elementos ya sueltos. El hook
  `useReducedMotionForMarkup` (`effects/reduced-motion.ts`) devuelve «con movimiento» hasta
  hidratar; lo usan `cover-stage`, `cinema` y el Telegrama, y `SplitText` pinta el mismo HTML en
  los dos casos. La prueba ahora también falla con elementos sueltos o errores de página. 60 de
  60 con `--repeat-each=10`.

## Ronda 30: alta de pareja, primeros pasos y novedades en el panel (18/11/2026)

Agente C de `docs/PLAN-EQUIPO.md`.

- **`/entrar`** con la identidad del panel: zona de tinta con la marca y formulario con mostrar
  contraseña, aviso de 8 caracteres y textos en «vosotros».
- **«Mis eventos»** (`src/app/panel/my-events.tsx`): tarjetas con fecha y estado, abrir y
  duplicar; sin eventos, invita a crear el primero. El alta adapta las etiquetas al tipo de
  evento y no deja fechas anteriores a mañana (`earliestEventDate`). Tras crear, se va al panel
  (`?bienvenida=1`), no al editor.
- **Primeros pasos** (`src/lib/events/first-steps.ts`): plantilla, fotos y textos, invitaciones
  y publicar, con «0 de 4 hechos»; se oculta sola al terminar. `getOrganizerData` lee también
  `theme` (sin cambio de esquema). La demo está terminada y no la enseña: se ve con
  `/panel/demo?vista=nuevo`.
- **«Desde vuestra última visita»** (`src/lib/guests/news.ts`, guardado en
  `features/dashboard/last-visit.ts`): respuestas nuevas con fecha, sin correo. Fecha de la última
  visita en `localStorage`; durante la visita, `sessionStorage` para que no desaparezcan al
  cambiar de página. Punto dorado en «Invitaciones» (anunciado como «respuestas nuevas»). En un
  evento real, la primera visita no marca nada como nuevo.
- El aviso de datos ficticios del pie ya solo sale en la demo.
- `tests/e2e/real.spec.ts` se adaptó al recorrido nuevo, pero necesita Supabase y no se ha
  ejecutado aquí.

## Ronda 31: `/ejemplos` con la identidad de la venta y la invitación a juego con la decoración (18/11/2026)

Agente B de `docs/PLAN-EQUIPO.md`.

- **`/ejemplos`** usa `venta.css`, con cabecera y pie de eFeLe. Secciones alternas de papel y
  tinta: plantillas (Papel y acuarela, Objetos), aperturas en carril y portadas (Con
  movimiento, Pintadas, Objetos), todas con el muestrario de la venta
  (`features/sales/sample-book.tsx`), que ahora admite fondo de tinta, filas de cuatro o cinco,
  grabaciones, etiqueta y enlace propio. Pestañas de 44 px y sin transparencia en los números
  (contraste). Se quitan los escaparates viejos de `showcase.tsx`.
- **Sección «A juego con vuestra decoración»** en la venta, entre el panel y el precio: lo que
  diferencia a eFeLe. Tres muestras (Pampa y terracota, Lavanda, Olivo y oro) con portada
  pintada, lacre y paleta, solo con recursos que ya había. Sin precios ni promesas: «Contadnos
  cómo será vuestra decoración y la invitación la sigue». Botón a `#pedir` y enlace a Instagram.

## Ronda 32: rediseño del editor (18/11/2026)

Agente A de `docs/PLAN-EQUIPO.md`.

- **Identidad común** en `src/app/marca.css` (`.marca`, `.marca-dark`, `.marca-title`, con
  `.panel*` como alias). `panel.css` la importa y deja solo lo propio del panel; así `/entrar` y
  `/panel`, que importan `panel.css`, la reciben sin más. El editor importa `marca.css` y un
  `editor.css` pequeño. La vista previa conserva los colores de la invitación.
- **Escritorio**: barra lateral de tinta con monograma, nombres, estado de guardado, siete
  pestañas con icono y descripción, y «Publicar» fijo abajo; ajustes en el centro y el móvil de
  vista previa a la derecha. Cada pestaña abre con un título en Italiana y una línea de para qué
  sirve, y acaba con «Siguiente». Enlace «Saltar a los ajustes» para teclado.
- **Móvil**: pestañas en una fila fija que se desliza; barra inferior fija con el conmutador
  «Editar / Vista previa» y «Publicar» siempre a mano. La vista previa ocupa la pantalla a
  tamaño real.
- Listas vacías con mensaje útil, tarjetas de papel, botones de 40 px. Nueva e2e de la barra
  inferior en el móvil; la medida de desbordes cuenta también `innerWidth`.
- Pendiente: partir `style-tab.tsx` (unas 1.100 líneas).

**Integración (18/11/2026)**: las cuatro ramas unidas con `--no-ff`; lint, tipos, 675 unitarias,
build y 369 E2E en verde (5 se saltan). La comprobación en Supabase no se pudo hacer: el proyecto
estaba hibernado.

## Ronda 33: álbum sin revisión, si la pareja quiere (18/11/2026)

- **Opción «Publicar las fotos al momento»** en el panel del álbum, apagada por defecto. Encendida,
  las fotos de los invitados se ven en el álbum en cuanto se suben; la pareja puede ocultarlas o
  borrarlas después. Apagada, como hasta ahora: cada foto espera a que la aprueben.
- Migración `20261118100000_album_sin_revision.sql`: columna `events.album_auto_approve`
  (la cambian los miembros con la política existente), `album_info` devuelve `autoApprove` y
  `album_confirm` guarda la foto aprobada o pendiente según el evento. **Sin aplicar todavía en
  el proyecto real**: hace falta el «sí» del cliente. Hasta entonces, en eventos reales el
  interruptor falla al guardar (la columna no existe) y el álbum sigue moderado.
- El invitado lee «Aparecerán aquí al momento» y «Ya están en el álbum», y la galería se refresca
  tras subir. En la demo el interruptor cambia en el navegador.
- Calidad de las fotos: se reducen a 2000 px por el lado largo y WebP al 85 %. Basta para pantalla
  e impresión hasta unos 13×18 cm; subir el límite a 3000–4000 px queda como decisión del cliente.

## Pendiente para próximas fases

1. Modelo de negocio y pagos (venta a parejas o servicio de organización).
2. Recordatorios masivos por email (requiere un proveedor de correo).
3. Opcionales propuestos: versión en inglés, tiempo habitual en mayo y galería posterior a la boda.
4. Cobro automático (Stripe) cuando haya cuenta; hoy la página de venta solo recoge solicitudes.
5. Dominio propio (Vercel) y, con él, `SITE_URL`.
