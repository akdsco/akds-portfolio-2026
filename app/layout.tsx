import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/components/theme-provider";
import { PaletteProvider } from "@/components/command-palette";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arkadiusz Ostrowski — Software Engineer",
  description:
    "London-based software engineer building production AI-native software end-to-end. Selected work, experience, and case studies.",
  openGraph: {
    title: "Arkadiusz Ostrowski — Software Engineer",
    description:
      "London-based software engineer building production AI-native software end-to-end.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PaletteProvider>
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </PaletteProvider>
        </ThemeProvider>
        {/* Analytics only in production — keeps local dev console quiet. */}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
