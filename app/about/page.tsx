import type { Metadata } from "next";

import { AboutMore } from "@/components/landing/about-more";
import { Experience } from "@/components/landing/experience";
import { Hero } from "@/components/landing/hero";
import { Skills } from "@/components/landing/skills";
import { Testimonials } from "@/components/landing/testimonials";
import { SITE_BRAND } from "@/lib/site";

// `/` redirects here, so /about is the canonical landing page. Description is
// inherited from the root layout; the title feeds its "akds : %s" template.
export const metadata: Metadata = {
  title: "about",
  alternates: { canonical: "/about" },
  // No `images` key — app/about/opengraph-image.tsx owns the card, and the file
  // convention only applies while no level declares `images` itself. That file
  // exists precisely because this block does: a page-level openGraph replaces
  // the layout's rather than merging, so without it /about has no card at all.
  openGraph: {
    title: "about",
    type: "website",
    url: "/about",
    siteName: SITE_BRAND,
    locale: "en_GB",
  },
};

export default function AboutPage() {
  return (
    <>
      <Hero />
      <AboutMore>
        <Experience />
        <Skills />
        <Testimonials />
      </AboutMore>
    </>
  );
}
