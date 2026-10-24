import { dressKind } from "@/lib/dress";

/*
 * Dress code de revista: cada sugerencia («Ellas», «Ellos», «Niños»…) con un figurín dibujado a
 * línea, como en una lámina de moda, y la prenda teñida con un color de la paleta de la pareja.
 * Son SVG propios: sin caras, para que valgan para cualquiera.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Head({ y = 18, hair }: { y?: number; hair: string }) {
  return (
    <>
      <ellipse cx="40" cy={y} rx="7" ry="8.5" {...STROKE} />
      <path d={hair} {...STROKE} />
    </>
  );
}

function Figure({ who, tint }: { who: string; tint: string }) {
  const kind = dressKind(who);
  const cloth = {
    fill: tint,
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinejoin: "round",
  } as const;
  return (
    <svg viewBox="0 0 80 200" aria-hidden className="h-full w-auto text-ink">
      <ellipse cx="40" cy="190" rx="26" ry="3.5" className="fill-ink/10" />
      {kind === "dress" ? (
        <>
          <Head hair="M32.5 20C30 7 50 5 47.5 20M44 9.5a4 4 0 1 1 5-3" />
          <path d="M40 26.5V34" {...STROKE} />
          <path d="M33 37C29 50 28 62 30 76M47 37C51 50 52 62 50 76" {...STROKE} />
          <path
            d="M33 36C36 34 44 34 47 36L46 52C45 60 44 66 45 72C52 110 60 150 66 186H14C20 150 28 110 35 72C36 66 35 60 34 52Z"
            {...cloth}
          />
          <path d="M35 70H45M40 76 38 184M43 82 52 184M37 82 27 184" {...STROKE} opacity=".35" />
        </>
      ) : kind === "suit" ? (
        <>
          <Head hair="M33 17C32 7 48 7 47 17" />
          <path d="M40 26.5V33" {...STROKE} />
          <path d="M27 37C24 60 24 75 26 96M53 37C56 60 56 75 54 96" {...STROKE} />
          <path d="M28 92H52L51 186H42.5L40 104 37.5 186H29Z" {...cloth} />
          <path d="M28 92H52L51 186H42.5L40 104 37.5 186H29Z" className="fill-ink/20" />
          <path d="M27 36C32 33 48 33 53 36L55 94H25Z" {...cloth} />
          <path d="M37 34 40 50 43 34Z" className="fill-paper" {...STROKE} />
          <path d="M36 34 40 62 44 34M40 62V94M30 70H35" {...STROKE} />
        </>
      ) : kind === "kids" ? (
        <>
          <Head y={98} hair="M32.5 97C32 87 48 87 47.5 97" />
          <path d="M40 106.5V111" {...STROKE} />
          <path d="M33 113 27 140M47 113 53 140M35.5 162V186M44.5 162V186" {...STROKE} />
          <path d="M33 112C37 110 43 110 47 112L50 134 58 162H22L30 134Z" {...cloth} />
        </>
      ) : (
        <>
          <path d="M36 36A4.5 4.5 0 1 1 40 40.5V44" {...STROKE} />
          <path d="M40 44 12 64H68Z" {...STROKE} />
          <path d="M18 64H62L60 160H20Z" {...cloth} />
          <path d="M30 64 40 80 50 64" {...STROKE} />
        </>
      )}
    </svg>
  );
}

export function DressFigures({
  examples,
  palette,
}: {
  examples: { who: string; text: string }[];
  palette: { hex: string }[];
}) {
  return (
    <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-x-3 gap-y-8">
      {examples.map((example, i) => (
        <li key={example.who} className="flex flex-col">
          <div className="flex h-44 items-end justify-center rounded-[3px] border border-line bg-paper pt-4 pb-2">
            <Figure
              who={example.who}
              tint={palette[i % palette.length]?.hex ?? "var(--color-gold-soft)"}
            />
          </div>
          <p className="mt-3 flex items-baseline gap-2 text-ink-soft">
            <span aria-hidden className="font-display text-[0.9375rem] italic tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.75rem] tracking-[0.2em] uppercase">{example.who}</span>
          </p>
          <p className="mt-1 font-display text-[1rem] leading-snug text-ink italic">
            {example.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
