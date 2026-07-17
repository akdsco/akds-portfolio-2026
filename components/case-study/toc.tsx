"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

// Where the reading line sits, as a fraction of the viewport height: a section
// becomes current once its heading has crossed it on the way up.
const READING_LINE = 0.28;
// How close to the foot of the document counts as the end of it. Fractional
// scroll positions and zoom mean the sum rarely lands exactly on scrollHeight.
const BOTTOM_SLACK_PX = 2;

/**
 * The key of the section the reader is on: the last one whose heading has
 * crossed the reading line, with the foot of the document forcing the last
 * section.
 *
 * Both halves are load-bearing, and an IntersectionObserver watching a band near
 * the top of the viewport got each of them wrong, because it can only report
 * what is crossing and has nothing to say at either end of the document:
 *
 * - A section can only reach a line near the top of the viewport if the document
 *   has enough scroll left below it, and the last one never does: the page runs
 *   out while it is still halfway down the screen. It is the taller viewport
 *   that suffers, since a tall one leaves less to scroll — on a case study with
 *   no endorsement to lengthen it, Reflection needs a viewport under ~515px to
 *   light on its own, so on any desktop the TOC sat on the section before it
 *   while the reader was looking at Reflection. Padding the page until the tail
 *   can reach the line costs most of a viewport of dead space and scales with
 *   viewport height, so no fixed number is right. Being at the bottom is its own
 *   answer: there is nothing below, so the last section is where the reader is.
 *
 *   This rescues the last section, not the tail in general. On the same page a
 *   viewport over ~840px tall leaves Outcome unable to reach the line either,
 *   and nothing lights it. That needs a longer page rather than a cleverer spy.
 * - Above the first heading nothing has crossed the line, which the observer
 *   read as "no news" and left the previous section lit, so scrolling back to
 *   the top kept Approach highlighted. Falling back to the first section is what
 *   "nothing has crossed yet" means.
 */
function useActiveSection(keys: string[]) {
  const [active, setActive] = useState<string | undefined>(keys[0]);

  useEffect(() => {
    let queued = false;

    const read = () => {
      const line = window.innerHeight * READING_LINE;
      let current = keys[0];
      for (const key of keys) {
        const top = document.getElementById(key)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) current = key;
      }
      const doc = document.documentElement;
      const atBottom =
        window.scrollY + window.innerHeight >=
        doc.scrollHeight - BOTTOM_SLACK_PX;
      setActive(atBottom ? keys[keys.length - 1] : current);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        read();
      });
    };

    // Once on mount too: a deep link (#reflection) lands mid-document without
    // ever firing a scroll event.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // The line and the foot of the document both move with the viewport.
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [keys]);

  return active;
}

// "On this page" with scroll-spy: the item for the section currently in view
// highlights as you scroll (smooth colour transition).
export function Toc({
  sections,
}: {
  sections: { key: string; title: string }[];
}) {
  // Memoised so the spy's listeners survive its own state updates: a fresh array
  // every render is a fresh dep, which would tear the effect down and rebuild it
  // on each scroll frame that changes the active section.
  const keys = useMemo(() => sections.map((s) => s.key), [sections]);
  const active = useActiveSection(keys);

  return (
    <nav className="border-line bg-panel rounded-[10px] border p-4">
      <div className="text-faint mb-3 font-mono text-[10px] tracking-[0.09em] uppercase">
        on this page
      </div>
      <ul className="flex flex-col gap-0.5">
        {sections.map((section, i) => {
          const isActive = active === section.key;
          return (
            <li key={section.key}>
              <a
                href={`#${section.key}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-mx-2 flex items-baseline gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                  isActive
                    ? "bg-chip text-ink"
                    : "text-dim hover:bg-chip hover:text-ink",
                )}
              >
                <span className="text-hi font-mono text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{section.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
