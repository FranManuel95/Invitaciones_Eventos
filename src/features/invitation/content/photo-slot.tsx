import { clsx } from "clsx";
import Image from "next/image";
import { AlmondBranch } from "../ornaments";

/**
 * Hueco para una fotografía. Con foto usa next/image (AVIF/WebP, tamaños responsivos);
 * sin foto muestra una ilustración en el mismo formato para que la maquetación no cambie
 * cuando lleguen las fotos reales.
 */
export function PhotoSlot({
  src,
  alt,
  ratio = "4/5",
  sizes = "(min-width: 768px) 320px, 80vw",
  className,
  tone = 0,
}: {
  src: string | null;
  alt: string;
  ratio?: "4/5" | "3/2" | "2/3";
  sizes?: string;
  className?: string;
  /** Variación de color de la ilustración (0–3) para que los huecos no sean idénticos. */
  tone?: number;
}) {
  const aspect = { "4/5": "aspect-[4/5]", "3/2": "aspect-[3/2]", "2/3": "aspect-[2/3]" }[ratio];
  if (src) {
    return (
      <div className={clsx("group relative overflow-hidden rounded-[2px] bg-cream", aspect, className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
        />
      </div>
    );
  }
  const washes = [
    "bg-[radial-gradient(120%_90%_at_30%_20%,#f3e4d8_0%,#e2d3be_55%,#cdbca4_100%)]",
    "bg-[radial-gradient(120%_90%_at_70%_25%,#eef0e4_0%,#d9dcc6_55%,#bfc4a6_100%)]",
    "bg-[radial-gradient(120%_90%_at_40%_30%,#f6e6e5_0%,#e6cfcc_55%,#cfb2ad_100%)]",
    "bg-[radial-gradient(120%_90%_at_60%_20%,#e9edf2_0%,#cfd7e0_55%,#aebccb_100%)]",
  ];
  return (
    <div
      aria-hidden
      className={clsx(
        "paper-grain relative overflow-hidden rounded-[2px]",
        aspect,
        washes[tone % washes.length],
        className,
      )}
    >
      <AlmondBranch className="absolute right-[8%] bottom-[8%] w-1/2 rotate-[-8deg] opacity-80" />
      <div className="absolute inset-3 border border-white/50" />
    </div>
  );
}
