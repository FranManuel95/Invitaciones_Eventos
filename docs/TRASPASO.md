# Traspaso entre sesiones

Estado del trabajo para retomarlo en una sesión nueva sin perder el hilo. Complementa a
`CLAUDE.md` (reglas), `PROJECT_SPEC.md` (producto) y `docs/DECISIONS.md` (por qué está hecho así).

## Dónde estamos

- **Rama de trabajo**: `claude/loving-faraday-2aw3om`. PR:
  https://github.com/FranManuel95/Invitaciones_Eventos/pull/1
- **Vista previa** (Vercel, se despliega con cada push):
  https://invitaciones-eventos-git-claude-l-2820ea-franmanuel95s-projects.vercel.app
- **Supabase**: proyecto `uzmrvclmjtxhcglyqadm` (París, plan gratuito). Todas las migraciones de
  `supabase/migrations/` están aplicadas.
- **Rondas terminadas**: 1–4 (invitación cinematográfica), 5 (Supabase, editor y panel completo),
  6 (plantillas, paletas, tipografías, sobre a medida, carta, calendarios, orden de secciones) y 7
  (aperturas, portadas animadas, música, dress code, save the date y álbum con QR). Resumen de
  cada una en `docs/DECISIONS.md`.
- **Pruebas al cerrar la ronda 7**: 222 unitarias y 144 E2E en verde (2 se saltan: las de Supabase
  real, que necesitan red).

## Pendiente

- **De la pareja (panel de Supabase)**: Authentication → URL Configuration (Site URL y
  `https://<dominio>/**` en Redirect URLs) y activar «Leaked password protection».
- **Revisar y fusionar el PR** cuando el usuario lo decida.
- **Ideas que salieron y no se han hecho**: pagos y página de venta (Stripe), versión en inglés,
  playlist colaborativa, lista de regalos, más escenas o aperturas, revisión en iPhone real.
- **Datos de prueba que se conservan a propósito** (el usuario pidió no borrar nada): el evento
  `prueba-despliegue-e2e` y el usuario `prueba-e2e@invitaciones.invalid`. Su contraseña no está en
  el repositorio; la E2E real la lee de `E2E_PASSWORD`.

## Cómo se trabaja aquí

- Plan aprobado → un commit por bloque → `npm run check` y `npm run test:e2e` → push → comprobar
  en Vercel que el despliegue está `READY` → resumen en español, cercano y sin tecnicismos.
- Mensajes de commit en español, con el formato de los anteriores (`git log`).
- Antes de cambiar la interfaz, las skills de `.claude/skills/` (ver `CLAUDE.md`).

## Trucos del entorno (ahorran tiempo)

- **Supabase desde el sandbox**: el proxy bloquea `*.supabase.co`; la app real solo se prueba en
  Vercel. La base de datos se toca con las herramientas MCP (`apply_migration`, `execute_sql`,
  `get_advisors`).
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
