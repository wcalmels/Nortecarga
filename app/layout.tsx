import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NorteCarga Red",
  description: "Red operacional para conectar cargas, camiones y oportunidades laborales en el norte de Chile.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "NorteCarga Red",
    description: "Carga, capacidad y trabajo conectados en una sola red operacional.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
