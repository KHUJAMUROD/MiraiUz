import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import LowEndDetector from "@/components/LowEndDetector/LowEndDetector";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mirai-jpn.uz";
const NORMALIZED_SITE_URL = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(NORMALIZED_SITE_URL),
  title: {
    default: "Mirai Uzbekistan - Yaponiyada o'qish",
    template: "%s | Mirai Uzbekistan",
  },
  description: "Yaponiyada ta'limni Miari bilan boshlang.",
  keywords: [
    "MIRAI JPN",
    "MiraiJpn",
    "Mirai",
    "Yapon tili kurslari",
    "Yaponiyada o'qish",
    "student visa",
    "JLPT",
    "NAT-TEST",
    "Uzbekistan",
    "Japan language center",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"],
  },
  openGraph: {
    title: "Mirai Uzbekistan - Yaponiyada o'qish",
    description: "Yaponiyada ta'limni Miari bilan boshlang.",
    url: "/",
    siteName: "Mirai JPN",
    locale: "uz_UZ",
    type: "website",
    images: [
      {
        url: "/images/main_pics/main.webp",
        width: 1200,
        height: 630,
        alt: "Mirai Uzbekistan - Yaponiyada ta'lim markazi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirai Uzbekistan - Yaponiyada o'qish",
    description: "Yaponiyada ta'limni Miari bilan boshlang.",
    images: ["/images/main_pics/main.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LowEndDetector />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
