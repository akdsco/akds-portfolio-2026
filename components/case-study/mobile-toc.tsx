"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Collapse } from "@/components/collapse";
import { cn } from "@/lib/utils";

const PANEL_ID = "case-study-jump";

// Mobile counterpart to the desktop `Toc`. The desktop rail is a sticky
// scroll-spy; below `lg` it's hidden, and a scroll-spy has no job in a
// non-sticky block, so this is a plain "jump to section" disclosure instead:
// tucked away by default, expands to numbered `#hash` links, and closes itself
// once you've picked one.
export function MobileToc({
  sections,
}: {
  sections: { key: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-line bg-panel overflow-hidden rounded-[10px] border">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        className="text-faint hover:text-ink flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 font-mono text-[10px] tracking-[0.09em] uppercase transition-colors"
      >
        <span className="flex-1 text-left">jump to section</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-3.5 transition-transform duration-300 ease-out motion-reduce:transition-none",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>
      <Collapse open={open} id={PANEL_ID}>
        <ul className="flex flex-col gap-0.5 px-2 pb-3">
          {sections.map((section, i) => (
            <li key={section.key}>
              <a
                href={`#${section.key}`}
                onClick={() => {
                  setOpen(false);
                }}
                className="text-dim hover:bg-chip hover:text-ink flex items-baseline gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors"
              >
                <span className="text-hi font-mono text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </Collapse>
    </nav>
  );
}
