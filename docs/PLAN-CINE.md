# Plan: la invitación entera, rodada como una película

Qué falta por hacer para que toda la invitación tenga el nivel de la apertura del sobre en 3D.
Está pensado para ir bloque a bloque: cada bloque se enseña en el iPhone antes de empezar el
siguiente. Escrito el 10/11/2026, tras recorrer la invitación de ejemplo en un móvil (unas 15
pantallas de desplazamiento después de la carta).

## Dónde estamos

- **Sobre en 3D**: rehecho como una escena de cine (mesa a contraluz, cámara en grúa, lacre que
  se rompe a cámara lenta, luz y chispas, la carta que sube y se funde con la pantalla de la
  carta). El usuario lo ha visto en su iPhone y lo da por mejor; el final está pendiente de su
  visto bueno definitivo.
- **Resto de aperturas**: como estaban. El sobre en la mesa tiene un retoque menor (cámara y luz
  con `cinema.tsx`) que queda lejos del 3D.
- **Después de la carta**: una página web ordenada y completa, pero plana. Es donde más se nota
  el bajón.

## Parte A · Después de la carta

### Diagnóstico

- La entrada es un corte: tras «Descubrir la invitación» aparece una página con los nombres sobre
  un fondo liso, sin foto y sin continuidad con la carta.
- Casi todo es texto. Solo hay fotos en «Dónde» y en «Nuestra historia».
- Todas las secciones se sienten iguales: no hay un momento que destaque ni sensación de avanzar
  por el día.
- Confirmar, que es lo más importante, llega al final y no se celebra.

Se mantiene lo que ya funciona: el calendario de hojas, la cuenta atrás, el programa con iconos,
las figuras del código de vestimenta y la línea de tiempo de la historia.

### Principios

1. **El dedo es el hilo conductor.** Las cosas se mueven porque el invitado baja, no solas. Nada
   de animaciones que se disparan una vez y ya.
2. **Un momento estrella por sección**, y el resto tranquilo.
3. **Lo práctico sigue sobrio.** Horarios de autobús, alojamientos, preguntas y número de cuenta
   son datos que se buscan: no se adornan.
4. **Mismo tema.** Todo sale de los colores, la letra y el adorno elegidos en el editor.
5. **Movimiento reducido**: cada bloque tiene su versión quieta, y se prueba.
6. **No pesa más al abrir.** Lo que añada peso se carga cuando hace falta.

### Bloques

| #   | Bloque                          | Qué ve el invitado                                                                                                                                                      | Archivos principales                                                          |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| A1  | Entrada con continuidad         | La carta se abre y da paso a una portada con la foto de la pareja a pantalla completa y los nombres encima. Al bajar, la foto se aleja y entra el texto de bienvenida.  | `experience.tsx`, `content/invitation-content.tsx`, `letter/letter-stage.tsx` |
| A2  | El día avanza al bajar          | En el programa, la luz del fondo pasa de la tarde a la noche a medida que se recorre ceremonia, cóctel, banquete y fiesta. La línea del programa se dibuja con el dedo. | `content/sections.tsx`, `content/program-icons.tsx`                           |
| A3  | «Nuestra historia» en capítulos | Cada año ocupa la pantalla: la foto grande se mueve despacio y el texto entra encima. Entre capítulos, la foto anterior se va por detrás.                               | `content/story-section.tsx`, `content/photo-slot.tsx`                         |
| A4  | «Dónde» con el recorrido        | El camino de la iglesia a la finca se traza mientras se baja; las fotos de los sitios entran con profundidad.                                                           | `content/route-map.tsx`, `content/sections.tsx`                               |
| A5  | Confirmar como un momento       | Al decir que sí, un lacre sella la respuesta y caen pétalos (o el adorno del tema). Al decir que no, un cierre amable. Vibración y sonido como en el sobre.             | `rsvp/`, `effects/sound.ts`, `effects/petals.tsx`                             |
| A6  | «Guarda la fecha»               | El calendario de hojas cae hasta el mes con el dedo y el día queda marcado; la cuenta atrás gana presencia.                                                             | `content/save-the-date.tsx`, `content/countdown.tsx`                          |
| A7  | Regalos                         | Las tarjetas entran una a una y el sello de «Reservado» se estampa al reservar.                                                                                         | `content/gift-section.tsx`                                                    |
| A8  | Un final                        | Cierra con la foto, los nombres y la fecha, y la opción de volver a abrir el sobre. Hoy acaba en un pie de página.                                                      | `content/invitation-content.tsx`                                              |
| A9  | Barra de secciones              | Revisar que no compita con las escenas a pantalla completa (se esconde al entrar en ellas y vuelve al salir).                                                           | `content/invitation-content.tsx`                                              |

Orden propuesto: A1 y A2 primero (marcan el tono), después A3, A5, A4, A6, A7, A8 y A9.

### Con qué se hace

- **Movimiento ligado al desplazamiento**: GSAP con ScrollTrigger (GSAP ya está instalado) y
  Lenis para suavizar el desplazamiento (también instalado; comprobar dónde se usa hoy).
- **Sin 3D en el contenido**, salvo que un bloque lo pida de verdad: fotos, capas y luz con CSS
  bastan y van fluidos en cualquier móvil.
- **Fotos**: la portada y la historia necesitan fotos grandes. En la demo se usan las de
  `public/fotos/`; en eventos reales, las que suba la pareja en el editor. Decidir qué se enseña
  cuando no hay foto (hoy, una ilustración con `PhotoSlot`).

### Riesgos y decisiones abiertas

- **Fluidez en el iPhone**: solo la puede juzgar el usuario. Cada bloque se entrega con enlace de
  vista previa.
- **Barra de direcciones de Safari**: al bajar cambia la altura de la pantalla; las escenas a
  pantalla completa tienen que tolerarlo (unidades `svh`/`dvh`).
- **Momentos del evento**: «save the date», «el día de la boda» y «después de la boda» comparten
  esta página; cada bloque debe comprobarse en los tres.
- **Otros tipos de evento** (bautizo, XV años): sin pareja ni «nuestra historia»; A1 y A3 deben
  funcionar con un solo nombre y sin esa sección.
- **Editor**: la vista previa del editor carga esta misma página; no debe ir más lenta.
- **Accesibilidad**: las pruebas con axe siguen pasando y el orden de lectura no cambia.

## Parte B · Aperturas que faltan

| #   | Bloque                               | Qué hay que hacer                                                                                                                                                    |
| --- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | Visto bueno del sobre en 3D          | Confirmar en el iPhone la fluidez y el final (posible doble contorno de medio segundo en las letras al fundirse). Después, regenerar su vídeo de la página de venta. |
| B2  | Díptico en el plató                  | Mismo plató y misma cámara, cambiando el objeto: dos hojas que se abren como puertas con luz entre ellas.                                                            |
| B3  | Caja con lazo en el plató            | El lazo se desata con caída de tela calculada en Blender (se reproduce, no se simula en el móvil), la tapa se levanta y hay papel de seda.                           |
| B4  | Sobre en la mesa y pantalla completa | Decidir si pasan a ser dos montajes de la escena 3D (uno abierto, otro pegado al lacre) y los dibujados quedan de reserva para móviles sin 3D.                       |
| B5  | Sobre junto a la ventana             | Más fotogramas para que el gesto del dedo vaya fino y sombras de ramas en movimiento (nuevo render en Blender).                                                      |
| B6  | Película (Premium)                   | Solo afinar el paso del vídeo a la carta, con el mismo fundido que el 3D.                                                                                            |
| B7  | Temas oscuros                        | Revisar la escena 3D con Medianoche, Esmeralda y Cine (solo se ha visto con el tema claro).                                                                          |
| B8  | Colores y composiciones              | La carta 3D solo dibuja la composición clásica; faltan las demás composiciones del editor.                                                                           |
| B9  | Vídeos de la venta                   | Regenerar todos con `scripts/capturas-venta.mjs` cuando las aperturas estén cerradas. Para el 3D, grabar fotograma a fotograma con `window.__cine`.                  |

## Parte C · Limpieza técnica pendiente

- `cinema.tsx` (capa de cámara y luz del sobre en la mesa): si B4 sale adelante, sobra.
- `TIMELINE` de `src/lib/envelope-3d.ts` ya no la usa la escena nueva (sí sus pruebas y el
  laboratorio): retirar o adaptar.
- La prueba E2E del sobre en 3D tarda más de un minuto sin tarjeta gráfica y se le amplió el
  margen; vigilar que no vuelva a fallar por tiempo.
- `docs/TRASPASO.md`: actualizar rama, estado y trucos nuevos (grabar la escena con
  `window.__cine`, `git push` sin forzar en esta sesión).

## Cómo se entrega cada bloque

1. Se hace el bloque en la rama de trabajo.
2. `npx prettier --write`, `npm run check` y `npm run test:e2e` en verde.
3. Un commit por bloque y push; Vercel publica la vista previa.
4. El usuario lo prueba en su iPhone y da el visto bueno o pide cambios.
5. A producción solo cuando él lo diga.
