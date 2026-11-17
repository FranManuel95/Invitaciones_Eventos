# Plan de trabajo en equipo: lo que falta para vender

Documento de traspaso (17/11/2026). Está escrito para otra cuenta o sesión que no ha visto la
conversación. Contiene el estado real, las tareas repartidas en cuatro agentes con sus encargos
listos para copiar, cómo integrarlas y lo que queda pendiente de datos del cliente.

**Lee antes:** `CLAUDE.md`, `docs/TRASPASO.md` (trucos del entorno) y las rondas 14 a 28 de
`docs/DECISIONS.md` (lo último hecho).

**Fuera de alcance por decisión del cliente:** no hacer vídeos nuevos (nada de Higgsfield) y
nada de envío por correo.

---

## 1. Estado en una página

| Cosa                         | Dónde está                                                                                                                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repositorio                  | `FranManuel95/Invitaciones_Eventos`                                                                                                                                                                        |
| Rama de trabajo              | `claude/tender-franklin-isgz7b` (último commit al escribir esto: `630354e`)                                                                                                                                |
| Producción                   | `main`, **muy por detrás**: todo lo de las rondas 9 a 28 está solo en la rama                                                                                                                              |
| PR abierta                   | #6, rama de trabajo → `main`, **sin fusionar** (es enorme: cientos de archivos)                                                                                                                            |
| Vercel                       | equipo `franmanuel95s-projects`, proyecto `invitaciones-eventos`                                                                                                                                           |
| Vista previa fija de la rama | `https://invitaciones-eventos-git-claude-t-205829-franmanuel95s-projects.vercel.app/`                                                                                                                      |
| Dominio comprado             | `efeleeventos.com` y `efeleeventos.es` en DonDominio (a nombre personal: aún no hay empresa ni autónomo)                                                                                                   |
| Subdominio conectado         | `invitaciones.efeleeventos.com` → proyecto de Vercel, **ligado a la rama de trabajo** (no a producción). CNAME `invitaciones` → `9cf3dcd1739022b9.vercel-dns-017.com` ya puesto en DonDominio y verificado |
| Marca                        | **eFeLe** (así, con esas mayúsculas), empresa de decoración de eventos. Instagram `@eventos.efele`. El servicio se llama «Invitaciones eFeLe»                                                              |

Lo que ya está hecho y no hay que rehacer:

- **Página de venta** (`src/app/page.tsx`, `src/app/venta.css`, `src/features/sales/`): rediseñada
  con identidad propia (tinta `#1b2033`, papel `#f4f2ed`, oro `#c8a45c` / `#86662a` como texto,
  lacre `#8a2433`, titulares en Italiana y cifras en Bodoni). Portada con el vídeo real del sobre,
  recorrido del invitado (paso a paso en el móvil), muestrario de 25 plantillas por familias,
  precio en tarjeta con lacre, marca eFeLe en cabecera y pie. Ronda 27 y siguientes.
- **Panel de los novios** (`src/app/panel/[evento]/`): rediseñado con la misma identidad
  (`panel.css`), menú lateral de tinta, barra inferior y hoja «Más» en el móvil. Ronda 28.
- **25 plantillas**: 10 de papel y acuarela con apertura en vídeo y 15 de «objetos» (periódico,
  billete, décimo, vinilo…). `docs/CONCEPTOS.md`.
- **Regalos y vestimenta**: apagados por defecto en plantillas y demo; cada cliente los enciende
  en el editor. Ronda 24.
- **Arreglo**: en la demo cada plantilla empieza por su portada aunque se hayan visto otras.

---

## 2. Reparto en agentes

Cuatro agentes trabajan **en paralelo**, cada uno en **su propia copia** (`isolation: "worktree"`
con la herramienta Agent) para no pisarse. Cada uno usa **un puerto distinto** para servir la web y
las pruebas (Playwright lee `PORT`; por defecto 3100). Ninguno hace push: cada uno hace commit en
su rama y la sesión principal integra.

| Agente | Tarea                                           | Puerto | Zona que toca                                                                                        |
| ------ | ----------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| A      | Rediseño del editor                             | 3301   | `src/app/editor/`, `src/features/editor/`                                                            |
| B      | `/ejemplos` y sección de decoración en la venta | 3302   | `src/app/ejemplos/`, `src/app/page.tsx` (solo añadir sección), `src/features/sales/`                 |
| C      | Alta de pareja y novedades en el panel          | 3303   | `src/app/entrar/`, `src/app/panel/page.tsx`, `src/app/panel/create-event-form.tsx`, inicio del panel |
| D      | Bodas de ejemplo propias y pendientes técnicos  | 3304   | `src/data/demo/variants.ts`, `tests/e2e/portadas.spec.ts`, Supabase solo lectura                     |

**Nadie edita `docs/DECISIONS.md`** (provocaría conflictos): cada agente lo cuenta en su informe y
la sesión principal lo escribe al integrar.

### Reglas comunes (van incluidas en cada encargo)

- Leer `CLAUDE.md` y `docs/TRASPASO.md`. Textos en español, tono cercano; datos ficticios.
- `npm ci` y luego `npx next typegen` (sin él, `tsc` falla con «Cannot find name 'PageProps'»).
- Chromium ya está en `/opt/pw-browsers/chromium`. **Nunca** `playwright install`. En scripts:
  `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`.
- Capturas antes y después, en escritorio (1440×900) y móvil (iPhone 13, 390×844; y 375×667 para
  pantallas bajas), mirándolas de verdad. Medir desbordes:
  `document.documentElement.scrollWidth - document.documentElement.clientWidth` debe ser 0.
- Nada se sale de los márgenes de la página, ni en ordenador ni en móvil (el cliente lo ha pedido
  varias veces: carriles y capturas no llegan al borde de la ventana).
- Botones táctiles de al menos 44 px; foco visible; respetar movimiento reducido; contraste AA
  (las pruebas pasan axe y fallan con «color-contrast»).
- `npm run start` no ve imágenes de `public/` creadas después de arrancar: reiniciar el servidor.
- Antes de terminar: `npm run check` en verde y las e2e de su zona en verde. Si cambian textos o
  roles que buscan las pruebas, se adaptan las pruebas **sin debilitarlas**.
- Commit en su rama, mensaje en español, terminando con las líneas de atribución de la sesión.
- Informe final breve: rama y commit, qué cambió, resultados, pendientes y dos capturas.

### Encargo A — Rediseño del editor

```
Trabajas en Invitaciones_Eventos (Next.js 16, React 19, Tailwind 4) en una copia aislada que
parte de la rama claude/tender-franklin-isgz7b. Lee CLAUDE.md, docs/TRASPASO.md y
docs/PLAN-EQUIPO.md (reglas comunes, que se aplican). Puerto: 3301 (PORT=3301 para Playwright y
npx next start -p 3301).

Encargo: rediseñar el editor de la invitación (/editor/[evento]; código en src/app/editor/ y
src/features/editor/, pestañas en src/features/editor/tabs/; style-tab.tsx tiene 1.100 líneas)
para que:
1. Tenga la identidad del panel ya rediseñado: src/app/panel/[evento]/panel.css (clase .panel que
   redefine los colores del tema; .panel-dark para zonas de tinta; .panel-title con Italiana),
   src/app/panel/[evento]/layout.tsx y src/features/dashboard/panel-nav.tsx. Extrae lo común a un
   archivo compartido (p. ej. src/app/marca.css) que usen panel y editor, en vez de duplicarlo.
   La vista previa (iframe con la invitación) sigue con los colores de la propia invitación.
2. Sea más fácil: pestañas y grupos claros, etiquetas comprensibles, estados vacíos útiles, la
   vista previa siempre a mano y el botón de publicar visible.
3. Vaya muy bien en el móvil (390×844 y 375×667): sin desbordes, nada cortado, nada fuera de los
   márgenes; mejorar el conmutador «Editar / Vista previa».
Skills: frontend-design y web-design-guidelines (herramienta Skill).
No toques: la venta, /ejemplos, src/app/panel/page.tsx, src/app/entrar/, src/data/demo/,
docs/DECISIONS.md. globals.css solo si es imprescindible y mínimo.
Comprobación: npm run check; npm run build; PORT=3301 npx playwright test
tests/e2e/editor.spec.ts tests/e2e/portadas.spec.ts tests/e2e/aperturas.spec.ts --trace off.
Commit en tu rama, sin push. Informe: rama, commit, cambios, resultados, pendientes y dos
capturas (escritorio y móvil) en el scratchpad.
```

### Encargo B — `/ejemplos` y sección «a juego con vuestra decoración»

```
Trabajas en Invitaciones_Eventos en una copia aislada que parte de claude/tender-franklin-isgz7b.
Lee CLAUDE.md, docs/TRASPASO.md y docs/PLAN-EQUIPO.md (reglas comunes). Puerto: 3302.

Encargo 1: rediseñar /ejemplos (src/app/ejemplos/page.tsx y los escaparates de
src/features/sales/showcase.tsx que use) con la identidad de la página de venta: src/app/venta.css
(clase .venta, .v-display Italiana, .v-num Bodoni para cifras, .v-ink zonas de tinta, .v-link,
.v-btn) y src/app/page.tsx como referencia. Cabecera y pie con la marca «eFeLe Invitaciones»
como en la venta. Las aperturas en vídeo, las portadas y las plantillas, con el mismo cuidado
del muestrario de la venta (src/features/sales/sample-book.tsx: pestañas por familia y carril
dentro de los márgenes). Hoy /ejemplos conserva el diseño antiguo (crema, flores) y se enlaza
desde la venta.

Encargo 2: en la página de venta (src/app/page.tsx), añadir UNA sección nueva entre «Y vosotros,
la boda en orden» y el precio: la invitación a juego con la decoración, que es lo que diferencia
a eFeLe (empresa de decoración de eventos, Instagram @eventos.efele): mismos colores, flores y
lacre que la decoración del día; se puede pedir junto con la decoración. Sin precios ni
promesas concretas que el cliente no haya decidido (por ejemplo, nada de «gratis con la
decoración»): texto del tipo «contadnos vuestra decoración y la invitación la sigue». Imágenes:
reutiliza recursos de public/ (portadas pintadas de public/portadas/, acuarelas de
public/acuarelas/, lacre de public/venta/lacre-oro.webp). No generes vídeos ni imágenes con IA.
Botón a #pedir. Añade la sección a tests/e2e/venta.spec.ts.

Skills: frontend-design, web-design-guidelines, writing-guidelines.
No toques: el editor, el panel, src/data/demo/, docs/DECISIONS.md.
Comprobación: npm run check; npm run build; PORT=3302 npx playwright test tests/e2e/venta.spec.ts
--trace off. Commit en tu rama, sin push. Informe con capturas (escritorio y móvil).
```

### Encargo C — Alta de pareja y novedades en el panel

```
Trabajas en Invitaciones_Eventos en una copia aislada que parte de claude/tender-franklin-isgz7b.
Lee CLAUDE.md, docs/TRASPASO.md y docs/PLAN-EQUIPO.md (reglas comunes). Puerto: 3303.

Encargo 1: revisar y mejorar el camino de una pareja nueva: /entrar (src/app/entrar/),
/panel «Mis eventos» (src/app/panel/page.tsx), el formulario de crear evento
(src/app/panel/create-event-form.tsx, acciones en src/app/panel/actions.ts) y la primera vez que
entra en el panel. Con la identidad del panel (src/app/panel/[evento]/panel.css; para páginas
fuera de [evento], importa ese CSS o el común si el agente A lo extrae; si no existe aún, importa
panel.css). Añade al inicio del panel una guía de primeros pasos para un evento recién creado
(elegir plantilla, poner fotos y textos, añadir invitaciones, publicar), que se oculta sola
cuando ya están hechos. La lógica de «qué está hecho» va en src/lib/ con pruebas unitarias.
Sin Supabase real en las pruebas: las e2e usan la demo (/panel/demo) y lo que ya existe.

Encargo 2: novedades sin correo. En el inicio del panel, un bloque «Desde vuestra última visita»
con las respuestas nuevas (quién ha confirmado o dicho que no, con fecha), guardando en el
navegador (localStorage, con try/catch) la fecha de la última visita. Si no hay nada nuevo, no
se muestra. En la navegación, un punto en «Invitaciones» o «Lista de invitados» cuando hay
respuestas nuevas. Lógica pura en src/lib/ con pruebas unitarias.

Skills: frontend-design, web-design-guidelines, writing-guidelines.
No toques: el editor, la venta, /ejemplos, src/data/demo/ (salvo leerlo), docs/DECISIONS.md.
Comprobación: npm run check; npm run build; PORT=3303 npx playwright test tests/e2e/panel.spec.ts
tests/e2e/invitaciones.spec.ts tests/e2e/organizacion.spec.ts --trace off. Commit en tu rama, sin
push. Informe con capturas.
```

### Encargo D — Bodas de ejemplo propias y pendientes técnicos

```
Trabajas en Invitaciones_Eventos en una copia aislada que parte de claude/tender-franklin-isgz7b.
Lee CLAUDE.md, docs/TRASPASO.md y docs/PLAN-EQUIPO.md (reglas comunes). Puerto: 3304.

Encargo 1: en src/data/demo/variants.ts varias plantillas reutilizan la boda de otra con la
función retitle (cambia nombres, fecha y foto, pero repite ciudad, lugares, historia, programa,
preguntas y mensajes del libro de firmas). Dale a cada una su boda propia y verosímil: ciudad,
lugares, historia, programa, menú, rutas de autobús y textos coherentes con el concepto de la
plantilla (p. ej. Embarque con una pareja viajera, Vinilo con una pareja musical, Cosecha en una
bodega). Puedes reutilizar las fotos que ya hay en public/fotos/ (no hay fotos nuevas ni se
generan). Datos 100 % ficticios. Mantén lo que las pruebas esperan (nombres de las parejas,
fechas) o ajusta las pruebas sin debilitarlas: tests/e2e/conceptos.spec.ts y portadas.spec.ts
buscan nombres concretos.

Encargo 2: la prueba «con movimiento reducido las escenas quedan quietas»
(tests/e2e/portadas.spec.ts) falla a veces (3 de cada 10 aprox., ya fallaba antes). Encuentra la
causa (probablemente se comprueban las animaciones antes de que la escena termine de montarse)
y arréglala en la prueba o en el código, sin quitar la comprobación. Demuéstralo con
--repeat-each=10 en verde.

Encargo 3 (solo lectura): con las herramientas de Supabase (mcp__Supabase__list_projects,
list_migrations, get_advisors), comprueba si la migración
supabase/migrations/20261112100000_libro_de_firmas.sql está aplicada en el proyecto real y si
hay avisos de seguridad. NO apliques nada: solo informa. Si no tienes acceso, dilo.

Skills: writing-guidelines para los textos.
No toques: editor, venta, panel, /ejemplos, docs/DECISIONS.md.
Comprobación: npm run check; npm run build; PORT=3304 npx playwright test
tests/e2e/conceptos.spec.ts tests/e2e/portadas.spec.ts tests/e2e/invitado.spec.ts --trace off.
Commit en tu rama, sin push. Informe con lo de Supabase.
```

---

## 3. Integración (sesión principal)

1. Lanzar los cuatro encargos con la herramienta Agent, `isolation: "worktree"`,
   `run_in_background: true`. No esperar con `sleep`: el aviso llega solo al terminar.
2. Al acabar cada uno, revisar su informe y sus capturas, y unir su rama a
   `claude/tender-franklin-isgz7b` con `git merge --no-ff <rama>`. Orden recomendado: D, C, B, A
   (el editor es el más grande; así sus conflictos, si hay, se resuelven al final).
   Conflictos probables: `src/app/panel/[evento]/panel.css` o un CSS común (A y C) y
   `tests/e2e/*.spec.ts`. No reescribir historia ni forzar push (el entorno lo bloquea).
3. Tras unirlo todo: `npm run check` y la batería completa en segundo plano
   (`npx playwright test --trace off`, unos 11 minutos). Con todo en verde, push.
4. Escribir en `docs/DECISIONS.md` una ronda por agente (29 y siguientes) con lo que cuenten sus
   informes, y actualizar `docs/TRASPASO.md`.
5. Comprobar en Vercel que el despliegue de la rama está `READY` y avisar al cliente con
   enlaces a `https://invitaciones.efeleeventos.com` (y `/ejemplos`, `/editor/demo`,
   `/panel/demo`).

---

## 4. Al final: lo que necesita datos o decisiones del cliente

No se hace sin preguntar. Pedirlo todo junto, en un mensaje claro.

1. **Llevar a producción.** Fusionar la PR #6 en `main` (enorme: revisar que el despliegue de
   la rama funciona antes). Después, en Vercel, quitar la rama del dominio
   `invitaciones.efeleeventos.com` para que sirva producción (herramienta
   `mcp__Vercel__add_project_domain`/editar el dominio del proyecto, o desde el panel de Vercel).
   **Requiere el «sí» explícito del cliente.**
2. **Datos legales** (aviso legal y privacidad muestran «[pendiente: …]»): variables de entorno
   en Vercel, nunca en el repositorio: `LEGAL_TITULAR`, `LEGAL_NIF`, `LEGAL_DOMICILIO`,
   `LEGAL_EMAIL` (`src/lib/site.ts`). Ahora no hay empresa ni autónomo dados de alta. Lo ideal es
   que el cliente los meta él mismo en Vercel (Settings → Environment Variables) para no pasar
   datos personales por el chat; luego hay que volver a desplegar.
3. **Que Google la encuentre:** variable `SITE_URL=https://invitaciones.efeleeventos.com`
   (sin barra final). Sin ella la web lleva `noindex` a propósito. Solo cuando esté en producción.
4. **Precio e IVA.** Hoy pone 129 € sin aclarar IVA. Estudio de mercado hecho (ver conversación
   resumida aquí): la competencia en España está entre 79 y 129 € la invitación con confirmación,
   100–200 € con sobre animado y 200–250 € a medida. Opciones propuestas: mantener 129 € como
   precio de lanzamiento con el normal a la vista (p. ej. 169 €); dos niveles (149 € y 199–249 €);
   o descuento al contratar la decoración. A particulares el precio se muestra con IVA incluido.
   El precio está en `PRICE_EUR` (`src/lib/sales/contact.ts`). **Decide el cliente.**
5. **`efeleeventos.es`.** Redirigirlo a la web: en DonDominio, redirección web de
   `efeleeventos.es` a `https://invitaciones.efeleeventos.com` (o a la web de la empresa cuando
   exista). `efeleeventos.com` (sin subdominio) se reserva para la web general de eFeLe.
6. **Cobro online** (Stripe): el cliente no tiene cuenta; hoy la venta recoge solicitudes en la
   tabla `contact_requests` de Supabase.
7. **Probar en móviles reales**: lo hace el cliente y manda capturas.

---

## 5. Trucos que ahorran tiempo

- En Claude Code no se puede hacer `sleep` largo: esperar con bucles `until … ; do sleep 5; done`
  o lanzar en segundo plano.
- Antes de mirar capturas, construir (`npm run build`) y reiniciar el servidor: un `next start`
  viejo sirve la versión anterior.
- La pila de `git stash` se comparte entre copias: si hay que usarla, `git stash push -m <etiqueta>`
  y aplicar por SHA, nunca `git stash pop` a secas.
- Prueba intermitente conocida: «con movimiento reducido las escenas quedan quietas» (la arregla
  el agente D). Otra del editor falla a veces en carga alta; repetida, pasa.
- Las direcciones `*.vercel.app` y el dominio propio no se pueden abrir desde el contenedor (el
  proxy lo bloquea); para saber si un despliegue está bien, usar las herramientas de Vercel
  (`list_deployments`, `get_deployment`, `get_domain_config`).
