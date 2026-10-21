"use client";

import { clsx } from "clsx";
import { ExternalLink, Search, SearchX } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { MENU_LABELS, allergyLabel } from "@/lib/domain/catalog";
import type { AttendanceStatus } from "@/lib/domain/types";
import type { GuestRow } from "@/lib/stats";
import { MenuDot, StatusBadge } from "./ui";

type StatusFilter = AttendanceStatus | "all";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "attending", label: "Confirmados" },
  { value: "pending", label: "Pendientes" },
  { value: "declined", label: "No asisten" },
];

const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function transportLabel(row: GuestRow, routes: Record<string, string>) {
  if (row.status !== "attending" || !row.transport) return "—";
  if (row.transport === "bus") return `Bus · ${routes[row.routeId ?? ""] ?? ""}`;
  return row.transport === "car" ? "Coche (ofrece plazas)" : "Por su cuenta";
}

export function GuestTable({
  rows,
  categories,
  routes,
  initialStatus = "all",
}: {
  rows: GuestRow[];
  categories: string[];
  routes: Record<string, string>;
  initialStatus?: StatusFilter;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [category, setCategory] = useState("all");
  const [grouped, setGrouped] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery.trim());
    return rows.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (category === "all" || r.category === category) &&
        (!q || normalize(`${r.name} ${r.groupName}`).includes(q)),
    );
  }, [rows, status, category, deferredQuery]);

  const groups = useMemo(() => {
    const map = new Map<string, GuestRow[]>();
    for (const r of filtered) map.set(r.groupId, [...(map.get(r.groupId) ?? []), r]);
    return [...map.values()];
  }, [filtered]);

  const reset = () => {
    setQuery("");
    setStatus("all");
    setCategory("all");
  };

  return (
    <div>
      {/* Filtros en una sola fila sobre la tabla */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar invitado o grupo</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar invitado o grupo…"
            className="h-10 w-full rounded-md border border-line bg-paper pr-3 pl-9 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="radiogroup"
            aria-label="Estado"
            className="flex rounded-md border border-line bg-paper p-0.5"
          >
            {STATUS_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={status === o.value}
                onClick={() => setStatus(o.value)}
                className={clsx(
                  "rounded px-2.5 py-1.5 text-xs transition-colors",
                  status === o.value ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-muted">
            <span className="sr-only">Grupo</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 rounded-md border border-line bg-paper px-2.5 text-xs text-ink focus:border-ink focus:outline-none"
            >
              <option value="all">Todos los grupos</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={grouped}
              onChange={(e) => setGrouped(e.target.checked)}
              className="size-4 accent-[#1e2a28]"
            />
            Agrupar por invitación
          </label>
        </div>
      </div>

      <p aria-live="polite" className="mt-4 mb-2 text-xs text-muted">
        {filtered.length} {filtered.length === 1 ? "invitado" : "invitados"}
        {grouped ? ` en ${groups.length} invitaciones` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-line bg-paper px-6 py-14 text-center">
          <SearchX aria-hidden className="size-6 text-muted" />
          <p className="mt-3 text-sm font-medium text-ink">
            Ningún invitado coincide con estos filtros
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-sm text-ink underline underline-offset-4"
          >
            Quitar filtros
          </button>
        </div>
      ) : (
        <>
          {/* Escritorio: tabla */}
          <div className="hidden overflow-hidden rounded-xl border border-line bg-paper md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-ivory/60 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Nombre
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Grupo
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Asistencia
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Transporte
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Menú
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Alergias
                  </th>
                </tr>
              </thead>
              {(grouped ? groups : [filtered]).map((list, i) => (
                <tbody
                  key={grouped ? list[0]!.groupId : i}
                  className="divide-y divide-line border-b border-line last:border-b-0"
                >
                  {grouped ? (
                    <tr className="bg-ivory/40">
                      <th
                        scope="rowgroup"
                        colSpan={6}
                        className="px-4 py-2 text-xs font-semibold text-ink"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span>
                            {list[0]!.groupName}{" "}
                            <span className="font-normal text-muted">· {list[0]!.category}</span>
                          </span>
                          <Link
                            href={`/i/${list[0]!.token}`}
                            className="inline-flex items-center gap-1 font-normal text-ink-soft hover:text-ink"
                          >
                            Ver invitación <ExternalLink aria-hidden className="size-3" />
                          </Link>
                        </span>
                      </th>
                    </tr>
                  ) : null}
                  {list.map((r) => (
                    <tr key={r.id} className="hover:bg-ivory/40">
                      <td className="px-4 py-2.5">
                        <span className="font-medium text-ink">{r.name}</span>
                        {r.isExtra ? (
                          <span className="ml-1.5 text-xs text-muted">acompañante</span>
                        ) : null}
                        {r.isChild ? (
                          <span className="ml-1.5 text-xs text-muted">niño/a</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft">{r.groupName}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft">{transportLabel(r, routes)}</td>
                      <td className="px-4 py-2.5">
                        {r.menu ? (
                          <span className="inline-flex items-center gap-1.5 text-ink-soft">
                            <MenuDot menu={r.menu} /> {MENU_LABELS[r.menu]}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft">
                        {r.allergies.length ? (
                          r.allergies.map(allergyLabel).join(", ")
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>

          {/* Móvil: tarjetas */}
          <ul className="space-y-2 md:hidden">
            {filtered.map((r) => (
              <li key={r.id} className="rounded-lg border border-line bg-paper p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{r.name}</p>
                    <p className="text-xs text-muted">
                      {r.groupName} · {r.category}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.status === "attending" ? (
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-muted">Menú</dt>
                      <dd className="mt-0.5 flex items-center gap-1.5 text-ink">
                        {r.menu ? (
                          <>
                            <MenuDot menu={r.menu} /> {MENU_LABELS[r.menu]}
                          </>
                        ) : (
                          "—"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Transporte</dt>
                      <dd className="mt-0.5 text-ink">{transportLabel(r, routes)}</dd>
                    </div>
                    {r.allergies.length ? (
                      <div className="col-span-2">
                        <dt className="text-muted">Alergias</dt>
                        <dd className="mt-0.5 text-ink">
                          {r.allergies.map(allergyLabel).join(", ")}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
