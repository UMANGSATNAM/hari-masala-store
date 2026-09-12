import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://harimasala.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Hari Masala — Pure & Authentic Indian Spices",
  description:
    "Shop premium quality Indian spices online at Hari Masala. Turmeric, chili, garam masala, cardamom, saffron and more. Order on WhatsApp.",
  keywords: [
    "Hari Masala",
    "Indian spices",
    "buy spices online",
    "turmeric powder",
    "garam masala",
    "red chili powder",
    "saffron",
    "cardamom",
    "whatsapp order",
  ],
  authors: [{ name: "Hari Masala" }],
  openGraph: {
    title: "Hari Masala — Pure & Authentic Indian Spices",
    description:
      "Shop premium quality Indian spices online at Hari Masala. Pure quality, rich aroma & traditional taste delivered to your doorstep.",
    url: siteUrl,
    siteName: "Hari Masala",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hari Masala — Pure & Authentic Indian Spices",
        type: "image/png",
      },
      {
        url: "/logo-share.png",
        width: 800,
        height: 800,
        alt: "Hari Masala Logo",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hari Masala — Pure & Authentic Indian Spices",
    description:
      "Premium quality Indian spices. Order on WhatsApp.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo-share.png",
    apple: "/logo-share.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
