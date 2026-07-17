"use client";

import { useState } from "react";

import { Collapse } from "@/components/collapse";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const PANEL_ID = "earlier-work";

export function EarlierWork({ projects }: { projects: Project[] }) {
  const [show, setShow] = useState(false);
  if (projects.length === 0) return null;

  return (
    <div>
      {/* Closed, the panel below is empty and the page's own pb-6 is the gap to
          the footer — a bottom margin here just stacks a second one on top of
          it. The top margin stays either way: it's the only thing between the
          toggle and the cards above. */}
      <div className={cn("mt-6 flex items-center gap-4", show && "mb-6")}>
        <div className="border-line flex-1 border-t border-dashed" />
        <button
          type="button"
          onClick={() => {
            setShow((s) => !s);
          }}
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
