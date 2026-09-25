import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  Amiri,
  Cormorant_Garamond,
  DM_Sans,
  Hind_Siliguri,
  Noto_Serif_Bengali,
} from "next/font/google";
import wedding from "@/config/weddingConfig";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-dm-sans",
});

const notoBengaliSerif = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-bengali-serif",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-bengali-sans",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://halima-weds-ertugrul.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${wedding.brideName.bn} ও ${wedding.groomName.bn} · ${wedding. brideName.en} & ${wedding.groomName.en}`,
  description: `শুভ বিবাহের আমন্ত্রণপত্র — ${wedding.brideName.bn} এবং ${wedding.groomName.bn} · ${wedding.dateDisplay.bn} · ${wedding.venue.bn}, ${wedding.venueLine2.bn}। You are cordially invited to the wedding of ${wedding.brideName.en} & ${wedding.groomName.en}.`,
  keywords: [
    "Bangladeshi Muslim Wedding Invitation",
    "শুভ বিবাহ",
    wedding.brideName.bn,
    wedding.groomName.bn,
    wedding.brideName.en,
    wedding.groomName.en,
  ],
  authors: [{ name: `${wedding.brideName.en} & ${wedding.groomName.en}` }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: `${wedding.brideName.bn} ও ${wedding.groomName.bn}`,
    title: `${wedding.brideName.bn} ও ${wedding.groomName.bn} — ${wedding.dateDisplay.bn}`,
    description: `${wedding.familyBlessingHeader.bn} · ${wedding.dateDisplay.bn} · ${wedding.venue.bn}, ${wedding.venueLine2.bn}`,
    images: [
      {
        url: wedding.coverImage,
        width: 1024,
        height: 1024,
        alt: `${wedding.brideName.en} & ${wedding.groomName.en} Wedding Invitation`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${wedding.brideName.bn} ও ${wedding.groomName.bn} — ${wedding.dateDisplay.bn}`,
    description: `${wedding.brideName.en} & ${wedding.groomName.en} · ${wedding.dateDisplay.en}`,
    images: [wedding.coverImage],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f2e6" },
    { media: "(prefers-color-scheme: dark)", color: "#24050a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${notoBengaliSerif.variable} ${hindSiliguri.variable} ${amiri.variable} bg-[#160408] text-ivory-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
