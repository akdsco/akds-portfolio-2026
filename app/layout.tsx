import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme-provider";
import { PaletteProvider } from "@/components/command-palette";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/site";

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
  // Absolute base for OG/Twitter images, canonical URLs, and the sitemap ref.
  // All relative URLs in child metadata resolve against this.
  metadataBase: new URL(SITE_URL),
  title: "Arkadiusz Ostrowski — Software Engineer",
  description:
    "London-based software engineer building production AI-native software end-to-end. Selected work, experience, and case studies.",
  openGraph: {
    title: "Arkadiusz Ostrowski — Software Engineer",
    description:
      "London-based software engineer building production AI-native software end-to-end.",
    type: "website",
    siteName: "Arkadiusz Ostrowski",
    locale: "en_GB",
    // OG image comes from app/opengraph-image.tsx (file convention).
  },
  twitter: {
    // Title, description and image are auto-filled from `openGraph` above — but
    // only while none of them are set here. Pinning a title disables that for
    // every descendant, which leaves case studies advertising the site title
    // instead of the project's. Leave this as just the card type.
    card: "summary_large_image",
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
        {/* Analytics + Speed Insights only in production — keeps dev quiet. */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
