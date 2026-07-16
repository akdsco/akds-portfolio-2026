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
  // data-scroll-behavior tells the router it may switch off the
  // `scroll-behavior: smooth` globals.css sets (for hash jumps) while it scrolls
  // to the top on a route change. Without it the router's scrollTo(0) inherits
  // the smooth animation, the incoming page's render cuts it short, and the new
  // page opens part-scrolled.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
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
