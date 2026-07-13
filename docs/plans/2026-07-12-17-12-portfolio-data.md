# portfolio data

- Date: 2026-07-12 17:12
- Branch: portfolio-data

## Problem / Context

Owner supplied three research-phase artefacts from a prior AI run, moved into repo root:
`portfolio.ts` (final typed data), `PORTFOLIO_RESEARCH.md` (long-form "why"),
`HANDOFF.md` (decisions + open items). This lands the real content layer the
CLAUDE.md TODOs were blocked on, and confirms the portfolio direction: **Option B,
project-led case studies** (see memory `portfolio-strategy-option-b`).

Two prior decisions govern this work:
- **Contact: GitHub + LinkedIn only.** No form, no mailto. The supplied data has a
  `publicEmail` field commented "for the website contact form" — that comment is
  now stale; the field stays in the data (owner content) but no component renders it.
- **Never invent professional history** — all copy is owner-supplied and verbatim.

Goal this pass: place the files, then hand-draft **case study #1 (Proof Library)**
by mining the research doc, and lock the `CaseStudy` shape from what the draft needs.

## Plan

1. Move files to intended homes: `data/portfolio.ts`, `docs/portfolio-research.md`,
   `docs/portfolio-handoff.md`. (done)
2. Fix the one genuinely stale string: header comment "Next.js 15" -> "Next.js 16".
   Leave `Radix UI` skill entry — it's real resume data (GrowthNation), not a claim
   about this repo. Leave `publicEmail` field intact but unused.
3. Draft Proof Library case study #1 as prose in `docs/case-studies/proof-library.md`,
   sourced only from `data/portfolio.ts` + `docs/portfolio-research.md`. No invention.
4. Derive the `CaseStudy` TS shape from the draft (extend `PortfolioCard`, don't
   replace) — proposal only, not wired into data yet until owner reviews the draft.

## Increments (test-first)

<!-- No unit surface: data + prose. Verify = typecheck stays green + presence checks. -->

1. verify: `npx tsc --noEmit` green after files land in `data/` -> impl: move files + fix Next 15->16 comment. Commit.
2. verify: case-study draft exists, every factual claim traceable to a line in portfolio.ts / research doc -> impl: write `docs/case-studies/proof-library.md`. Commit.
3. verify: proposed `CaseStudy` type compiles alongside existing types -> impl: append proposed shape (commented / separate block) for owner review. Commit.

## Notes

- Design step gating + whether we need a design brief for Claude design: answered in
  the report back to owner, not code. Likely: capture all case-study data first, then
  a short design-direction doc kicks off the design phase.
