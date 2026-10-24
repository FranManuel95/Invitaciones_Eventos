"use client";

import { Download } from "lucide-react";

/** Descarga un CSV generado en el servidor (con BOM para que Excel respete las tildes). */
export function CsvButton({
  csv,
  filename,
  label,
}: {
  csv: string;
  filename: string;
  label: string;
}) {
  const download = () => {
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-ink/25 bg-paper px-4 text-[0.875rem] text-ink transition-colors hover:border-ink"
    >
      <Download aria-hidden className="size-4" /> {label}
    </button>
  );
}
