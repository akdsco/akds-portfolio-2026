import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme-provider";
import { PaletteProvider } from "@/components/command-palette";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { OG_SHARED, SITE_BRAND, SITE_URL } from "@/lib/site";

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
  // Tab titles read as the route: "akds : about", "akds : projects". Each page
  // supplies its own segment; `default` only covers routes that set no title of
  // their own (not-found, error), which get the bare brand.
  title: {
    template: `${SITE_BRAND} : %s`,
    default: SITE_BRAND,
  },
  description:
    "London-based software engineer building production AI-native software end-to-end. Selected work, experience, and case studies.",
  openGraph: {
    // og:title is pinned; og:description is not. Left unpinned, og:title falls
    // back to the page's own `title` — which the template has already turned
    // into "akds : about". The card art is a giant "akds" wordmark, so a title
    // repeating it says the brand twice and the page not at all. Pages state
    // their own bare og:title ("about", "Proof Library"); this is only the
    // floor for anything that doesn't.
    //
    // Description stays unpinned: pinning would cascade the site blurb over
    // each page's own.
    ...OG_SHARED,
    title: SITE_BRAND,
    type: "website",
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
