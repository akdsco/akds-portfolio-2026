import Link from "next/link";

import { StackChips } from "@/components/stack-chips";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const linked = Boolean(project.caseStudy);
  const className = cn(
    "border-line bg-panel hover:border-hi flex flex-col gap-3.5 rounded-[11px] border p-5 transition-colors",
    !linked && "opacity-90",
  );

  const body = (
    <>
      <div>
        <div className="flex items-baseline justify-between gap-2.5">
          <div className="text-ink text-[17px] font-semibold tracking-tight">
            {project.title}
          </div>
          {linked && <span className="text-hi font-mono text-sm">→</span>}
        </div>
        <div className="text-faint mt-1 font-mono text-[11.5px]">
          {project.company}
        </div>
      </div>
      <p className="text-dim line-clamp-3 text-sm leading-relaxed">
        {project.hook}
      </p>
      <div className="mt-auto">
        <StackChips items={project.stack} />
      </div>
    </>
  );

  if (linked) {
    return (
      <Link href={`/projects/${project.slug}`} className={className}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}
