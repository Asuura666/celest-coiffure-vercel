import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Celest Coiffure Élégance | Plaisance-du-Touch",
  description:
    "Salon de coiffure mixte à Plaisance-du-Touch : coupe, couleur, balayage, mise en forme et conseils personnalisés.",
  metadataBase: new URL("https://celest-coiffure.fr"),
  openGraph: {
    title: "Celest Coiffure Élégance",
    description:
      "Salon de coiffure mixte à Plaisance-du-Touch, près de Toulouse.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
        <SpeedInsights sampleRate={0.25} />
      </body>
    </html>
  );
}
