# portfolio build

- Date: 2026-07-13 18:33
- Branch: portfolio-build

## Problem / Context

Foundation is merged (data/portfolio.ts, case-study drafts, v1 design artifact, CI).
Build the real Next.js 16 site from the artifact, consuming data/portfolio.ts, across
the three surfaces + command palette, in ONE PR. Owner chisels exact copy on the
rendered site afterwards, so build for correct structure/data, not final wording.

Locked: cool accent scheme; lands on `/` (= About/home, no separate Home); routes
`/projects` + `/projects/[slug]`; nav shows GitHub + LinkedIn only; no contact form;
NO CV download (site is the CV expansion); palette baked into this PR; "tasteful
dev-coded". Landing follows the design: hero + skills + experience + testimonials
(projects live on /projects, not teased on the landing).

## Plan (build order; each step a commit, CI green throughout)

### Phase B — clean data model (do first)
1. Replace `PortfolioCard` + `CaseStudy` with ONE clean `Project` type (no Omit, no
   legacy role/focus). Shape: slug, title, company, stack, hook, featured, role?,
   period?, caseStudy?({ sections, testimonialId?, status? }). One `projects` array.
2. Populate `projects`: the 4 kept case studies (Proof Library, SlateIQ, AI research
   assistant, Routes Wallet) get `caseStudy`; film-tracking, Connect4, Wutzu are
   earlier-work cards (featured:false, no caseStudy). Fill more case studies later.
   Wire testimonialId (Proof Library -> Ben Ritchie, id 1).
3. GrowthNation naming sweep: hero.paragraphs[0], project company, experience[0].company.
4. Remove CV: drop `profile.cvFile` and any /resume + download references.

### Theming foundation
5. `app/theme.css` — single swap-a-file palette: named oklch vars, cool light (`:root`)
   + dark (`.dark`). Import into globals.css; map via `@theme inline`. Fonts (Geist +
   Geist Mono), keyframes (blink cursor, pulse), scanline utility.

### Shared + layout
6. SiteNav to the design (akds logo, About/Projects, GitHub+LinkedIn+theme). Footer
   (no CV download).
7. Primitives: `Kicker` (diamond // LABEL), `StackChips`.

### Pages
8. Landing `/` — hero (static prompt for now), skills grid, experience timeline,
   testimonials (clamp + expand). No featured-projects section (per design).
9. Projects `/projects` — top cards (4, linking) + earlier-work toggle (3).
10. Case study `/projects/[slug]` — generateStaticParams over the 4 slugs, sections,
    sticky meta.json card, on-this-page TOC, endorsement.

### Enhancement (same PR)
11. Command palette — dialog/combobox, `/` + Cmd/Ctrl+K, fuzzy filter, real actions
    (go/external/theme + /whoami), a11y, reduced-motion, progressive enhancement.
    Commands: /projects /skills /experience /testimonials /github /linkedin /theme
    /top /whoami. NO /resume. One Vitest keyboard test for this piece.

### Housekeeping
12. Basic metadata (title, description, OG using brand image). Update CLAUDE.md TODOs.

## Verification

Per step: CI suite green (prettier/eslint/tsc/build) + visual check against the
artifact via dev server. Palette gets a Vitest keyboard/filter test.

## Open (confirm at green light)
- Landing has no featured-projects strip (follows design) — OK, or add a teaser?
- Otherwise all decisions locked: cool accent, 4 case studies, fold film, no CV,
  palette in this PR, clean Project type, theme.css.
