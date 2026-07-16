# about more fade scroll

- Date: 2026-07-16 11:38
- Branch: random-bugs

## Problem / Context

`components/landing/about-more.tsx` hides the deeper About sections (skills,
experience, testimonials) behind a "Show more" toggle. Clicking it expands the
`Collapse`, but the revealed content sits below the fold — the viewport doesn't
move, so from the user's seat the click does nothing.

The toggle is currently two-way ("Show more" ↔ "Show less"). The owner wants it
one-way: once the detail is asked for, it stays out until a page refresh.

The command palette (`⌘K` / `/`) and `/about#section` hash landings must keep
working: `command-palette.tsx` dispatches `about:reveal` with a section id,
`AboutMore` listens, opens the panel and scrolls to that specific section.

## Plan

On click: fade the button out, expand the panel, and once the expansion has
actually produced layout, scroll the first revealed section to the top.

- **One-way open.** Drop the `open` → `closed` path and the "Show less" label.
  Reopening is a page refresh.
- **Fade the toggle, then collapse it away.** The dashed rules either side of
  the button exist only to host it, so the row fades (opacity, ~200ms) and gives
  its space back.
- **Scroll on the click.**
- **Scroll target.** Button click → first managed section present in the DOM.
  Palette / hash reveal → the targeted section, unchanged.
- Children are always rendered (`Collapse` clips them rather than unmounting),
  so `getElementById` resolves whether or not the panel is open.

### What actually shipped, and why it differs

Two things in the plan above were wrong, and the code went the other way. Kept
here because the reasoning is the point:

- **The toggle collapses; it does not unmount.** Unmounting the row dropped
  ~34px out of the layout in one frame, and the content below jerked up under
  the cursor before the scroll had started. It now sits in its own `Collapse`
  and gives its space back on the same 300ms curve the panel expands on —
  measured, the largest single-frame move of `#skills` went from ~34px to 4px.
- **The scroll does not wait for the collapse to settle.** It can't: native
  `scrollIntoView({behavior:"smooth"})` fixes its target on the call, and at
  click time the panel hasn't expanded, so the document is too short for the
  target to exist — it clamps and lands 538px short (measured). Waiting instead
  costs a dead beat where the click does nothing. `lib/scroll-into-view-live`
  re-aims every frame, so motion starts ~15ms after the click and follows the
  layout as it grows. `COLLAPSE_MS` is passed in as `settleMs`: not a delay
  before scrolling, but the point after which an apparently-closed gap can be
  trusted as arrival.

## Increments (test-first)

1. test: clicking "Show more" opens the panel, fades the toggle away, and
   scrolls to the first section; the button never returns as "Show less" (red)
   → impl: one-way `open` state, toggle in its own `Collapse`, click → reveal
   first managed section (green).
2. test: `about:reveal` for a managed section still opens + scrolls to *that*
   section, and an unmanaged id is still ignored (red — should already pass,
   guards the refactor) → impl: unify both paths through one `reveal(id)`
   helper (green).

## Notes

- "First section" is read off the DOM (`querySelector` returns document order),
  not hardcoded — `about/page.tsx` owns the running order and has changed it.
- `COLLAPSE_MS` lives in `components/collapse.tsx` beside the `duration-300` it
  describes, and is exported to whoever needs to outlast that animation.
- Reduced motion: `Collapse` sets `motion-reduce:transition-none`, and
  `scrollIntoViewLive` jumps rather than glides — one frame late, so the jump
  measures a document that has actually grown.
