import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cromvent.ee"),
  title: {
    default: "CROMVENT – Ventilatsioonitööd Tartus",
    template: "%s | Cromvent",
  },
  description:
    "Ventilatsiooni torustiku ehitus ja isoleerimine, filtrite vahetus ning seadmete hooldus Tartus ja Lõuna-Eestis.",
  keywords: [
    "ventilatsioon",
    "ventilatsiooni torustik",
    "torustiku ehitus",
    "ventilatsiooni isolatsioon",
    "LAM isolatsioon",
    "armaflex",
    "tulevill",
    "filtrite vahetus",
    "Flexit",
    "Systemair",
    "Zehnder",
    "Tartu ventilatsioon",
  ],
  openGraph: {
    title: "CROMVENT – Ventilatsioonitööd",
    description:
      "Ventilatsiooni torustik, isolatsioon ja hooldus Tartus ja Lõuna-Eestis.",
    url: "https://www.cromvent.ee",
    siteName: "Cromvent",
    type: "website",
    locale: "et_EE",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et">
      <body className={orbitron.className}>{children}</body>
    </html>
  );
}
