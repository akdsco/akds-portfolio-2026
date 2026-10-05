# cloudflare deploy

- Date: 2026-10-05 13:21
- Branch: cloudflare-deploy

## Tickets

- Resolves:
- Refs:

## Problem / Context

Move the portfolio onto a new domain **akds.dev** (bought via Cloudflare
Registrar, DNS already in Cloudflare) and deploy it on **Cloudflare**.

**Updated constraint (supersedes "keep Vercel untouched"):** arkadiusz.tech
**expires in ~2 days**, and the owner is retiring the Vercel deploy. Vercel's Git
auto-deploy will be **disconnected** (owner: Vercel → Settings → Git →
Disconnect), which freezes the current arkadiusz.tech deployment live until the
domain dies, then the project is deleted. So `main` no longer needs to keep
Vercel building — **the env-gate is dropped**; `output: 'export'` goes in
outright.

Repo audit for the move: **no env vars / secrets** used by the app (only
`NODE_ENV`), no `vercel.json`, no `.vercel` link — it was the default zero-config
Vercel Git integration. The only Vercel coupling in the repo is
`@vercel/analytics` + `@vercel/speed-insights` in `app/layout.tsx`, which report
only on Vercel (dead weight on Cloudflare). Owner chose to **remove them and wire
Cloudflare Web Analytics** instead.

Decisions already made with the owner:

- **Static export**, not SSR. The app is 100% statically renderable: every
  dynamic route (`/projects/[slug]` + its OG image) has `generateStaticParams`,
  there are no API routes / Server Actions / ISR / cookies, and the Satori OG
  images render at build time. Confirmed against the Next 16 static-export docs.
- **Git-connected auto-deploy** on Cloudflare (push to `main` → build → deploy),
  mirroring the current Vercel flow.
- Hosting product: **Cloudflare Pages** (static). The deprecated thing was
  `@cloudflare/next-on-pages` (the SSR-on-Pages adapter, Next 13–14 only) — pure
  static hosting on Pages is fully supported and is the right fit here.

Next-16 static-export facts that drive the plan (from the official guide):
- Config-level `redirects`, `headers`, `rewrites`, `proxy` are UNSUPPORTED in
  export. The `/`→`/about` edge redirect therefore lives in a Cloudflare
  `_redirects` file, not next.config.
- `next/image` default loader is UNSUPPORTED → needs `images.unoptimized: true`.
  Only `components/landing/hero.tsx` uses `next/image`.
- Metadata-file routes (`sitemap.ts`, `robots.ts`) and `opengraph-image.tsx`
  with `generateStaticParams` ARE supported — they emit static files at build.
- Whether `redirect()` inside `app/page.tsx` survives export is UNKNOWN from
  docs — the unsupported list names config `redirects`, not the `redirect()`
  function. **Increment 1 settles this empirically before any code changes.**

## Plan

1. Observe reality: run an export build with `output: 'export'`, see exactly what
   breaks (esp. `app/page.tsx` `redirect()`), so the home-redirect handling is
   evidence-based.
2. Set `output: 'export'` + `images.unoptimized` in `next.config.ts` (no gate).
3. Point the site's canonical origin at akds.dev (`SITE_URL`).
4. Handle `/`→`/about` for the static deploy via Cloudflare `_redirects` (+ make
   `app/page.tsx` export-safe if increment 1 shows `redirect()` breaks export).
5. Remove `@vercel/analytics` + `@vercel/speed-insights`; add a Cloudflare Web
   Analytics beacon gated on `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (renders nothing
   until the token is set in Cloudflare's build env).
6. Add a reproducible `build:static` script + document the Cloudflare build
   config (build command, output dir, Node version, analytics token var).
7. Verify: typecheck + lint + unit tests green; a real export build emits the
   right HTML/metadata/OG (grep the emitted files, per the house metadata rule);
   `_redirects` present in `out/`.
8. Hand off: PR + the step-by-step Vercel-disconnect + Cloudflare dashboard + DNS
   walkthrough for the owner. Owner merges.

## Increments (test-first)

1. **Baseline export build (observe).** Set `output: 'export'`, run `next build`,
   capture whether `redirect()` in `app/page.tsx` fails the export and what else
   surfaces. Record the real error/behaviour in Notes. (Rolled into increment 2's
   commit.)

2. **Static export config.**
   impl: `next.config.ts` → `output: 'export'`, `images: { unoptimized: true }`.
   Config has no meaningful unit surface; it's verified by the real export build
   in increment 7. Commit with increment 1's findings.

3. **Canonical origin → akds.dev.**
   test: `SITE_URL === 'https://akds.dev'` and sitemap/robots derive from it
   (adjust existing `sitemap.test.ts` / `robots.test.ts` if they pin the old
   host). → impl: one-line edit in `lib/site.ts`.

4. **Home redirect for the static deploy.** Driven by increment 1's finding:
   - Always: add `public/_redirects` with `/  /about  301` (copied verbatim into
     `out/` on export; serves the edge 301 on Cloudflare before any HTML).
     test: a check asserting `public/_redirects` contains the `/ → /about` rule.
   - If increment 1 shows `redirect()` breaks export: make `app/page.tsx`
     export-safe (Vercel is being retired, so SSR parity no longer constrains
     this) and record the chosen approach + why.

5. **Swap analytics to Cloudflare.**
   test (`components/cloudflare-analytics.test.tsx`): renders nothing when
   `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` is unset; renders the CF beacon `<script>`
   with `data-cf-beacon` carrying the token when set. →
   impl: new `components/cloudflare-analytics.tsx`; replace the two `@vercel/*`
   imports/usages in `app/layout.tsx`; drop both deps from `package.json`.

6. **Build ergonomics.**
   `package.json`: add `build:static` (`next build`, explicit) so the Cloudflare
   build command is reproducible locally. (Plain `next build` now exports, but a
   named script documents intent.)

7. **Full verification (no unit surface — a real build + greps).**
   `npm run typecheck && npm run lint && npm run test`, then `npm run build:static`
   and assert: `out/` exists, `out/_redirects` present, `out/about.html` /
   `out/projects.html` / `out/projects/<slug>.html` emitted, OG image files
   emitted, and the emitted `<link rel="canonical">` / `og:` tags point at
   akds.dev (grep `out/`, per the house metadata-verification rule).

## Notes

- Vercel reads `vercel.json`/next redirects, NOT `_redirects` — so `_redirects`
  is inert on Vercel, which is fine: Vercel keeps its SSR `redirect()`.
- Changing `SITE_URL` to akds.dev also changes the canonical/OG tags the Vercel
  build emits on arkadiusz.tech. That is deliberate and correct: it consolidates
  SEO onto the new domain (old domain declares the new one canonical). Flagged to
  owner.
- Owner does the Cloudflare dashboard clicks + DNS (akds.dev already in
  Cloudflare, so attaching it is one step). Documented at hand-off; never merged
  by the assistant.
