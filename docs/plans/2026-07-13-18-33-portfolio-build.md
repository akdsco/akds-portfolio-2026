# portfolio build

- Date: 2026-07-13 18:33
- Branch: portfolio-build

## Problem / Context

The content + design foundation is merged (data/portfolio.ts, case-study drafts,
v1 design artifact, CI). Now build the real Next.js 16 site from the artifact,
consuming data/portfolio.ts, across the three surfaces + command palette. Full
context in docs/implementation-plan.md. Owner chisels exact copy on the rendered
site afterwards, so build for correct structure/data, not final wording.

Locked decisions: cool accent scheme; site lands on `/` (= About/home, no separate
Home); routes `/projects` + `/projects/[slug]`; nav displays GitHub + LinkedIn only;
no contact form; tokens in one swap-a-file source; "tasteful dev-coded".

## Plan (build order; each step a meaningful commit, CI green throughout)

### Phase B — data (do first; unblocks pages)
1. Narrow `CaseStudy` to `Omit<PortfolioCard,'role'|'focus'> & {...}` (review finding #7)
   so hook/sections are the single source of truth.
2. Promote the 4 rough drafts (docs/case-studies/*.md) into typed `CaseStudy`
   objects: `export const caseStudies: CaseStudy[]`. Wire `testimonialId`
   (Proof Library -> Ben Ritchie, id 1).
3. GrowthNation naming sweep (findings #1/#6): hero.paragraphs[0], portfolio card
   company, experience[0].company.
4. Film-production-tracking (finding #2): move to the earlier-work toggle so all 4
   top cards link to a detail page and nothing 404s. (Pending owner confirm.)
5. Add a card `blurb`/`hook` for non-case-study cards so the index renders cleanly.

### Theming foundation
6. `app/tokens.css` — the single swap-a-file palette: named oklch vars for cool
   light (`:root`) + dark (`.dark`). Import into globals.css; map via `@theme inline`.
   Fonts (Geist + Geist Mono), keyframes (blink cursor, pulse), scanline utility.

### Shared + layout
7. SiteNav to the design (akds logo, About/Projects, GitHub+LinkedIn+theme). Footer.
8. Primitives: `Kicker` (diamond // LABEL), `StackChips`.

### Pages (static; no palette yet)
9. Landing `/` — hero (static prompt), featured projects, about/bio, skills,
   experience timeline, testimonials (clamp+expand).
10. Projects `/projects` — card grid + earlier-work toggle.
11. Case study `/projects/[slug]` — generateStaticParams over 4 slugs, sections,
    sticky meta.json card, on-this-page TOC, endorsement.

### Enhancement (separate follow-up PR)
12. Command palette — dialog/combobox, keyboard, fuzzy filter, real actions,
    /whoami, a11y, reduced-motion, progressive enhancement (docs/command-palette-brief.md).

### Housekeeping
13. Update CLAUDE.md TODOs (data layer delivered, design direction locked, pages built).
    Metadata + CV pdf deferred until owner supplies the CV.

## Increments (test-first)

No unit surface for most of this; verification per increment = CI suite green
(prettier/eslint/tsc/build) + visual check against the artifact via dev server.
The command palette (step 12) is the one piece worth a Vitest keyboard test.

## Notes / open decisions for green light
- Accent: cool (confirm).
- Film-tracking: fold into earlier-work toggle (confirm).
- Palette: core site first, palette as its own PR (confirm).
- One `portfolio-build` PR for steps 1-11 + 13; palette PR separate.
