# Capturas para el carrusel: confirmación de asistencia y panel de los novios

Capturas de la demo (`/i/familia-garcia` y `/panel/demo`) tomadas el 18/11/2026 desde la rama
`claude/exciting-franklin-43k083`. Todos los datos son ficticios.

Solo durante la captura se ha ocultado:

- en la invitación, el distintivo «Demo con datos ficticios» y «Saltar intro», con el modo de
  grabación `?grabar=1`;
- en el panel, el distintivo «Demo» de la cabecera, el aviso del pie «Datos ficticios generados
  para la demo…» y el enlace «Regalos» del menú (los regalos no se ofrecen).

La app no se ha cambiado.

## Carpetas

| Carpeta             | Qué hay                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `invitado/`         | Móvil 390×844 a @3x (1170×2532): la confirmación paso a paso                                  |
| `panel-movil/`      | Móvil 390×844 a @3x: pantalla visible de cada página, y página completa de Inicio e Invitados |
| `panel-escritorio/` | Escritorio 1440×900 a @2x (2880×1800), mismas páginas                                         |
| `carrusel-4x5/`     | Las capturas de móvil en un lienzo de 1080×1350 (4:5) sobre papel, listas para Instagram      |

## Invitado (`invitado/`)

| Archivo                  | Qué muestra                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| `01_asistencia.png`      | Paso 1: «Sí, allí estaré» marcado                                         |
| `02_acompanantes.png`    | Paso 2: los tres de la invitación marcados y un acompañante, Jaime Torres |
| `03_transporte.png`      | Paso 3: «Sí, usaremos el autobús», recogida en Madrid y 3 plazas          |
| `04_menu_alergias.png`   | Paso 4: menú de carne y alergia a la lactosa                              |
| `05_mensaje_cancion.png` | Paso 5: mensaje para los novios y canción para el DJ                      |
| `06_todo_listo.png`      | Paso 6: resumen para revisar antes de enviar                              |
| `07_confirmado.png`      | Después de enviar: «¡Qué ilusión! Gracias por confirmar»                  |
| `08_pase_invitado.png`   | El pase del invitado: asistentes, menús, autobús y código QR              |

El botón del primer paso dice «Sí, asistiré»; la opción marcada dice «Sí, allí estaré».

## Panel (`panel-movil/` y `panel-escritorio/`)

| Archivo                          | Página                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `01_inicio.png`                  | Inicio: días que faltan y cifras de respuestas                                   |
| `01b_novedades.png` (solo móvil) | Inicio, bloque «Desde vuestra última visita» (en escritorio sale en `01_inicio`) |
| `01_inicio_completa.png`         | Inicio, página completa                                                          |
| `02_invitados.png`               | Lista de invitados                                                               |
| `02_invitados_completa.png`      | Lista de invitados, página completa                                              |
| `03_invitaciones.png`            | Invitaciones: copiar enlace, WhatsApp y QR de cada una                           |
| `04_menus_alergias.png`          | Menús y necesidades especiales                                                   |
| `05_transporte.png`              | Transporte: rutas, plazas y pasajeros                                            |
| `06_mesas.png`                   | Mesas: plano y sitio de cada invitación                                          |
| `07_recordatorios.png`           | Recordatorios a quien aún no ha respondido                                       |
| `08_libro_de_firmas.png`         | Libro de firmas                                                                  |
| `09_primeros_pasos.png`          | Guía de primeros pasos de un evento recién creado (`?vista=nuevo`)               |

## Lo que hace de verdad el panel

Comprobado en el código y en la demo. Que no se prometa nada más.

- **Inicio**:
  - los días que faltan;
  - cuántas invitaciones han respondido y cuántas no se han abierto;
  - cifras de invitados, confirmados, sin responder y que no vienen.
- **Novedades sin correo**: el bloque «Desde vuestra última visita» lista las respuestas nuevas
  con fecha, y un punto dorado en «Invitaciones» avisa de ellas. La última visita se guarda en ese
  navegador, no en la cuenta.
- **Primeros pasos**: en un evento nuevo, una guía de cuatro pasos (plantilla, fotos y textos,
  invitaciones, publicar) que desaparece al terminarlos.
- **Invitaciones**:
  - cada una tiene su enlace personal, que se copia, se abre en WhatsApp o se imprime como QR;
  - se ve si cada una está sin abrir, abierta sin responder, confirmada o rechazada;
  - la lista se puede importar desde un CSV.
- **Lista de invitados**: búsqueda y filtros por respuesta, grupo y autobús, y agrupar por
  invitación.
- **Recordatorios**: se envían **uno a uno por WhatsApp**, con un texto que se rellena solo para
  cada invitación (nombre, pareja, plazo y enlace). No hay envío masivo ni por correo.
- **Menús y alergias**: reparto de menús y alergias de los confirmados, **descarga en CSV para el
  catering** y hoja para imprimir por mesas.
- **Transporte**: plazas por ruta, ocupación y pasajeros, con **descarga en CSV**.
- **Mesas**: plano para colocar las mesas y sentar a cada invitación. Avisa si una mesa se pasa de
  plazas y de las alergias de cada una, y se puede imprimir.
- **Libro de firmas**: los novios leen los mensajes y pueden ocultar los que no quieran que se
  vean.

La lista de invitados no se exporta a CSV: solo se descargan el catering y los pasajeros del
autobús.
