import type { Metadata, Viewport } from "next";
import {
  Bangers,
  Bodoni_Moda,
  Cormorant_Garamond,
  Courier_Prime,
  Fraunces,
  Great_Vibes,
  Italiana,
  Jost,
  Pinyon_Script,
  Playfair_Display,
  Press_Start_2P,
  Poiret_One,
} from "next/font/google";
import "./globals.css";

// Didona de papelería para nombres y titulares (con eje de tamaño óptico) y una geométrica
// clásica para la interfaz: el contraste de la pareja Bodoni + Futura de la tipografía editorial.
const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

// Tipografías que elige cada invitación (FONTS en src/lib/theme). Todas con licencia OFL y sin
// precarga: el navegador solo descarga las que usa la invitación que está abriendo.
const classic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});
const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
  display: "swap",
  preload: false,
});
const poiret = Poiret_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poiret",
  display: "swap",
  preload: false,
});
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
  preload: false,
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
  preload: false,
});

// Máquina de escribir, para la plantilla Telegrama.
const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
  display: "swap",
  preload: false,
});
// Rotulación de tebeo (plantilla Cómic) y píxeles de recreativa (plantilla Arcade).
const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
  display: "swap",
  preload: false,
});
const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
  preload: false,
});
const fontVariables = [
  classic,
  playfair,
  fraunces,
  italiana,
  poiret,
  pinyon,
  greatVibes,
  courier,
  bangers,
  pixel,
].map((f) => f.variable);

const sans = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Invitaciones eFeLe (demo)", template: "%s | Invitaciones eFeLe" },
  description: "Prototipo de invitaciones digitales premium para bodas y eventos.",
  // Prototipo con datos ficticios: no debe indexarse.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#efebe1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={[display.variable, sans.variable, ...fontVariables].join(" ")}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
