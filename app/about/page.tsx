import type { Metadata } from "next";

import { AboutMore } from "@/components/landing/about-more";
import { Experience } from "@/components/landing/experience";
import { Hero } from "@/components/landing/hero";
import { Skills } from "@/components/landing/skills";
import { Testimonials } from "@/components/landing/testimonials";

// `/` redirects here, so /about is the canonical landing page. Title +
// description are inherited from the root layout.
export const metadata: Metadata = {
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Hero />
      <AboutMore>
        <Skills />
        <Experience />
        <Testimonials />
      </AboutMore>
    </>
  );
}
