import { Images } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { WeddingEvent } from "@/lib/domain/types";

const DEFAULT_MESSAGE =
  "Gracias por acompañarnos en un día tan especial. Ha sido mejor de lo que soñábamos porque estabais allí.";

/** Después de la boda: el agradecimiento de la pareja y el álbum con las fotos de todos. */
export function ThankYou({
  event,
  albumToken,
}: {
  event: WeddingEvent;
  albumToken: string | null;
}) {
  return (
    <section aria-labelledby="gracias-title" className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:px-10 sm:py-24 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14">
        <h2
          id="gracias-title"
          className="font-names text-[clamp(3.5rem,14vw,6rem)] leading-[0.9] text-ink"
        >
          Gracias
        </h2>
        <div className="max-w-[40ch]">
          <p className="font-display text-[1.625rem] leading-[1.45] text-ink sm:text-[1.875rem]">
            {event.thankYouMessage?.trim() || DEFAULT_MESSAGE}
          </p>
          <p className="mt-4 text-ink-soft">
            {event.couple.first} &amp; {event.couple.second}
          </p>
          {albumToken ? (
            <a href={`/album/${albumToken}`} className={buttonClasses("primary", "lg", "mt-8")}>
              <Images aria-hidden className="size-5" />
              Ver las fotos de la boda
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
