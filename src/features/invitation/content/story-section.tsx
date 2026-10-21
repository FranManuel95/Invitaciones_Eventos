import type { WeddingEvent } from "@/lib/domain/types";
import { PhotoSlot } from "./photo-slot";
import { Section } from "./sections";

/** Nuestra historia: cuatro momentos en orden, con año, título, dos líneas y una foto. */
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
        className="max-w-[22rem]"
      />
      <ol className="mt-12 space-y-12">
        {story.moments.map((moment, i) => (
          <li
            key={moment.year}
            className="grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-8"
          >
            <PhotoSlot
              src={moment.photo}
              alt={moment.photoAlt}
              sizes="(min-width: 640px) 176px, 60vw"
              tone={i + 1}
              className="w-2/3 sm:w-full"
            />
            <div>
              <p className="font-display text-[2.5rem] leading-none text-wax tabular-nums">
                {moment.year}
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
