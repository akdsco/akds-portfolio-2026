"use client";

import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/wordmark";

/** Marks this browsing session's footer sign-off as spent. sessionStorage, not
 *  localStorage: "once per visit" is a session, so a tab close resets it and a
 *  genuine return visit gets the moment again — but crossing between pages in
 *  one session doesn't replay it. */
export const FOOTER_SEEN_KEY = "akds:footer-assembled";

/**
 * The ghosted footer wordmark, which assembles itself — letters rising into
 * place — the first time it scrolls into view in a visit, then rests.
 *
 * A client island so the layout-level footer can stay a server component. The
 * server (and the first client render) paint the mark fully assembled and
 * static: `play` starts false, so there's no data-assemble and no hydration
 * mismatch. The observer flips it on later, only if this visit hasn't spent its
 * sign-off and motion is welcome — so a reduced-motion visitor just sees the
 * resting ghost, and nothing is marked spent for them.
 */
export function FooterWordmark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [play, setPlay] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (sessionStorage.getItem(FOOTER_SEEN_KEY)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        // Spend the visit's sign-off and play, then stop watching — this is a
        // one-shot reveal, not a scroll-linked effect.
        sessionStorage.setItem(FOOTER_SEEN_KEY, "1");
        setPlay(true);
        io.disconnect();
      },
      // Wait until a good part of the mark is on screen, so it assembles as the
      // reader arrives at it rather than while it's a sliver at the edge.
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <Wordmark
      ref={ref}
      assemble
      play={play}
      className={className}
      style={style}
    />
  );
}
