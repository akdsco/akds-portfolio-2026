# center nav links

- Date: 2026-09-03 12:26
- Branch: center-nav-links

## Tickets

- Resolves: (none — direct fix, no ticket by owner's request)
- Refs:

## Problem / Context

The top nav's About/Projects links don't line up on the page's centre axis, so
they sit visibly off-centre from the centred "Experience / Skills" toggle below.

Cause: `components/site-nav.tsx` lays the bar out as a 3-group flexbox with
`justify-between` — `[akds logo] … [About Projects] … [icons]`. `justify-between`
spreads three groups with equal gaps; it only centres the middle group when the
left and right groups are the same width. They aren't (the "akds" wordmark is
wider than the icon cluster), so the middle group drifts left of the true centre.
The section content below is centred on the page axis, so the two don't align.

## Plan

Lay the nav out as a 3-column grid instead: `grid grid-cols-[1fr_auto_1fr]`, with
the logo `justify-self-start`, the links `justify-self-center`, the icons
`justify-self-end`. The centre (`auto`) column is always at the bar's true centre
regardless of the side groups' widths — and stays correct when the icons fold
into the palette button under 500px. No behaviour, data, or a11y change; markup
order and every class except the layout container stays put.

## Behaviours (Given / When / Then)

- **B1 — links centred.** Given the About page at a desktop width, When the nav
  renders, Then the horizontal centre of the About/Projects group equals the
  page's centre axis (within a small tolerance), matching the centred content
  below — not offset by the logo/icon width difference.
- **B2 — nothing dropped.** Given the nav, When it renders, Then the home
  (akds) link, both About/Projects links, and the theme toggle are all still
  present and reachable (the restructure preserves the markup).

## Increments (test-first)

1. **Verify the offset, then fix it (B1).** This is layout geometry — jsdom has
   no layout (every rect is 0×0), so per the repo's own convention
   (`lib/scroll-into-view-live` is browser-verified, not unit-tested) the check
   is a **real-browser measurement**, not a jsdom test.
   - harness (red): with the dev server up, measure in the browser the centre-x
     of the nav links group, the "Experience / Skills" toggle, and the viewport;
     confirm the links centre is offset from the page centre on the current
     `justify-between` layout.
   - impl (green): switch the nav container to `grid grid-cols-[1fr_auto_1fr]`
     and add `justify-self-*` to the three children; re-measure and confirm the
     links centre now matches the toggle/page centre.
2. **Guard the markup (B2) — not added, stated honestly.** The diff changes only
   the nav's layout container (flex+justify-between → grid + `justify-self`
   utilities); no element, order, or role is added/removed, so B2's markup is
   unchanged by construction. A jsdom test here would either assert Tailwind
   classes (brittle, and against the repo's testing conventions) or re-test
   static markup behind heavy provider mocks (usePalette / usePathname /
   next-themes) for no real coverage of this change. The behaviour that changed
   is geometry, which jsdom can't measure — verified in a real browser instead,
   consistent with how `lib/scroll-into-view-live` is handled.

## Out of scope / risks

- Not touching the scroll-hide behaviour, the wordmark crop, or the sub-500px
  icon fold — only the layout container.
- Risk: the centre column could overlap the side groups at a very narrow width
  if a side group grows unusually wide. Mitigated by the grid (side columns are
  `1fr`, they share slack) and checked at mobile width during verification.

## Notes

Browser verification (dev server, /about):
- Before: links-group centre 623.6 vs content/toggle centre 632.5 → −8.9px (and
  −16.4px vs raw viewport centre). Off-centre, as reported.
- After (grid): links centre 632.5 = nav centre = toggle centre → 0.0px offset.
- Narrow (500px, icons fold): no overflow, links still centred, gaps 63px
  (logo↔links) / 53px (links↔icons); below 500 the right group only shrinks.
