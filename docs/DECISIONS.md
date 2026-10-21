# Decisiones del prototipo

Registro de las decisiones tomadas en el primer hito (prototipo visual). Cada una está pensada para
ser sencilla y reversible.

## Stack

| Pieza | Versión | Motivo |
| --- | --- | --- |
| Next.js (App Router) | 16.4 | Rutas estáticas por invitación (`generateStaticParams`), metadatos y listo para Vercel |
| React | 19.3 | — |
| TypeScript | 6.0, `strict` + `noUncheckedIndexedAccess` | — |
| Tailwind CSS | 4.3 | Tokens como variables CSS en `@theme`, que se pueden sobrescribir por evento |
| Motion (`motion/react`) | 14.5 | Coreografía del sobre (`useAnimate`), presencia entre pantallas, gestos y movimiento reducido |
| Zod | 4.6 | Valida las respuestas guardadas (datos no confiables). Se reutilizará en el servidor |
| lucide-react | 1.61 | Iconos |

**Descartados por ahora:**

- React Hook Form: el RSVP es un asistente con validación por pasos que vive en `src/lib/rsvp/draft.ts`
  y se prueba sin React. Además, `@hookform/resolvers@6` tenía un conflicto de dependencias.
- shadcn/Radix: los controles son nativos (radio, checkbox, select, `details`), accesibles por defecto.
- Librerías de gráficos: son dos gráficos SVG pequeños hechos a mano.
- Supabase y la autenticación: quedan fuera de este hito.

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

- No hay secretos, claves ni datos personales reales. No se necesita `.env`.
- Las respuestas leídas de `localStorage` se validan con Zod antes de usarse.
- Todo el sitio lleva `robots: noindex`.
- `npm audit --omit=dev`: 0 vulnerabilidades. Las alertas de `npm audit` vienen de dependencias de
  desarrollo de ESLint (`eslint-config-next` → `fast-glob` → `micromatch`) y no se incluyen en el
  bundle.

## Pendiente para próximas fases

1. Probar el sobre en Safari/iOS real.
2. Backend (Supabase/PostgreSQL con RLS), tokens seguros y validación en servidor.
3. Autenticación del panel y permisos para ver las alergias.
4. Alta y edición de invitados, exportación CSV, mesas, tareas, presupuesto y comunicaciones reales.
5. Temas por pareja y fotografía con licencia.
