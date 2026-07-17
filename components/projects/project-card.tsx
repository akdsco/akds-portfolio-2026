import Link from "next/link";

import { StackChips } from "@/components/stack-chips";
import type { Project } from "@/data/portfolio";
import { cardLift, cardLiftWrap } from "@/lib/card-lift";
import { plainText } from "@/lib/inline-links";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const linked = Boolean(project.caseStudy);
  // The lift is the site's tell for "this goes somewhere", so only a card that
  // does gets it. An earlier-work card that rose under the cursor promised a
  // detail page it doesn't have.
  const className = cn(
    "border-line bg-panel relative flex h-full flex-col gap-3.5 rounded-[11px] border p-5",
    linked ? cn("group-hover:border-hi", cardLift) : "opacity-90",
  );

  const body = (
    <>
      <div>
        {/* The title carries the accent, not a corner glyph. An arrow here said
            nothing the page doesn't already say three times over — the copy
            ("four have full write-ups"), the layout (linked cards above the
            divider, the rest behind a toggle), and the lift on hover. Every
            featured card had one, so within its own group it distinguished
            nothing. Colouring the title instead spends the accent on the moment
            it means something: you're about to open this. */}
        <div
          className={cn(
            "text-ink text-[17px] font-semibold tracking-tight",
            linked &&
              "group-hover:text-hi transition-colors duration-200 ease-out",
          )}
        >
          {project.title}
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

  // The wrapper is the hover target and keeps the card's resting footprint, so
  // the lift can't pull the card out from under the cursor. See lib/card-lift.
  return (
    <div className={cn("h-full", linked && cardLiftWrap)}>
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
