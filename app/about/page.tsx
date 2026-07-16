import type { Metadata } from "next";

import { AboutMore } from "@/components/landing/about-more";
import { Experience } from "@/components/landing/experience";
import { Hero } from "@/components/landing/hero";
import { Skills } from "@/components/landing/skills";
import { Testimonials } from "@/components/landing/testimonials";

// `/` redirects here, so /about is the canonical landing page. Description is
// inherited from the root layout; the title feeds its "akds : %s" template.
export const metadata: Metadata = {
  title: "about",
  alternates: { canonical: "/about" },
  // Deliberately no `openGraph` block: this page inherits the root card, and a
  // page-level openGraph replaces the layout's rather than merging, which drops
  // the inherited image. The layout pins og:title on this page's behalf.
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
