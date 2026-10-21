"use client";

import type { ReactNode } from "react";
import { ChoiceCard } from "@/components/ui/fields";
import {
  CALENDAR_IDS,
  CALENDARS,
  ENVELOPE_IDS,
  ENVELOPES,
  STYLE_IDS,
  STYLES,
  WAX_IDS,
  WAXES,
  type Theme,
} from "@/lib/theme";
import { Group, useEditor } from "../fields";

function Swatches({ colors }: { colors: string[] }) {
  return (
    <span aria-hidden className="flex shrink-0 -space-x-1.5">
      {colors.map((c, i) => (
        <span key={i} className="size-6 rounded-full ring-2 ring-paper" style={{ background: c }} />
      ))}
    </span>
  );
}

function Choice<K extends keyof Theme>({
  name,
  value,
  label,
  description,
  swatch,
}: {
  name: K;
  value: Theme[K];
  label: string;
  description?: string;
  swatch: ReactNode;
}) {
  const { draft, setTheme } = useEditor();
  return (
    <ChoiceCard
      name={`tema-${name}`}
      value={value}
      checked={draft.theme[name] === value}
      onChange={() => setTheme({ ...draft.theme, [name]: value })}
      label={
        <span className="flex items-center justify-between gap-3">
          {label}
          {swatch}
        </span>
      }
      description={description}
    />
  );
}

/** Estilo, sobre, lacre y calendario: opciones cerradas y con contraste revisado. */
export function StyleTab() {
  return (
    <div className="grid gap-8">
      <Group title="Estilo" description="Papel, tinta y tipografía de toda la invitación.">
        <div role="radiogroup" aria-label="Estilo" className="grid gap-3">
          {STYLE_IDS.map((id) => {
            const s = STYLES[id];
            return (
              <Choice
                key={id}
                name="style"
                value={id}
                label={s.label}
                description={s.description}
                swatch={<Swatches colors={[s.palette.paper, s.palette.ink, s.palette.gold]} />}
              />
            );
          })}
        </div>
      </Group>
      <Group title="Sobre">
        <div role="radiogroup" aria-label="Sobre" className="grid gap-3">
          {ENVELOPE_IDS.map((id) => {
            const e = ENVELOPES[id];
            return (
              <Choice
                key={id}
                name="envelope"
                value={id}
                label={e.label}
                description={e.description}
                swatch={<Swatches colors={[e.paper[0], e.inside]} />}
              />
            );
          })}
        </div>
      </Group>
      <Group title="Lacre" description="También marca el día de la boda en el calendario.">
        <div role="radiogroup" aria-label="Lacre" className="grid gap-3 sm:grid-cols-2">
          {WAX_IDS.map((id) => (
            <Choice
              key={id}
              name="wax"
              value={id}
              label={WAXES[id].label}
              swatch={<Swatches colors={[WAXES[id].hex]} />}
            />
          ))}
        </div>
      </Group>
      <Group title="Calendario">
        <div role="radiogroup" aria-label="Calendario" className="grid gap-3">
          {CALENDAR_IDS.map((id) => (
            <Choice
              key={id}
              name="calendar"
              value={id}
              label={CALENDARS[id].label}
              description={CALENDARS[id].description}
              swatch={null}
            />
          ))}
        </div>
      </Group>
    </div>
  );
}
