"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// "On this page" with scroll-spy: the item for the section currently in view
// highlights as you scroll (smooth colour transition).
export function Toc({
  sections,
}: {
  sections: { key: string; title: string }[];
}) {
  const [active, setActive] = useState<string | undefined>(sections[0]?.key);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.key))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // The intersecting section nearest the top of the viewport wins.
        const nearest = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActive(nearest.target.id);
      },
      // A thin detection band near the top of the viewport.
      { rootMargin: "-20% 0px -72% 0px" },
    );
    els.forEach((el) => {
      observer.observe(el);
    });
    return () => {
      observer.disconnect();
    };
  }, [sections]);

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
