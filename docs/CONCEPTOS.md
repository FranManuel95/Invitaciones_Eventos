# Plantillas de concepto: cómo se hacen y qué viene después

Documento de trabajo para seguir la línea abierta con **Gaceta**, **Embarque** y **Premio**
(ronda 18 de `docs/DECISIONS.md`). Está pensado para que otra persona u otra sesión pueda
construir las siguientes sin haber visto cómo se hicieron las primeras.

Rama de trabajo: `claude/tender-franklin-isgz7b` (PR #6 contra `main`, sin fusionar). La
continuación (Telegrama y Postal, ronda 19) está en `claude/exciting-franklin-43k083`, que parte
de esa rama y la contiene entera.

**Hechas las cuarenta y nueve**: Gaceta, Embarque y Premio (ronda 18), Telegrama y Postal (ronda 19),
las diez de la ronda 20 (Vinilo, Pasaporte, Carta, Mapa, Constelación, Cómic, Cosecha, Tarot,
Arcade y Semillas) e Instantánea, Abanico, Cerillas, Galleta de la suerte, Casete y Mensaje en una botella (ronda
38, en `cover/concepts-new.tsx`) y Crucigrama, Billete de tren y Receta de la abuela (ronda 38, en
`cover/concepts-new2.tsx`) y Entrada de concierto, Cartel de feria y Ficha de biblioteca (ronda
38, en `cover/concepts-new3.tsx`) y Llave de hotel, Partitura, Brújula y Lacre (ronda 38, en
`cover/concepts-new4.tsx`) y Póker, Calendario de puertas y Horóscopo (ronda 38, en
`cover/concepts-new5.tsx`) y Plano de metro, Etiqueta de equipaje y Tarjeta de fidelidad (ronda
38, en `cover/concepts-new6.tsx`) y Diploma, Sobre de cromos y Caja de bombones (ronda 38, en
`cover/concepts-new7.tsx`) y Teléfono de disco, Radio antigua y Máquina de escribir (ronda 38, en
`cover/concepts-new8.tsx`) y Puzle, Tarta nupcial y Entrada de cine (ronda 38, en
`cover/concepts-new9.tsx`) y Globo aerostático, Bola de nieve y Brindis (ronda 38, en
`cover/concepts-new10.tsx`). Las fichas de abajo se conservan como referencia de lo que se
construyó; lo que queda es lo de «Pendiente en las que ya existen», que vale para todas.

Dónde está cada cosa ahora: piezas comunes en `cover/concept-kit.tsx`; portadas en
`concepts.tsx`, `concepts-more.tsx` y `concepts-play.tsx`; pruebas en
`tests/e2e/portadas.spec.ts` y `tests/e2e/conceptos.spec.ts`.

## Qué es una plantilla de concepto

Las plantillas «de siempre» son un fondo bonito con los nombres encima. Una plantilla de concepto
es otra cosa: **la portada es un objeto entero que el invitado reconoce** (un periódico, un
billete, un décimo) y la invitación se comporta como ese objeto.

Una plantilla solo cuenta como concepto si cumple las cinco condiciones:

1. **Un objeto reconocible en un segundo.** Si hay que explicarlo, no vale.
2. **Los datos de la boda ocupan los huecos reales del objeto.** En el billete, la ciudad es el
   destino y la invitación son los pasajeros; en el periódico, el programa es el sumario. Nada
   de texto de relleno que no salga del evento.
3. **Una interacción que solo tiene sentido en ese objeto** (arrancar el resguardo, rascar el
   décimo). Una sola, bien hecha, con alternativa para quien no pueda usarla.
4. **El concepto sigue dentro.** La cabecera, el rótulo de cada sección y el cierre son del mismo
   objeto (páginas numeradas, matasellos, número de serie).
5. **Paleta y letra propias**, que no se parezcan a las de ninguna otra plantilla.

Y un límite: **el humor va en los detalles, no en lo que hay que entender.** La fecha, el lugar y
cómo confirmar se leen igual de claros que en cualquier otra plantilla.

## Cómo está montado (lo que ya existe)

| Pieza                      | Dónde                                                     | Qué hace                                                                                                                                         |
| -------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Portadas de concepto       | `src/features/invitation/cover/concepts.tsx`              | Un componente por portada (`GazetteCover`, `BoardingCover`, `PrizeCover`) y el mapa `COVERS`. Reciben `event`, `guestName`, `onOpen` y `reduce`. |
| Registro de portadas       | `src/lib/theme/cover.ts`                                  | `COVER_IDS`, `COVERS` (nombre y descripción), `CONCEPT_COVERS` (tinta y papel de la hoja), `isConceptCover`, `isLightCover`.                     |
| Enganche en la portada     | `src/features/invitation/cover/cover-stage.tsx`           | Si `isConceptCover(scene)`, pinta `ConceptCover` en lugar del fondo y los nombres. El gesto de levantar la portada es el común.                  |
| Motivo (piel interior)     | `MOTIF_IDS` y `MOTIFS` en `cover.ts`; `theme.motif`       | `kind: "concepto"` o `"acuarela"`. `experience.tsx` pone `data-motif` y `data-motif-kind` en la raíz.                                            |
| Variables del motivo       | `motifVars()` en `src/features/invitation/experience.tsx` | `--motif-stamp` (`"10·07·27"`) y `--motif-serial` (`"N.º 100727"`), listas para `content:` en CSS.                                               |
| Piel interior              | `src/features/invitation/skins/skins.css`                 | Reglas por `[data-motif="…"]`: `.motif-hero` (cabecera), `.motif-sprig` (rótulo de cada sección), `.motif-closing` (cierre).                     |
| Cabecera y cierre sin foto | `painted` en `invitation-content.tsx`                     | Con motivo, la cabecera es `header.motif-hero` (sin foto) y el pie lleva `.motif-closing`.                                                       |
| Estilo de color            | `STYLES` en `src/lib/theme/index.ts`                      | Quince colores y cuatro tonos de escena. Las pruebas exigen contraste AA.                                                                        |
| Plantilla                  | `TEMPLATES`, `TEMPLATE_IDS`, `FEATURED_TEMPLATE_IDS`      | Junta estilo, portada, motivo, letra, calendario y apertura. Las destacadas salen en la venta y el editor.                                       |
| Boda de ejemplo            | `retitle()` en `src/data/demo/variants.ts`                | Parte de una boda ya escrita y cambia nombres, fecha, foto y colores de vestimenta.                                                              |
| Filigranas                 | `public/ornamentos/`                                      | SVG en negro para usar como `mask` (así toman el color del tema).                                                                                |

Tipografías cargadas (en `src/app/layout.tsx`): Bodoni Moda, Cormorant, Playfair Display,
Fraunces, Italiana, Poiret One, Pinyon Script, Great Vibes, Courier Prime y Jost. Para una letra nueva hay que
añadirla ahí con `next/font` y, si va a ser la de la plantilla, darla de alta en `FONTS`.

Sonido y vibración: `src/features/invitation/effects/sound.ts` (`playPaper`, `playSealCrack`,
`playTick`, `haptic`, `audioContext` para sonidos nuevos). Todo respeta el botón de silencio.

## Receta: una plantilla de concepto, paso a paso

1. **Tema** (`cover.ts` e `index.ts`): id en `COVER_IDS`, entrada en `COVERS` y en
   `CONCEPT_COVERS`; id en `MOTIF_IDS` y entrada en `MOTIFS` con `kind: "concepto"`; estilo nuevo
   en `STYLE_IDS` y `STYLES`; plantilla en `TEMPLATE_IDS`, `TEMPLATES` y
   `FEATURED_TEMPLATE_IDS`. La plantilla lleva `cover` y `motif` con el mismo id.
2. **Portada** (`concepts.tsx`): un componente y su entrada en `COVERS`. Obligatorio:
   - un `<h1 id="cover-title" tabIndex={-1} translate="no">` con los nombres;
   - un botón cuyo nombre accesible contenga «toca para abrir» y que llame a `onOpen`;
   - `onPointerDown={(e) => e.stopPropagation()}` en todo lo que se toque, o la portada entera
     se levantará con el gesto;
   - la fecha en un `<time dateTime={isoDay(event.date)}>`, siempre en la página aunque esté
     tapada (así la lee un lector de pantalla);
   - con `reduce` (movimiento reducido), sin animaciones de entrada.
3. **Piel interior** (`src/features/invitation/skins/skins.css`, que solo se descarga con las
   plantillas con motivo): tres reglas por motivo, como mínimo `.motif-hero`,
   `.motif-sprig` y `.motif-closing`. Los hijos de `.motif-closing` ya se ocultan en los de
   concepto. Usar las variables de color del tema (`--color-ink`, `--color-gold`,
   `--color-paper`…), nunca colores fijos.
4. **Muestra del editor**: entrada en el mapa de portadas de
   `src/features/editor/tabs/style-tab.tsx` (`url(/venta/portada-<id>.webp)`).
5. **Boda de ejemplo**: `retitle(...)` con nombres nuevos, fecha, foto y cuatro o cinco colores
   de vestimenta a juego con la paleta; añadirla a `VARIANTS`.
6. **Imágenes del escaparate** en `public/venta/`: `plantilla-<id>-portada.webp` y
   `portada-<id>.webp` (captura de la portada a 390 × 844, guardada a 600 px de ancho) y
   `plantilla-<id>.webp` (un recorte 4:5 del interior).
7. **Textos**: cambiar el número de plantillas en `src/app/page.tsx` y `src/app/ejemplos/page.tsx`.
8. **Pruebas**: en `tests/e2e/portadas.spec.ts`, una prueba por concepto (el título, el dato
   personalizado, la interacción, la alternativa accesible y axe sin fallos graves) y subir los
   contadores de `tests/e2e/venta.spec.ts` (plantillas y portadas). Las pruebas de contraste de
   `tests/unit/theme.test.ts` cubren el estilo nuevo sin tocar nada.
9. **Comprobar**: `npm run check` y `npm run test:e2e`. Mirar capturas de la portada y de tres
   secciones del interior antes de dar nada por bueno.
10. **Anotar** la ronda en `docs/DECISIONS.md`.

Trampas ya pisadas:

- En las pruebas, los textos de la portada pueden repetirse en el sobre que espera debajo:
  acotar con `page.locator("[data-cover='<id>']")` o con el rol del contenedor.
- El texto pequeño con `opacity` sobre filigrana falla el contraste de axe. Las etiquetas, a
  tinta plena.
- `next start` no ve las imágenes de `public/` creadas después de arrancar: reiniciar.
- Las fechas se formatean con `timeZone: "Europe/Madrid"` para que servidor y navegador den lo
  mismo.
- El lienzo de rascar necesita `touch-action: none` y capturar el puntero.

## Nivel de acabado exigido

Antes de enseñar una plantilla de concepto, repasar:

- [ ] La portada llena la pantalla de un móvil (390 × 844) sin huecos muertos ni cortes.
- [ ] Cada dato visible sale del evento: nombres, fecha, ciudad, programa, invitación.
- [ ] Funciona con un nombre largo, sin segunda persona (cumpleaños) y sin foto.
- [ ] La interacción responde al primer toque, vibra y no levanta la portada por accidente.
- [ ] Hay camino sin la interacción (botón) y con teclado.
- [ ] Con movimiento reducido no hay animaciones automáticas.
- [ ] El interior tiene cabecera, rótulo de sección y cierre del mismo concepto.
- [ ] Los colores de vestimenta de la boda de ejemplo casan con la paleta.
- [ ] Contraste AA y axe sin fallos graves ni críticos.
- [ ] Probado con el dedo en un móvil real (pendiente también en las tres primeras).

## Pendiente en las que ya existen

Hecho en la ronda 21: la carta (membrete y despedida), el pase del invitado y una apertura
propia («concepto», el objeto de la plantilla trae la carta). En la ronda 23 las plantillas
volvieron a sus sobres, que se ven mucho mejor; «concepto» queda como opción del editor. Para una plantilla nueva: añadir su
entrada en `CONCEPT_KITS` (`src/lib/theme/concept-kit.ts`) y su `.concept-carrier` en
`skins.css` si quiere un objeto distinto en la apertura opcional. Y comprobar la portada en
375 × 667: el botón de abrir tiene que verse entero (prueba en `tests/e2e/conceptos.spec.ts`).

Lo que queda:

1. **Probarlas con el dedo en un móvil real**, sobre todo los gestos (sacar el disco, tirar del
   corcho, levantar la campana, seguir la ruta) y los sonidos.
2. **Aperturas en vídeo** para las que más se vendan, cuando haya créditos de Higgsfield
   (`docs/HIGGSFIELD.md`): el periódico que se despliega, el sobre de correo aéreo, la botella
   que se descorcha.
3. **Tono.** Los textos son desenfadados a propósito; falta decidir si se ofrece una variante
   sobria de cada uno.

## Ideas siguientes

Doce conceptos, por orden de preferencia. Cada ficha trae lo necesario para empezar: el objeto,
qué dato va en qué hueco, la interacción, la piel interior, la paleta con sus valores, la letra,
los textos y qué recursos harían falta. Las paletas son un punto de partida: hay que pasarlas por
las pruebas de contraste y ajustar.

### 1. Vinilo: un disco de 45 revoluciones

- **Objeto**: la funda de un sencillo con el disco asomando por un lado.
- **Huecos**: los nombres son el grupo; «Sí, quiero» es el título del disco; la fecha, el año de
  edición; la ciudad, «grabado en directo en…»; el programa, la lista de canciones (cara A:
  ceremonia y cóctel; cara B: cena y baile) con la hora como duración.
- **Interacción**: sacar el disco de la funda arrastrándolo; al soltarlo gira y la portada se
  abre. Alternativa: botón «Poner el disco».
- **Interior**: rótulo de sección «A1», «A2», «B1»… con un surco fino debajo; la cabecera es la
  galleta del disco (círculo con el texto en arco); el cierre, «Fin de la cara B».
- **Paleta** (estilo `vinilo`): papel `#f3ead8`, tinta `#1c1917`, acento naranja `#c2511f`,
  secundario mostaza `#d9a441`, negro disco `#141211`.
- **Letra**: Poiret One para títulos y Jost para datos; números de pista en tabulares.
- **Textos**: «Edición limitada: un solo ejemplar.» · «Se escucha mejor acompañado.»
- **Recursos**: ninguno externo; los surcos son círculos concéntricos en SVG. Encaja con la
  canción pedida al confirmar («Tu canción entra en la cara B»).
- **Dificultad**: media (el arrastre con inercia).

### 2. Pasaporte: tapa, visados y sellos

- **Objeto**: un pasaporte cerrado, con escudo y letras doradas.
- **Huecos**: en la tapa, «Reino de [nombres]»; dentro, la hoja de datos con la invitación como
  titular, la fecha como «válido desde» y la ciudad como «lugar de expedición»; la línea de
  lectura mecánica (`P<ESP…`) compuesta con nombres y fecha.
- **Interacción**: abrir la tapa (giro en 3D sobre el lomo). En el interior, cada sección visitada
  estampa su sello con un golpe sordo.
- **Interior**: cada sección es un visado; el rótulo es un sello de entrada con forma distinta
  por sección (redondo, ovalado, rectangular) y la fecha dentro; el cierre, «Buen viaje».
- **Paleta** (`pasaporte`): tapa granate `#5a1220`, dorado `#c9a14a`, papel de seguridad
  `#f1ece0`, tinta `#1e1b2e`, sellos en azul `#2a4a7f` y rojo `#a3221b`.
- **Letra**: Cormorant en versalitas para la tapa; monoespaciada para los datos.
- **Textos**: «Este documento da derecho a barra libre.» · «No requiere vacunas, solo ganas.»
- **Recursos**: fondo de seguridad con `public/ornamentos/filigrana.svg`; escudo en SVG con el
  monograma.
- **Dificultad**: media. Cuidado: se parece a Embarque; no ofrecer las dos juntas en la venta sin
  diferenciarlas bien (aquí manda el documento, allí el vuelo).

### 3. Carta de restaurante: el menú del día

- **Objeto**: la carta de un restaurante de mantel blanco.
- **Huecos**: los nombres son el nombre del local («Casa Lucía y Marcos, desde 2019»); la fecha,
  «menú del día»; el programa, los platos (entrante: ceremonia; principal: banquete; postre:
  baile), con la hora donde iría el precio; las alergias y el menú del invitado enlazan con la
  confirmación.
- **Interacción**: levantar la campana de plata (se arrastra hacia arriba, sale vapor y debajo
  está la fecha). Alternativa: botón «Destapar».
- **Interior**: rótulos «Entrantes», «Principales», «Postres», «Bodega» según la sección, con una
  línea de puntos hasta el margen; cabecera con la orla de la carta; cierre «La casa invita».
- **Paleta** (`mantel`): papel `#fbf8f1`, tinta `#22201c`, acento verde botella `#2f4a3a`,
  secundario burdeos `#7a2230`, filete dorado `#b08a2e`.
- **Letra**: Playfair Display para platos, cursiva para descripciones, Jost para precios.
- **Textos**: «IVA y abrazos incluidos.» · «Cocina abierta hasta que el cuerpo aguante.»
- **Recursos**: campana en SVG o en imagen con transparencia; vapor en CSS.
- **Dificultad**: baja o media. Es la que mejor casa con los datos que ya hay (menús y alergias).

### 4. Mapa del tesoro: la ruta hasta la boda

- **Objeto**: un mapa dibujado a mano, con costa, rosa de los vientos y una X.
- **Huecos**: los lugares del evento son las paradas de la ruta (iglesia, finca), en su orden; la
  fecha, en la cartela; la ciudad, el nombre de la isla; los autobuses, «rutas marítimas».
- **Interacción**: seguir la línea de puntos con el dedo hasta la X; al llegar, la X se abre.
  Alternativa: botón «Ir a la X».
- **Interior**: rótulo de sección con el número de parada en un círculo y la distancia («parada 2
  de 5»); cabecera con la cartela del mapa; cierre con la rosa de los vientos. La sección de
  lugares ya tiene mapa de ruta (`content/route-map.tsx`): reutilizar su trazado.
- **Paleta** (`pergamino`): papel `#efe2c4`, tinta sepia `#3b2a1a`, mar `#9fb7b5`, acento rojo
  lacre `#9b2c1f`, verde tierra `#6f7d4f`.
- **Letra**: Fraunces para rótulos, Pinyon Script para la cartela.
- **Textos**: «El tesoro no se entierra: se celebra.» · «Aquí hay canapés.»
- **Recursos**: textura de pergamino (se puede componer como las portadas de acuarela) y la
  costa en SVG. Con Higgsfield: una ilustración de mapa sin texto para el fondo.
- **Dificultad**: alta (seguir un trazado con el dedo y tolerar el pulso).

### 5. Telegrama: urgente, con STOP (hecha, ronda 19)

- **Objeto**: un telegrama con sus tiras de texto pegadas.
- **Huecos**: remitente, los nombres; destinatario, la invitación; origen, la ciudad; el texto,
  en mayúsculas y con STOP: «NOS CASAMOS STOP 10 JULIO STOP VEJER STOP NO FALTES STOP».
- **Interacción**: el texto se teclea solo, letra a letra, con el sonido de la máquina; tocar lo
  acelera. Al terminar, la tira se arranca. Con movimiento reducido, aparece ya escrito.
- **Interior**: rótulos en tira de papel pegada, torcida un grado; cabecera con el encabezado del
  servicio de telégrafos; cierre «FIN DEL MENSAJE STOP».
- **Paleta** (`telegrafo`): papel amarillento `#f0e6cb`, tinta azul de cinta `#1f2f4d`, acento
  rojo «urgente» `#a3221b`, tiras `#fbf6e6`.
- **Letra**: monoespaciada para el mensaje (hace falta cargar una, por ejemplo Courier Prime);
  Jost para lo impreso del formulario.
- **Textos**: «Urgente: confirmar asistencia STOP» · «Tasa: una sonrisa por palabra.»
- **Recursos**: sonido de tecla con `audioContext()`; sin imágenes.
- **Dificultad**: baja. Buena primera tarea para quien llegue nuevo.

### 6. Constelación: el cielo de esa noche

- **Objeto**: una carta celeste circular, con sus coordenadas.
- **Huecos**: la fecha y la ciudad dan título al mapa («El cielo sobre Altea, 18 de diciembre de
  2027, 20:00»); las estrellas principales llevan el nombre de los actos del programa.
- **Interacción**: unir con el dedo las estrellas marcadas; al completar el trazo, la figura se
  ilumina y se abre. Alternativa: botón «Unir las estrellas».
- **Interior**: rótulo con las coordenadas (ascensión y declinación inventadas a partir de la
  hora del acto); cabecera con el círculo del mapa; cierre con la constelación completa.
- **Paleta** (`celeste`, estilo oscuro): fondo `#0d1530`, tinta `#f2ecdb`, líneas doradas
  `#d8b96a`, secundario azul `#6f8cc4`.
- **Letra**: Italiana para títulos, Jost fina para coordenadas.
- **Textos**: «Visible a simple vista desde la pista de baile.»
- **Recursos**: estrellas con el generador con semilla (`seeded` en `cover.ts`), sin imágenes.
  Ojo: ya hay una portada «Cielo estrellado»; esta tiene que distinguirse por ser un mapa con
  retícula y nombres, no un cielo de ambiente. No prometer astronomía real.
- **Dificultad**: media.

### 7. Cómic: la portada de un tebeo

- **Objeto**: la portada de un cómic, con su precio, su número y un bocadillo.
- **Huecos**: los nombres son el título de la colección; «N.º 1» y la fecha, en la esquina; el
  bocadillo dice «¡Nos casamos!»; la foto de la pareja, tramada a puntos de color.
- **Interacción**: pasar viñetas deslizando de lado; la última es la fecha y abre la invitación.
  Alternativa: botones «Viñeta anterior» y «Viñeta siguiente».
- **Interior**: rótulo de sección en cartela amarilla de narrador («Mientras tanto, en la
  finca…»); cabecera con el título en perspectiva; cierre «Continuará».
- **Paleta** (`tebeo`): papel `#fbf3df`, tinta `#141414`, rojo `#d92b2b`, amarillo `#f5c518`,
  azul `#2563c9`. Es la más viva del catálogo: comprobar el contraste del amarillo.
- **Letra**: hace falta una de rotulación (por ejemplo Bangers o Comic Neue); cargarla con
  `next/font`.
- **Textos**: onomatopeyas con medida («¡Clinc!» en el brindis). «Apto para todos los públicos.»
- **Recursos**: la trama de puntos ya está resuelta en Gaceta (`radial-gradient`); aquí en color.
- **Dificultad**: media o alta. Es fácil pasarse de broma: revisar que la fecha y el lugar se lean
  sin esfuerzo.

### 8. Cosecha: la etiqueta de una botella

- **Objeto**: una botella de vino vista de frente, con su etiqueta y su cápsula.
- **Huecos**: los nombres son la bodega; el año de la boda, la añada («Cosecha 2027»); la ciudad,
  la denominación de origen; la contraetiqueta, la nota de cata con el mensaje de bienvenida; el
  programa, el maridaje.
- **Interacción**: descorchar tirando del corcho hacia arriba; al salir suena y se abre.
  Alternativa: botón «Descorchar».
- **Interior**: rótulo con un número de botella («Botella 3 de 150», con el número de plazas
  reales); cabecera con la etiqueta; cierre con el corcho y la fecha grabada.
- **Paleta** (`bodega`): papel de etiqueta `#f4efe2`, tinta `#2a1a1f`, vino `#5e1a2b`, dorado
  `#b3924a`, verde botella `#243a2e`.
- **Letra**: Bodoni Moda para la etiqueta, Cormorant para la contraetiqueta.
- **Textos**: «Embotellado en origen. Consumir en buena compañía.»
- **Recursos**: botella en SVG o imagen con transparencia; sonido del corcho con `audioContext()`.
  Hay un lacre dorado y varios más en la cuenta de Higgsfield que sirven de cápsula.
- **Dificultad**: media.

### 9. Tarot: la carta de los enamorados

- **Objeto**: una carta de tarot boca abajo, con su dorso ornamental.
- **Huecos**: al girarla es «VI · Los enamorados», con los nombres en la cartela y la fecha en
  números romanos; la ciudad, en el borde inferior.
- **Interacción**: girar la carta (giro en 3D al tocar o al arrastrar de lado). Alternativa:
  botón «Dar la vuelta a la carta».
- **Interior**: cada sección es un arcano con su número romano («II · La fecha», «VII · El
  viaje»); cabecera con el marco de la carta; cierre «Así estaba escrito».
- **Paleta** (`arcano`, estilo oscuro): fondo `#1c1630`, tinta `#f1e7d0`, dorado `#d3ad5a`,
  secundario ciruela `#5c2f5a`.
- **Letra**: Cormorant en versalitas con mucho espaciado; números romanos en Bodoni Moda.
- **Textos**: «Las cartas no mienten: habrá baile.»
- **Recursos**: el dorso, con rosetas (`rosette()` en `concepts.tsx`); la ilustración central
  pide una imagen generada (dos figuras, sol y luna, estilo grabado, sin texto).
- **Dificultad**: media. Avisar al cliente del tema: no gusta a todas las familias.

### 10. Arcade: jugador 1 y jugador 2

- **Objeto**: la pantalla de inicio de una máquina recreativa, en píxeles.
- **Huecos**: «Jugador 1» y «Jugador 2» son los nombres; la fecha es el récord; la ciudad, la
  fase; «Inserte moneda» pasa a «Pulsa para empezar».
- **Interacción**: pulsar el botón rojo de la máquina; suenan tres notas y arranca la partida.
  Extra opcional: un minijuego de diez segundos (atrapar anillos) que nunca bloquea el paso.
- **Interior**: rótulo «Fase 1», «Fase 2»… con una barra de progreso; cabecera con el marcador;
  cierre «Fin de la partida · ¿Continuar? Sí».
- **Paleta** (`arcade`, estilo oscuro): fondo `#12122b`, tinta `#f4f4f0`, magenta `#ff3d81`,
  cian `#37d5d6`, amarillo `#ffd23f`.
- **Letra**: de píxeles (por ejemplo Press Start 2P), solo en títulos cortos; el cuerpo, en Jost,
  porque la de píxeles no se lee en párrafos.
- **Textos**: «Nivel desbloqueado: matrimonio.» · «Vidas: todas las que hagan falta.»
- **Recursos**: sonidos sintetizados con `audioContext()`; figuras en SVG de cuadrícula.
- **Dificultad**: media o alta. Público muy concreto: ofrecerla como opción, no como principal.

### 11. Postal: anverso y reverso (hecha, ronda 19)

- **Objeto**: una postal turística, con su foto y, detrás, sello, matasellos y renglones.
- **Huecos**: en el anverso, la foto de la pareja con «Recuerdo de [ciudad]»; en el reverso, la
  dirección es la invitación, el texto manuscrito es el mensaje de bienvenida y el matasellos
  lleva la fecha.
- **Interacción**: dar la vuelta a la postal (giro en 3D). Alternativa: botón «Girar la postal».
- **Interior**: rótulo con un sello de correos distinto por sección (dentado con `mask`);
  cabecera con el reverso de la postal; cierre con el matasellos grande.
- **Paleta** (`postal`): papel `#f6f0e1`, tinta azul de bolígrafo `#1e3a6e`, rojo sello
  `#b3312a`, verde `#3f6b5e`, cielo de la foto según el evento.
- **Letra**: Pinyon Script para el texto a mano, Jost para lo impreso.
- **Textos**: «Aquí todo bien. Os esperamos.» · «Franqueo pagado en ilusión.»
- **Recursos**: reutiliza el matasellos de Embarque (`--motif-stamp`). Diferenciarla de Embarque:
  aquí manda la foto y la letra a mano.
- **Dificultad**: baja. Segunda buena tarea de entrada, después del telegrama.

### 12. Sobre de semillas: para plantar el día de la boda

- **Objeto**: un sobre de semillas de ferretería, con su ilustración botánica.
- **Huecos**: la variedad es «Amor de [nombres]»; la época de siembra, la fecha; el lugar, la
  ciudad; las instrucciones del dorso son el programa («regar con cava a las 20:30»).
- **Interacción**: agitar el móvil o deslizar para que caigan las semillas, que brotan en flores
  alrededor de la fecha. Alternativa: botón «Sembrar». El sensor de movimiento pide permiso en
  iOS: no depender de él.
- **Interior**: rótulo con el pictograma de siembra (sol, riego, profundidad) y un dato del acto;
  cabecera con la franja del sobre; cierre con el brote.
- **Paleta** (`vivero`): papel kraft claro `#ece0c5`, tinta `#2b3a23`, verde `#5d7a3a`, acento
  amapola `#c8452c`, crema `#fbf6e7`.
- **Letra**: Fraunces para el nombre de la variedad, Jost para la ficha técnica.
- **Textos**: «Germina en buena compañía.» · «Florece cada aniversario.»
- **Recursos**: las acuarelas ya generadas (olivo, eucalipto, lavanda, buganvilla, paniculata,
  pampa) sirven de ilustración; están recortadas en `public/acuarelas/` (tres) y el resto, en la
  cuenta de Higgsfield. Enlaza con un detalle real: regalar semillas a los invitados.
- **Dificultad**: media.

## Ideas para la siguiente tanda (después de la ronda 38)

Objetos reconocibles en un segundo y con un gesto que solo tiene sentido en ellos:

Hechas en la ronda 38: Galleta de la suerte, Casete, Crucigrama, Receta, Billete de tren,
Entrada de concierto, Cartel de feria, Ficha de biblioteca, Llave de hotel, Partitura y Brújula.
Quedan por probar:

1. **Cometa**: se tira del hilo y sube con los nombres en la cola.
2. **Reloj de arena**: se le da la vuelta y cae la arena hasta la fecha.
3. **Faro**: se enciende la luz y su haz barre el lugar de la boda.

## Por dónde empezar

1. ~~**Telegrama** y **Postal**~~: hechas (ronda 19).
2. **Carta de restaurante**: la que mejor aprovecha los datos que ya hay (menús y alergias).
3. **Vinilo**: la más vistosa para grabar en vídeo corto.
4. Después, completar las tres existentes (carta y pase del concepto) antes de abrir más frentes:
   tres conceptos redondos valen más que diez a medias.

Antes de cada una: leer `docs/TRASPASO.md`, aplicar las skills de `.claude/skills/`
(`frontend-design` para la dirección visual, `web-design-guidelines` para accesibilidad) y seguir
la receta de arriba.
