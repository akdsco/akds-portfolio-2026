"use client";

import { useEffect, useState } from "react";

import { Wordmark } from "@/components/wordmark";

/** Marks this browsing session's footer sign-off as spent. sessionStorage, not
 *  localStorage: "once per visit" is a session, so a tab close resets it and a
 *  genuine return visit gets the moment again — but crossing between pages in
 *  one session doesn't replay it. */
export const FOOTER_SEEN_KEY = "akds:footer-assembled";

/** A beat between reaching the bottom and the mark assembling, so it reads as a
 *  deliberate sign-off rather than firing the instant the page settles. */
export const FOOTER_ENTER_DELAY_MS = 400;

/** Slack on the bottom test, to absorb sub-pixel rounding and elastic overscroll
 *  so "practically at the bottom" counts. */
const BOTTOM_SLOP_PX = 2;

/**
 * Rest and peak colours for the footer's coral wave. It runs the SAME flare as
 * the nav, but the nav mark is 38px and this one is ~200px, so full coral would
 * blare; the peak is dialled back to a translucent coral and the rest matches
 * the mark's own `text-ink/10` ghost, so the wave shimmers through and settles
 * back invisibly. Both track their theme tokens (`--hi`, `--ink`).
 */
const FOOTER_FLARE_STYLE: React.CSSProperties = {
  "--flare-rest": "color-mix(in oklab, var(--ink) 10%, transparent)",
  "--flare-peak": "color-mix(in oklab, var(--hi) 55%, transparent)",
} as React.CSSProperties;

/**
 * The ghosted footer wordmark, which runs the nav's coral wave once — as a
 * sign-off — the first time the reader reaches the foot of the page in a visit,
 * then rests.
 *
 * The trigger is scroll position, not an IntersectionObserver: the mark is huge
 * and shoved off-centre (`translate-x`), so it overflows the viewport and can
 * never be "fully visible" — and firing when it's merely half on screen goes off
 * mid-scroll, which reads as a glitch. Page-bottom is the unambiguous signal,
 * and it's what the reader means by "the end".
 *
 * A client island so the layout-level footer can stay a server component. The
 * server (and the first client render) paint the mark static: `play` starts
 * false, so there's no data-wave and no hydration mismatch. Scroll flips it on
 * later, only if this visit hasn't spent its sign-off and motion is welcome —
 * so a reduced-motion visitor just sees the resting ghost, and nothing is marked
 * spent for them.
 */
export function FooterWordmark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(FOOTER_SEEN_KEY)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let delay: ReturnType<typeof setTimeout> | undefined;
    const atBottom = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - BOTTOM_SLOP_PX;

    const onScroll = () => {
      if (!atBottom()) return;
      // Reached the end. Stop listening and, after a short beat, play once and
      // spend the visit's sign-off — a one-shot reveal, not a scroll-linked
      // effect.
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delay = setTimeout(() => {
        sessionStorage.setItem(FOOTER_SEEN_KEY, "1");
        setPlay(true);
      }, FOOTER_ENTER_DELAY_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // A page that fits without scrolling is already at its bottom.
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(delay);
    };
  }, []);

  return (
    <Wordmark
      flare
      play={play}
      className={className}
      style={{ ...FOOTER_FLARE_STYLE, ...style }}
    />
  );
}
