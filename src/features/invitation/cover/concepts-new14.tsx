"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, formatNumericDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la decimoquinta tanda (ronda 38): el estuche de los anillos con la fecha
 * grabada, un carné de baile de los de antes y una cápsula del tiempo que se desentierra.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Anillos: el estuche se abre y la fecha va grabada ─────────────── */

function RingsCover({ event, onOpen, reduce }: ConceptProps) {
  const [open, setOpen] = useState(false);
  const hosts = hostsOf(event);
  const initials = `${hosts.first.charAt(0)}${hosts.second ? ` & ${hosts.second.charAt(0)}` : ""}`;
  const click = () => {
    if (open) return;
    setOpen(true);
    haptic(18);
    playNotes([1319, 1568], "sine", 0.1);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#3a2433,#1a0f18_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f6e9d8]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Dos anillos para</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* El estuche de terciopelo: la tapa gira hacia atrás y deja ver los anillos. */}
        <div
          data-anillos={open ? "abierto" : "cerrado"}
          onPointerDown={(e) => {
            stop(e);
            click();
          }}
          className="relative mt-10 h-52 w-60 cursor-pointer [perspective:800px]"
        >
          <div
            className="absolute inset-x-0 bottom-24 h-28 origin-bottom rounded-t-[40px] bg-[linear-gradient(180deg,#7a2440,#4e1428)] shadow-[inset_0_-6px_12px_rgb(0_0_0/0.35)] transition-transform duration-700"
            style={{
              transform: open ? "rotateX(-70deg)" : "rotateX(-92deg)",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <span className="absolute inset-3 rounded-t-[32px] bg-[linear-gradient(180deg,#f3ece4,#d9cfc4)]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex h-24 items-start justify-center gap-3 rounded-b-[14px] bg-[linear-gradient(180deg,#6e1f38,#3d0f1f)] pt-3 shadow-[0_18px_30px_-16px_rgb(0_0_0/0.7)]">
            {open
              ? ["oro", "oro blanco"].map((metal) => (
                  <span
                    key={metal}
                    aria-hidden
                    className={`block size-14 rounded-full border-[7px] shadow-[0_2px_6px_rgb(0_0_0/0.4)] ${metal === "oro" ? "border-[#d8b25e]" : "border-[#d9dde2]"}`}
                  />
                ))
              : null}
          </div>
        </div>
        <After reduce={reduce} className="mt-5 text-[0.9375rem]">
          {open ? (
            <>
              Grabado por dentro: <span translate="no">{initials}</span>
              <span className="block text-[1.0625rem] font-semibold">
                <time dateTime={isoDay(event.date)}>{formatNumericDate(event.date)}</time> ·{" "}
                {event.city}
              </span>
            </>
          ) : (
            <>
              Ábrelo para leer lo que llevan grabado.
              <span className="block text-[1.0625rem] font-semibold">
                <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
              </span>
            </>
          )}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={click}
            disabled={open}
            className="mt-3 rounded-full bg-[#d8b25e] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2a1020] disabled:opacity-70"
          >
            {open ? "Estuche abierto" : "Abrir el estuche"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Carné de baile: se apunta tu nombre en el primer baile libre ─────────────── */

function DanceCardCover({ event, guestName, onOpen, reduce }: ConceptProps) {
  const [signed, setSigned] = useState(false);
  const hosts = hostsOf(event);
  const party = event.program.find((p) => p.icon === "party");
  const dances = [
    { dance: "Vals", partner: hosts.first },
    { dance: "Pasodoble", partner: hosts.second ?? hosts.first },
    { dance: "Rumba", partner: signed ? (guestName ?? "Tú") : "" },
    { dance: "Hasta el final", partner: "Todos" },
  ];
  const sign = () => {
    if (signed) return;
    setSigned(true);
    playPaper(0.25);
    haptic(10);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(160deg,#f4ecf2,#e2d4e2)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2e1d33]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Carné de baile de la boda de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        {/* La tarjetita con su cordón y su lápiz. */}
        <div
          data-baile={signed ? "apuntado" : "libre"}
          className="relative mt-6 w-[min(16rem,72vw)] rounded-[6px] border-2 border-[#8a6a9a] bg-[#fffaf4] px-4 pt-6 pb-4 text-left shadow-[0_18px_30px_-18px_rgb(60_30_70/0.5)]"
        >
          <span
            aria-hidden
            className="absolute -top-6 left-1/2 h-8 w-0.5 -translate-x-1/2 bg-[#8a6a9a]"
          />
          <span
            aria-hidden
            className="absolute -top-7 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[#c9a65d]"
          />
          <p className="text-center text-[0.6875rem] tracking-[0.18em] uppercase">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
          <p className="text-center text-[0.75rem]">
            {party ? `${party.place}, desde las ${party.time}` : event.city}
          </p>
          <ol className="mt-3 divide-y divide-dashed divide-[#cdb8d4]">
            {dances.map(({ dance, partner }, i) => (
              <li key={dance} className="flex items-baseline justify-between gap-3 py-1.5">
                <span className="text-[0.8125rem] font-semibold">
                  {i + 1}. {dance}
                </span>
                <span
                  className="min-w-[6rem] border-b border-[#8a6a9a] text-right text-[0.9375rem] italic"
                  style={{ fontFamily: PLAYFAIR }}
                  translate="no"
                >
                  {partner}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <After reduce={reduce} className="mt-5 text-[0.9375rem]">
          {signed ? "Apuntado. La rumba es tuya." : "Queda un baile libre. ¿Te apuntas?"}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={sign}
            disabled={signed}
            className="mt-3 rounded-full bg-[#5a3a6a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {signed ? "Baile reservado" : "Apuntarme al baile"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Cápsula del tiempo: se desentierra y dentro está la fecha ─────────────── */

function TimeCapsuleCover({ event, onOpen, reduce }: ConceptProps) {
  const [dig, setDig] = useState(0);
  const found = dig >= 0.98;
  const digging = dig > 0;
  const unearth = () => {
    if (digging) return;
    playPaper(0.4);
    const done = () => {
      haptic([10, 30, 10]);
      playNotes([523, 659, 784, 1047], "triangle", 0.12);
    };
    if (reduce) {
      setDig(1);
      done();
      return;
    }
    animate(0.01, 1, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setDig,
      onComplete: done,
    });
  };
  const year = new Date(event.date).getFullYear();

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#e9f0e4,#cfd9c2_38%,#8a6a4a_62%,#5e452e)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Cápsula del tiempo de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <p className="mt-1 text-[0.9375rem]">
          Para abrir el <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
        </p>
        <div
          data-capsula={found ? "desenterrada" : digging ? "cavando" : "enterrada"}
          onPointerDown={(e) => {
            stop(e);
            unearth();
          }}
          className="relative mt-auto mb-4 h-60 w-full cursor-pointer overflow-hidden"
        >
          {/* La lata sube desde la tierra; al llegar arriba, se ve su etiqueta. */}
          <div
            className="absolute left-1/2 flex h-36 w-28 -translate-x-1/2 flex-col items-center justify-center rounded-[10px] border-2 border-[#5d6b70] bg-[linear-gradient(90deg,#9aa8ad,#d6dee0_45%,#8d9ba0)] text-[#1e2a2e] shadow-[0_12px_20px_-10px_rgb(0_0_0/0.5)]"
            style={{ bottom: `${-40 + dig * 62}%` }}
          >
            <span className="absolute inset-x-0 top-0 h-4 rounded-t-[8px] bg-[#5d6b70]" />
            <span className="rounded-[2px] bg-[#fbf7ee] px-2 py-1 text-[0.6875rem] leading-tight font-semibold">
              NO ABRIR
              <br />
              HASTA {year}
            </span>
          </div>
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[38%] rounded-t-[50%] bg-[#4f3a26]" />
        </div>
        <After reduce={reduce} className="text-[0.9375rem] text-[#fbf3e6]">
          {found
            ? `Ya se puede abrir: nos vemos en ${event.city}.`
            : "Desentiérrala para ver qué guardamos."}
        </After>
        <div className="flex w-full flex-col items-center text-[#fbf3e6]">
          <button
            type="button"
            onPointerDown={stop}
            onClick={unearth}
            disabled={digging}
            className="mt-3 rounded-full bg-[#fbf3e6] px-6 py-2.5 text-[0.9375rem] font-medium text-[#3a2a1c] disabled:opacity-70"
          >
            {found ? "Desenterrada" : digging ? "Cavando…" : "Desenterrar la cápsula"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const FOURTEENTH_NEW_COVERS = {
  anillos: RingsCover,
  baile: DanceCardCover,
  capsula: TimeCapsuleCover,
};
