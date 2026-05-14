import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Espace client Kozéo",
  description: "Votre projet Kozéo en un coup d'œil — interventions, devis, factures.",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={interTight.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
