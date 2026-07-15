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

export const metadata: Metadata = {
  title: "Hari Masala — Pure & Authentic Indian Spices",
  description:
    "Shop premium quality Indian spices online at Hari Masala. Turmeric, chili, garam masala, cardamom, saffron and more. Order on WhatsApp with cash on delivery.",
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
      "Premium quality Indian spices. Order on WhatsApp. Cash on delivery available.",
    siteName: "Hari Masala",
    type: "website",
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
