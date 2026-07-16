# og metadata fix

- Date: 2026-07-16 10:07
- Branch: og-metadata-fix

## Problem / Context

PR #5 shipped the swap-ready metadata (`metadataBase`, OG image, Twitter card,
robots, canonical) and was merged, but a code review of that branch surfaced
three defects that were never fixed before the merge. They are live on `main`:

1. **Case-study pages render no `og:image`.** Verified in the prerendered HTML:
   `.next/server/app/projects/slate-iq.html` has `og:title` / `og:description` /
   `og:url` / `og:type` but zero `og:image`, and no `og:site_name` / `og:locale`
   either. `/about`, `/projects` and `/` all have them. So the most shareable
   pages on the site — the case studies, the whole point of the portfolio — post
   to LinkedIn/Slack as a bare text link.

2. **`twitter:title` on case-study pages is the generic site title**, not the
   project's.

3. **The title/description strings are duplicated** verbatim in the layout's
   `twitter` block.

`node_modules/next/dist/docs/` is not shipped in this install, so the mechanism
was read from Next's source (`node_modules/next/dist/lib/metadata/`):

- `resolve-metadata.js:149` — the file-convention image from
  `app/opengraph-image.tsx` is only injected at the segment that owns the file,
  and only when that level's `openGraph` has no own `images` key. A page that
  declares its own `openGraph` (`mergeMetadata`, line 182-184) **replaces the
  resolved object wholesale**. `app/projects/[slug]/` has no image file of its
  own, so nothing re-adds `images` → `og:image` vanishes. That is defect 1.
- `resolve-metadata.js:624-630` — `postProcessMetadata` auto-fills
  `twitter.title`/`description` from the resolved `openGraph`, but **only when
  twitter has no title of its own**. The layout pins one, which disables the
  auto-fill for every descendant. That is defect 2 — and defect 3 is its cause,
  so removing the duplication fixes both.

## Plan

1. Add `SOCIAL_IMAGE` (url + dimensions + alt) to `lib/site.ts`, next to
   `SITE_URL`, as the single source of truth for the social card descriptor.
   Have `app/opengraph-image.tsx` derive its `size`/`alt` from it so the route
   and the metadata cannot drift.
2. In `app/projects/[slug]/page.tsx`, make the page's `openGraph` self-contained:
   explicit `images`, `siteName`, `locale`. It replaces rather than merges, so
   anything it omits is lost.
3. In `app/layout.tsx`, reduce `twitter` to just `card` and let Next auto-fill
   title/description/images from `openGraph`. Kills the duplication and restores
   per-page Twitter titles in one move.
4. Verify against a real build, not just unit tests: re-grep the prerendered
   HTML for `og:image` + a project-specific `twitter:title`.

## Increments (test-first)

1. test: case-study `generateMetadata` returns `openGraph.images` pointing at the
   social card, plus `siteName` + `locale` (red) → impl: `SOCIAL_IMAGE` in
   `lib/site.ts`, wired into `app/opengraph-image.tsx` and the page's `openGraph`
   (green).
2. test: root layout's `twitter` block pins no `title`/`description`, so Next's
   auto-fill stays enabled for descendants (red) → impl: strip both from
   `app/layout.tsx` (green).
3. verify: fresh `next build`, then grep `.next/server/app/projects/slate-iq.html`
   for `og:image` and a project-specific `twitter:title`. This is the honest test
   — the unit tests assert the metadata objects we return, but only the build
   exercises Next's own resolution, which is where all three defects lived.

## Notes

- The layout-twitter test is deliberately white-box: it asserts an absence, which
  reads oddly without the reason. The reason is the auto-fill rule above, so the
  test carries a comment pointing at it. Without the test, the obvious "tidy up"
  of re-adding a title silently re-breaks every child page's Twitter card.
- Full gate before pushing: `typecheck`, `lint`, `test`, **`format:check`**, and
  `build`. `format:check` is a separate CI gate and broke CI on PR #5 — do not
  skip it again.

## What changed after the plan

The branch sat unmerged while `company-links` shipped, then grew well past its
original scope. Rebased onto that work; `page.tsx` conflicted only on imports, and
the two fixes compose — `description` now comes from `plainText(hook)` (so link
markup can't leak into `og:description`) *and* carries `siteName`/`locale`.

- **A third instance of the same root cause.** The layout pinned `openGraph.title`
  exactly as it had pinned `twitter.title`, so `/projects` shared a byte-identical
  card *and title* with `/about` despite declaring its own. Found by reading the
  rendered tags per page rather than the source.
- **The card was redesigned** to a cropped "akds" wordmark, on the owner's call:
  these are read a couple of hundred pixels wide in a chat thread, where the old
  `$ whoami` layout was unreadable. That forced the Satori font work — the old
  card's `fontFamily: "monospace"` had never rendered, because Satori can't read
  the woff2 `next/font/google` emits and ignores fonts it wasn't handed.
- **Per-segment cards replaced the `images: [SOCIAL_IMAGE]` workaround.** With
  `[slug]` owning an `opengraph-image.tsx`, the file convention injects the card
  itself — so the explicit `images` key went, and `SOCIAL_IMAGE` with it. It's now
  a trap in reverse: declaring `images` there would suppress the per-project card.
- **The mark spread to the nav and footer**, which is where the crop had to become
  a shared ratio rather than three hand-tuned offsets. The subtle part wasn't the
  ratio — it was `line-height` on the clip container; see `components/wordmark.tsx`.
- **Review caught two of my own claims.** `outputFileTracingIncludes` was dead
  config whose comment asserted the cards would 500 without it: rebuilt without it
  and all six routes still traced both fonts, because @vercel/nft resolves the
  `join()` and the cards prerender anyway. And an unknown slug returned 200 for its
  card while the page 404'd.
