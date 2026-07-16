"use client";

import { useEffect, useId, useState } from "react";

import { Kicker } from "@/components/kicker";
import { testimonials, type Testimonial } from "@/data/portfolio";
import { cardLift, cardLiftWrap } from "@/lib/card-lift";
import { cn } from "@/lib/utils";

// Quotes run 162–327 chars; clamp the long ones with a Read more toggle.
const CLAMP_OVER = 200;
// Drives the height transition AND the clamp that has to outlast it. One
// constant because the two must be equal: re-clamping before the height has
// finished kills the collapse animation outright. Inline-styled rather than a
// `duration-*` class so a literal can't drift away from the timer.
const UNROLL_MS = 300;

const ordered = [...testimonials].sort((a, b) => a.order - b.order);

function Quote({ t }: { t: Testimonial }) {
  const clampable = t.quote.length > CLAMP_OVER;
  const [expanded, setExpanded] = useState(false);
  const quoteId = useId();
  // The box closes now; the text clamps once it's arrived. Re-applying
  // line-clamp the moment we start closing shrinks the text to four lines
  // instantly, so `auto` already measures the closed height and there's nothing
  // left to animate. Held off, the full text rolls up under the clipping box
  // and the ellipsis appears at the end.
  const [textClamped, setTextClamped] = useState(true);
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setTextClamped(!expanded);
      },
      expanded ? 0 : UNROLL_MS,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [expanded]);
  const boxClamped = clampable && !expanded;

  return (
    <div className={cardLiftWrap}>
      <figure
        className={cn(
          "border-line bg-panel group-hover:border-hi relative m-0 flex h-full flex-col rounded-[10px] border p-5",
          cardLift,
        )}
      >
        <div className="text-hi absolute top-2 left-4 font-serif text-4xl leading-none opacity-50">
          &ldquo;
        </div>
        {/* Height, not line-clamp, does the animating: line-clamp can't be
            transitioned. interpolate-size lets `4lh -> auto` interpolate, so the
            quote unrolls to its natural height without measuring it. Browsers
            without it ignore the transition and snap, as this did before.
            Typography sits here so `lh` resolves against the quote's own line
            box rather than the figure's. */}
        <div
          id={quoteId}
          className={cn(
            "mt-3.5 mb-3.5 overflow-hidden text-[14.5px] leading-relaxed",
            "transition-[height] ease-out [interpolate-size:allow-keywords] motion-reduce:transition-none",
            // h-[4lh] must match line-clamp-4 below.
            boxClamped ? "h-[4lh]" : "h-auto",
          )}
          style={{ transitionDuration: `${UNROLL_MS}ms` }}
        >
          <blockquote
            className={cn(
              "text-ink m-0 text-pretty",
              boxClamped && textClamped && "line-clamp-4",
            )}
          >
            {t.quote}
          </blockquote>
        </div>
        {clampable && (
          <button
            type="button"
            onClick={() => {
              setExpanded((e) => !e);
            }}
            aria-expanded={expanded}
            aria-controls={quoteId}
            className="text-hi -mx-1 mb-3 block w-fit cursor-pointer rounded-[4px] px-1 py-0.5 font-mono text-[11.5px]"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
        <figcaption className="border-line text-ink mt-auto border-t border-dashed pt-3 text-[13px]">
          <span className="font-semibold">{t.author}</span>
          <div className="text-faint mt-0.5 font-mono text-[11px]">
            {t.designation}
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20">
      <Kicker label="testimonials" />
      <div className="grid gap-4 sm:grid-cols-2">
        {ordered.map((t) => (
          <Quote key={t.id} t={t} />
        ))}
      </div>
    </section>
  );
}
