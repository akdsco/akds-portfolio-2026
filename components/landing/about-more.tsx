"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const MANAGED = new Set(["skills", "experience", "testimonials"]);

// Collapses the deeper About sections (skills, experience, testimonials) behind
// one toggle, mirroring the Projects "show earlier work" pattern. The sections
// are passed as children (server-rendered) and revealed instantly on toggle.
export function AboutMore({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Reveal + scroll when a section is targeted (command palette jump, or a
  // /about#section hash from another page), so the jump isn't broken while
  // collapsed.
  useEffect(() => {
    const reveal = (id: string) => {
      if (!MANAGED.has(id)) return;
      setOpen(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = document.getElementById(id);
          if (!el) return;
          const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          el.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start",
          });
        }),
      );
    };
    reveal(window.location.hash.replace("#", ""));
    const onReveal = (e: Event) => reveal((e as CustomEvent<string>).detail);
    window.addEventListener("about:reveal", onReveal);
    return () => window.removeEventListener("about:reveal", onReveal);
  }, []);
  return (
    <div className="mx-auto max-w-[820px] px-6 py-14 md:px-10">
      <div className="flex items-center gap-4">
        <div className="border-line flex-1 border-t border-dashed" />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="border-line bg-chip text-dim hover:text-ink hover:border-hi inline-flex cursor-pointer items-center gap-2 rounded-[7px] border px-3.5 py-1.5 font-mono text-xs transition-colors"
        >
          {open ? "Show less" : "Show more"}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        <div className="border-line flex-1 border-t border-dashed" />
      </div>
      {open && <div className="mt-14 space-y-14">{children}</div>}
    </div>
  );
}
