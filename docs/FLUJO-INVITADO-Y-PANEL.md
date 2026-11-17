# Cómo funciona la confirmación del invitado y el panel de los novios

Descripción para quien lleva el contenido y los textos. Todo lo de abajo sale del código actual
(`src/features/invitation/rsvp/`, `src/lib/rsvp/draft.ts`, `src/app/panel/[evento]/`). Los datos de
la demo son ficticios.

---

## Parte 1. El invitado: cómo confirma su asistencia

### Cómo llega

- Cada **invitación** (no cada persona) tiene un **enlace personal** (`/i/<token>`). Puede ser una
  familia («Familia García»), una pareja o una persona sola.
- La invitación sabe cuántas **plazas** incluye (`maxAttendees`) y quién viene nombrado (los
  «miembros»). Si hay más plazas que nombres, el resto son acompañantes sin nombre todavía.
- Al abrir el enlace por primera vez, la invitación queda marcada como «abierta» (los novios lo ven).

### La pregunta

Tras el sobre y el resto de la invitación, la sección «Confirma tu asistencia» muestra, sobre la foto
del banquete a toda pantalla, **«¿Venís?»** (o **«¿Vienes?»** si la invitación es de una persona) y
cuántas plazas incluye. Dos botones: **«Sí, asistiré»** y **«No podré asistir»**. Se indica el
**plazo de respuesta** («Puedes responder o cambiar tu respuesta hasta el …»). Pasado el plazo, la
sección dice «El plazo ha terminado» y remite a escribir directamente a los novios.

### Los pasos (formulario por pasos, con barra de progreso y botón «Atrás»)

Los pasos cambian según lo que responda:

**Si dice que NO asiste:** Asistencia → Mensaje → Resumen.

- Mensaje opcional: «¿Quieres dejarnos unas palabras?» (hasta 500 caracteres).

**Si dice que SÍ asiste:**

1. **Asistencia** («Confirma tu asistencia»). Opciones: «Sí, allí estaré» / «No podré asistir».
2. **Acompañantes** («¿Quién vendrá?»). Solo aparece si la invitación tiene más de 1 plaza.
   - Casillas con cada persona nombrada (los niños llevan la etiqueta «Niño/a»). Hay que marcar a
     alguien como mínimo.
   - Si sobran plazas sin nombre, botón **«Añadir acompañante»** (nombre de 2 a 80 caracteres;
     se puede quitar con la X).
   - Contador: «2 de 4 plazas ocupadas». No se puede superar el máximo de plazas.
3. **Transporte.** Solo si el evento tiene rutas de autobús.
   - «¿Vais a usar el autobús?» → **Sí** (se reserva plaza de ida y vuelta) / **No, iremos por
     nuestra cuenta** (hay aparcamiento).
   - Si **sí**: elegir **punto de recogida** en un desplegable (cada ruta muestra punto y hora de
     salida; después se enseñan las horas de vuelta) y **cuántas plazas de autobús** (de 1 al número
     de asistentes).
   - Si **no**: «¿Podéis ofrecer plazas en vuestro coche?» → Sí / No. Si sí, cuántas plazas libres
     (de 1 a 6). Sirve para organizar coches compartidos.
4. **Menú y alergias**, **por cada persona que viene**:
   - **Menú:** carne, pescado, vegetariano, vegano o infantil (el infantil solo para niños; los
     menús de los novios pueden tener nombre y descripción propios). Obligatorio elegir uno.
   - **Alergias o intolerancias** (casillas): gluten, lactosa, frutos secos, marisco, huevo y
     «otros». Con «otros» aparece un campo «Cuéntanos cuál» (obligatorio, 3 a 200 caracteres).
   - Aviso de privacidad: solo organizadores y catering ven esto, para preparar el menú.
5. **Mensaje y canción.**
   - Mensaje o petición especial (opcional, hasta 500 caracteres).
   - «¿Qué canción no puede faltar?» (opcional, hasta 120 caracteres; se pasa al DJ).
6. **Resumen.** Lista de todo lo contestado con enlace «Editar» en cada bloque. Botón **«Enviar
   respuesta»** (si falla el envío, avisa y ofrece «Reintentar»).

Validación: cada paso se valida antes de pasar al siguiente y los errores salen junto al campo.
Si el invitado cierra la página con la respuesta a medias, el navegador le avisa.

### Después de enviar

- Animación de celebración (pétalos) y mensaje de confirmación.
- Si dijo que sí, recibe su **pase personal**: nombre de la invitación, personas, menús, transporte,
  mesa asignada (cuando los novios ya la han puesto), el primer acto del programa, un **QR** y un
  código (`INV-…`). Se puede **guardar, compartir o imprimir**. (El QR es solo informativo.)
- Mientras no pase el plazo puede pulsar **«Editar respuesta»** y volver a entrar con sus datos
  previos. Se ve «Respuesta guardada el …» y «Ver la respuesta completa».
- Si antes dijo que no y edita, se parte de que vienen todos los nombrados.

### Qué más puede hacer el invitado en su invitación (fuera del RSVP)

- Ver programa, lugares, cómo llegar, vestimenta, preguntas frecuentes, regalos.
- **Regalos:** reservar un regalo de la lista (el resto de invitados solo ve «libre» o «reservado»,
  nunca quién lo regala) y ver los datos de Bizum o cuenta si los novios los han puesto.
- **Libro de firmas:** dejar un mensaje que ven todos los invitados.
- **Álbum:** subir fotos (esperan aprobación de los novios).
- **Música de fondo** (empieza apagada) y botón para añadir al calendario.

### Dónde se guarda

- Eventos reales: la respuesta va a la base de datos (Supabase) y el invitado solo accede con su
  token. También se recuerda en su navegador.
- Demostración (`/i/demo`): solo en el navegador del visitante, sin red.

---

## Parte 2. El panel de los novios (el «CRM»)

Está en `/panel/<evento>`. El organizador entra con su cuenta; puede invitar a otra persona como
organizador (Ajustes). Menú lateral en escritorio y barra deslizable en móvil. La demo es
`/panel/demo`.

### Estado del evento

Barra de publicación: el evento empieza como **«Borrador sin publicar»**. Se puede publicar primero
como **save the date** (versión corta) y después como **invitación completa**. Desde el inicio se
abre el **editor** de la invitación (`/editor/<evento>`: plantilla, estilo, portada, sobre, textos,
fotos, programa, rutas de autobús, menús, regalos, vestimenta…).

### Secciones

**Invitados y envío**

- **Inicio:** saludo («Hola, María»), días que faltan y resumen («han respondido 12 de 20
  invitaciones; quedan 8 por contestar y 3 aún no la han abierto»). Cifras: invitados, confirmados,
  sin responder, no asisten (con porcentajes). Gráfico de confirmaciones acumuladas por día,
  reparto de menús, alergias, transporte, canciones pedidas, ofertas de coche y mensajes recientes.
  Atajos: «Editar la invitación» y «Ver quién falta por responder».
- **Invitaciones:** una por familia/pareja/persona, cada una con su enlace personal. Se envía por
  **WhatsApp**, se copia o se imprime su **QR**. Estados: sin abrir → abierta → respondida. Se crea
  o edita cada invitación (nombre, categoría, plazas, teléfono, miembros, si es niño).
  **Importar desde CSV** (columnas: invitacion, categoria, plazas, telefono, nombre, apellidos,
  nino; hay plantilla descargable).
- **Invitados:** tabla con buscador, filtros (confirmados / pendientes / no asisten, autobús sí/no),
  opción de agrupar por invitación y **exportar a CSV**. Muestra por persona su menú, alergias y
  transporte.
- **Recordatorios:** a quien aún no ha respondido. Un texto común editable con huecos y un botón
  **«Recordar por WhatsApp»** por invitación (con su enlace). Prioriza a quien no ha abierto la
  invitación.

**Logística del día**

- **Transporte:** plazas de autobús reservadas frente a las totales, por ruta y punto de recogida;
  lista de pasajeros (exportable a CSV); invitados que van por su cuenta; quién ofrece plazas de
  coche y cuántas.
- **Menús:** resumen para el catering (solo cuentan los confirmados): reparto de menús, alergias más
  comunes y quién tiene qué necesidad.
- **Mesas:** plano del salón donde se colocan mesas y se sienta a cada invitación arrastrando. Avisa
  si una mesa se llena de más y de las alergias de cada mesa. La mesa asignada aparece luego en el
  pase del invitado.
- **Imprimir:** tarjetas de mesa, lista para la entrada, carteles del álbum, hoja del catering y
  canciones para el DJ, con los datos de hoy.

**Interacción con los invitados**

- **Regalos:** quién ha reservado cada regalo (los invitados no lo ven).
- **Libro de firmas:** mensajes que dejan los invitados; los novios pueden **ocultar** los que no
  convengan.
- **Álbum:** las fotos que suben los invitados esperan aprobación; se imprime el QR para las mesas.

**Organización de los novios**

- **Tareas:** lo pendiente hasta el gran día, con fecha y responsable.
- **Presupuesto:** previsto, pagado y pendiente, con los próximos pagos.
- **Agenda:** calendario único con tareas, pagos, el plazo de respuesta y el día del evento.
- **Ajustes:** quién organiza el evento, invitar a otra persona y borrar el evento.

### Cómo se relacionan las dos partes

Todo lo que el invitado contesta en el formulario alimenta el panel: asistencia → Inicio e
Invitados; acompañantes → plazas y Mesas; autobús y coche → Transporte; menú y alergias → Menús,
Mesas e Imprimir (catering); canción → Imprimir (DJ); mensaje → Inicio; apertura del enlace →
Invitaciones y Recordatorios.

### Notas

- Los textos de la interfaz están en español y en tono cercano.
- Los eventos que no son bodas (cumpleaños, bautizos…) cambian el vocabulario («anfitriones»,
  «el evento»), pero el flujo es el mismo.
