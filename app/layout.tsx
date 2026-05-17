import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "./components/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://generalconclave.general-conclave-industries.workers.dev";

export const metadata: Metadata = {
  title: { default: "General Conclave Industries", template: "%s | General Conclave" },
  description: "AI-автоматизация для малого бизнеса. Telegram-боты, AI-интеграции и готовые цифровые продукты. Первый результат за 7 дней.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: "General Conclave Industries",
    title: "General Conclave Industries — AI-автоматизация для бизнеса",
    description: "Автоматизируем бизнес. Убираем рутину. Увеличиваем выручку. Telegram-боты, AI-интеграции и готовые промт-пакеты.",
    url: SITE_URL,
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "General Conclave" }],
  },
  twitter: {
    card: "summary",
    title: "General Conclave Industries",
    description: "AI-автоматизация для малого бизнеса. Первый результат за 7 дней.",
    images: ["/logo.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
