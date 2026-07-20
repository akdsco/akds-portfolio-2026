"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How long the pointer has to sit still on the mark before it flares. Long
 *  enough that a pointer passing through the nav doesn't trip it, short enough
 *  that a deliberate pause is quickly rewarded. */
export const DWELL_MS = 500;

/**
 * "Has the pointer been parked on this thing for a while?" — the trigger for the
 * nav wordmark's flare.
 *
 * Returns a `runId`: 0 while nothing is happening, then a fresh number per
 * flare. It's an id rather than a boolean because CSS won't replay a keyframe on
 * a live element, so the letters key off this to force the remount that does.
 *
 * Both environment checks happen at event time, never at render. They read
 * matchMedia, which is browser-only and `undefined` during SSR, so anything
 * rendered from them mismatches on hydration (see CLAUDE.md).
 */
export function useDwellFlare() {
  const [runId, setRunId] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current === null) return;
    clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const onPointerEnter = useCallback(() => {
    // A hover easter egg. On touch a press fires pointerenter just the same,
    // which is not a gesture anyone means as "hover".
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    clear();
    timer.current = setTimeout(() => {
      setRunId((n) => n + 1);
    }, DWELL_MS);
  }, [clear]);

  const onPointerLeave = useCallback(() => {
    clear();
    // Back to 0 mid-sweep drops the animation with the letters, so the mark
    // follows the pointer out rather than finishing to an empty nav.
    setRunId(0);
  }, [clear]);

  // A pending dwell firing into an unmounted tree sets state on nothing.
  useEffect(() => clear, [clear]);

  return {
    runId,
    handlers: {
      onPointerEnter,
      onPointerLeave,
      onPointerCancel: onPointerLeave,
    },
  };
}
