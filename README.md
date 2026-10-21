# Invitaciones · prototipo visual

Prototipo navegable de invitaciones digitales premium para bodas y eventos. Tiene dos partes:

- **Invitado** (`/i/[token]`): portada cinematográfica, sobre con apertura 3D interactiva y sello de
  lacre, carta personalizada, programa, ubicaciones, transporte, información práctica y RSVP por pasos
  (acompañantes, autobús, menús, alergias y mensaje).
- **Organizador** (`/panel`): resumen con métricas, lista de invitados con búsqueda y filtros,
  transporte, menús y alergias, y comunicaciones.

> **Todo es de demostración.** Los nombres, lugares y respuestas son ficticios. No hay backend,
> autenticación ni envío de mensajes. Las respuestas del RSVP solo se guardan en el navegador
> (`localStorage`).

La especificación completa está en [`PROJECT_SPEC.md`](PROJECT_SPEC.md) y las decisiones técnicas en
[`docs/DECISIONS.md`](docs/DECISIONS.md).

## Requisitos

- Node.js 20.9 o superior (probado con Node 22.22)
- npm 10

No hace falta ninguna variable de entorno ni ningún servicio externo.

## Instalación y ejecución

```bash
npm install
npm run dev          # http://localhost:3000
```

Versión de producción:

```bash
npm run build
npm run start        # http://localhost:3000
```

> La compilación descarga las fuentes Bodoni Moda y Jost de Google Fonts una sola vez
> (`next/font` las sirve después desde el propio sitio). Hace falta conexión a internet durante el `build`.

## Recorrido de la demo

| URL                 | Qué muestra                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| `/`                 | Portada de la demo con enlaces a todas las invitaciones de ejemplo                    |
| `/i/familia-garcia` | Familia con una niña y una plaza libre para acompañante                               |
| `/i/carlos-ruiz`    | Invitación individual con acompañante opcional                                        |
| `/i/elena-y-pablo`  | Pareja                                                                                |
| `/i/prueba-error`   | Simula un fallo de red al enviar el RSVP la primera vez (estado de error y reintento) |
| `/i/plazo-cerrado`  | Estado de plazo de confirmación cerrado                                               |
| `/panel`            | Panel del organizador                                                                 |

Consejos:

- En la portada, desliza hacia arriba, toca o pulsa Intro. En el sobre, toca o pulsa Intro/Espacio.
- «Saltar intro» lleva directo al contenido. En la misma sesión no se repite la introducción
  («Volver a abrir el sobre» al final de la invitación la repite).
- Con `prefers-reduced-motion` activado, las transiciones se sustituyen por fundidos.
- Para borrar una respuesta guardada, limpia el `localStorage` del sitio.

## Comprobaciones

| Script              | Qué hace                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run lint`      | ESLint (configuración de Next.js)                                                                       |
| `npm run typecheck` | TypeScript estricto                                                                                     |
| `npm run test`      | Pruebas unitarias con Vitest (lógica del RSVP y estadísticas)                                           |
| `npm run test:e2e`  | Pruebas de extremo a extremo con Playwright en móvil y escritorio, con auditoría de accesibilidad (axe) |
| `npm run build`     | Compilación de producción                                                                               |
| `npm run check`     | lint + typecheck + test + build                                                                         |

Para las pruebas E2E hay que compilar antes (`npm run build`). Playwright arranca el servidor en el
puerto 3100. Si no tienes navegadores de Playwright instalados, ejecuta `npx playwright install chromium`.

## Estructura

```
src/
  app/                    Rutas (App Router)
    i/[token]/            Experiencia del invitado
    panel/                Panel del organizador
  features/
    invitation/           Portada, sobre, carta, secciones y RSVP
    dashboard/            Navegación, gráficos, tabla de invitados y piezas del panel
  components/             Botones, campos de formulario, distintivo de demo
  lib/
    domain/               Tipos del dominio y catálogos (menús, alergias)
    rsvp/draft.ts         Estado, pasos y validación del RSVP (sin React)
    stats.ts              Cálculos del panel (funciones puras)
    data/                 Acceso a datos: repositorio y almacenamiento de demo
  data/demo/              Evento e invitados ficticios (generados de forma determinista)
tests/
  unit/                   Vitest
  e2e/                    Playwright + axe
```

## Límites conocidos del prototipo

- Sin backend: el panel muestra datos generados y no refleja las respuestas enviadas desde las
  invitaciones (que solo viven en el navegador).
- Sin autenticación: `/panel` es público (con `noindex`).
- El paisaje de la portada es una ilustración SVG en lugar de una fotografía.
- La animación del sobre se ha probado en Chromium (móvil y escritorio). **Falta probarla en Safari/iOS
  real.**
- Solo hay un tema visual y está en español.
