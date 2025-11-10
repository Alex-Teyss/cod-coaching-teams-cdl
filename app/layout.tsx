import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthErrorToast } from "@/components/auth/auth-error-toast";
import { StructuredData } from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://codcoachingteams.com'),
  title: {
    default: "Cod Coaching Teams - Coaching professionnel Call of Duty",
    template: "%s | Cod Coaching Teams"
  },
  description: "Plateforme de coaching d'équipes Call of Duty. Améliorez vos performances avec des stratégies professionnelles, analyses détaillées et coaching personnalisé.",
  keywords: ["Call of Duty", "coaching", "esport", "équipe", "stratégie", "gaming", "COD", "formation", "performance"],
  authors: [{ name: "Cod Coaching Teams" }],
  creator: "Cod Coaching Teams",
  publisher: "Cod Coaching Teams",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://codcoachingteams.com",
    siteName: "Cod Coaching Teams",
    title: "Cod Coaching Teams - Coaching professionnel Call of Duty",
    description: "Améliorez les performances de votre équipe avec des stratégies professionnelles, analyses détaillées et coaching personnalisé.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cod Coaching Teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cod Coaching Teams - Coaching professionnel Call of Duty",
    description: "Améliorez les performances de votre équipe avec des stratégies professionnelles",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://codcoachingteams.com",
    languages: {
      'fr-FR': 'https://codcoachingteams.com',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
          <Suspense fallback={null}>
            <AuthErrorToast />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
