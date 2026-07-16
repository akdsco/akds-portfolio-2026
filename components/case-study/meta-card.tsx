import type { ReactNode } from "react";

import { ExternalLink } from "@/components/external-link";
import { StackChips } from "@/components/stack-chips";
import { companyHref, type Project } from "@/data/portfolio";

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="text-faint mb-1.5 font-mono text-[10px] tracking-[0.09em] uppercase">
      {children}
    </div>
  );
}

export function MetaCard({ project }: { project: Project }) {
  const status = project.caseStudy?.status;
  const href = companyHref(project.company);
  return (
    <div className="border-line bg-panel overflow-hidden rounded-[10px] border">
      <div className="border-line flex items-center gap-2 border-b px-3.5 py-2.5">
        <span className="bg-hi size-[9px] rounded-full" />
        <span className="text-dim font-mono text-[11px] tracking-[0.06em]">
          meta.json
        </span>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div>
          <Label>company</Label>
          <div className="text-ink text-[13.5px]">
            {href ? (
              <ExternalLink href={href}>{project.company}</ExternalLink>
            ) : (
              project.company
            )}
          </div>
        </div>
        {project.role && (
          <div>
            <Label>role</Label>
            <div className="text-ink text-[13.5px]">{project.role}</div>
          </div>
        )}
        {project.period && (
          <div>
            <Label>period</Label>
            <div className="text-ink text-[13.5px]">{project.period}</div>
          </div>
        )}
        <div>
          <Label>stack</Label>
          <StackChips items={project.stack} />
        </div>
        {status && (
          <div className="border-line flex items-center gap-2 border-t border-dashed pt-3.5">
            <span className="bg-hi animate-pulse-dot size-[7px] shrink-0 rounded-full shadow-[0_0_8px_var(--hi)]" />
            <span className="text-dim font-mono text-[11.5px]">
              status: <span className="text-hi">{status}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
