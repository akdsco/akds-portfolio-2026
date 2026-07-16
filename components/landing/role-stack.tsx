"use client";

import { useId, useState } from "react";

import { Collapse } from "@/components/collapse";
import { chipClass } from "@/components/stack-chips";
import { cn } from "@/lib/utils";

// A role's tech, led by the few worth scanning. The rest sits behind a toggle
// so a long stack can't bury the role it belongs to — the reader gets one line,
// and the detail is a click away if they want it.
export function RoleStack({ lead, rest }: { lead: string[]; rest: string[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const chip = cn(chipClass, "hover:border-hi hover:text-ink");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {lead.map((item) => (
          <span key={item} className={chip}>
            {item}
          </span>
        ))}
        {rest.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className={cn(
              chipClass,
              "text-hi hover:border-hi cursor-pointer border-dashed",
            )}
          >
            {open ? "Show less" : `+${rest.length} more`}
          </button>
        )}
      </div>
      {rest.length > 0 && (
        <Collapse open={open} id={panelId}>
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {rest.map((item) => (
              <span key={item} className={chip}>
                {item}
              </span>
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
}
