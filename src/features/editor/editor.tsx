"use client";

import { hostNames } from "@/lib/event-kind";
import { clsx } from "clsx";
import {
  ArrowLeft,
  BedDouble,
  Bus,
  CalendarHeart,
  Images,
  MapPin,
  Palette,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { saveDraft } from "@/app/editor/actions";
import { publishEvent } from "@/app/panel/actions";
import { Button } from "@/components/ui/button";
import type { EventMeta } from "@/lib/data/repository";
import { setIn, validateDraft, type Draft, type Path } from "@/lib/editor/draft";
import type { Theme } from "@/lib/theme";
import type { Stage } from "@/features/invitation/experience";
import { Monogram } from "@/features/invitation/ornaments";
import { EditorContext } from "./fields";
import { PreviewFrame } from "./preview-frame";
import { BasicsTab } from "./tabs/basics-tab";
import { ExtrasTab } from "./tabs/extras-tab";
import { ProgramTab } from "./tabs/program-tab";
import { StoryTab } from "./tabs/story-tab";
import { StyleTab } from "./tabs/style-tab";
import { TextsTab } from "./tabs/texts-tab";
import { TransportTab } from "./tabs/transport-tab";

type Tab = {
  id: string;
  label: string;
  /** Qué se cambia, en pocas palabras (bajo el nombre, en el menú del ordenador). */
  hint: string;
  /** Para qué sirve, encabezando la pestaña. */
  intro: string;
  icon: LucideIcon;
  Panel: () => ReactNode;
  /** Partes del borrador que se editan aquí (para contar los errores de cada pestaña). */
  roots: readonly string[];
};

// Primero el aspecto; después el contenido, en el orden en que suele rellenarse.
const TABS = [
  {
    id: "estilo",
    label: "Estilo",
    hint: "Plantilla, colores, sobre y carta",
    intro: "Elegid una plantilla y retocad lo que queráis: cada cambio se ve al momento.",
    icon: Palette,
    Panel: StyleTab,
    roots: ["theme", "coverVideo", "song"],
  },
  {
    id: "datos",
    label: "Pareja y fecha",
    hint: "Nombres, día, lugar y plazo",
    intro: "Quién lo celebra, cuándo y dónde, y hasta qué día se puede confirmar.",
    icon: CalendarHeart,
    Panel: BasicsTab,
    roots: [
      "kind",
      "couple",
      "date",
      "city",
      "region",
      "climate",
      "rsvpDeadline",
      "hashtag",
      "contactPhone",
    ],
  },
  {
    id: "historia",
    label: "Fotos e historia",
    hint: "Portada, fotos y vuestra historia",
    intro: "Las fotos de la invitación y los momentos que queráis contar.",
    icon: Images,
    Panel: StoryTab,
    roots: ["coverPhoto", "coverDepthMap", "banquetPhoto", "story"],
  },
  {
    id: "textos",
    label: "Textos",
    hint: "Carta, bienvenida, vestimenta y regalos",
    intro: "Lo que leen vuestros invitados, de la carta al agradecimiento.",
    icon: PenLine,
    Panel: TextsTab,
    roots: ["cardMessage", "welcomeMessage", "thankYouMessage", "dressCode", "gift"],
  },
  {
    id: "programa",
    label: "Programa y lugares",
    hint: "Los actos del día y dónde son",
    intro: "Cada acto con su hora y su lugar, con la dirección para llegar.",
    icon: MapPin,
    Panel: ProgramTab,
    roots: ["program", "venues"],
  },
  {
    id: "transporte",
    label: "Autobuses y menús",
    hint: "Rutas y menús para elegir",
    intro: "Si ponéis autobuses o varios menús, se pregunta al confirmar.",
    icon: Bus,
    Panel: TransportTab,
    roots: ["busRoutes", "menu"],
  },
  {
    id: "extras",
    label: "Preguntas y alojamiento",
    hint: "Dudas habituales y dónde dormir",
    intro: "Respuestas a lo que os van a preguntar y sitios cerca para dormir.",
    icon: BedDouble,
    Panel: ExtrasTab,
    roots: ["faqs", "accommodation"],
  },
] as const satisfies readonly Tab[];

type TabId = (typeof TABS)[number]["id"];
type Action = { type: "set"; path: Path; value: unknown } | { type: "theme"; theme: Theme };

function reducer(state: { draft: Draft; version: number }, action: Action) {
  const draft =
    action.type === "theme"
      ? { ...state.draft, theme: action.theme }
      : { ...state.draft, content: setIn(state.draft.content, action.path, action.value) };
  return { draft, version: state.version + 1 };
}

/**
 * Editor de la invitación, con la identidad del panel (`src/app/marca.css`).
 * Ordenador: menú de tinta a la izquierda (pestañas y «Publicar»), ajustes en el centro y el
 * móvil con la invitación en vivo a la derecha. Móvil: pestañas arriba y, abajo, una barra fija
 * para pasar de «Editar» a «Vista previa» y publicar. En eventos reales guarda solo el borrador
 * a los 1,5 s sin cambios; «Publicar» crea la versión que ven los invitados.
 */
export function Editor({
  eventKey,
  initial,
  meta,
}: {
  eventKey: string;
  initial: Draft;
  meta?: EventMeta & { unpublishedChanges: boolean };
}) {
  const eventId = meta?.id ?? null;
  const [{ draft, version }, dispatch] = useReducer(reducer, { draft: initial, version: 0 });
  // Pantalla de la vista previa: la eligen sus botones o el apartado del estilo que se edita.
  const [stage, setStage] = useState<Stage>("cover");
  const [tab, setTab] = useState<TabId>("estilo");
  const [view, setView] = useState<"editar" | "vista">("editar");
  const [savedVersion, setSavedVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [published, setPublished] = useState({
    status: meta?.status ?? "draft",
    pending: meta?.unpublishedChanges ?? true,
  });
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const main = useRef<HTMLElement>(null);

  const check = useMemo(() => validateDraft(draft), [draft]);
  const errors = useMemo(() => (check.ok ? new Map<string, string>() : check.errors), [check]);
  const set = useCallback(
    (path: Path, value: unknown) => dispatch({ type: "set", path, value }),
    [],
  );
  const setTheme = useCallback((theme: Theme) => dispatch({ type: "theme", theme }), []);
  const unsaved = eventId !== null && version !== savedVersion;

  const save = useCallback(async () => {
    if (!eventId) return true;
    setSaving(true);
    const savingVersion = version;
    const result = await saveDraft(eventId, draft);
    setSaving(false);
    if (!result.ok) {
      setSaveError(result.error);
      return false;
    }
    setSaveError(null);
    setSavedVersion(savingVersion);
    setPublished((p) => ({ ...p, pending: true }));
    return true;
  }, [eventId, draft, version]);

  // Guardado automático del borrador válido.
  useEffect(() => {
    if (!unsaved || !check.ok) return;
    const id = window.setTimeout(() => void save(), 1500);
    return () => window.clearTimeout(id);
  }, [unsaved, check.ok, save]);

  useEffect(() => {
    if (!unsaved) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);

  async function publish() {
    if (!eventId || !check.ok) return;
    setPublishing(true);
    setPublishMessage(null);
    const saved = !unsaved || (await save());
    const result = saved ? await publishEvent(eventId) : { error: "Guarda antes de publicar." };
    setPublishing(false);
    if (result.error) {
      setPublishMessage(result.error);
      return;
    }
    setPublished({ status: "published", pending: false });
    setPublishMessage("Publicada: los invitados ya ven esta versión.");
  }

  const status = !check.ok
    ? { text: "Hay campos por revisar.", tone: "danger" }
    : !eventId
      ? { text: "Demo: los cambios no se guardan.", tone: "muted" }
      : saveError
        ? { text: saveError, tone: "danger" }
        : saving || unsaved
          ? { text: "Guardando…", tone: "muted" }
          : published.pending
            ? {
                text:
                  published.status === "published"
                    ? "Guardado. Hay cambios sin publicar."
                    : "Guardado. Aún sin publicar.",
                tone: "pending",
              }
            : { text: "Publicada y al día.", tone: "success" };

  const errorCount = (roots: readonly string[]) =>
    [...errors.keys()].filter((k) => roots.some((r) => k === r || k.startsWith(`${r}.`))).length;

  /** Cambia de pestaña y vuelve al principio de los ajustes. */
  const openTab = (id: TabId) => {
    setTab(id);
    main.current?.scrollTo({ top: 0 });
    if (window.matchMedia("(max-width: 1023.98px)").matches) window.scrollTo({ top: 0 });
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!delta) return;
    e.preventDefault();
    const next = TABS[(index + delta + TABS.length) % TABS.length];
    if (!next) return;
    setTab(next.id);
    const el = tabRefs.current.get(next.id);
    el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const showView = (v: "editar" | "vista") => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  const backHref = eventId ? `/panel/${eventId}` : "/panel/demo";
  const index = TABS.findIndex((t) => t.id === tab);
  const current = TABS[index] ?? TABS[0];
  const next = TABS[index + 1];
  const names = hostNames({
    ...draft.content.couple,
    first: draft.content.couple.first || "…",
  });
  const canPublish = eventId !== null && check.ok && !publishing && (published.pending || unsaved);

  return (
    <EditorContext value={{ draft, set, setTheme, errors, eventId, showStage: setStage }}>
      <div
        className={clsx(
          "marca editor flex flex-col lg:grid lg:h-dvh lg:grid-cols-[15rem_minmax(0,1fr)_minmax(21rem,36%)] xl:grid-cols-[17rem_minmax(0,1fr)_minmax(24rem,38%)]",
          // En el móvil, la vista previa ocupa justo la pantalla; editando, la página baja.
          view === "vista" ? "h-dvh" : "min-h-dvh",
        )}
      >
        <a
          href="#ajustes"
          className="sr-only-focusable fixed top-2 left-2 z-50 rounded-md bg-ink px-4 py-2 text-sm text-paper"
        >
          Saltar a los ajustes
        </a>

        {/*
         * Menú de tinta. En el ordenador es la columna izquierda; en el móvil se deshace
         * (`contents`) y sus tres partes van arriba (nombres y pestañas) y abajo (barra fija).
         */}
        <div className="marca-dark contents lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto">
          <header className="flex items-center gap-1 bg-ivory py-2 pt-[max(0.5rem,env(safe-area-inset-top))] pr-4 pl-1.5 lg:block lg:bg-transparent lg:px-4 lg:pt-6 lg:pb-0">
            <Link
              href={backHref}
              aria-label="Volver al panel"
              className="inline-grid size-11 shrink-0 place-items-center rounded-full text-ink-soft hover:text-ink lg:inline-flex lg:size-auto lg:min-h-11 lg:items-center lg:gap-2 lg:rounded-md lg:text-[0.875rem]"
            >
              <ArrowLeft aria-hidden className="size-5 lg:size-4" />
              <span aria-hidden className="hidden lg:inline">
                Volver al panel
              </span>
            </Link>
            <div className="flex min-w-0 items-center gap-3 lg:mt-5 lg:px-1">
              <Monogram
                first={draft.content.couple.first || "·"}
                second={draft.content.couple.second}
                className="hidden size-10 shrink-0 text-gold lg:block"
              />
              <div className="min-w-0">
                <h1 translate="no" className="marca-title truncate text-[1.5rem] leading-tight">
                  {names}
                </h1>
                <p
                  role="status"
                  aria-live="polite"
                  className={clsx(
                    "flex items-start gap-2 text-[0.8125rem] leading-snug",
                    status.tone === "danger"
                      ? "font-medium text-danger"
                      : status.tone === "success"
                        ? "text-success"
                        : "text-muted",
                  )}
                >
                  <span
                    aria-hidden
                    className={clsx(
                      "mt-[0.3rem] size-2 shrink-0 rounded-full",
                      status.tone === "danger"
                        ? "bg-danger"
                        : status.tone === "success"
                          ? "bg-success"
                          : status.tone === "pending"
                            ? "bg-gold"
                            : "bg-muted",
                    )}
                  />
                  <span className="min-w-0">{status.text}</span>
                </p>
              </div>
            </div>
          </header>

          {/* Pestañas: fila que se desliza en el móvil, lista en el menú del ordenador. */}
          <div
            className={clsx(
              "sticky top-0 z-30 border-b border-line bg-ivory lg:static lg:z-auto lg:mt-8 lg:border-0 lg:bg-transparent",
              view === "vista" && "hidden lg:block",
            )}
          >
            <div
              role="tablist"
              aria-label="Partes de la invitación"
              className="mx-3 flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-1 py-2.5 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-3 lg:py-0 [&::-webkit-scrollbar]:hidden"
            >
              {TABS.map((t, i) => {
                const count = errorCount(t.roots);
                const selected = tab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      if (el) tabRefs.current.set(t.id, el);
                    }}
                    type="button"
                    role="tab"
                    id={`pestana-${t.id}`}
                    aria-selected={selected}
                    aria-controls="ajustes"
                    aria-describedby={`pestana-${t.id}-ayuda`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => openTab(t.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={clsx(
                      "group relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[0.875rem] whitespace-nowrap transition-colors lg:min-h-0 lg:items-start lg:gap-3 lg:rounded-lg lg:px-3 lg:py-2.5 lg:text-left lg:whitespace-normal",
                      i === 1 && "lg:mt-4",
                      selected
                        ? "border border-transparent bg-ink text-ivory lg:border-0 lg:bg-paper lg:text-ink lg:before:absolute lg:before:inset-y-2.5 lg:before:left-0 lg:before:w-0.5 lg:before:rounded-full lg:before:bg-gold"
                        : "border border-line text-ink-soft hover:text-ink lg:border-0 lg:hover:bg-paper/60",
                    )}
                  >
                    <Icon
                      aria-hidden
                      strokeWidth={1.75}
                      className={clsx(
                        "hidden size-[1.125rem] shrink-0 lg:mt-0.5 lg:block",
                        selected && "text-gold",
                      )}
                    />
                    <span className="min-w-0 lg:flex-1">
                      <span className="lg:block lg:text-[0.9375rem]">{t.label}</span>
                      <span
                        id={`pestana-${t.id}-ayuda`}
                        aria-hidden
                        className="hidden text-[0.75rem] leading-snug text-muted lg:mt-0.5 lg:block"
                      >
                        {t.hint}
                      </span>
                    </span>
                    {count ? (
                      <span className="rounded-full bg-[#9a2b2b] px-1.5 text-[0.6875rem] leading-4 font-semibold text-white lg:mt-1">
                        {count}
                        <span className="sr-only"> por revisar</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Publicar: al pie del menú en el ordenador; en el móvil, barra fija abajo. */}
          <div className="sticky bottom-0 z-40 order-last border-t border-line bg-ivory px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:static lg:order-none lg:mt-auto lg:border-0 lg:bg-transparent lg:px-4 lg:pt-8 lg:pb-6">
            {publishMessage ? (
              <p role="status" className="mb-2 text-[0.8125rem] text-ink-soft">
                {publishMessage}
              </p>
            ) : null}
            <div className="flex items-center gap-2 lg:block">
              <div
                role="group"
                aria-label="Qué ver"
                className="grid min-w-0 flex-1 grid-cols-2 rounded-full bg-paper p-1 lg:hidden"
              >
                {(["editar", "vista"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    onClick={() => showView(v)}
                    className={clsx(
                      "h-10 rounded-full px-3 text-[0.875rem] whitespace-nowrap transition-colors",
                      view === v ? "bg-ink font-medium text-ivory" : "text-ink-soft",
                    )}
                  >
                    {v === "editar" ? "Editar" : "Vista previa"}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => void publish()}
                disabled={!canPublish}
                title={eventId ? undefined : "En la demo no se publica"}
                className="h-12 shrink-0 px-5 max-lg:rounded-full! lg:w-full"
              >
                {publishing
                  ? "Publicando…"
                  : published.status === "published" && eventId
                    ? "Volver a publicar"
                    : "Publicar"}
              </Button>
            </div>
            {eventId ? null : (
              <p className="mt-3 hidden text-[0.75rem] text-muted lg:block">
                En la demo se puede probar todo, pero no se publica.
              </p>
            )}
            <p className="mt-6 hidden text-[0.75rem] text-muted lg:block">
              <span className="marca-title text-[1.125rem] text-ink-soft">eFeLe</span> Invitaciones
            </p>
          </div>
        </div>

        <main
          ref={main}
          className={clsx(
            "min-w-0 flex-1 lg:h-dvh lg:overflow-y-auto",
            view === "vista" && "hidden lg:block",
          )}
        >
          <div
            role="tabpanel"
            id="ajustes"
            aria-labelledby={`pestana-${current.id}`}
            tabIndex={-1}
            className="mx-auto max-w-2xl px-4 pt-6 pb-16 outline-none sm:px-6 lg:px-8 lg:pt-10"
          >
            <header className="mb-8">
              <h2 className="marca-title text-[2.25rem] leading-none text-ink sm:text-[2.75rem]">
                {current.label}
              </h2>
              <p className="mt-2.5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-muted">
                {current.intro}
              </p>
            </header>
            <current.Panel />
            {next ? (
              <div className="mt-12 border-t border-line pt-6">
                <button
                  type="button"
                  onClick={() => {
                    openTab(next.id);
                    tabRefs.current.get(next.id)?.scrollIntoView({ block: "nearest" });
                  }}
                  className="group inline-flex min-h-11 flex-col items-start rounded-md text-left"
                >
                  <span className="text-[0.8125rem] text-muted">Siguiente</span>
                  <span className="marca-title text-[1.75rem] leading-tight text-ink underline decoration-gold/60 decoration-1 underline-offset-[6px] group-hover:decoration-gold">
                    {next.label}
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </main>

        <aside
          aria-label="Vista previa"
          className={clsx(
            "min-h-0 border-line bg-cream lg:block lg:h-dvh lg:border-l lg:px-6 lg:py-6",
            view === "editar" ? "hidden" : "flex-1 px-3 pt-3 pb-3",
          )}
        >
          <PreviewFrame
            src={`/editor/${eventKey}/vista`}
            draft={check.ok ? check.draft : null}
            stage={stage}
            onStage={setStage}
          />
        </aside>
      </div>
    </EditorContext>
  );
}
