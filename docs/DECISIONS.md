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
5. Limpiar las fotos que se sustituyen en el editor (la anterior se queda en el almacenamiento).
