"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How long the pointer has to sit still on the mark before it flares. Long
 *  enough that a pointer passing through the nav doesn't trip it, short enough
 *  that a deliberate pause is quickly rewarded. */
export const DWELL_MS = 500;

/** How long to hold the flare once it has started, before releasing it. Tracks
 *  the nav wave's own length: four letters at the CSS defaults (360ms each,
 *  180ms apart) finish ~900ms after the first. Holding for this whole span is
 *  what lets a triggered flare play out even after the pointer has left, then
 *  the flare releases (data-wave drops and the wave settles back to rest). Keep
 *  in sync with --flare-duration / --flare-stagger in globals.css. */
export const FLARE_HOLD_MS = 900;

/**
 * "Has the pointer been parked on this thing for a while?" — the trigger for the
 * nav wordmark's flare.
 *
 * Returns a `runId`: 0 while nothing is happening, then a fresh number per
 * flare. It's an id rather than a boolean because CSS won't replay a keyframe on
 * a live element, so the letters key off this to force the remount that does.
 *
 * Once a flare fires it runs to completion on its own timer, not the pointer's
 * presence: leaving mid-wave no longer cuts it short. `runId` stays non-zero for
 * the whole hold, so `data-wave` stays set and the letter keyframe plays all the
 * way through even after the pointer has gone, then drops back to 0 at rest.
 *
 * Both environment checks happen at event time, never at render. They read
 * matchMedia, which is browser-only and `undefined` during SSR, so anything
 * rendered from them mismatches on hydration (see CLAUDE.md).
 */
export function useDwellFlare() {
  const [runId, setRunId] = useState(0);
  const dwell = useRef<ReturnType<typeof setTimeout> | null>(null);
  const release = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDwell = useCallback(() => {
    if (dwell.current === null) return;
    clearTimeout(dwell.current);
    dwell.current = null;
  }, []);

  const clearRelease = useCallback(() => {
    if (release.current === null) return;
    clearTimeout(release.current);
    release.current = null;
  }, []);

  const onPointerEnter = useCallback(() => {
    // A hover easter egg. On touch a press fires pointerenter just the same,
    // which is not a gesture anyone means as "hover".
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    clearDwell();
    dwell.current = setTimeout(() => {
      // Flare starts: bump the run to replay the wave, then hold it for the
      // wave's own length on a release timer. From here the pointer is
      // irrelevant — leaving won't cut it, and re-dwelling replaces the hold.
      setRunId((n) => n + 1);
      clearRelease();
      release.current = setTimeout(() => {
        setRunId(0);
      }, FLARE_HOLD_MS);
    }, DWELL_MS);
  }, [clearDwell, clearRelease]);

  const onPointerLeave = useCallback(() => {
    // Only cancel a dwell that hasn't fired yet — a pointer passing through. A
    // flare already under way keeps its own release timer, so it finishes and
    // then fades rather than snapping off with the pointer.
    clearDwell();
  }, [clearDwell]);

  // Pending timers firing into an unmounted tree set state on nothing.
  useEffect(() => {
    return () => {
      clearDwell();
      clearRelease();
    };
  }, [clearDwell, clearRelease]);

  return {
    runId,
    handlers: {
      onPointerEnter,
      onPointerLeave,
      onPointerCancel: onPointerLeave,
    },
  };
}
