# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Also read `@AGENTS.md` — Next.js 16 has breaking changes from your training data; consult `node_modules/next/dist/docs/` before writing non-trivial Next-specific code.

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
- `<html suppressHydrationWarning>` is required to avoid the class-toggling hydration warning.
- Dark variant is handled by Tailwind v4's `@custom-variant dark (&:is(.dark *))` in `app/globals.css` — this matches the class strategy.
- Theme tokens (background, foreground, primary, etc.) live in `app/globals.css` as CSS variables (`oklch` values), exposed to Tailwind via `@theme inline`.
- `ModeToggle` toggles between explicit `"light"` / `"dark"` and reads `resolvedTheme` so the initial `"system"` state renders correctly.

## Notes for future work

- **No contact form, no mailto.** Recruiter contact path is GitHub + LinkedIn (icons in `SiteNav`). Do not add a contact API, nodemailer, or email form.
- **About / Resume / Projects routes 404 by design** until pages are built. Skeleton nav links are intentional placeholders.
- **Bio copy is owner-supplied.** Never invent professional history, job titles, or project descriptions — ask for them.
- **Data layer (`data/`) is deferred.** When added, it will be typed TS objects only — no MDX, no Contentlayer, no CMS.

## History context

- `BOOTSTRAP_PROMPT.md` is the original setup spec, kept as historical record. Two of its locks (Next 15, Tailwind v3) were superseded because the ecosystem moved on between when the spec was written and when it was executed. Commits document the reasoning.
