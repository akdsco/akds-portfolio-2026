# metadata swap ready

- Date: 2026-07-15 11:26
- Branch: metadata-swap-ready

## Problem / Context

The new portfolio is deployed to Vercel as a new project, tested on its
`*.vercel.app` domain, and will eventually take over the `arkadiusz.tech` custom
domain (moved off the current live portfolio). Before that swap, the site's
metadata must be correct for the production domain — otherwise OG cards, canonical
URLs, and crawl directives point at the wrong host the moment the domain flips.

Current state (`app/layout.tsx` + page-level metadata): titles, descriptions, and
basic OpenGraph title/description are present. Missing: `metadataBase`, OG
**image**, Twitter card, `robots`, `sitemap`, per-page `canonical`.

Separately: add **Vercel Speed Insights** (mirrors the existing `@vercel/analytics`
wiring in `app/layout.tsx`).

Facts:
- Production domain `https://arkadiusz.tech`, already in the Vercel account.
- Next.js 16.2.7 App Router; Metadata API + file conventions (`opengraph-image`,
  `twitter-image`, `robots.ts`, `sitemap.ts`) apply.
- Routes: `/` → redirect `/about`; `/about`; `/projects`; `/projects/[slug]`
  (case-study slugs via `generateStaticParams`).
- Theme tokens in `app/theme.css` (dark palette drives the OG card).
- No env vars; Analytics is `NODE_ENV`-gated — mirror that pattern.

## Plan

1. `metadataBase` + site-wide OG/Twitter defaults in `app/layout.tsx` (siteName,
   url, locale `en_GB`, `type: website`, `twitter.card: summary_large_image`).
2. Dynamic OG image `app/opengraph-image.tsx` (`next/og` ImageResponse, 1200×630,
   branded dark card from `theme.css`); `app/twitter-image.tsx` re-exports it.
3. `app/robots.ts` — allow all, declare sitemap URL.
4. `app/sitemap.ts` — `/about`, `/projects`, one entry per case-study slug.
5. Per-page `alternates.canonical` — `/about`, `/projects`, `/projects/${slug}`.
6. Speed Insights — add `@vercel/speed-insights`, render `<SpeedInsights />` in
   layout next to `<Analytics />`, same `NODE_ENV` gate.

Centralise the domain in `lib/site.ts` (one source of truth for metadataBase,
robots, sitemap).

## Increments (test-first)

Unit-testable surface = the pure route data (sitemap/robots). Next file
conventions are validated by `tsc` + `next build` (which renders the ImageResponse).
Honest note: the visual OG card and live Analytics/SpeedInsights beacons can't be
asserted in Vitest — build + manual check cover those.

1. test: `sitemap()` yields an absolute-URL entry for every case-study slug + the
   static routes (`/about`, `/projects`) → impl: `lib/site.ts` + `app/sitemap.ts`.
2. test: `robots()` allows `/` and points `sitemap` at the site URL → impl:
   `app/robots.ts`.
3. impl: extend `app/layout.tsx` metadata (metadataBase, OG defaults, twitter
   card). Verify by typecheck + build (static object, no unit test).
4. impl: `opengraph-image.tsx` (+ `twitter-image.tsx` re-export). Verified by
   `next build` rendering the route without error.
5. impl: add `alternates.canonical` to the three pages.
6. impl: install `@vercel/speed-insights`, render `<SpeedInsights />`. Build green.

Keep `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build` green at
every step. Commit per increment.

## Notes
