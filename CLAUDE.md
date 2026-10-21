# Invitaciones_Eventos

Prototipo de invitaciones digitales premium (Next.js 16, React 19, Tailwind 4, Motion, Zod).

- Especificación del producto: `PROJECT_SPEC.md`. Decisiones de diseño y técnicas: `docs/DECISIONS.md`.
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
