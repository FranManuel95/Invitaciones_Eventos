"use client";

import { clsx } from "clsx";
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChoiceCard } from "@/components/ui/fields";
import type { Stage } from "@/features/invitation/experience";
import {
  BlossomCorner,
  DecoCorner,
  EucalyptusCorner,
  OliveCorner,
  WaxSealArt,
} from "@/features/invitation/ornaments";
import {
  accentFor,
  applyTemplate,
  CALENDAR_IDS,
  CALENDARS,
  ENVELOPE_IDS,
  EDGE_IDS,
  EDGES,
  ENVELOPES,
  FLAP_IDS,
  flapGeometry,
  FLAPS,
  FONT_IDS,
  FONTS,
  LAYOUT_IDS,
  LAYOUTS,
  LINER_IDS,
  linerBackground,
  LINERS,
  ORNAMENT_IDS,
  ORNAMENTS,
  SEAL_MARK_IDS,
  SEAL_MARKS,
  SEAL_SHAPE_IDS,
  SEAL_SHAPES,
  SECTION_IDS,
  SECTIONS,
  STYLE_IDS,
  STYLES,
  TEMPLATE_IDS,
  TEMPLATES,
  templateOf,
  TEXTURE_IDS,
  TEXTURES,
  WAX_IDS,
  WAXES,
  waxHex,
  WEIGHT_IDS,
  WEIGHTS,
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

type ChoiceKey =
  | "style"
  | "envelope"
  | "wax"
  | "calendar"
  | "font"
  | "flap"
  | "weight"
  | "texture"
  | "liner"
  | "sealShape"
  | "sealMark"
  | "layout"
  | "edge"
  | "ornament";

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

// Cada apartado lleva la vista previa a la pantalla donde se ve lo que se cambia.
const PARTS: readonly { id: string; label: string; Panel: () => ReactNode; stage?: Stage }[] = [
  { id: "plantillas", label: "Plantillas", Panel: TemplatesPart },
  { id: "colores", label: "Colores", Panel: ColorsPart },
  { id: "letra", label: "Tipografía", Panel: FontsPart, stage: "cover" },
  { id: "sobre", label: "Sobre", Panel: EnvelopePart, stage: "envelope" },
  { id: "carta", label: "Carta", Panel: LetterPart, stage: "letter" },
  { id: "calendario", label: "Calendario", Panel: CalendarPart, stage: "content" },
  { id: "secciones", label: "Secciones y música", Panel: SectionsPart, stage: "content" },
];

/** Estilo: se parte de una plantilla y se ajusta cada detalle por apartados. */
export function StyleTab() {
  const { showStage } = useEditor();
  const [part, setPart] = useState("plantillas");
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const id = useId();
  const current = PARTS.find((p) => p.id === part) ?? PARTS[0]!;
  const choose = (next: (typeof PARTS)[number]) => {
    setPart(next.id);
    if (next.stage) showStage(next.stage);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = PARTS[(index + delta + PARTS.length) % PARTS.length]!;
    choose(next);
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
            onClick={() => choose(p)}
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

/** Pares de letra con una muestra escrita con los nombres de la pareja. */
function FontsPart() {
  const { draft, setTheme } = useEditor();
  const { first, second } = draft.content.couple;
  return (
    <Group
      title="Tipografía"
      description="Letra de los nombres y los titulares. Los textos largos siguen en una letra fácil de leer."
    >
      <div role="radiogroup" aria-label="Tipografía" className="grid gap-3 sm:grid-cols-2">
        {FONT_IDS.map((id) => {
          const font = FONTS[id];
          return (
            <ChoiceCard
              key={id}
              name="tema-font"
              value={id}
              checked={draft.theme.font === id}
              onChange={() => setTheme({ ...draft.theme, font: id })}
              label={font.label}
              description={
                <>
                  <span
                    aria-hidden
                    className="mt-1.5 mb-1 block truncate text-[1.75rem] leading-tight text-ink"
                    style={{ fontFamily: font.names ?? font.display }}
                  >
                    {first} &amp; {second}
                  </span>
                  <span
                    aria-hidden
                    className="block text-[1.0625rem] leading-tight text-ink-soft"
                    style={{ fontFamily: font.display }}
                  >
                    Guarda la fecha
                  </span>
                  <span className="mt-1 block">{font.description}</span>
                </>
              }
            />
          );
        })}
      </div>
    </Group>
  );
}

/** Muestra de la forma de la solapa sobre el papel elegido. */
function FlapSample({ flap, theme }: { flap: Theme["flap"]; theme: Theme }) {
  const env = ENVELOPES[theme.envelope];
  const { depth, clip } = flapGeometry(flap);
  return (
    <span
      aria-hidden
      className="relative block h-9 w-13 shrink-0 rounded-[2px] shadow-sm"
      style={{ background: env.paper[1] }}
    >
      <span
        className="absolute inset-x-0 top-0 block"
        style={{
          height: `${depth}%`,
          clipPath: clip,
          background: env.paper[0],
          filter: "drop-shadow(0 1px 0 rgb(0 0 0 / 0.25))",
        }}
      />
    </span>
  );
}

function Tile({ background }: { background: string }) {
  return (
    <span
      aria-hidden
      className="block size-9 shrink-0 rounded-md ring-1 ring-ink/10"
      style={{ background }}
    />
  );
}

/** Papel, solapa, gramaje, textura, forro y lacre del sobre. */
function EnvelopePart() {
  const { draft } = useEditor();
  const theme = draft.theme;
  const env = ENVELOPES[theme.envelope];
  const gold = STYLES[theme.style].palette.gold;
  const seal = { "--seal": waxHex(theme) } as CSSProperties;
  return (
    <>
      <Group title="Papel" description="Color y forro de partida del sobre.">
        <div role="radiogroup" aria-label="Papel del sobre" className="grid gap-3 sm:grid-cols-2">
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
      <Group title="Solapa">
        <div role="radiogroup" aria-label="Solapa" className="grid gap-3 sm:grid-cols-2">
          {FLAP_IDS.map((id) => (
            <Choice
              key={id}
              name="flap"
              value={id}
              label={FLAPS[id].label}
              description={FLAPS[id].description}
              swatch={<FlapSample flap={id} theme={theme} />}
            />
          ))}
        </div>
      </Group>
      <Group
        title="Gramaje"
        description="Cuanto más grueso, más canto, más sombra y más peso al abrir."
      >
        <div role="radiogroup" aria-label="Gramaje" className="grid gap-3 sm:grid-cols-3">
          {WEIGHT_IDS.map((id) => (
            <Choice
              key={id}
              name="weight"
              value={id}
              label={WEIGHTS[id].label}
              description={WEIGHTS[id].description}
              swatch={null}
            />
          ))}
        </div>
      </Group>
      <Group title="Textura">
        <div role="radiogroup" aria-label="Textura" className="grid gap-3 sm:grid-cols-2">
          {TEXTURE_IDS.map((id) => (
            <Choice
              key={id}
              name="texture"
              value={id}
              label={TEXTURES[id].label}
              description={TEXTURES[id].description}
              swatch={
                <Tile
                  background={`${TEXTURES[id].image}, linear-gradient(${env.paper[0]}, ${env.paper[1]})`}
                />
              }
            />
          ))}
        </div>
      </Group>
      <Group title="Forro" description="El dibujo que se ve al levantar la solapa.">
        <div role="radiogroup" aria-label="Forro" className="grid gap-3 sm:grid-cols-2">
          {LINER_IDS.map((id) => (
            <Choice
              key={id}
              name="liner"
              value={id}
              label={LINERS[id].label}
              description={LINERS[id].description}
              swatch={
                <Tile
                  background={linerBackground(id, { inside: env.inside, gold, own: env.liner })}
                />
              }
            />
          ))}
        </div>
      </Group>
      <Group title="Forma del lacre">
        <div role="radiogroup" aria-label="Forma del lacre" className="grid gap-3 sm:grid-cols-3">
          {SEAL_SHAPE_IDS.map((id) => (
            <Choice
              key={id}
              name="sealShape"
              value={id}
              label={SEAL_SHAPES[id].label}
              description={SEAL_SHAPES[id].description}
              swatch={
                <span style={seal} className="block size-10 shrink-0">
                  <WaxSealArt
                    monogram={draft.content.couple.monogram}
                    shape={id}
                    mark={theme.sealMark}
                    className="size-full"
                  />
                </span>
              }
            />
          ))}
        </div>
      </Group>
      <Group title="Grabado del lacre">
        <div role="radiogroup" aria-label="Grabado del lacre" className="grid gap-3 sm:grid-cols-2">
          {SEAL_MARK_IDS.map((id) => (
            <Choice
              key={id}
              name="sealMark"
              value={id}
              label={SEAL_MARKS[id].label}
              swatch={
                <span style={seal} className="block size-10 shrink-0">
                  <WaxSealArt
                    monogram={draft.content.couple.monogram}
                    shape={theme.sealShape}
                    mark={id}
                    className="size-full"
                  />
                </span>
              }
            />
          ))}
        </div>
      </Group>
    </>
  );
}

/** Esquema de la composición: dónde van foto, nombres y texto. */
function LayoutSample({ layout }: { layout: Theme["layout"] }) {
  const line = "block h-[3px] rounded-full bg-ink/25";
  return (
    <span
      aria-hidden
      className={clsx(
        "flex h-14 w-11 shrink-0 flex-col gap-1 rounded-[3px] bg-paper p-1.5 shadow-sm ring-1 ring-ink/10",
        layout === "editorial" ? "items-start" : "items-center",
        layout === "marco" && "outline outline-1 -outline-offset-4 outline-gold/70",
      )}
    >
      {layout === "foto" ? (
        <span className="-mx-1.5 -mt-1.5 mb-0.5 block h-4 w-11 bg-taupe/60" />
      ) : null}
      {layout === "clasica" || layout === "marco" ? (
        <span className="block size-2.5 rounded-full ring-1 ring-gold" />
      ) : null}
      {layout === "editorial" ? <span className="block h-2 w-7 rounded-[1px] bg-ink/60" /> : null}
      <span className={clsx(line, "w-6")} />
      <span className={clsx(line, "w-7")} />
      {layout === "minimal" ? null : <span className={clsx(line, "w-5")} />}
    </span>
  );
}

const ORNAMENT_ART = {
  almendro: BlossomCorner,
  olivo: OliveCorner,
  eucalipto: EucalyptusCorner,
  geometrico: DecoCorner,
  ninguno: null,
} as const;

function OrnamentSample({ ornament }: { ornament: Theme["ornament"] }) {
  const Art = ORNAMENT_ART[ornament];
  return (
    <span aria-hidden className="block size-11 shrink-0 overflow-hidden rounded-md bg-ivory">
      {Art ? <Art className="size-full" /> : null}
    </span>
  );
}

/** Composición, borde y ornamento de la carta. */
function LetterPart() {
  return (
    <>
      <Group title="Composición" description="Cómo se reparten nombres, saludo y mensaje.">
        <div role="radiogroup" aria-label="Composición" className="grid gap-3 sm:grid-cols-2">
          {LAYOUT_IDS.map((id) => (
            <Choice
              key={id}
              name="layout"
              value={id}
              label={LAYOUTS[id].label}
              description={LAYOUTS[id].description}
              swatch={<LayoutSample layout={id} />}
            />
          ))}
        </div>
      </Group>
      <Group title="Borde del papel">
        <div role="radiogroup" aria-label="Borde del papel" className="grid gap-3 sm:grid-cols-3">
          {EDGE_IDS.map((id) => (
            <Choice
              key={id}
              name="edge"
              value={id}
              label={EDGES[id].label}
              description={EDGES[id].description}
              swatch={null}
            />
          ))}
        </div>
      </Group>
      <Group title="Ornamento" description="Lo que enmarca la carta en la pantalla.">
        <div role="radiogroup" aria-label="Ornamento" className="grid gap-3 sm:grid-cols-2">
          {ORNAMENT_IDS.map((id) => (
            <Choice
              key={id}
              name="ornament"
              value={id}
              label={ORNAMENTS[id].label}
              description={ORNAMENTS[id].description}
              swatch={<OrnamentSample ornament={id} />}
            />
          ))}
        </div>
      </Group>
    </>
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
