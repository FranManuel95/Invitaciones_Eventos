"use client";

import { clsx } from "clsx";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChoiceCard } from "@/components/ui/fields";
import {
  accentFor,
  applyTemplate,
  CALENDAR_IDS,
  CALENDARS,
  ENVELOPE_IDS,
  ENVELOPES,
  SECTION_IDS,
  SECTIONS,
  STYLE_IDS,
  STYLES,
  TEMPLATE_IDS,
  TEMPLATES,
  templateOf,
  WAX_IDS,
  WAXES,
  type Theme,
} from "@/lib/theme";

// Pestaña «Estilo» del editor: plantillas y, por apartados, cada detalle del aspecto.
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

type ChoiceKey = "style" | "envelope" | "wax" | "calendar";

function Choice<K extends ChoiceKey>({
  name,
  value,
  label,
  description,
  swatch,
  extra,
}: {
  name: K;
  value: Theme[K];
  label: string;
  description?: string;
  swatch: ReactNode;
  /** Cambios que acompañan a la elección (p. ej. quitar el color propio al elegir un lacre). */
  extra?: Partial<Theme>;
}) {
  const { draft, setTheme } = useEditor();
  const checked = draft.theme[name] === value && (name !== "wax" || !draft.theme.waxColor);
  return (
    <ChoiceCard
      name={`tema-${name}`}
      value={value}
      checked={checked}
      onChange={() => setTheme({ ...draft.theme, [name]: value, ...extra })}
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

const PARTS = [
  { id: "plantillas", label: "Plantillas", Panel: TemplatesPart },
  { id: "colores", label: "Colores", Panel: ColorsPart },
  { id: "sobre", label: "Sobre", Panel: EnvelopePart },
  { id: "calendario", label: "Calendario", Panel: CalendarPart },
  { id: "secciones", label: "Secciones y música", Panel: SectionsPart },
] as const;

/** Estilo: se parte de una plantilla y se ajusta cada detalle por apartados. */
export function StyleTab() {
  const [part, setPart] = useState<(typeof PARTS)[number]["id"]>("plantillas");
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const id = useId();
  const current = PARTS.find((p) => p.id === part) ?? PARTS[0];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = PARTS[(index + delta + PARTS.length) % PARTS.length]!;
    setPart(next.id);
    refs.current.get(next.id)?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Apartados del estilo"
        className="-mx-1 mb-6 flex flex-wrap gap-2 px-1"
      >
        {PARTS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              if (el) refs.current.set(p.id, el);
            }}
            type="button"
            role="tab"
            id={`${id}-${p.id}`}
            aria-selected={part === p.id}
            aria-controls={`${id}-panel`}
            tabIndex={part === p.id ? 0 : -1}
            onClick={() => setPart(p.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={clsx(
              "rounded-full border px-3.5 py-1.5 text-[0.875rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              part === p.id
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-ink-soft hover:border-ink/40",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${current.id}`}
        className="grid gap-8"
      >
        <current.Panel />
      </div>
    </div>
  );
}

/** Muestra en miniatura de una plantilla: papel, tinta, sobre y lacre. */
function TemplateSample({ look }: { look: Theme }) {
  const p = STYLES[look.style].palette;
  const env = ENVELOPES[look.envelope];
  return (
    <span
      aria-hidden
      className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-md ring-1 ring-ink/10"
      style={{ background: STYLES[look.style].scene[1] }}
    >
      <span
        className="absolute inset-x-3 top-3 bottom-2 block rounded-[2px]"
        style={{ background: `linear-gradient(180deg, ${env.paper[0]}, ${env.paper[1]})` }}
      />
      <span
        className="absolute inset-x-3 top-3 block h-7"
        style={{
          background: `linear-gradient(180deg, ${env.paper[0]}, ${env.paper[1]})`,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          filter: "brightness(0.96)",
        }}
      />
      <span
        className="absolute top-[2.35rem] left-1/2 block size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: look.waxColor ?? WAXES[look.wax].hex }}
      />
      <span className="absolute right-1.5 bottom-1.5 flex gap-0.5">
        <span className="block size-2 rounded-full" style={{ background: p.ink }} />
        <span className="block size-2 rounded-full" style={{ background: p.gold }} />
      </span>
    </span>
  );
}

function TemplatesPart() {
  const { draft, setTheme } = useEditor();
  const active = templateOf(draft.theme);
  return (
    <Group
      title="Plantillas"
      description="Empieza por una y después cambia lo que quieras en los demás apartados."
    >
      <div role="radiogroup" aria-label="Plantillas" className="grid gap-3 sm:grid-cols-2">
        {TEMPLATE_IDS.map((id) => {
          const look = applyTemplate(draft.theme, id);
          return (
            <ChoiceCard
              key={id}
              name="tema-plantilla"
              value={id}
              checked={active === id}
              onChange={() => setTheme(look)}
              label={
                <span className="flex items-center justify-between gap-3">
                  {TEMPLATES[id].label}
                  <TemplateSample look={look} />
                </span>
              }
              description={TEMPLATES[id].description}
            />
          );
        })}
      </div>
      {active ? null : (
        <p className="mt-3 text-[0.8125rem] text-muted">
          Estilo personalizado: has cambiado detalles de la plantilla.
        </p>
      )}
    </Group>
  );
}

function ColorsPart() {
  return (
    <>
      <Group title="Paleta" description="Papel, tinta y oro de toda la invitación.">
        <div role="radiogroup" aria-label="Paleta" className="grid gap-3 sm:grid-cols-2">
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
      <Group
        title="Lacre y acento"
        description="El color de la cera también marca el día de la boda y los detalles."
      >
        <div role="radiogroup" aria-label="Lacre" className="grid gap-3 sm:grid-cols-2">
          {WAX_IDS.map((id) => (
            <Choice
              key={id}
              name="wax"
              value={id}
              label={WAXES[id].label}
              swatch={<Swatches colors={[WAXES[id].hex]} />}
              extra={{ waxColor: null }}
            />
          ))}
        </div>
        <OwnColor />
      </Group>
    </>
  );
}

/** Color libre para el lacre. El acento de los textos se ajusta solo para que se lea. */
function OwnColor() {
  const { draft, setTheme } = useEditor();
  const id = useId();
  const own = draft.theme.waxColor;
  const accent = accentFor(draft.theme);
  const adjusted = own !== null && accent.toLowerCase() !== own.toLowerCase();
  return (
    <div className="mt-4 rounded-lg border border-line bg-paper px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={id} className="text-[0.9375rem] font-medium text-ink">
          Color propio
        </label>
        <input
          id={id}
          type="color"
          value={own ?? WAXES[draft.theme.wax].hex}
          onChange={(e) => setTheme({ ...draft.theme, waxColor: e.target.value })}
          className="h-9 w-14 cursor-pointer rounded border border-line bg-paper p-0.5"
          aria-describedby={`${id}-ayuda`}
        />
        {own ? (
          <button
            type="button"
            onClick={() => setTheme({ ...draft.theme, waxColor: null })}
            className="text-[0.875rem] text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Quitar color propio
          </button>
        ) : null}
      </div>
      <p id={`${id}-ayuda`} className="mt-1.5 text-[0.8125rem] text-muted">
        {own
          ? adjusted
            ? "En los textos se usa una versión algo más intensa para que se lean bien."
            : "Se lee bien sobre el papel elegido."
          : "Elige cualquier color para la cera, por ejemplo el de las flores."}
      </p>
    </div>
  );
}

function EnvelopePart() {
  return (
    <Group title="Papel del sobre">
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
  );
}

function CalendarPart() {
  return (
    <Group title="Calendario" description="Cómo se marca el día en «Guarda la fecha».">
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
  );
}

/** Qué secciones se ven en la invitación y si suena música al abrir el sobre. */
function SectionsPart() {
  const { draft, setTheme } = useEditor();
  const hidden = new Set(draft.theme.hidden);
  return (
    <>
      <Group
        title="Secciones"
        description="Quita las que no necesitéis. La confirmación de asistencia siempre se ve."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTION_IDS.map((id) => (
            <ChoiceCard
              key={id}
              type="checkbox"
              label={SECTIONS[id]}
              checked={!hidden.has(id)}
              onChange={(e) =>
                setTheme({
                  ...draft.theme,
                  // Se guarda en el orden de la invitación.
                  hidden: SECTION_IDS.filter((s) => (s === id ? !e.target.checked : hidden.has(s))),
                })
              }
            />
          ))}
        </div>
      </Group>
      <Group title="Música">
        <ChoiceCard
          type="checkbox"
          label="Música al abrir el sobre"
          description="Piano suave compuesto en el navegador. Cada invitado puede silenciarla."
          checked={draft.theme.music}
          onChange={(e) => setTheme({ ...draft.theme, music: e.target.checked })}
        />
      </Group>
    </>
  );
}
