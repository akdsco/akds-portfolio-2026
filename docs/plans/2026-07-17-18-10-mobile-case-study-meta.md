# mobile case study meta

- Date: 2026-07-17 18:10
- Branch: mobile-case-study-meta

## Problem / Context

On a case study (`/projects/[slug]`) the right rail — the `meta.json` card
(`components/case-study/meta-card.tsx`) plus the `ON THIS PAGE` scroll-spy TOC
(`components/case-study/toc.tsx`) — lives in a single `<aside>` placed *after* the
main content in the grid (`app/projects/[slug]/page.tsx`). At `lg` it's a sticky
sidebar; below `lg` the grid collapses to one column and the aside drops to the
**bottom** of the page.

That's wrong on mobile:

- **Meta at the bottom**: a recruiter reads the whole study before seeing
  company / role / period / stack — context that should frame the read, up top.
- **TOC at the bottom**: it's a scroll-spy whose only job is tracking position in
  a sticky column. Non-sticky, below the content you've already scrolled past, it
  does nothing.

Owner decisions (asked): on mobile, **relocate the actual `meta.json` card to the
top** (keep its look, don't reshape into a byline), and add a **collapsed "jump
to section" disclosure** (not a removal, not an always-open list).

## Plan

Purpose-built per breakpoint, no shared responsive contortion of one element:

1. Desktop rail stays exactly as today, but only renders at `lg`: the existing
   `<aside>` becomes `hidden lg:flex …` (all its sticky/nav-follow behaviour
   unchanged).
2. A **mobile-only block** (`lg:hidden`) becomes the *first* grid child, so on
   mobile it sits above the reading column (below the hero). It holds:
   - `<MetaCard>` — the same component, reused verbatim.
   - a new `<MobileToc>` — a collapsed "jump to section" disclosure, only when
     `sections.length > 1` (mirrors the desktop TOC guard).
   Being `lg:hidden` it's removed from grid flow at `lg`, so the desktop grid is
   unchanged: main → col1, aside → col2.

`MobileToc` (new client component, `components/case-study/mobile-toc.tsx`):
- A bordered panel matching the card aesthetic (`border-line bg-panel rounded`).
- A full-width trigger `button`: mono uppercase "jump to section" label + a
  chevron that rotates on open. `aria-expanded` + `aria-controls` → the panel id.
- Reuses `Collapse` (`components/collapse.tsx`) for the animated open/close and
  its `inert`-when-closed a11y.
- Inside: the numbered section list (`01 Problem` …) as plain `#hash` jump links,
  matching the desktop TOC's row styling. No scroll-spy (pointless in a
  tuck-away). Tapping a link **closes** the disclosure.

Order within the mobile block: MetaCard then MobileToc (mirrors desktop: meta
above TOC).

## Increments (test-first)

1. **MobileToc component.**
   - test (`components/case-study/mobile-toc.test.tsx`): closed by default —
     panel `inert`, trigger `aria-expanded="false"`; click trigger → opens
     (`aria-expanded="true"`, panel not inert); renders one link per section with
     `href="#<key>"`, correct `01/02…` numbering and titles, in order; clicking a
     link sets it back to closed.
   - impl: write `MobileToc` using `Collapse` + a toggle button.

2. **Wire into the page.**
   - Change: `<aside>` → `hidden lg:flex lg:flex-col …` (keep every existing
     class); insert the `lg:hidden` mobile block as the first grid child with
     `MetaCard` + guarded `MobileToc`.
   - Verify: `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`
     all green; then drive the real page at a mobile viewport (chrome-devtools)
     and confirm meta sits at the top, jump-list toggles, desktop rail unchanged.

## Notes

- jsdom has no layout, so the `lg:hidden`/`hidden lg:flex` responsive split isn't
  unit-testable (same reason `about-more`/presentation isn't) — it's verified in a
  real browser at the end. Tests cover `MobileToc`'s open/close + link logic only.
- MetaCard rendered twice (mobile block + desktop aside) is fine: it holds no
  `id`s and is pure presentation over the same `project` data — one source of
  truth, two placements, only one visible per breakpoint.
