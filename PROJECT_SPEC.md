# Invitaciones_Eventos — Especificación del proyecto

## Objetivo

Construir una plataforma de invitaciones digitales premium para bodas y otros eventos. La experiencia principal debe sentirse como una invitación física de lujo convertida en una experiencia web interactiva, no como una plantilla genérica ni un simple formulario.

El producto tendrá dos experiencias conectadas:
1. **Invitación para el invitado**: mobile-first, visual, emocional, fácil de usar y accesible mediante enlace personal sin exigir crear una cuenta.
2. **Panel privado de organización**: para gestionar invitados, RSVP, acompañantes, transporte, menús, alergias, comentarios, tareas y posteriormente mesas y presupuesto.

## Dirección artística

- Dirección recomendada: **híbrida cinematográfica + editorial de lujo**.
- La primera impresión debe sorprender; el resto de la web debe seguir siendo clara, elegante y práctica.
- Referencias de estilo: la sofisticación editorial de una web de boda premium y la sencillez de una invitación personalizada como la SPA de referencia vista en la conversación. No copiar literalmente diseños, contenido, nombres, imágenes ni código con licencia incompatible.
- Paleta inicial orientativa: marfil, crema, tonos cálidos, tinta oscura y detalles dorados discretos. Debe poder evolucionar según la identidad de cada pareja.
- Tipografía con serif editorial para titulares y sans-serif legible para interfaz.
- Fotografía de calidad, espacio negativo, composición cuidada, microinteracciones y jerarquía visual intencional.
- Evitar apariencia de dashboard SaaS genérico, exceso de tarjetas, gradientes aleatorios, animaciones decorativas sin propósito y diseño que parezca una plantilla barata.

## Experiencia del invitado

### Recorrido principal
1. El invitado abre un enlace personal.
2. Ve un sobre cerrado, con papel texturizado, nombres y sello/lacre.
3. Al tocar o activar el sobre, este se abre mediante animación CSS 3D fluida y la tarjeta aparece con una transición cuidada.
4. Se revela la invitación con nombres de la pareja, fecha, fotografía o composición visual y acceso al contenido.
5. Puede explorar el programa, ubicaciones, transporte, alojamiento, preguntas frecuentes y galería.
6. Confirma asistencia y responde solo las preguntas pertinentes para su invitación.
7. Ve una confirmación clara y puede volver a consultar la información.

### Funcionalidades de invitado
- Invitación personalizada por token/enlace individual.
- RSVP: asistirá / no asistirá / pendiente.
- Acompañantes permitidos y nombres, respetando el cupo asignado.
- Necesidad de transporte; punto de recogida o preferencias relevantes.
- Menú y restricciones alimentarias/alergias, solicitando solo los datos necesarios.
- Programa y horarios del evento.
- Ubicaciones con enlaces a mapas.
- Información de alojamiento, vestimenta y preguntas frecuentes.
- Mensaje o petición especial a los organizadores.
- Edición de la respuesta hasta una fecha límite configurable.
- Confirmación final y estados de carga/error accesibles.

## Animación e interacción

La apertura del sobre es el momento visual estrella:
- Sobre construido con elementos reales de interfaz/CSS, no una imagen estática que simule interacción.
- Tapa con transformación 3D, profundidad, sombra y perspectiva.
- Sello de lacre como detalle visual.
- Tarjeta que emerge o se revela de forma coreografiada.
- Transiciones suaves entre secciones, aparición progresiva de contenido y movimiento sutil de fotografía cuando aporte valor.
- Usar Framer Motion/Motion si encaja con las dependencias y versión elegidas; la animación del sobre puede resolverse con CSS 3D.
- Incluir estados de foco/teclado, botón para saltar la animación, soporte de prefers-reduced-motion y alternativas sin movimiento.
- No bloquear al usuario con una secuencia larga; permitir acceder al contenido rápidamente.
- Rendimiento móvil prioritario: evitar animaciones costosas, CLS, dependencias innecesarias y cargas grandes.

## Panel de gestión

- Inicio con resumen de confirmaciones y pendientes.
- Tabla/lista de invitados con búsqueda, filtros y agrupación por familia/grupo.
- Alta y edición de invitados, límites de acompañantes y enlaces personales.
- Resumen RSVP: aceptados, rechazados, pendientes y total de asistentes.
- Vista de transporte: plazas solicitadas, punto de recogida y necesidades.
- Resumen de menús y restricciones alimentarias con acceso restringido.
- Comentarios y peticiones especiales.
- Exportación a CSV/Excel en una fase posterior.
- Después: mesas, tareas, presupuesto, recordatorios y comunicaciones.
- Diseño profesional, rápido y denso en información, coherente con la marca pero optimizado para productividad.

## Tecnología propuesta (a confirmar tras inspección)

- Next.js con App Router y TypeScript.
- Tailwind CSS para estilos.
- Supabase/PostgreSQL para persistencia y Supabase Auth para el panel privado, si se confirma como opción adecuada.
- Políticas RLS y validación de servidor para impedir que un invitado consulte o modifique respuestas ajenas.
- Validación de formularios con Zod y React Hook Form si aporta valor.
- Vercel como posible despliegue web.
- No añadir credenciales, claves, datos reales de invitados ni secretos al repositorio.

Estas tecnologías son una propuesta inicial, no una obligación si el repositorio o las restricciones del proyecto justifican otra decisión. No implementar backend ni integración de pagos en el primer prototipo visual.

## Modelo conceptual futuro

Entidades posibles:
- Event: datos del evento, tema visual, fechas, ubicaciones, contenido y plazos.
- GuestGroup: familia/grupo y sus límites.
- Guest: invitado, contacto opcional, estado y token de invitación.
- RSVP: asistencia, acompañantes, respuestas de transporte/menú, comentario y fecha de actualización.
- EventSection: secciones configurables de contenido.
- Organizer/User: identidad, permisos y relación con eventos.

No crear el esquema de base de datos hasta validar el alcance y diseñar la experiencia inicial.

## Alcance del primer hito: prototipo visual premium

Prioridad absoluta: una demo navegable y visualmente convincente, con datos ficticios, que permita probar:
1. Portada/sobre cerrado.
2. Apertura del sobre con animación 3D real.
3. Revelación de tarjeta e invitación.
4. Secciones del evento (programa, ubicaciones, información práctica).
5. Flujo de RSVP interactivo con validación y confirmación de demostración.
6. Vista inicial del panel de gestión con métricas ficticias, lista de invitados y filtros visuales.

En este hito, no se requiere persistencia real, envío real de mensajes, autenticación real ni datos personales. Marcar claramente cualquier dato o acción como demo. Mantener los componentes preparados para conectar servicios después.

## Calidad y criterios de aceptación

- El diseño debe sentirse deliberado, premium y personalizado; no un CRUD con una portada decorativa.
- Responsive real, con atención especial a móviles.
- Animaciones funcionales, fluidas y accesibles.
- RSVP demo navegable de principio a fin.
- El panel debe mostrar un lenguaje visual propio para la gestión y ser utilizable.
- Estados vacíos, errores, éxito y carga cuidados.
- Componentes reutilizables, tipos claros y código mantenible.
- Sin errores de consola ni errores de TypeScript/lint/build en las comprobaciones disponibles.
- README con instrucciones exactas para instalar y ejecutar el proyecto.
- Documentar las decisiones importantes y los límites del prototipo.

## Reglas de trabajo para Codex

1. Inspecciona primero el repositorio, las ramas, archivos, configuración y scripts existentes.
2. Este repositorio se revisó mediante la API de GitHub y estaba vacío en ese momento (rama por defecto main, repositorio privado). Vuelve a comprobar el estado actual antes de escribir.
3. No sobrescribas ni elimines archivos existentes sin entenderlos y justificar el cambio.
4. No añadas servicios, claves ni variables secretas reales. Si hacen falta variables de entorno, crea solo un .env.example sin secretos.
5. Antes de instalar dependencias, comprueba versiones actuales y compatibilidad; evita dependencias innecesarias.
6. Empieza por el prototipo visual del primer hito. No implementes todo el producto de una vez.
7. Si el repositorio sigue vacío, propone una estructura mínima y construye el prototipo en una rama de trabajo si el entorno lo permite. No hagas push directo a main sin una revisión clara del diff.
8. Ejecuta las verificaciones disponibles (lint, typecheck, tests y build) y reporta qué se ejecutó y qué no.
9. Al terminar, resume archivos creados/modificados, decisiones visuales/técnicas, instrucciones para ejecutar y limitaciones conocidas.
10. Si falta una decisión importante, elige la opción más sencilla y reversible para el prototipo, documentándola en lugar de bloquear el avance.

## Referencias de inspiración revisadas previamente

- Wedding Website: https://github.com/Soccerbeats/weddingwebsite
- Wedding Invitation SPA: https://github.com/Nicolas960125/wedding-invitation
- OSWP: https://github.com/dccakes/SCV
- Git Hitched: https://github.com/fredbenenson/git-hitched

Son referencias de análisis visual/funcional, no dependencias que haya que copiar. Antes de reutilizar código, comprobar la licencia vigente del repositorio y de cada recurso. Algunas referencias usan licencias no comerciales y no deben incorporarse a un producto comercial sin permiso adecuado.
