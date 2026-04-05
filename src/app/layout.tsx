import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Día de mi Suerte | Suscríbete y Gana Premios Cada Semana",
  description:
    "Plataforma de sorteos semanales en vivo. Suscríbete desde S/8 al mes y participa por premios reales: iPhone, PlayStation, MacBook y más. Sorteos todos los miércoles a las 8PM por Instagram Live.",
  keywords: [
    "sorteos en vivo",
    "ganar premios",
    "suscripción premios",
    "sorteo semanal Perú",
    "día de mi suerte",
    "ganar iPhone",
    "sorteos Instagram",
  ],
  openGraph: {
    title: "Día de mi Suerte | Gana Premios Cada Semana",
    description:
      "Suscríbete desde S/8/mes y participa en sorteos semanales de premios reales.",
    url: "https://diademisuerte.com",
    siteName: "Día de mi Suerte",
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Día de mi Suerte | Gana Premios Cada Semana",
    description:
      "Suscríbete desde S/8/mes. Sorteos en vivo todos los miércoles.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
