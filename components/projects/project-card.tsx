import Link from "next/link";

import { StackChips } from "@/components/stack-chips";
import type { Project } from "@/data/portfolio";
import { plainText } from "@/lib/inline-links";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const linked = Boolean(project.caseStudy);
  const className = cn(
    "border-line bg-panel hover:border-hi flex flex-col gap-3.5 rounded-[11px] border p-5 transition-[transform,box-shadow,border-color] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.6)] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none",
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
      {/* plainText, not LinkedText: the whole card is wrapped in a <Link> below,
          so an anchor here would nest <a> inside <a>. The label still reads. */}
      <p className="text-dim line-clamp-3 text-sm leading-relaxed">
        {plainText(project.hook)}
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
