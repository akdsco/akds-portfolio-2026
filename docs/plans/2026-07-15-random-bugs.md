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

**Fix:** extracted a reusable `components/pulse-dot.tsx` (just the dot: colour +
pulse + glow, `aria-hidden`). Alignment is the caller's job — both rows use a
plain `flex items-center`, which centres the dot **dead-centre on the whole text
block**: on the line for a single-line label, and at the midpoint of the block
for a wrapped two-line label. No magic top-margin.

Owner's spec: dead-centre for both one *and* two lines. An earlier attempt wrapped
the dot in a `h-[1lh]` box + `items-start` to pin it to line 1 — rejected, because
that is the opposite of centring on a two-line block.

Also shortened the availability copy to
"Open to remote or hybrid, senior engineering roles" (owner-supplied).

**Verified** via headless-Chrome screenshots + pixel measurement of dot-centre vs
text-block-centre:
- single line (1000px viewport): offset −0.5px (dead centre)
- wrapped two lines (340px viewport): offset +1.0px (dead centre of block)
typecheck + eslint clean.
