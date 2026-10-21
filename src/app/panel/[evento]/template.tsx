import { ViewTransition } from "react";

/**
 * La plantilla se vuelve a montar en cada navegación del panel: la sección que sale se
 * desvanece y la nueva aparece (clases fade-out/fade-in de globals.css). Las secciones son
 * del mismo nivel, así que no hay deslizamientos.
 */
export default function PanelTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="fade-in" exit="fade-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
