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

## Pendiente para próximas fases

1. Modelo de negocio y pagos (venta a parejas o servicio de organización).
2. Recordatorios masivos por email (requiere un proveedor de correo).
3. Opcionales propuestos: versión en inglés, tiempo habitual en mayo y galería posterior a la boda.
4. Cobro automático (Stripe) cuando haya cuenta; hoy la página de venta solo recoge solicitudes.
5. Dominio propio (Vercel) y, con él, `SITE_URL`.
