// Fraction of the remaining distance to close per 60fps frame — an ease-out
// that lands in roughly half a second. Scaled by real elapsed time below, so a
// 120Hz display doesn't run it at double speed.
const EASE = 0.15;
const FRAME_MS = 1000 / 60;
// The tail of an ease-out asks for steps finer than a device pixel, which the
// scroll position quantizes straight back to where it was — leaving it stuck a
// pixel short for good. Keep a floor under the step, never larger than what's
// left to travel, and snap the last sliver.
const MIN_STEP_PX = 0.5;
const SNAP_PX = 1;
const GIVE_UP_MS = 2000;
// Keys that scroll the page, and so mean "I'll take it from here". Anything
// else must not cancel: the command palette dispatches its jump *from* an Enter
// keydown that is still bubbling up to window, so treating every key as a
// takeover cancels the scroll on the very keystroke that asked for it.
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

/**
 * Smooth-scroll `el` into view (honouring its `scroll-margin-top`), re-aiming
 * every frame rather than locking onto one target up front.
 *
 * Native `scrollIntoView({behavior:"smooth"})` can't do this job when the
 * layout is still moving: it fixes its target on the call. Fired as a collapse
 * starts expanding, the document is still short — there is no scrollY 700 to
 * scroll to yet — so the target gets clamped against the collapsed page and the
 * scroll finishes hundreds of px short. Waiting for the expansion instead buys
 * a dead beat where the click does nothing. Re-reading the target each frame
 * lets the scroll start immediately and follow the layout as it grows.
 *
 * `settleMs` is how long the caller's layout takes to stop moving; until then
 * an apparently-closed gap is not treated as arrival, since early on the target
 * is clamped to roughly where we already are.
 *
 * Cancels if the user takes over the scroll. Reduced motion jumps instead.
 * Returns a cancel fn.
 */
export function scrollIntoViewLive(el: Element, settleMs: number) {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  // Where we'd need to be, given the layout as it stands this frame.
  const aim = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const want = window.scrollY + el.getBoundingClientRect().top - margin;
    return Math.max(0, Math.min(want, max));
  };

  // Every move here is "instant": a global `scroll-behavior: smooth` would
  // otherwise kick off a fresh CSS animation on every frame and crawl. The
  // easing is ours.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // One frame, so the caller's state change has reached the DOM: aiming now
    // would measure a document that hasn't grown yet and clamp short. Reduced
    // motion means no transition to wait out, so one frame is the whole wait.
    const jump = requestAnimationFrame(() => {
      window.scrollTo({ top: aim(), behavior: "instant" });
    });
    return () => {
      cancelAnimationFrame(jump);
    };
  }

  const started = performance.now();
  let last = started;
  let frame = 0;
  const onKey = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) stop();
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    // Whoever is scrolling now, it isn't us.
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", onKey);
  };
  const step = (now: number) => {
    const want = aim();
    const gap = want - window.scrollY;
    const elapsed = now - started;
    if (
      (elapsed > settleMs && Math.abs(gap) <= SNAP_PX) ||
      elapsed > GIVE_UP_MS
    ) {
      window.scrollTo({ top: want, behavior: "instant" });
      stop();
      return;
    }
    // Rate per real millisecond, so the glide takes the same wall-clock time at
    // 60Hz and 120Hz.
    const rate = 1 - Math.pow(1 - EASE, (now - last) / FRAME_MS);
    last = now;
    // Floor the move so it can't stall, but cap it at what's left so it can't
    // cross the target and ping-pong back on the next frame. Magnitudes only —
    // `gap` is negative scrolling up.
    const move = Math.min(
      Math.max(Math.abs(gap * rate), MIN_STEP_PX),
      Math.abs(gap),
    );
    window.scrollTo({
      top: window.scrollY + Math.sign(gap) * move,
      behavior: "instant",
    });
    frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", onKey);
  return stop;
}
