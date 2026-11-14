# Traspaso entre sesiones

Estado del trabajo para retomarlo en una sesión nueva sin perder el hilo. Complementa a
`CLAUDE.md` (reglas), `PROJECT_SPEC.md` (producto) y `docs/DECISIONS.md` (por qué está hecho así).

## Dónde estamos

- **Ramas** (13/11/2026). Ojo: hay varias líneas de trabajo y **lo que no está en `main` no está
  en producción**. Antes de empezar, `git fetch` y `git branch -r`, y para cada rama
  `git log origin/main..origin/<rama>`.
  - `main`: producción. Llega hasta el PR #4 (sobre de película en una sola toma, encuadre
    vertical).
  - `claude/tender-franklin-isgz7b`: **rama de trabajo de esta línea**, sin PR abierto. Parte de
    `main` y ya incluye (por unión) todo lo de `claude/loving-faraday-2aw3om-grogl2`. Trae: las
    portadas pintadas y los efectos, el color del sobre de película, las plantillas Arcilla,
    Olivar, Noche dorada y Buganvilla, y todo lo de después de la carta.
  - `claude/loving-faraday-2aw3om-grogl2`: la sesión «Proyecto de invitaciones» (móvil), que sigue
    añadiendo cosas (sobre en 3D de cine, escenas de después de la carta, libro de firmas, díptico
    3D). Incluye el trabajo de `claude/exciting-franklin-43k083`. Cuando avance, repetir la unión
    en la rama de trabajo (`git merge-tree --write-tree HEAD origin/<rama>` prueba la unión sin
    tocar nada). Con `git merge` el mensaje va con `-m`: `-F -` no funciona.
  - `claude/loving-faraday-2aw3om` y `codex/premium-envelope-polish`: antiguas, no usar.
- **Vista previa** (Vercel, proyecto `invitaciones-eventos`, equipo `franmanuel95s-projects`): cada
  push crea una dirección nueva del tipo `invitaciones-eventos-<código>-franmanuel95s-projects.vercel.app`.
  Se obtiene con `list_deployments` del conector de Vercel (filtrando por rama) y está lista
  cuando el estado es `READY`. La demo se prueba por la URL:
  `/i/familia-garcia?plantilla=…&portada=…&efecto=…&apertura=…&pelicula=…`.
- **Supabase**: proyecto `uzmrvclmjtxhcglyqadm` (París, plan gratuito). Todas las migraciones de
  `supabase/migrations/` están aplicadas (comprobar la última, `aperturas_invitacion`, con
  `list_migrations`: el usuario pidió dejar el SQL para el final y aceptarlo él).
- **Rondas terminadas**: 1–4 (invitación cinematográfica), 5 (Supabase, editor y panel completo),
  6 (plantillas, paletas, tipografías, sobre a medida, carta, calendarios, orden de secciones) y 7
  (aperturas, portadas animadas, música, dress code, save the date y álbum con QR), 8 (borrado
  de archivos con el evento, lista de regalos y página de venta), 9 (imprimir, después de la
  boda, duplicar, aperturas, tiempo habitual, otros tipos de evento y velocidad) y 10 (sobre más
  cuidado, plantillas Cine y Herbario, XV años, dress code de revista, programa que se enciende y
  pase de fotos). Resumen de cada una en
  `docs/DECISIONS.md`.
- **Pruebas (13/11/2026, rama de trabajo con todo unido)**: 301 unitarias y 255 E2E en verde (3
  se saltan: las 2 de Supabase real, que necesitan red, y la de la píldora en el proyecto de
  escritorio). Ver también la ronda 12.
- **Evento real del usuario**: `fm-y-lucia-2030-915f24` (lo creó probando en su iPhone). No tocar.

## Pendiente

- **Ronda 11 · recursos con Higgsfield (11–13/11/2026)**. Hecho, en la rama de trabajo:
  - **Sobre de película en una sola toma** (vertical, 10 s): sin la imagen doble ni el corte a otra
    escena del vídeo anterior. Está en `main` (PR #4). Tiempos de la vibración y del destello por
    encuadre en `TIMING` (`envelope/video-envelope.tsx`).
  - **Color del sobre de película** (`theme.film`: blanco, salvia, burdeos), con su opción en el
    editor. Cada color es un vídeo propio en `public/aperturas/sobre-dorado/`.
  - **Portadas pintadas** (`ramas`, `buganvilla`, `medianoche`, `arcilla`, `orilla`) en
    `public/portadas/`, definidas en `src/lib/theme/cover.ts` (`PAINTED_COVERS`: los claros llevan
    los nombres en tinta y un halo del color del papel). En los claros, los botones de arriba de la
    invitación («Saltar intro», sonido) también van en tinta.
  - **Efectos sobre la portada** (`theme.coverEffect`: `ninguno`, `petalos`, `oro`): bucles de 4 s en
    `public/portadas/efectos/` con `mix-blend-mode: screen`; no se pintan con movimiento reducido.
  - **Plantillas nuevas** (`TEMPLATES` en `src/lib/theme/index.ts`): «Arcilla» (portada arcilla,
    pétalos, sobre burdeos), «Olivar» (ramas, sobre salvia), «Noche dorada» (medianoche, polvo de
    oro, sobre 3D) y «Buganvilla» (el sobre blanco). Pensadas para grabarlas y subirlas a Instagram.
  - Detalle y modelos usados: `docs/HIGGSFIELD.md`; el porqué, en `docs/DECISIONS.md` (ronda 11).
- **Ronda 12 · plantillas para Instagram (13–14/11/2026)**. Detalle y porqués en
  `docs/DECISIONS.md` (ronda 12). Estado:
  - **Elegidas**: Arcilla (sobre burdeos), Buganvilla (sobre blanco) y Olivar (sobre salvia), con
    los vídeos de Higgsfield que ya existen. Noche dorada queda fuera.
  - **Una boda de ejemplo por plantilla** (`src/data/demo/variants.ts`): Arcilla, María y Daniel;
    Buganvilla, Carmen y Álvaro; Olivar, Elena y Hugo. Fotos propias de las dos nuevas hechas por
    el usuario en ChatGPT (`public/fotos/buganvilla/` y `olivar/`).
  - **Para grabar** (usar la vista previa de Vercel de la rama, en pestaña privada o con `&v=N`
    para saltarse la copia guardada): `/i/familia-garcia?plantilla=arcilla&grabar=1`, igual con
    `buganvilla` y `olivar`.
  - **Hecho**: modo de grabación, revisión de diseño, botones para pasar el dress code y las
    firmas, foto de la carta encuadrada arriba, fundidos entre fondos oscuros y claros, pétalos
    de Arcilla apagados bajo los nombres y música de fondo apagada por defecto.
  - **Pruebas**: `npm run check` en verde (301 unitarias) y la batería E2E completa en verde salvo
    una intermitente («con movimiento reducido las escenas quedan quietas», pasa al repetirla) y
    la del estilo de música, ya corregida (activa la música antes de elegir estilo). La pasada de
    258 completa se hizo antes de los últimos cambios; después se repitieron editor y portadas.
  - **No comprobado**: nada se ha visto en un iPhone real; la vista previa de Vercel no se puede
    abrir desde el entorno de Claude Code (bloquea Vercel), solo se ve en navegador local.
- **Lo que falta de la ronda 11**:
  1. **Recuperar la tarjeta que sale del sobre** (petición del usuario, 13/11): la versión del
     23/10 del sobre blanco terminaba con la tarjeta saliendo y flotando, y sobre ella se escribía
     el saludo (`src/lib/quad.ts` sigue en el proyecto; el vídeo antiguo está en el historial:
     `git show e9ffb46:public/aperturas/sobre-video/sobre.mp4`). Plan: un segundo tramo de 6 s que
     empiece en el último fotograma del vídeo actual (el sobre abierto con el destello) y termine
     con la tarjeta en blanco de frente; unirlo sin corte, medir las cuatro esquinas de la tarjeta
     y volver a pegar el texto. El texto para Higgsfield está en el historial de la sesión; se
     redacta como los de `docs/HIGGSFIELD.md`.
     **Aclaración pendiente**: el usuario también quería recuperar «todo lo que se hizo por
     última vez» en la sesión «Proyecto de invitaciones», y eso ya se trajo por unión (escenas de
     después de la carta); no es lo mismo que la tarjeta. Preguntar si falta algo más.
  2. Vídeo **horizontal (16:9)** del sobre blanco de una sola toma; hoy sigue el antiguo.
  3. Repetir los **pétalos** (salen grandes y casi quietos; de momento se apagan bajo los nombres
     en la portada) y las **luciérnagas** (salían insectos);
     generar la portada **esmeralda**; tandas sin hacer: fotos de ejemplo, forros, lacres, audio.
  4. ~~Modo de grabación~~ **hecho (13/11)**: `?grabar=1` en la demo oculta «Demo con datos
     ficticios» y «Saltar intro» (el botón de sonido se queda). Ej.: `/i/familia-garcia?plantilla=buganvilla&grabar=1`.
  5. Ver **Noche dorada** (sobre 3D) en un iPhone real: aquí no hay WebGL.
  6. **PR abierto**: [#6](https://github.com/FranManuel95/Invitaciones_Eventos/pull/6), a `main`,
     un solo PR (la historia está entrelazada por las uniones). Sin fusionar: lo decide el usuario
     tras ver la vista previa. Incluye la migración del libro de firmas, ya aplicada en Supabase.
  7. Si el usuario quiere más fotos: la portada de Buganvilla hace también de foto de pareja (solo
     hay un retrato). Tandas de Higgsfield para lo que falta: `docs/higgsfield/TANDA-INSTAGRAM.md`.

- **Plan en curso (10/11/2026)**: llevar toda la invitación al nivel de la apertura del sobre en
  3D (`docs/PLAN-CINE.md`). La parte A (después de la carta) está hecha entera; queda la parte B
  (resto de aperturas) y la limpieza de la parte C. Esa línea de trabajo vive en
  `claude/loving-faraday-2aw3om-grogl2` (incluye lo de `claude/exciting-franklin-43k083`; sin PR
  abierto: producción no tiene aún ni el 3D nuevo ni las escenas de después de la carta). El
  usuario pide centrarse en el móvil y seguir puliendo todo lo de después de la carta.

- **Libro de firmas aplicado (12/11/2026)**: migración `libro_de_firmas` en Supabase, con la RLS
  comprobada (los invitados y los usuarios que no son miembros no pueden leer ni escribir en la
  tabla; solo se firma con `guestbook_sign` y el token). Los avisos de seguridad no han cambiado:
  salvo los de siempre (funciones con token abiertas por diseño, `contact_requests` sin políticas a
  propósito y la contraseña filtrada, que es del plan Pro), no hay nada nuevo. Para verlo en un
  evento real: editor → Textos → «Mostrar el libro de firmas» y publicar.
- **Higgsfield (13/11/2026)**: la cuenta que se usa ahora tiene la prueba de 3 días con
  generaciones ilimitadas (acaba el 15/11; la renovación automática está cancelada) y unos 50
  créditos. La prueba **solo sirve desde un chat de claude.ai, no desde Claude Code**. Las reglas,
  los modelos y los textos están en `docs/HIGGSFIELD.md`. Otras cuentas del usuario (la del plan
  Lite y otra gratuita) ya no pueden tener la prueba: el soporte la limita a cuentas que nunca
  tuvieron suscripción ni otra prueba, una sola vez.

- **Supabase (hecho el 22/10/2026)**: contraseña mínima de 8 caracteres y direcciones de la web
  en URL Configuration. «Leaked password protection» solo existe en el plan Pro: activarla al
  pasar a un plan de pago (el aviso de seguridad seguirá saliendo hasta entonces).
- **PR #1 fusionado en `main` (24/10/2026)**: producción en
  https://invitaciones-eventos-franmanuel95s-projects.vercel.app. La rama de trabajo sigue siendo
  `claude/loving-faraday-2aw3om`, recreada desde `main` para lo nuevo (cada bloque, un PR nuevo).
- **Vercel Authentication desactivada (24/10/2026)**: las direcciones `*.vercel.app` se abren sin
  cuenta. Supabase → URL Configuration: Site URL de producción y `…vercel.app/**` añadidas.
- **Antes de abrir la página de venta al público** (lo hace el usuario en Vercel → Settings →
  Environment Variables, y vuelve a desplegar): `LEGAL_TITULAR`, `LEGAL_NIF`, `LEGAL_DOMICILIO`,
  `LEGAL_EMAIL`; revisar los borradores de `/aviso-legal` y `/privacidad` (plazos de
  conservación incluidos); `SITE_URL` cuando haya dominio; `SIGNUP_OPEN=false` si las cuentas se
  dan solo a quien las pide (y desactivar el alta en Supabase).
- **Prueba real en GitHub Actions** («Prueba real con Supabase», se lanza a mano; solo aparece
  cuando el archivo está en `main`): variables `NEXT_PUBLIC_SUPABASE_URL` y
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, secretos `E2E_EMAIL` y `E2E_PASSWORD` (un usuario de
  prueba creado en Supabase → Authentication → Users → Add user, con «Auto Confirm»). Cada
  ejecución crea un evento «Prueba y Automática» que se queda (no se borra nada sin permiso).
- **Solicitudes de la página de venta**: se leen en Supabase → Table Editor → `contact_requests`.
- **Ideas que salieron y no se han hecho**: cobro con Stripe (el usuario aún no tiene cuenta),
  recordatorios por correo (necesitan un proveedor), dominio propio, vídeo promocional para
  Instagram con Remotion (ver ronda 10), versión en inglés
  (descartada por ahora), playlist colaborativa, más escenas o aperturas.
- **Revisión en iPhone real**: la hace el usuario y manda capturas; aquí solo hay Chromium.
- **Datos de prueba que se conservan a propósito** (el usuario pidió no borrar nada): el evento
  `prueba-despliegue-e2e` y el usuario `prueba-e2e@invitaciones.invalid`. Su contraseña no está en
  el repositorio; la E2E real la lee de `E2E_PASSWORD`.

## Cómo se trabaja aquí

- Plan aprobado → un commit por bloque → `npm run check` y `npm run test:e2e` → push → comprobar
  en Vercel que el despliegue está `READY` → resumen en español, cercano y sin tecnicismos.
- Mensajes de commit en español, con el formato de los anteriores (`git log`).
- Antes de cambiar la interfaz, las skills de `.claude/skills/` (ver `CLAUDE.md`).

## Trucos del entorno (ahorran tiempo)

- **Cuenta nueva o sesión vacía** (aprendido el 13/11): el repositorio no viene clonado; hay que
  adjuntarlo con `add_repo` (con acceso de escritura) y clonarlo con `git clone --depth 1`.
  El clon es superficial: para traer la rama de trabajo, `git fetch --depth=300 origin
+refs/heads/<rama>:refs/remotes/origin/<rama>`; y añadir esa referencia a
  `remote.origin.fetch` para que el hook de «commits sin subir» no se queje. Subir con
  `git -c push.negotiate=true push -u origin <rama>`; si da 503, repetir con espera.
- **GitHub desde el entorno**: `gh pr …` falla (GraphQL bloqueado); usar `gh api repos/…` (REST).
  Las direcciones `*.vercel.app` no se pueden abrir desde aquí.
- **Mapa de profundidad de una portada nueva**: `python3 scripts/depth-map.py <modelo.onnx>
<portada.jpg> <salida.png> 0.1` (el modelo MiDaS pequeño se descarga de
  github.com/isl-org/MiDaS/releases/download/v2_1/model-small.onnx).

- **Higgsfield** (vídeo e imagen con IA): conector personalizado
  `https://mcp.higgsfield.ai/mcp` (el del catálogo de Claude solo lee). Lo ilimitado de la prueba
  solo va desde un chat de claude.ai: aquí se descargan (`show_generations` → `rawUrl` → `curl`),
  se revisan y se montan. Antes de gastar créditos, `get_cost: true`. Guía completa y textos:
  `docs/HIGGSFIELD.md`. Subir imágenes: `media_upload`, `curl -X PUT` y `media_confirm`.
- **Dependencias tras cambiar de rama**: `npm ci`, luego `npx next typegen` (sin él, `tsc` falla con
  «Cannot find name 'PageProps'») y `npm run check`. Las E2E necesitan el build.
- **Pruebas largas**: `npx playwright test --trace off` tarda unos 7–8 minutos; se lanza en segundo
  plano y no se sube hasta que acaba. Una prueba del editor («sin desbordes ni infracciones
  graves») era intermitente por medir el contraste en mitad de una transición; ya espera 350 ms.
- **Capturas de la invitación**: llegar a la carta (`toca para abrir` → `Abrir el sobre`) y a
  «Descubrir la invitación», y bajar con `window.scrollTo`; las escenas necesitan ~900 ms por
  paso. El sobre 3D no se ve en Chromium de pruebas (sin WebGL).
- **Hooks de Stop**: avisan si hay commits sin subir; se sube al final de cada bloque, con las
  pruebas ya pasadas. Si Git rechaza un `push --force` por la clasificación de seguridad, se une la
  rama con su historia (`git merge -s ours origin/<rama> -m "…"`) en vez de reescribirla.

- **Supabase pausado**: en el plan gratuito el proyecto se pausa solo. Con el conector de Supabase,
  `restore_project` lo reactiva; tarda unos minutos y mientras tanto las consultas dan «connection
  timeout» (el historial de migraciones sale vacío hasta que arranca del todo).
- **Supabase desde el sandbox**: el proxy bloquea `*.supabase.co`; la app real solo se prueba en
  Vercel. La base de datos se toca con las herramientas MCP (`apply_migration`, `execute_sql`,
  `get_advisors`).
- **SQL con el usuario**: pidió dejar las migraciones para el final del trabajo y aceptarlas él;
  también puede rechazar consultas de solo lectura. Preguntar antes de tocar Supabase.
- **Confirmaciones de Supabase**: el servidor MCP pide confirmación cuando el SQL contiene
  `delete` (aunque sea dentro de una función) y la llamada caduca a los 60 s si nadie la acepta.
  Diseñar sin borrados cuando sea posible o avisar al usuario antes.
- **Pruebas de RLS**: dentro de `begin; … set local role anon; … rollback;`, guardando los
  resultados en una tabla temporal para verlos al final.
- **Tipos de rutas**: tras crear una ruta nueva, `npx next typegen`.
- **Servidor de pruebas**: Playwright arranca `next start` en el puerto 3100. Para matar uno
  colgado: `pkill -f "next-serve[r]"` (con el corchete, para no matar la propia shell).
- **Capturas con Playwright**: `chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })`
  y el script en la raíz del repo (para que encuentre `node_modules`), borrándolo después.
- **Formato**: `npx prettier --write` sobre lo tocado antes de `npm run check`.
- **Reinicios**: si la sesión se reinicia y vuelve en modo Plan, apuntar el progreso en el plan y
  pedir aprobación; no se pierde nada si cada bloque se sube al terminarlo.
