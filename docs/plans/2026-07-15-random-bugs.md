# Random bugs / polish — grab-bag worktree

Catch-all branch for small visual/polish fixes. One commit per fix.

## Fixes

### 1. Pulsing status-dot vertical alignment

**Problem:** the "live" pulsing dot rendered slightly low against its adjacent
text. The hero (`components/landing/hero.tsx`) hard-coded `mt-1.5` (6px) on the
dot to fake-align it to a `text-xs` line — but the correct offset is ~4.5px, so
it sat ~1.5px low. The same dot markup was duplicated in
`components/case-study/meta-card.tsx` (there using `items-center`, fine only
while the status stays single-line).

**Fix:** extracted a reusable `components/pulse-dot.tsx`. It wraps the dot in a
`h-[1lh]` (one line-height tall) flex box that centres the dot, so a parent row
set to `items-start` lands the dot on the optical centre of the *first* text
line — no magic margin, adapts to any font size, and stays correct if the text
wraps. Both call sites now use `<PulseDot />` with `items-start` rows.

**Verified:** typecheck + eslint clean; dev server confirms the `h-[1lh]` rule
compiles (`.h-\[1lh\]{height:1lh}`) and the wrapper renders on `/about`.
`lh` unit is Baseline-2024, fine for a modern portfolio.
