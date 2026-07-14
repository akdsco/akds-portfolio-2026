"use client";

import { useState } from "react";

import { Kicker } from "@/components/kicker";
import { testimonials } from "@/data/portfolio";
import { cn } from "@/lib/utils";

// Quotes run 162–327 chars; clamp the long ones with a Read more toggle.
const CLAMP_OVER = 200;

const ordered = [...testimonials].sort((a, b) => a.order - b.order);

export function Testimonials() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <section id="testimonials" className="scroll-mt-20">
      <Kicker label="testimonials" />
      <div className="grid items-start gap-4 sm:grid-cols-2">
        {ordered.map((t) => {
          const clampable = t.quote.length > CLAMP_OVER;
          const expanded = open[t.id] ?? false;
          return (
            <figure
              key={t.id}
              className="border-line bg-panel hover:border-hi relative m-0 rounded-[10px] border p-5 transition-[transform,box-shadow,border-color] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.6)] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
            >
              <div className="text-hi absolute top-2 left-4 font-serif text-4xl leading-none opacity-50">
                &ldquo;
              </div>
              <blockquote
                className={cn(
                  "text-ink mt-3.5 mb-3.5 text-[14.5px] leading-relaxed text-pretty",
                  clampable && !expanded && "line-clamp-4",
                )}
              >
                {t.quote}
              </blockquote>
              {clampable && (
                <button
                  type="button"
                  onClick={() =>
                    setOpen((prev) => ({ ...prev, [t.id]: !expanded }))
                  }
                  className="text-hi -mx-1 mb-3 block w-fit cursor-pointer rounded-[4px] px-1 py-0.5 font-mono text-[11.5px]"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
              <figcaption className="border-line text-ink border-t border-dashed pt-3 text-[13px]">
                <span className="font-semibold">{t.author}</span>
                <div className="text-faint mt-0.5 font-mono text-[11px]">
                  {t.designation}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
