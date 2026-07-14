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
- **ESLint** (flat config) + **Prettier** with `prettier-plugin-tailwindcss`
- **npm**, no `src/` directory, `@/*` import alias
- **Node 24 LTS** (pinned via `.nvmrc` for Vercel parity)

## Commands

```bash
npm run dev        # next dev (Turbopack, default in v16)
npm run build      # next build
npm run start      # next start
npm run lint       # eslint (flat config)
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
- **AboutMore** (`about-more.test.tsx`) — reveal on `about:reveal` + scroll.
- **Data invariants** (`data/portfolio.test.ts`) — unique slugs, resolvable
  `testimonialId`, featured↔caseStudy intent.

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
lib/             # Utilities (cn helper)
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

## Notes for future work

- **No contact form, no mailto.** Recruiter contact path is GitHub + LinkedIn (icons in `SiteNav`). Do not add a contact API, nodemailer, or email form.
- **Routes:** the site lands on `/` → redirects to `/about` (the About/home). Pages: `/about`, `/projects`, `/projects/[slug]`. There is no `/resume` and no separate home. Nav shows About + Projects; logo → `/about`.
- **Bio copy is owner-supplied.** Never invent professional history, job titles, or project descriptions — ask for them. Case-study copy in `data/portfolio.ts` is rough by design; the owner chisels exact wording on the rendered site.
- **Data layer:** `data/portfolio.ts` — typed TS objects only (no MDX/CMS). One `Project` type drives both `/projects` cards and `/projects/[slug]` detail pages (a project with a `caseStudy` gets a detail page).
- **Theme:** the colour palette lives in `app/theme.css` (one swap-a-file, cool "tasteful dev-coded" scheme, light + dark), mapped into `app/globals.css` via `@theme inline`. Semantic tokens: `base/panel/ink/dim/faint/line/chip/brand/hi`.
- **No contact form, no mailto, no CV download.** GitHub + LinkedIn are the only surfaced links; the site is the expansion of the CV the owner sends directly.

## Pending TODO (track these; don't lose them)

- [x] **Favicon** — done. Owner-supplied `public/images/brand-image.webp` (500x500); derived `app/icon.png` (256px) + `app/apple-icon.png` (180px); removed the default `app/favicon.ico`. Next 16 auto-serves these. (Note: it's a portrait photo, so it reads soft at 16px; a mono "akds"/glyph icon is an easy swap later if wanted.)
- [ ] **Metadata** — per-page titles/descriptions + OpenGraph title/description are in place (`app/layout.tsx`; `generateMetadata` on projects + case study). Still TODO: `metadataBase` + OG image + Twitter card + `robots` + canonical once the production domain is set.
- [x] **Data layer** — delivered in `data/portfolio.ts` (typed; one `Project` type + skills/experience/education/certs/testimonials).
- [x] **Design direction** — locked: "tasteful dev-coded", cool scheme; palette in `app/theme.css`.
- [x] **Pages** — built: `/about` (landing), `/projects` index, `/projects/[slug]` detail, plus the command palette. No `/resume`.
- [x] **Real copy** — owner-supplied content is in `data/portfolio.ts` (case-study copy intentionally rough; owner chisels on the rendered site).

## History context

- `BOOTSTRAP_PROMPT.md` is the original setup spec, kept as historical record. Two of its locks (Next 15, Tailwind v3) were superseded because the ecosystem moved on between when the spec was written and when it was executed. Commits document the reasoning.
