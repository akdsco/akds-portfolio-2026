# structured data

- Date: 2026-07-22 11:19
- Branch: structured-data

## Problem / Context

The site ships no structured data (JSON-LD), so Google's Rich Results Test finds
"no items detected" and search engines have no machine-readable description of
who the site is about. For a personal portfolio the high-value schema is
`Person` (entity/knowledge-graph understanding); `BreadcrumbList` is the one that
also produces a visible rich result in the SERP.

Owner-supplied facts only — everything is drawn from `data/portfolio.ts` /
`lib/site.ts`; nothing invented (per the repo's "never invent history" rule).

## Plan

Follow Next 16's JSON-LD guide (`node_modules/.../json-ld.md`): render native
`<script type="application/ld+json">` in layout/page, with `<` escaped to
`<` to prevent script breakout.

- `lib/structured-data.ts` — pure builders off the data layer:
  - `webSiteLd()` — `WebSite` (name = fullName, alternateName "akds", url).
  - `profilePageLd()` — `ProfilePage` wrapping a `Person` (name = fullName,
    jobTitle = lead segment of `profile.title`, url, absolute `image`, `sameAs`
    = every `profile.socials` URL, so the list can't drift from the source).
  - `breadcrumbLd(items)` — `BreadcrumbList`, positions 1..n, absolute `item`
    URLs.
  - `abs(path)` — site-relative → absolute against `SITE_URL` (Google requires
    absolute URLs in structured data).
- `components/json-ld.tsx` — server `<JsonLd data>` that stringifies + escapes.
- Mount:
  - `app/layout.tsx` — `webSiteLd()` (sitewide, once).
  - `app/about/page.tsx` — `profilePageLd()` (the profile lives here).
  - `app/projects/[slug]/page.tsx` — `breadcrumbLd([Projects, <project>])`
    → SERP renders `arkadiusz.tech › Projects › <project>`.

## Increments (test-first)

1. test: `lib/structured-data.test.ts` — builders' shapes + invariants (red:
   module doesn't exist) → impl: `lib/structured-data.ts` (green):
   - `webSiteLd`: `@type` WebSite, `url === SITE_URL`, name = fullName.
   - `profilePageLd`: ProfilePage → Person; name = fullName; url = SITE_URL;
     `image` absolute under SITE_URL; `sameAs` deep-equals `profile.socials`
     URLs (proves GitHub + LinkedIn present AND nothing invented); `jobTitle`
     = lead of `profile.title`.
   - `breadcrumbLd`: positions sequential from 1; every `item` absolute under
     SITE_URL; leaf is the last entry.
   - invariant: no relative URL anywhere in any builder's output.
2. test: `components/json-ld.test.tsx` (red) → impl: `components/json-ld.tsx`
   (green):
   - emits `<script type="application/ld+json">` whose text `JSON.parse`s back
     to the input.
   - a `<` in the data is escaped to `<` (no raw `</` from data) — XSS
     guard from the Next guide.
3. impl: mount the three blocks (layout / about / [slug]). No unit surface for
   "did the tag render in the page" — verified by the build + HTML grep below.

## Notes

- End-to-end verification (matches how the metadata tests are really checked):
  `next build`, then grep `.next/server/app/**/*.html` for `application/ld+json`
  on `/about` and a `/projects/<slug>` route, and JSON-parse the emitted blocks.
  Final proof is re-running Google's Rich Results Test on the deployed URL — the
  breadcrumb is the one that will flip it to "detected".
- `Person` is NOT a rich-result type, so the Rich Results Test may still show
  "no items detected" for `/about` even though the markup is correct and valid
  (confirm via the Schema Markup Validator instead). That's expected.
