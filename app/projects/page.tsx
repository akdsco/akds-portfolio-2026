import type { Metadata } from "next";

import { EarlierWork } from "@/components/projects/earlier-work";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Projects — Arkadiusz Ostrowski",
  description: "Selected engineering work, with full case-study write-ups.",
};

const featured = projects.filter((p) => p.featured);
const earlier = projects.filter((p) => !p.featured);

export default function ProjectsPage() {
  return (
    <>
      <section className="border-line relative border-b">
        <div className="scanline pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[880px] px-6 py-11 md:px-10">
          <div className="text-dim mb-6 flex items-center gap-2 font-mono text-[12.5px]">
            <span className="text-brand">$</span>
            <span>ls ~/projects</span>
            <span className="bg-brand animate-blink inline-block h-[15px] w-2 translate-y-0.5" />
          </div>
          <h1 className="text-ink mb-3 text-4xl font-semibold tracking-tight sm:text-[40px]">
            Projects
          </h1>
          <p className="text-dim max-w-xl text-lg leading-relaxed text-pretty">
            Selected work, newest first. Four have full write-ups; the rest are
            here for completeness.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[880px] px-6 py-10 md:px-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <EarlierWork projects={earlier} />
      </div>
    </>
  );
}
