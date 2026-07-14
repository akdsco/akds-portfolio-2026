"use client";

import { useState } from "react";

import { Collapse } from "@/components/collapse";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/data/portfolio";

const PANEL_ID = "earlier-work";

export function EarlierWork({ projects }: { projects: Project[] }) {
  const [show, setShow] = useState(false);
  if (projects.length === 0) return null;

  return (
    <div>
      <div className="my-6 flex items-center gap-4">
        <div className="border-line flex-1 border-t border-dashed" />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-expanded={show}
          aria-controls={PANEL_ID}
          className="border-line bg-chip text-dim hover:text-ink hover:border-hi cursor-pointer rounded-[7px] border px-3.5 py-1.5 font-mono text-xs transition-colors"
        >
          {show
            ? "Hide earlier work"
            : `Show earlier work (${projects.length})`}
        </button>
        <div className="border-line flex-1 border-t border-dashed" />
      </div>
      <Collapse open={show} id={PANEL_ID}>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Collapse>
    </div>
  );
}
