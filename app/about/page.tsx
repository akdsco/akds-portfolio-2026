import { AboutMore } from "@/components/landing/about-more";
import { Experience } from "@/components/landing/experience";
import { Hero } from "@/components/landing/hero";
import { Skills } from "@/components/landing/skills";
import { Testimonials } from "@/components/landing/testimonials";

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
