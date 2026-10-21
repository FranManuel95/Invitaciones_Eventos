# Skills del proyecto

Copias literales de skills públicas que Claude Code carga automáticamente al trabajar en este
repositorio. Se incluyen sin modificar, con su licencia original. Este README solo añade las
notas propias del proyecto.

| Skill | Origen | Commit | Licencia |
| --- | --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | `dbd4588` | Apache-2.0 (`LICENSE.txt`) |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | `063bee9` | MIT (`LICENSE.txt`) |
| `react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) | `063bee9` | MIT (`LICENSE.txt`) |
| `react-view-transitions` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-view-transitions) | `063bee9` | MIT (`LICENSE.txt`) |
| `composition-patterns` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns) | `063bee9` | MIT (`LICENSE.txt`) |
| `writing-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/writing-guidelines) | `063bee9` | MIT (`LICENSE.txt`) |
| `webapp-testing` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) | `dbd4588` | Apache-2.0 (`LICENSE.txt`) |

`web-design-guidelines/guidelines-snapshot.md` es una copia de las reglas de
[vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)
(MIT, `LICENSE-guidelines.txt`). Lo mismo con `writing-guidelines/guidelines-snapshot.md`
([vercel-labs/writing-guidelines](https://github.com/vercel-labs/writing-guidelines), MIT). Las skills
piden descargar las reglas en cada revisión; las copias sirven cuando no hay red.

## Notas para este proyecto

- **Textos.** `writing-guidelines` está pensada para documentación en inglés. Aquí se aplican sus
  reglas de voz (activa, segunda persona, frases cortas, sin relleno), no las de estructura de
  documentos.
- **Pruebas.** `webapp-testing` incluye scripts de Python. En este proyecto se aplica la misma
  metodología con Playwright en TypeScript (`tests/e2e`).
- **Idioma.** La interfaz está en español. Donde las guías piden *Title Case*, se usa mayúscula
  solo en la primera palabra, como manda la ortografía española.
- **Brief.** La dirección de arte acordada (paleta, Bodoni Moda + Jost, motivo de almendro) está
  en `docs/DECISIONS.md`. Según `frontend-design`, el brief prevalece sobre los valores por
  defecto.
- **Motion.** El repositorio `motiondivision/motion` (MIT) no publica una skill para usar la
  librería; sus agentes son para desarrollarla. Las prácticas que seguimos (LazyMotion + `m`,
  `useReducedMotion`, animar solo `transform`/`opacity`) están en `docs/DECISIONS.md`.
- **Actualizar.** Para actualizar una skill, vuelve a copiar la carpeta desde su origen y
  actualiza el commit en esta tabla.
