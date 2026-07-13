# Implementation plan: build the site from the v1 design

Turns the v1 design artifact (`docs/design-artifacts/v1-design-akds-portfolio-2026.zip`,
file `akds-portfolio-v1-full-redesign.dc.html`) into the real Next.js 16 app,
consuming `data/portfolio.ts`. The artifact covers all three surfaces: 5a Landing
(About/home), 5b Projects index, 5c Case-study detail, plus the command palette.

## What the artifact gives us

It is a design-canvas export: static markup + tokens, with `{{ }}` data bindings,
`<sc-for>` (map), and `<sc-if>` (conditional). Command-palette behavior is mocked
in the canvas; the real logic is ours to write (spec is in the artifact's own note).

Mapping to React:
- `<sc-for list as>` -> `.map()`
- `<sc-if value>` -> conditional render
- `{{ styleP }}` (theme var block) -> CSS tokens in `globals.css`, not inline
- inline styles -> Tailwind v4 utilities backed by the token vars

## Design tokens (oklch) to port into globals.css

Two accent schemes, each with dark + light. Dark is primary. Decision needed:
which scheme, and whether the `//` kickers/diamonds use `--hi` or `--accent`.

**Cool scheme (default in the artifact):**
- Dark: `--bg` oklch(0.155 0.012 248), `--panel` 0.198, `--fg` 0.96, `--muted` 0.73,
  `--faint` 0.54, `--line` oklch(1 0 0 / 0.10), `--chip` oklch(1 0 0 / 0.05),
  `--accent` (cyan) oklch(0.80 0.12 178), `--hi` (coral) oklch(0.60 0.20 33),
  `--hiSoft` oklch(0.60 0.20 33 / 0.20)
- Light: `--bg` 0.98/240, `--panel` white, `--fg` 0.20, `--muted` 0.44, `--faint` 0.57,
  `--accent` cyan 195, `--hi` coral 31

**Warm scheme (alternative):** dark `--bg` 0.165/70 + `--accent` amber 78; light
`--bg` 0.985/85 + `--accent` amber 62.

Roles: `--accent` = the cyan `$` prompt and the tagline; `--hi` = kickers (`//`),
diamonds, `->` arrows, status pulses, the "AI-native" emphasis span, TOC numbers.

Fonts: Geist + Geist Mono (already the baseline) via `next/font`.
Keyframes to keep: `dcblink` (cursor), `dcpulse` (status dot). Scanline is a cheap
`repeating-linear-gradient` at ~3.5% opacity. Particle fx (`fx-*`) is decorative
canvas from the runtime; implement a light version or defer.

## Component architecture

Layout / shared:
- `app/layout.tsx` (exists): fonts, ThemeProvider, nav, footer
- `components/site-nav.tsx` (update): `akds` logo, About / Projects, GitHub / LinkedIn
  / theme toggle. `ModeToggle` already exists and follows the hydration rule.
- `components/site-footer.tsx` (new)
- `components/command-palette.tsx` (new, client): the shared palette; prop for the
  prompt label per surface (`cat ~/about.md`, `ls ~/projects`, `cat ~/projects/<slug>.md`)
- `components/kicker.tsx`: the `<diamond> // LABEL ----` section header (landing
  sections + case-study kickers)
- `components/stack-chips.tsx`: mono chip list

Landing (`app/page.tsx`):
- `components/landing/hero.tsx` (hosts the palette trigger), `skills.tsx`,
  `experience.tsx`, `testimonials.tsx` (client: 4-line clamp + expand toggle)

Projects index (`app/projects/page.tsx`):
- `components/projects/project-card.tsx`, `earlier-work.tsx` (client toggle)

Case-study detail (`app/projects/[slug]/page.tsx`):
- `generateStaticParams` over the 4 case-study slugs
- `components/case-study/meta-card.tsx` (sticky `meta.json` panel + status pulse),
  `toc.tsx` (client; "on this page", optional scrollspy)

## Data work (Phase B, prerequisite for /projects/[slug])

1. **Promote the rough drafts to typed `CaseStudy` objects.** Only Proof Library is
   fully fleshed; SlateIQ / AI research assistant / Routes Wallet are rough `.md` in
   `docs/case-studies/`. Add a `caseStudies: CaseStudy[]` export in `data/portfolio.ts`
   built from those drafts. Wire `testimonialId` (Proof Library -> Ben Ritchie, id 1).
2. **GrowthNation naming sweep** in `data/portfolio.ts`: `hero.paragraphs[0]`,
   `portfolio[0].company`, `experience[0].company` still say "stealth sales-AI startup".
3. **Card blurb reconciliation.** The index cards render a `hook`, but non-case-study
   `PortfolioCard`s (film-tracking, Connect4, Wutzu) have `focus`/`role`, not `hook`.
   Decide: add an optional `hook`/`blurb` to `PortfolioCard`, or map `focus` -> card
   blurb for those three.
4. Parked gaps (SlateIQ solo/shared split, AI research components) ship with current
   wording until the owner refines them.

## Assets needed from owner

- **Brand photo** (artifact points at `arkadiusz.tech/img/brand-image.jpg`). Put a
  real image in `public/img/` (preferred) or configure a remote loader.
- **CV PDF** -> `public/`; enables the `/resume` palette command + any download link.
- **Favicon / OG image** (already a CLAUDE.md TODO).

## Build order (increments; each a meaningful commit)

1. **Theming foundation.** `globals.css` oklch tokens (dark default + light override
   via the class strategy), `@theme inline` mapping to Tailwind tokens, fonts,
   keyframes, scanline utility. Verify: theme toggle flips with no hydration mismatch.
2. **Layout shell.** SiteNav to the design + footer. Verify nav, links, toggle.
3. **Shared primitives.** `Kicker`, `StackChips`.
4. **Landing (static, no palette yet).** Hero (static prompt), skills, experience,
   testimonials, wired to `data/portfolio.ts`. Verify visually against the artifact.
5. **Data Phase B.** Promote case studies, GrowthNation sweep, card-blurb fix. Typecheck.
6. **Projects index.** Cards + earlier-work toggle. Verify.
7. **Case-study detail.** `[slug]` page + `generateStaticParams`, sections, sticky
   meta card, TOC. Verify all four render.
8. **Command palette (own PR).** Dialog + combobox/listbox, keyboard (`/`, `Cmd/Ctrl+K`,
   arrows, Enter, Esc), fuzzy subsequence filter, actions (scroll / route / download /
   external / theme), `/whoami` easter egg, `aria-activedescendant`, focus return,
   `prefers-reduced-motion`. Progressive enhancement: page fully works without it.
9. **Polish.** Metadata (title/description, OG, Twitter, canonical, `metadataBase`),
   favicon, image optimization, optional particle fx, a11y + Lighthouse pass.

## Testing / verification

No test framework yet (CLAUDE.md defers tests until worth it). The one piece worth a
real test is the command palette's keyboard/filter logic: add Vitest + Testing Library
for that component. Everything else: typecheck + eslint + `next build` + manual verify
via the dev server and screenshots (the `run` / `verify` skills).

## Branch / PR strategy

Recommend landing the current `portfolio-data` branch (data + case studies + all
design docs + the artifact) as one reviewable PR and merging it, then implementing on
a fresh branch off updated `main` per the worktree workflow. The build is large;
splitting keeps PRs reviewable. The command palette ships as its own follow-up PR
(step 8), since it is a non-blocking enhancement.

## Known implementation notes

- Base UI has no prebuilt command menu; build the palette on Base UI Dialog + a custom
  listbox, or a small headless combobox.
- Theme-dependent actions (palette `/theme`, ModeToggle) read `resolvedTheme` at click
  time per the CLAUDE.md hydration rule; never branch rendered markup on it.
- The artifact is heavily inline-styled; translate to Tailwind v4 utilities over the
  token vars rather than copying inline styles.
