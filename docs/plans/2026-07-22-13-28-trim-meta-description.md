# trim meta description

- Date: 2026-07-22 13:28
- Branch: trim-meta-description

## Problem / Context

Case-study pages set `description` / `og:description` to the full
`plainText(project.hook)` — up to ~190 chars (e.g. `/projects/slate-iq`). Google
truncates the SERP snippet at ~155–160 chars and social cards at ~125, so the
tail is cut mid-word. The hook is owner-chiselled copy shown on the page as the
lede, so it must NOT be rewritten — only the emitted meta string should be
trimmed, at a word boundary.

`/about` (126 chars) and `/projects` (short) are already within range and must
stay untouched.

## Plan

- `lib/truncate.ts` — `truncateForMeta(text, max = 155)`: returns `text`
  unchanged when `≤ max`; otherwise cuts to a word boundary before `max`, strips
  trailing punctuation, and appends a single `…`. Pure, `max`-inclusive
  (result length always `≤ max`).
- `app/projects/[slug]/page.tsx` — wrap the shared `description` in it:
  `const description = truncateForMeta(plainText(project.hook));`. Because both
  `description` and `openGraph.description` read that one variable, the prose
  test's "og and meta stay in step" invariant still holds, and the anti-link-leak
  assertion still holds (we truncate the already-plainText'd string).

## Increments (test-first)

1. test: `lib/truncate.test.ts` (red: module absent) → impl `lib/truncate.ts`
   (green):
   - short text (`≤ max`) returned unchanged.
   - long text → length `≤ max`, ends with `…`, cut at a word boundary (no
     partial word), no trailing punctuation before the `…`.
2. impl: apply in `generateMetadata`. Existing `page.prose.test.ts` stays green
   (link-leak + og/meta-in-step invariants unaffected).

## Notes

- `max = 155`: fits Google's ~155–160 SERP window; social still clips to ~125
  with its own ellipsis, but the front-loaded first sentence lands either way.
  `/about` at 126 is under the cap, so it's returned verbatim (no change).
- End-to-end: `next build`, re-measure the `/projects/slate-iq` `og:description`
  length (was 190 → expect ≤ 155 ending in `…`); `/about` unchanged at 126.
