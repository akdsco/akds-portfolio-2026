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
npm run dev      # next dev (Turbopack, default in v16)
npm run build    # next build
npm run start    # next start
npm run lint     # eslint (flat config)
```

No test command — tests are deferred until there's something worth testing.

## Folder structure

```
app/             # App Router routes & layout
components/      # Shared components (SiteNav, ThemeProvider, ModeToggle, icons)
components/ui/   # shadcn primitives (button, card, …)
lib/             # Utilities (cn helper)
data/            # NOT YET — typed TS objects (no MDX/CMS) added in a later phase
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
- **About / Resume / Projects routes 404 by design** until pages are built. Skeleton nav links are intentional placeholders.
- **Bio copy is owner-supplied.** Never invent professional history, job titles, or project descriptions — ask for them.
- **Data layer (`data/`) is deferred.** When added, it will be typed TS objects only — no MDX, no Contentlayer, no CMS.

## Pending TODO (track these; don't lose them)

- [x] **Favicon** — done. Owner-supplied `public/images/brand-image.webp` (500x500); derived `app/icon.png` (256px) + `app/apple-icon.png` (180px); removed the default `app/favicon.ico`. Next 16 auto-serves these. (Note: it's a portrait photo, so it reads soft at 16px; a mono "akds"/glyph icon is an easy swap later if wanted.)
- [ ] **Metadata** — only generic `title` + `description` in `app/layout.tsx`. Pending owner's resume/data work. When done: set `metadataBase`, OG title/description, OG image, Twitter card, `robots`, canonical. Per-page metadata via `generateMetadata` where dynamic.
- [ ] **Data layer (`data/`)** — owner is producing typed content for resume, projects, about. Once delivered, scaffold `data/` with one typed module per surface (e.g. `data/projects.ts`, `data/work.ts`, `data/profile.ts`). Strict types, no `any`.
- [ ] **Design direction** — owner is collecting references / mood. Visual direction (type scale, color beyond shadcn defaults, rhythm, hero treatment) blocks page design. Tokens land in `app/globals.css` via `@theme inline` (oklch).
- [ ] **Pages** — `/about`, `/resume`, `/projects`. Build after data layer + design direction land. Each page consumes a typed module from `data/`.
- [ ] **Real copy** — owner-supplied (see "Bio copy" rule above). Do not stub plausible-sounding placeholder text in committed code; use obvious lorem (`Lorem ipsum…`) so it can't accidentally ship.

## History context

- `BOOTSTRAP_PROMPT.md` is the original setup spec, kept as historical record. Two of its locks (Next 15, Tailwind v3) were superseded because the ecosystem moved on between when the spec was written and when it was executed. Commits document the reasoning.
