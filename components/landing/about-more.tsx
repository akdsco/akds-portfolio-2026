"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { Collapse } from "@/components/collapse";
import { cn } from "@/lib/utils";

// The toggle reveals everything but scrolls to the top of the first section.
const FIRST_SECTION = "skills";
const MANAGED = [FIRST_SECTION, "experience", "testimonials"];
const PANEL_ID = "about-more";
const TOGGLE_ID = "about-more-toggle";
// Keep in sync with Collapse's duration-300: scrolling before the grid rows
// have settled aims smooth-scroll at a stale position.
const COLLAPSE_MS = 300;

// Collapses the deeper About sections (skills, experience, testimonials) behind
// one toggle, mirroring the Projects "show earlier work" pattern. Opening is
// one-way — once the detail is asked for it stays out until a reload.
export function AboutMore({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) =>
    timers.current.push(window.setTimeout(fn, ms));

  // Open and scroll to a section, whether targeted by the toggle, the command
  // palette, or an /about#section hash from another page. Children are always
  // rendered (Collapse clips rather than unmounts), so the element resolves
  // even while closed.
  const reveal = useCallback((id: string) => {
    if (!MANAGED.includes(id)) return;
    const wasOpen = openRef.current;
    openRef.current = true;
    setOpen(true);
    later(
      () => {
        const el = document.getElementById(id);
        if (!el) return;
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      },
      // Already open? Nothing to wait for.
      wasOpen ? 0 : COLLAPSE_MS,
    );
  }, []);

  useEffect(() => {
    // Deferred a tick: a hash landing is an async request to open, not state
    // to cascade through the mount render.
    later(() => reveal(window.location.hash.replace("#", "")), 0);
    const onReveal = (e: Event) => reveal((e as CustomEvent<string>).detail);
    window.addEventListener("about:reveal", onReveal);
    const pending = timers.current;
    return () => {
      window.removeEventListener("about:reveal", onReveal);
      // Don't let a queued scroll outlive the component.
      pending.forEach((t) => clearTimeout(t));
    };
  }, [reveal]);

  return (
    <div className="mx-auto max-w-[820px] px-6 py-14 md:px-10">
      {/* The toggle collapses on the same curve as the panel expands, rather
          than unmounting mid-flight and jerking the content up under it. */}
      <Collapse open={!open} id={TOGGLE_ID}>
        <div
          className={cn(
            "flex items-center gap-4 transition-opacity duration-200 motion-reduce:transition-none",
            open && "opacity-0",
          )}
        >
          <div className="border-line flex-1 border-t border-dashed" />
          <button
            type="button"
            onClick={() => reveal(FIRST_SECTION)}
            aria-expanded={open}
            aria-controls={PANEL_ID}
            className="border-line bg-chip text-dim hover:text-ink hover:border-hi inline-flex cursor-pointer items-center gap-2 rounded-[7px] border px-3.5 py-1.5 font-mono text-xs transition-colors"
          >
            Show more
            <ChevronDown className="size-3.5" />
          </button>
          <div className="border-line flex-1 border-t border-dashed" />
        </div>
      </Collapse>
      <Collapse open={open} id={PANEL_ID}>
        <div className="space-y-14">{children}</div>
      </Collapse>
    </div>
  );
}
