import type { WeddingEvent } from "@/lib/domain/types";
import { RollingYear } from "../effects/rolling-year";
import { PhotoSlot } from "./photo-slot";
import { Section } from "./sections";

/**
 * Nuestra historia, contada con el scroll: las fotos se descubren al llegar, un hilo dorado
 * une los momentos y el año avanza como un contador. Las animaciones de scroll son CSS nativo
 * (globals.css: reveal-photo, parallax-slow, story-thread).
 */
export function StorySection({ event }: { event: WeddingEvent }) {
  const { story } = event;
  return (
    <Section id="historia" title="Nuestra historia" aside={story.intro} tone="tinted">
      <PhotoSlot
        src={story.couplePhoto}
        alt={`${event.couple.first} y ${event.couple.second}`}
        ratio="4/5"
        sizes="(min-width: 640px) 352px, 92vw"
        tone={0}
        className="reveal-photo max-w-[22rem]"
      />
      <ol className="story-list relative mt-14 space-y-14 pl-7 sm:pl-9">
        <span
          aria-hidden
          className="story-thread absolute top-3 bottom-3 left-[3px] w-px bg-gradient-to-b from-gold via-gold/80 to-gold/20"
        />
        {story.moments.map((moment, i) => (
          <li
            key={moment.year}
            className="relative grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-8"
          >
            <span
              aria-hidden
              className="absolute top-2 -left-7 size-[7px] rounded-full bg-gold ring-4 ring-cream sm:-left-9"
            />
            <div className="parallax-slow w-2/3 sm:w-full">
              <PhotoSlot
                src={moment.photo}
                alt={moment.photoAlt}
                sizes="(min-width: 640px) 176px, 60vw"
                tone={i + 1}
                className="reveal-photo"
              />
            </div>
            <div>
              <p className="font-display text-[2.5rem] leading-none text-wax tabular-nums">
                <RollingYear value={moment.year} from={story.moments[i - 1]?.year} />
              </p>
              <h3 className="mt-2 font-display text-[1.625rem] leading-tight text-ink">
                {moment.title}
              </h3>
              <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-muted">
                {moment.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
