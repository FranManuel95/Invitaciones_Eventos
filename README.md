# Invitaciones

Invitaciones digitales premium para bodas y eventos, con su panel de organización. Tiene tres partes:

- **Invitado** (`/i/[token]`): portada cinematográfica, sobre con apertura 3D interactiva y sello de
  lacre, carta personalizada, programa, lugares, transporte, información práctica y confirmación de
  asistencia por pasos (acompañantes, autobús, menús, alergias, canción y mensaje).
- **Editor** (`/editor/[evento]`): la pareja parte de una de las ocho plantillas y ajusta cada
  detalle: paleta y color propio, tipografía, sobre (papel, solapa, gramaje, textura, forro y
  lacre), composición de la carta, calendario y orden de las secciones; también la apertura
  (sobre en la mesa o a pantalla completa, díptico o caja con lazo), la portada (foto en 3D,
  escenas animadas o vídeo) y la música. Cambia textos, programa,
  lugares, autobuses, menús y fotos, y ve la invitación en vivo en un móvil antes de publicarla.
- **Panel** (`/panel/[evento]`): resumen, invitaciones con enlace, WhatsApp y QR, lista de
  invitados, transporte, menús, plano de mesas, recordatorios, álbum de fotos con QR, tareas,
  presupuesto, agenda y ajustes; publicar primero un «save the date» y después la invitación.

La especificación está en [`PROJECT_SPEC.md`](PROJECT_SPEC.md) y las decisiones técnicas en
[`docs/DECISIONS.md`](docs/DECISIONS.md).

## Dos modos

- **Demostración** (sin configurar nada): todo funciona con datos ficticios en memoria. La invitación
  guarda las respuestas en el navegador y el panel y el editor de la demo no guardan cambios.
- **Con Supabase**: cuentas con email y contraseña, eventos propios guardados en PostgreSQL con
  RLS, respuestas reales de los invitados y fotos en Supabase Storage. La demo sigue disponible en
  `/panel/demo` y `/editor/demo`.

## Requisitos

- Node.js 20.9 o superior (probado con Node 22.22)
- npm 10

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

> La compilación descarga las fuentes (Bodoni Moda, Cormorant Garamond y Jost) de Google Fonts una
> sola vez; `next/font` las sirve después desde el propio sitio.

### Conectar Supabase (opcional)

1. Crea un proyecto en Supabase y aplica, en orden, las migraciones de `supabase/migrations/`.
2. Copia `.env.example` a `.env.local` y rellena `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (la clave _publishable_, que es pública). **Nunca** pongas
   la clave `service_role`.
3. En Supabase, en Authentication → URL Configuration, añade la URL del sitio y
   `https://<tu-dominio>/**` en Redirect URLs, para que los emails de confirmación vuelvan aquí.
4. Recomendado: activa Authentication → Passwords → «Leaked password protection».

`supabase/tests/rls.sql` comprueba las políticas de seguridad (se ejecuta dentro de una transacción
que se deshace).

## Recorrido de la demo

| URL                                                                       | Qué muestra                                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `/`                                                                       | Página de venta: producto, precio, preguntas y formulario           |
| `/ejemplos`                                                               | Índice de la demo: invitaciones de ejemplo, estilos y accesos       |
| `/i/familia-garcia`                                                       | Familia con una niña y una plaza libre para acompañante             |
| `/i/familia-garcia?estilo=noche&sobre=kraft&lacre=oro&calendario=minimal` | La misma invitación con otro tema                                   |
| `/i/familia-garcia?plantilla=luciernagas`                                 | La misma invitación con una plantilla (once en la portada)          |
| `/i/familia-garcia?apertura=pantalla&portada=luces`                       | Sobre a pantalla completa y portada con luces y mariposas           |
| `/i/familia-garcia?fase=save-the-date`                                    | Fase «save the date»: solo la fecha, sin confirmación               |
| `/album/demo`                                                             | Álbum de los invitados (subida simulada)                            |
| `/i/carlos-ruiz?dia=boda&hora=19:10`                                      | Modo «día de la boda»: acto actual, siguiente y autobuses de vuelta |
| `/i/prueba-error`                                                         | Simula un fallo de red al confirmar la primera vez                  |
| `/i/plazo-cerrado`                                                        | Plazo de confirmación cerrado                                       |
| `/editor/demo`                                                            | Editor con vista previa en vivo (sin guardar)                       |
| `/panel/demo`                                                             | Panel del organizador con datos ficticios                           |
| `/panel/demo/regalos`                                                     | Lista de regalos: quién ha reservado cada uno                       |
| `/panel/demo/imprimir`                                                    | Tarjetas de mesa, Busca tu mesa, carteles QR, catering y canciones  |
| `/i/carlos-ruiz?dia=despues`                                              | Después de la boda: agradecimiento y álbum                          |
| `/entrar`                                                                 | Acceso y alta de cuentas (con Supabase)                             |
| `/laboratorio/sobre-3d`                                                   | Prototipo del sobre con WebGL (React Three Fiber) para comparar     |

Consejos:

- En la portada, desliza hacia arriba, toca o pulsa Intro. En el sobre, toca o pulsa Intro o Espacio.
- «Saltar intro» lleva directo al contenido. Al volver en la misma sesión hay una apertura corta.
- Con `prefers-reduced-motion` activado, las transiciones se sustituyen por fundidos.

## Comprobaciones

| Script              | Qué hace                                                                             |
| ------------------- | ------------------------------------------------------------------------------------ |
| `npm run lint`      | ESLint (configuración de Next.js)                                                    |
| `npm run typecheck` | TypeScript estricto                                                                  |
| `npm run test`      | Pruebas unitarias con Vitest                                                         |
| `npm run test:e2e`  | Pruebas de extremo a extremo con Playwright en móvil y escritorio, con auditoría axe |
| `npm run build`     | Compilación de producción                                                            |
| `npm run check`     | lint + typecheck + test + build                                                      |

Para las pruebas E2E hay que compilar antes. Playwright arranca el servidor en el puerto 3100.
`tests/e2e/real.spec.ts` recorre el flujo completo contra Supabase (entrar, crear, editar, publicar,
responder y gestionar) y solo se ejecuta si defines `E2E_EMAIL` y `E2E_PASSWORD` de un usuario de
prueba.

## Estructura

```
src/
  app/
    i/[token]/              Invitación del invitado
    editor/[evento]/        Editor y su vista previa (iframe en /vista)
    panel/                  Mis eventos y panel de cada evento (/panel/demo es la demo)
    entrar/, auth/, unirse/ Acceso, confirmación de email e invitaciones a organizar
  features/
    invitation/             Portada, sobre, carta, secciones y RSVP
    editor/                 Pestañas, listas, fotos y vista previa del editor
    guests/                 Invitaciones, CSV, WhatsApp, QR y recordatorios
    seating/                Plano de mesas
    planning/               Tareas, presupuesto y agenda
    settings/               Miembros del evento
    dashboard/              Navegación, gráficos y piezas del panel
  lib/
    data/repository.ts      Punto único de datos (demo o Supabase)
    supabase/               Clientes de servidor y navegador
    theme/                  Plantillas, paletas, letras, sobre, carta, calendarios y contraste
    editor/, events/        Borrador del editor y fechas en Europe/Madrid
    guests/, seating.ts     CSV, envío y mesas (funciones puras)
    planning/               Tareas sugeridas, presupuesto y agenda (funciones puras)
    domain/, rsvp/, stats.ts Tipos, esquemas Zod, RSVP y estadísticas
  data/demo/                Datos ficticios deterministas
supabase/
  migrations/               Esquema, RLS y funciones
  tests/rls.sql             Pruebas de las políticas
tests/
  unit/                     Vitest
  e2e/                      Playwright + axe
```

## Límites conocidos

- La animación del sobre se ha probado en Chromium y en un iPhone; conviene repasarla en más
  dispositivos.
- Los recordatorios se envían por WhatsApp uno a uno; el email masivo necesita un proveedor de correo.
- Los pagos y la venta del servicio están por decidir.
- Solo en español.
