"use client";

import { clsx } from "clsx";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { saveDraft } from "@/app/editor/actions";
import { publishEvent } from "@/app/panel/actions";
import { Button } from "@/components/ui/button";
import type { EventMeta } from "@/lib/data/repository";
import { setIn, validateDraft, type Draft, type Path } from "@/lib/editor/draft";
import type { Theme } from "@/lib/theme";
import { EditorContext } from "./fields";
import { PreviewFrame } from "./preview-frame";
import { BasicsTab } from "./tabs/basics-tab";
import { ExtrasTab } from "./tabs/extras-tab";
import { ProgramTab } from "./tabs/program-tab";
import { StoryTab } from "./tabs/story-tab";
import { StyleTab } from "./tabs/style-tab";
import { TextsTab } from "./tabs/texts-tab";
import { TransportTab } from "./tabs/transport-tab";

const TABS = [
  { id: "estilo", label: "Estilo", Panel: StyleTab, roots: ["theme"] },
  {
    id: "datos",
    label: "Pareja y fecha",
    Panel: BasicsTab,
    roots: ["couple", "date", "city", "region", "rsvpDeadline", "hashtag", "contactPhone"],
  },
  {
    id: "textos",
    label: "Textos",
    Panel: TextsTab,
    roots: ["cardMessage", "welcomeMessage", "dressCode", "gift"],
  },
  { id: "programa", label: "Programa y lugares", Panel: ProgramTab, roots: ["program", "venues"] },
  {
    id: "transporte",
    label: "Autobuses y menús",
    Panel: TransportTab,
    roots: ["busRoutes", "menu"],
  },
  {
    id: "historia",
    label: "Fotos e historia",
    Panel: StoryTab,
    roots: ["coverPhoto", "coverDepthMap", "banquetPhoto", "story"],
  },
  {
    id: "extras",
    label: "Preguntas y alojamiento",
    Panel: ExtrasTab,
    roots: ["faqs", "accommodation"],
  },
] as const;

type Action = { type: "set"; path: Path; value: unknown } | { type: "theme"; theme: Theme };

function reducer(state: { draft: Draft; version: number }, action: Action) {
  const draft =
    action.type === "theme"
      ? { ...state.draft, theme: action.theme }
      : { ...state.draft, content: setIn(state.draft.content, action.path, action.value) };
  return { draft, version: state.version + 1 };
}

/**
 * Editor de la invitación: ajustes a la izquierda y el móvil con la invitación en vivo a la
 * derecha (en el móvil, en pestañas). En eventos reales guarda solo el borrador a los 1,5 s
 * sin cambios; «Publicar» crea la versión que ven los invitados.
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
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("estilo");
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
                tone: "muted",
              }
            : { text: "Publicada y al día.", tone: "success" };

  const errorCount = (roots: readonly string[]) =>
    [...errors.keys()].filter((k) => roots.some((r) => k === r || k.startsWith(`${r}.`))).length;

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
    tabRefs.current.get(next.id)?.focus();
  };

  const backHref = eventId ? `/panel/${eventId}` : "/panel/demo";
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <EditorContext value={{ draft, set, setTheme, errors, eventId }}>
      <div className="flex min-h-dvh flex-col bg-ivory lg:h-dvh">
        <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-[0.875rem] text-ink-soft hover:text-ink"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Panel
            </Link>
            <h1 className="min-w-0 flex-1 truncate font-display text-[1.375rem] leading-tight text-ink">
              {draft.content.couple.first || "…"} &amp; {draft.content.couple.second || "…"}
            </h1>
            <p
              role="status"
              aria-live="polite"
              className={clsx(
                "order-last w-full text-[0.8125rem] sm:order-none sm:w-auto",
                status.tone === "danger"
                  ? "font-medium text-danger"
                  : status.tone === "success"
                    ? "text-success"
                    : "text-muted",
              )}
            >
              {status.text}
            </p>
            {eventId ? (
              <Button
                size="sm"
                onClick={() => void publish()}
                disabled={!check.ok || publishing || (!published.pending && !unsaved)}
              >
                {publishing
                  ? "Publicando…"
                  : published.status === "published"
                    ? "Volver a publicar"
                    : "Publicar"}
              </Button>
            ) : (
              <Button size="sm" disabled>
                Publicar
              </Button>
            )}
          </div>
          {publishMessage ? (
            <p
              role="status"
              className="border-t border-line px-4 py-2 text-[0.8125rem] text-ink-soft sm:px-6"
            >
              {publishMessage}
            </p>
          ) : null}
          {/* En el móvil, editar y ver se alternan. */}
          <div
            role="group"
            aria-label="Modo"
            className="grid grid-cols-2 gap-1 border-t border-line bg-ivory p-1.5 lg:hidden"
          >
            {(["editar", "vista"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={clsx(
                  "h-9 rounded-md text-[0.875rem] transition-colors",
                  view === v ? "bg-paper text-ink shadow-sm" : "text-ink-soft",
                )}
              >
                {v === "editar" ? "Editar" : "Vista previa"}
              </button>
            ))}
          </div>
        </header>

        <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,40%)]">
          <div
            className={clsx("min-h-0 lg:overflow-y-auto", view === "vista" && "hidden lg:block")}
          >
            <div
              role="tablist"
              aria-label="Secciones del editor"
              aria-orientation="horizontal"
              className="sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-line bg-ivory/95 px-4 py-2 backdrop-blur sm:px-6"
            >
              {TABS.map((t, i) => {
                const count = errorCount(t.roots);
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      if (el) tabRefs.current.set(t.id, el);
                    }}
                    type="button"
                    role="tab"
                    id={`pestana-${t.id}`}
                    aria-selected={tab === t.id}
                    aria-controls="panel-editor"
                    tabIndex={tab === t.id ? 0 : -1}
                    onClick={() => setTab(t.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={clsx(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-[0.875rem] whitespace-nowrap transition-colors",
                      tab === t.id
                        ? "bg-ink text-paper"
                        : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                    )}
                  >
                    {t.label}
                    {count ? (
                      <span className="rounded-full bg-danger px-1.5 text-[0.6875rem] leading-4 font-semibold text-white">
                        {count}
                        <span className="sr-only"> por revisar</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div
              role="tabpanel"
              id="panel-editor"
              aria-labelledby={`pestana-${current.id}`}
              tabIndex={0}
              className="mx-auto max-w-2xl px-4 pt-6 pb-24 outline-none sm:px-6"
            >
              <current.Panel />
            </div>
          </div>

          <aside
            aria-label="Vista previa"
            className={clsx(
              "border-line bg-cream/50 p-4 lg:block lg:h-full lg:min-h-0 lg:border-l",
              view === "editar" ? "hidden" : "h-[calc(100dvh-8.5rem)]",
            )}
          >
            <PreviewFrame src={`/editor/${eventKey}/vista`} draft={check.ok ? check.draft : null} />
          </aside>
        </div>
      </div>
    </EditorContext>
  );
}
