import Link from "next/link";

import { StackChips } from "@/components/stack-chips";
import type { Project } from "@/data/portfolio";
import { cardLift, cardLiftWrap } from "@/lib/card-lift";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const linked = Boolean(project.caseStudy);
  const className = cn(
    "border-line bg-panel group-hover:border-hi relative flex h-full flex-col gap-3.5 rounded-[11px] border p-5",
    cardLift,
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

  // The wrapper is the hover target and keeps the card's resting footprint, so
  // the lift can't pull the card out from under the cursor. See lib/card-lift.
  return (
    <div className={cn(cardLiftWrap, "h-full")}>
      {linked ? (
        <Link href={`/projects/${project.slug}`} className={className}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </div>
  );
}
