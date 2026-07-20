# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠ Next.js 16 — likely newer than your training data

This project uses **Next.js 16** (released May 2026). APIs, conventions, and file structure may differ from what you were trained on. Before writing any non-trivial Next-specific code (caching, routing, params, middleware/proxy, fonts, metadata, data fetching, Server Actions), **read the relevant guide in `node_modules/next/dist/docs/`** and heed deprecation notices. Don't guess.

Key v16 changes likely outside training data:
- **Turbopack is the default** for `next dev` and `next build`
- **`params` and `searchParams` are `Promise`** — must be `await`ed in layouts, pages, route handlers, etc.
- **`middleware.ts` is renamed to `proxy.ts`** (Node runtime only; edge runtime requires keeping the old `middleware.ts`)
- **`fetch()` is no longer cached by default** — opt in with `'use cache'`
- **`next lint` removed** — this repo runs `eslint` directly via `npm run lint`
- **React Compiler** is stable but not enabled here

## Project goal

Personal portfolio for Arkadiusz ("akds"), optimized for software engineering recruiters and hiring managers scanning quickly. The landing page is a **showcase**, not a lead-gen funnel — no contact form, no mailto CTA. Social links (GitHub, LinkedIn) in the nav are the only contact path.

Design is intentionally deferred. The home page is a working placeholder using shadcn defaults, not a designed surface.

## Stack

- **Next.js 16** App Router (deviates from original spec's "15" — current stable; v16 breaking changes don't touch this project's surface)
- **TypeScript** in total strict mode: `strict` + `noUncheckedIndexedAccess` + `noImplicitOverride`
- **Tailwind CSS v4** (deviates from spec's "v3" — shadcn's mainstream path moved to v4)
- **shadcn/ui** v4 CLI, `base-nova` preset, **Base UI primitives** (`@base-ui/react`, not Radix — shadcn's current default)
- **next-themes** with `attribute="class"`, `defaultTheme="system"`
- **Lucide** for icons (brand glyphs inlined in `components/icons.tsx` — lucide v1.x dropped them)
- **@vercel/analytics**
- **ESLint** (flat config, **strict + type-aware**: `typescript-eslint`
  `strictTypeChecked` + `stylisticTypeChecked` over `eslint-config-next`;
  `--max-warnings=0`) + **Prettier** with `prettier-plugin-tailwindcss`
- **npm**, no `src/` directory, `@/*` import alias
- **Node 24 LTS** (pinned via `.nvmrc` for Vercel parity)

## Commands

```bash
npm run dev        # next dev (Turbopack, default in v16)
npm run build      # next build
npm run start      # next start
npm run lint       # eslint (flat config, strict type-aware, --max-warnings=0)
npm run typecheck  # tsc --noEmit
npm run test       # vitest run (Tier 1 unit/component tests)
npm run test:watch # vitest (watch mode)
```

## Testing

**Tier 1: Vitest + Testing Library** (jsdom). `npm run test` runs the suite; CI
runs it in the `verify` job between typecheck and build. Config lives in
`vitest.config.ts` (jsdom env, globals, `@/` alias mirroring `tsconfig.json`);
`vitest.setup.ts` loads `@testing-library/jest-dom` and stubs the browser APIs
jsdom lacks but components use — `matchMedia`, `IntersectionObserver`,
`ResizeObserver`, and `Element.scrollIntoView`.

What's covered (the regression-prone client logic, not presentation):

- **Command palette matching** (`command-palette.matching.test.ts`) — the pure
  `filterCommands` matcher, incl. the shipped `/ttop` → `/testimonials` bug.
- **Command palette keyboard/a11y** (`command-palette.keyboard.test.tsx`) —
  open/focus, arrow selection, Enter → router, Escape + focus restore.
- **Collapse** (`collapse.test.tsx`) — `inert` + grid-rows by `open`.
- **AboutMore** (`about-more.test.tsx`) — one-way reveal on click / `about:reveal`,
  and which section each entry point aims at. `lib/scroll-into-view-live` is
  mocked here: jsdom has no layout, so every rect is `0×0` and asserting where a
  scroll lands would only measure the mocks. That helper is verified against a
  real browser instead — it's geometry, not logic.
- **Data invariants** (`data/portfolio.test.ts`) — unique slugs, resolvable
  `testimonialId`, featured↔caseStudy intent.
- **Company sites** (`data/company-sites.test.ts`) — `companyHref` returns a URL
  or `null`, never a sentinel; every company used has an entry.
- **Inline links** (`lib/inline-links.test.ts`, `components/linked-text.test.tsx`)
  — `[text](url)` → anchor with `target`/`rel`; refuses `javascript:`, `http:`,
  `data:` and relative hrefs; `plainText` degrades markup to its label.
- **Experience** (`components/landing/experience.test.tsx`) — company linked vs
  plain by `companyHref`; highlights render; `role="list"` survives.
- **Case-study prose** (`app/projects/[slug]/page.prose.test.ts`) — no inline
  link markup ever reaches `<meta>`/`og:description`.

Tests colocate with source as `*.test.ts(x)`. `next build` ignores them (they're
not routes) but `tsc` still typechecks them. Tier 2 (a Playwright smoke e2e) is a
deferred follow-up, not built here.

> **Turbopack stale-CSS quirk:** if CSS changes don't appear in `next dev`, clear
> the cache (`rm -rf .next`) and restart — the production build is unaffected.

## Folder structure

```
app/             # App Router routes & layout
components/      # Shared components (SiteNav, ThemeProvider, ModeToggle, icons)
components/ui/   # shadcn primitives (button, card, …)
lib/             # Utilities (cn helper, scroll-into-view-live)
data/            # portfolio.ts — typed content (Project, skills, experience, testimonials…)
```

File naming: kebab-case for files, PascalCase for component exports. Imports use `@/`.

## Theming

- next-themes wraps the app in `app/layout.tsx` with `attribute="class"` and `defaultTheme="system"`.
- `<html suppressHydrationWarning>` is required to avoid the class-toggling hydration warning. `<body suppressHydrationWarning>` is also set to absorb attributes injected by browser extensions (ColorZilla, Grammarly, etc.) — extension DOM mutation is out of our control.
- Dark variant is handled by Tailwind v4's `@custom-variant dark (&:is(.dark *))` in `app/globals.css` — this matches the class strategy.
- Theme tokens (background, foreground, primary, etc.) live in `app/globals.css` as CSS variables (`oklch` values), exposed to Tailwind via `@theme inline`.

### Hydration rule for theme-dependent components

**Never let rendered output depend on `resolvedTheme` (or `theme`).** At SSR `resolvedTheme` is `undefined` — it lives in `localStorage` + `matchMedia`, both browser-only — so any markup keyed off it (`aria-label`, conditional classes, conditional children) will mismatch on hydration. `suppressHydrationWarning` only hides the warning; the actual DOM still differs for a frame.

Two patterns that work, in order of preference:

1. **Render-stable markup, CSS-driven theme branching.** Make the output identical for both themes; let Tailwind's `dark:` variant flip what's visible. next-themes sets the `class` on `<html>` via an inline script that runs before React hydrates, so the correct branch is already painted on first frame. `ModeToggle` uses this — generic `aria-label="Toggle theme"`, Sun/Moon swap via `dark:scale-0` / `dark:scale-100`, and the click handler reads `resolvedTheme` at invocation time (post-hydration).
2. **Mount gate** — only when the markup *must* differ. Render a stable placeholder until a `useSyncExternalStore` "am I on the client?" hook flips. Don't use the `useState`+`useEffect` mount pattern: React 19's `react-hooks/set-state-in-effect` rule flags it.

## Links

- **All outbound links go through `ExternalLink`** (`components/external-link.tsx`).
  It carries no styling. Its one job is that `target="_blank"` never ships
  without `rel="noopener noreferrer"`. Pass `proseLinkClass` for links sitting in
  a run of prose; icon links style themselves.
- **Company names render via `CompanyLink`**, which links or plain-texts based on
  `companyHref`. `companySites` in `data/portfolio.ts` maps every `CompanyName`
  to a URL *or* an explicit sentinel (`url-no-longer-active`, `no-public-url`).
  It's a `Record`, so adding a company without deciding won't compile.
- **Prose fields support inline `[text](url)`**: `summary`, `highlights`, the
  case-study `hook` and body paragraphs, and the About bio `about.paragraphs`
  (rendered through `LinkedText` in `components/landing/hero.tsx`). Only
  `https://` linkifies; anything else stays literal text, which is what keeps
  `javascript:` inert. Titles, company names and chip labels are not prose, so
  don't parse them.
- **Where a link can't render, use `plainText()`**: inside another anchor
  (`ProjectCard` wraps its body in a `<Link>`) and in `<meta>` content
  (`generateMetadata`). Both would otherwise leak raw `[x](https://…)`.

## Metadata

The production origin lives in `lib/site.ts` (`SITE_URL`) — a domain move is a
one-line edit there. Canonical URLs are set **per page, never on the layout**: a
layout canonical cascades to every route, and `/` redirects to `/about`.

**Social cards** are rendered by `lib/og-card.tsx` and mounted by the file
convention at three segments — `app/` (role caption), `app/projects/` ("Projects")
and `app/projects/[slug]/` (the project name). Each `twitter-image.tsx` re-exports
its sibling `opengraph-image.tsx`. `/about` and `/` inherit the root card.

Three rules in Next's metadata resolution are counter-intuitive, invisible in the
source, and have each shipped as a bug here:

1. **A page-level `openGraph` replaces the layout's — it does not merge into it.**
   Anything it omits (`siteName`, `locale`) is simply absent from the page.
2. **`twitter` and `openGraph` titles auto-fill from the page's `title` only while
   unset.** Pinning either on the layout silently gives every child page the
   generic site title instead of its own — that's twice now, once per block.
3. **The inverse of 1 for images:** the file-convention image is only injected at
   the segment owning `opengraph-image.tsx`, *and only while no level declares
   `images` itself*. Since `[slug]` now owns a card, declaring `images` there
   would silently swap every case study's card for the generic one — with the
   tags still looking correct.

Unit tests guard these (`app/layout.metadata.test.ts`,
`app/projects/[slug]/page.metadata.test.ts` — note they assert an *absence*, so
don't "tidy them up"). The real check is a build plus a grep of the emitted HTML
in `.next/server/app/`: Next's own resolution is where every one of these bugs
lived, and the metadata objects can look correct while the rendered tags aren't.

## Wordmark

The cropped "akds" mark appears in the nav, the footer and the social cards.

- **The crop is a ratio of font size**, never a pixel offset — `WORDMARK_VISIBLE`
  in `lib/wordmark.ts` is the only place it's set. The three surfaces render at
  38px / ~208px / 460px; hand-tuned offsets drifted them to 76% / 56% / 74%.
- **Use `components/wordmark.tsx`**, don't hand-roll the clip. `line-height: 1`
  has to sit on the *clip container*, not just the text: without it the container
  inherits Tailwind's 1.5 strut, whose half-leading shifts the glyphs down inside
  the box, and two call sites with an identical ratio cut at visibly different
  depths.
- **Satori reads ttf/otf/woff, not woff2** — which is all `next/font/google`
  emits. That's why `lib/fonts/*.ttf` is committed and loaded explicitly, and why
  a `fontFamily` Satori hasn't been given is silently ignored rather than erroring.
- Colour splits by job: the footer mark is decorative (`ink/10`), the nav mark is
  a link and the card mark is the brand, so both sit at `faint`.

## Notes for future work

- **No contact form, no mailto.** Recruiter contact path is GitHub + LinkedIn (icons in `SiteNav`). Do not add a contact API, nodemailer, or email form.
- **Routes:** the site lands on `/` → redirects to `/about` (the About/home). Pages: `/about`, `/projects`, `/projects/[slug]`. There is no `/resume` and no separate home. Nav shows About + Projects; logo → `/about`.
- **Bio copy is owner-supplied.** Never invent professional history, job titles, or project descriptions — ask for them. Case-study copy in `data/portfolio.ts` is rough by design; the owner chisels exact wording on the rendered site.
- **Data layer:** `data/portfolio.ts` — typed TS objects only (no MDX/CMS). One `Project` type drives both `/projects` cards and `/projects/[slug]` detail pages (a project with a `caseStudy` gets a detail page).
- **Theme:** the colour palette lives in `app/theme.css` (one swap-a-file, cool "tasteful dev-coded" scheme, light + dark), mapped into `app/globals.css` via `@theme inline`. Semantic tokens: `base/panel/ink/dim/faint/line/chip/brand/hi`.
- **No contact form, no mailto, no CV download.** GitHub + LinkedIn are the only surfaced links; the site is the expansion of the CV the owner sends directly.
- **Icons:** `app/icon.png` (256px) + `app/apple-icon.png` (180px) are derived from the owner-supplied `public/images/brand-image.webp`; Next 16 auto-serves them by file convention (there is no `app/favicon.ico` — don't re-add one).

Work that's pending rather than settled belongs in `docs/TODO.md`, not here — this
file is loaded into every session, so it's for rules that stay true, not state
that goes stale.

## History context

- `BOOTSTRAP_PROMPT.md` is the original setup spec, kept as historical record. Two of its locks (Next 15, Tailwind v3) were superseded because the ecosystem moved on between when the spec was written and when it was executed. Commits document the reasoning.
