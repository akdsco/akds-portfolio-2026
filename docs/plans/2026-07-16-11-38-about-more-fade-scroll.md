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
- **Fade, then unmount the whole row.** The dashed rules either side of the
  button exist only to host it, so the button + rules fade together (opacity,
  ~200ms) and then leave the layout entirely. Keeping the button mounted-but-
  invisible would leave an orphan dashed line with a gap punched in the middle,
  which reads as a rendering fault rather than a divider. Unmounting at 200ms
  also lands the ~34px layout shift *before* the scroll at 300ms, so the scroll
  target is computed against settled layout.
- **Scroll after the collapse settles.** `Collapse` animates
  `grid-template-rows` over 300ms. Scrolling on a double rAF (today's code)
  aims at an element that is still mid-animation, so smooth scroll locks onto a
  stale target. Wait the collapse duration instead. When the panel is *already*
  open (a palette jump after opening) there's nothing to wait for — scroll on
  the next tick.
- **Scroll target.** Button click → first managed section present in the DOM
  (`skills`). Palette / hash reveal → the targeted section, unchanged.
- Children are always rendered (`Collapse` clips them rather than unmounting),
  so `getElementById` resolves whether or not the panel is open.

## Increments (test-first)

1. test: clicking "Show more" opens the panel, fades + removes the button, and
   scrolls `skills` to the top; the button never returns as "Show less" (red)
   → impl: one-way `open` state, `rowGone` fade timer, click → reveal first
   managed section (green).
2. test: `about:reveal` for a managed section still opens + scrolls to *that*
   section, and an unmanaged id is still ignored (red — should already pass,
   guards the refactor) → impl: unify both paths through one `reveal(id)`
   helper (green).

## Notes

- `MANAGED` becomes an ordered array (it was a `Set`) so "first section" has a
  defined meaning.
- `COLLAPSE_MS` must stay in sync with `duration-300` in `components/collapse.tsx`.
- Reduced motion: `Collapse` already sets `motion-reduce:transition-none`, and
  the scroll keeps its existing `prefers-reduced-motion` → `behavior: "auto"`
  branch. The timers still run; they just wait on an instant layout.
