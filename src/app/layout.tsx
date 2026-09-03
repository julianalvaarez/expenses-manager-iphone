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
  title: "FinCorp | Gestor de Gastos e Ingresos Corporativo",
  description:
    "Plataforma empresarial avanzada para la gestión, auditoría y control de gastos e ingresos corporativos. Visualización por meses, reportes financieros y métricas en tiempo real.",
  keywords: [
    "gestor de gastos",
    "control de ingresos",
    "finanzas corporativas",
    "gestión financiera",
    "auditoría empresarial",
    "presupuesto mensual",
    "FinCorp",
  ],
  authors: [{ name: "FinCorp Enterprise Systems" }],
  creator: "FinCorp",
  publisher: "FinCorp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "FinCorp | Gestor de Gastos e Ingresos Corporativo",
    description:
      "Controla tus finanzas empresariales con análisis mensual detallado, métricas KPI en tiempo real y auditoría de transacciones.",
    url: "https://fincorp.app",
    siteName: "FinCorp Gestor Financiero",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinCorp | Gestor de Gastos e Ingresos Corporativo",
    description:
      "Controla tus finanzas empresariales con análisis mensual detallado, métricas KPI en tiempo real y auditoría de transacciones.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
