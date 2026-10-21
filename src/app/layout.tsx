import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Jost } from "next/font/google";
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

// Garalda del estilo «Clásico» (src/lib/theme). Sin precarga: solo la descargan esas invitaciones.
const classic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const sans = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Invitaciones (demo)", template: "%s | Invitaciones" },
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
    <html lang="es" className={`${display.variable} ${classic.variable} ${sans.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
