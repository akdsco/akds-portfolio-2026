import type { Metadata } from "next";

import { HeroPrompt } from "@/components/command-palette";
import { HeroBand } from "@/components/hero-band";
import { EarlierWork } from "@/components/projects/earlier-work";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Projects — Arkadiusz Ostrowski",
  description: "Selected engineering work, with full case-study write-ups.",
  alternates: { canonical: "/projects" },
};

const featured = projects.filter((p) => p.featured);
const earlier = projects.filter((p) => !p.featured);

export default function ProjectsPage() {
  return (
    <>
      <HeroBand className="max-w-[880px] py-11">
        <div className="mb-6">
          <HeroPrompt command="ls ~/projects" />
        </div>
        <h1 className="text-ink mb-3 text-4xl font-semibold tracking-tight sm:text-[40px]">
          Projects
        </h1>
        <p className="text-dim max-w-xl text-lg leading-relaxed text-pretty">
          Selected work, newest first.
        </p>
      </HeroBand>

      <div className="mx-auto max-w-[880px] px-6 py-10 md:px-10">
        <div className="scroll-reveal-group grid gap-4 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <EarlierWork projects={earlier} />
      </div>
    </>
  );
}
