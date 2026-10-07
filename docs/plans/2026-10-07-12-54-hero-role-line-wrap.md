# hero role line wrap

- Date: 2026-10-07 12:54
- Branch: hero-role-line-wrap

## Tickets

- Resolves:
- Refs:

## Problem / Context

The mono role line under the name — `AI Engineer · TypeScript · Python` — stacks
onto two lines at **520px and below** (`flex-col` → `min-[520px]:flex-row` in
`components/landing/hero.tsx`). The full string is only ~255px wide at 13px mono,
so at 375–520px there is tons of unused horizontal space and the stack looks
cramped/sad.

Owner wants:
1. Single line down to **375px** (the optimisation target). It should only wrap
   when it genuinely has to (sub-~300px, off-target but graceful).
2. When it does wrap, a `·` separator must **not** orphan — it must stay glued to
   the chunk before it and never jump down with (or lead) the following chunk.

Available content width at 375px = 375 − 2×24px (`px-6` on HeroBand) = 327px,
comfortably > ~255px, so one line fits.

## Plan

- `data/portfolio.ts`: split `about.tagline` into three uniform segments
  `["AI Engineer", "TypeScript", "Python"]` (was `["AI Engineer", "TypeScript ·
  Python"]`). `join(" · ")` is unchanged → the title-contract test stays green,
  and three uniform segments let the renderer glue every separator the same way.
- `components/landing/hero.tsx`: drop the `flex-col`/`min-[520px]:flex-row`
  stacking. Render one wrapping line of `whitespace-nowrap` segment-groups, each
  non-last group carrying its trailing ` ·` **inside** the nowrap span, joined by
  an ordinary breakable space. Breaks can then only happen between groups, the
  dot always sits on the preceding chunk's line, and the whole line stays on one
  row until it truly cannot fit.

## Increments (test-first)

1. test (`data/portfolio.test.ts`): `about.tagline` is the 3-segment split and
   still `join(" · ")`s to the canonical title. → impl: change the array in
   `data/portfolio.ts`.
2. test (`components/landing/hero.test.tsx`, new): the role line renders every
   segment; each non-last segment's nowrap group contains its `·` (glued) and the
   last carries no trailing separator; the container no longer uses the stacking
   classes. → impl: rewrite the role-line block in `hero.tsx`.

## Notes

- jsdom has no layout, so the actual wrap point / 375px behaviour is verified in a
  real browser (chrome-devtools resize), not asserted in a unit test. The unit
  test guards the DOM structure (glued separators, segment count) that makes the
  CSS wrap behaviour correct.
- Visual confirmation at 375px / 320px / 520px before PR.
