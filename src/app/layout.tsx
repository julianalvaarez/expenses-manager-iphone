import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Mis Finanzas | Gestor de Gastos Personales",
  description:
    "Aplicación fácil y rápida para llevar el control de tus gastos e ingresos personales mes a mes.",
  keywords: [
    "gestor de gastos personal",
    "mis finanzas",
    "control de ingresos y gastos",
    "ahorro personal",
    "presupuesto mensual",
  ],
  authors: [{ name: "Mis Finanzas" }],
  openGraph: {
    title: "Mis Finanzas | Gestor de Gastos Personales",
    description:
      "Controla tus gastos e ingresos personales con resumen mensual y seguimiento de ahorro.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
