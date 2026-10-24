# Invitaciones_Eventos

Invitaciones digitales premium con editor y panel (Next.js 16, React 19, Tailwind 4, Motion, Zod,
Supabase).

- Rutas: invitación `/i/[token]`, editor `/editor/[evento]`, panel `/panel/[evento]`. `demo` es la
  demostración con datos en memoria (sin red); el resto son eventos reales en Supabase.
- Datos: todo pasa por `src/lib/data/repository.ts`. Los cambios de esquema van como migración en
  `supabase/migrations/` (RLS en cada tabla nueva; los invitados solo acceden por funciones con
  token) y se revisan con los avisos de seguridad de Supabase.
- Lógica sin React (temas, CSV, mesas, presupuesto…) en `src/lib/`, con pruebas unitarias.

- Especificación del producto: `PROJECT_SPEC.md`. Decisiones de diseño y técnicas: `docs/DECISIONS.md`.
- Al empezar una sesión, lee `docs/TRASPASO.md`: estado del trabajo, pendientes y trucos del entorno.
- Antes de cambiar la interfaz, aplica las skills de `.claude/skills/`:
  - `frontend-design` para la dirección visual;
  - `web-design-guidelines` para revisar la usabilidad y la accesibilidad;
  - `react-best-practices` para el rendimiento;
  - `react-view-transitions` para la continuidad entre pantallas;
  - `composition-patterns` para la arquitectura de componentes;
  - `writing-guidelines` para los textos;
  - `webapp-testing` para la verificación visual.
- Comprobaciones antes de subir cambios: `npm run check` (lint, tipos, unitarias y build) y
  `npm run test:e2e` (Playwright con axe; requiere el build).
- Textos de la interfaz en español y en tono cercano. Todos los datos son ficticios. Nunca se
  añaden secretos ni datos personales reales.
