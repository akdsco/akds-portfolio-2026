"use client";

import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Collapse, COLLAPSE_MS } from "@/components/collapse";
import { scrollIntoViewLive } from "@/lib/scroll-into-view-live";
import { cn } from "@/lib/utils";

const MANAGED = ["skills", "experience", "testimonials"];
// querySelector returns the first match in *document* order, so this asks the
// page which section comes first instead of hardcoding it here — about/page.tsx
// owns the running order and has already changed it once.
const MANAGED_SELECTOR = MANAGED.map((id) => `#${id}`).join(", ");
const PANEL_ID = "about-more";
const TOGGLE_ID = "about-more-toggle";

// Collapses the deeper About sections (skills, experience, testimonials) behind
// one toggle, mirroring the Projects "show earlier work" pattern. Opening is
// one-way — once the detail is asked for it stays out until a reload.
export function AboutMore({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const cancelScroll = useRef<() => void>(undefined);

  // Open and scroll to a section, whether targeted by the toggle, the command
  // palette, or an /about#section hash from another page. Children are always
  // rendered (Collapse clips rather than unmounts), so the element resolves
  // even while closed — no wait needed before aiming at one.
  const reveal = useCallback((id: string) => {
    if (!MANAGED.includes(id)) return;
    setOpen(true);
    const el = document.getElementById(id);
    if (!el) return;
    cancelScroll.current?.();
    cancelScroll.current = scrollIntoViewLive(el, COLLAPSE_MS);
  }, []);

  // The toggle reveals everything, and lands on whichever section is on top.
  const revealFirst = useCallback(() => {
    const first = document
      .getElementById(PANEL_ID)
      ?.querySelector(MANAGED_SELECTOR);
    if (first) reveal(first.id);
    else setOpen(true);
  }, [reveal]);

  useEffect(() => {
    // Deferred a tick: a hash landing is an async request to open, not state
    // to cascade through the mount render.
    const mounted = window.setTimeout(() => {
      reveal(window.location.hash.replace("#", ""));
    });
    const onReveal = (e: Event) => {
      reveal((e as CustomEvent<string>).detail);
    };
    window.addEventListener("about:reveal", onReveal);
    return () => {
      window.removeEventListener("about:reveal", onReveal);
      clearTimeout(mounted);
      // Don't let a running scroll outlive the component.
      cancelScroll.current?.();
    };
  }, [reveal]);

  return (
    // Asymmetric: below the toggle only has to reach the footer's ghosted
    // wordmark, which reads better close so the mark feels attached to the page.
    <div className="mx-auto max-w-[820px] px-6 pt-8 pb-6 md:px-10">
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
            onClick={revealFirst}
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
