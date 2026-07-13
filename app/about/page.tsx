import { Experience } from "@/components/landing/experience";
import { Hero } from "@/components/landing/hero";
import { Skills } from "@/components/landing/skills";
import { Testimonials } from "@/components/landing/testimonials";

export default function AboutPage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-[820px] space-y-14 px-6 py-14 md:px-10">
        <Skills />
        <Experience />
        <Testimonials />
      </div>
    </>
  );
}
