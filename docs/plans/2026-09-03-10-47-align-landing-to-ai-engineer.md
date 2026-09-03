# align landing to ai engineer

- Date: 2026-09-03 10:47
- Branch: landing-page-still-leads-with-full-stack-align-arkadiusz-tech-to-the-applied-ai-positioning

## Tickets

- Resolves: https://app.notion.com/p/Landing-page-still-leads-with-full-stack-align-arkadiusz-tech-to-the-applied-AI-positioning-3d015f963d1381ef8728d093ec6bcbc0
- Refs:

## Problem / Context

TB-131. arkadiusz.tech still leads with the full-stack-generalist identity while the
job-hunt canonical positioning moved to AI Engineer / applied-AI (automation-scripts
PR #115). The live site now contradicts the CV and profiles: a recruiter clicking
through reads the old label.

Canonical positioning (pull wording verbatim, do not re-invent) lives in
`automation-scripts/src/job-hunt/data/master-cv.yml` + `story.md`:

- `profile.title`: **AI Engineer · FDE · Python · TypeScript**
- headline `hl-hard-problems`: **AI Engineer. I solve the hard problems at the root and build what moves the business.**
- story.md Positioning: lead with applied AI; breadth is a supporting capability,
  never the headline; full-stack retired from current use, survives only in past-role
  history.

Where the old identity currently lives in this repo (the surfaces to change):

- `data/portfolio.ts:203` — `profile.title` = "Software Engineer · Full-Stack · TypeScript · React · Node" (feeds schema.org jobTitle via `lib/structured-data.ts`).
- `data/portfolio.ts:242` — `about.tagline` = ["Software Engineer · Full-Stack", "TypeScript · React · Node"] (the visible mono identity line under the name, rendered in `components/landing/hero.tsx:51`).
- `data/portfolio.ts:231` — `hero.tagline` = "I build production AI-native software end-to-end." (the big lede sentence, rendered in `hero.tsx:59` with the `HIGHLIGHT` word in coral).
- `components/landing/hero.tsx:10` — `HIGHLIGHT = "AI-native software"` (the coral-accented substring inside the lede).
- `app/opengraph-image.tsx:11` — OG card caption "Software Engineer · London".
- `lib/og-card.tsx` — `ALT = "akds : Software Engineer, London"`.
- `app/layout.tsx:38` — meta `description` "London-based software engineer building production AI-native software end-to-end…".
- Stale comments referencing the old title: `lib/structured-data.ts:25`, `app/about/opengraph-image.tsx:1`.

Not touched (legitimate history): experience entry id 4 `position: "Software Engineer"` — a past job title, exactly where full-stack/SE is allowed to survive.
Note: `hero.name` and `hero.paragraphs` are dead (Hero renders `about.*`); left alone (see out of scope).

## Plan

Swap the identity strings to the canonical AI-Engineer wording across every surface a
recruiter reads (visible hero, page `<title>` template source, meta/OG/social-card,
schema.org). Two open copy decisions, my recommendation in each:

1. **Coral highlight word in the new lede.** New headline is "AI Engineer. I solve the
   **hard problems** at the root and build what moves the business." — recommend
   highlighting **"hard problems"** (the differentiator). Alt: "the root".
2. **Meta description rewrite.** Recommend: "London-based AI engineer building production
   AI-native software end-to-end. Selected work, experience, and case studies." (swap the
   noun only; keep the rest).

## Behaviours (Given / When / Then)

- **B1 — hero identity.** Given a visitor loads the landing page, When they read the hero,
  Then the mono role line reads "AI Engineer · FDE · Python · TypeScript" and the lede reads
  "AI Engineer. I solve the hard problems at the root and build what moves the business." —
  no full-stack line. (AC 1)
- **B2 — meta/OG identity.** Given the page source and social card, When you inspect the
  `<title>` source, meta description, OG caption and card ALT, Then none carry "full-stack"
  or a "Software Engineer · …" identity; schema.org `jobTitle` is "AI Engineer". (AC 2)
- **B3 — full-stack only as history.** Given the site data, When "full-stack" appears at all,
  Then it appears nowhere as current identity (0 occurrences in `data/portfolio.ts`); the
  only surviving SE label is the past `position` on a prior role. (AC 3)
- **B4 — matches CV.** Given master-cv.yml / story.md, When compared to the site, Then the
  title + headline wording is identical to the canonical strings. (AC 4)

## Increments (test-first)

1. **Identity data (B1, B3, B4).**
   test: extend `data/portfolio.test.ts` — `profile.title === "AI Engineer · FDE · Python · TypeScript"`;
   `about.tagline.join(" · ") === profile.title` (mono line ≡ title); `hero.tagline` ===
   the exact canonical headline; no `/full-?stack/i` in `profile.title`, `about.tagline`,
   `hero.tagline`, and 0 `/full-?stack/i` matches across the whole `data/portfolio.ts`
   source (B3). Red first.
   → impl: edit `data/portfolio.ts` lines 203, 242, 231 to the canonical strings.

2. **schema.org jobTitle (B2).**
   test: add to `lib/structured-data.test.ts` — `person.jobTitle === "AI Engineer"` (explicit,
   alongside the existing derive-from-title assertion).
   → impl: green already once title changes; update the stale comment at
   `lib/structured-data.ts:25`.

3. **Lede highlight (B1).**
   test: assert the lede composes cleanly — `` `${ledeBefore}${HIGHLIGHT}${ledeAfter}` === hero.tagline ``
   and `HIGHLIGHT` is a substring of `hero.tagline`. (Export `HIGHLIGHT` or a tiny
   `splitLede` helper from `hero.tsx` so it is unit-testable rather than only reachable
   through a full render.)
   → impl: set `HIGHLIGHT = "hard problems"` (pending decision 1).

4. **Social card + meta surfaces (B2).**
   test: a source-scan invariant (new `app/identity-surfaces.test.ts`) — `app/opengraph-image.tsx`
   contains "AI Engineer · London" and not "Software Engineer"; `lib/og-card.tsx` ALT has no
   "Software Engineer"; `app/layout.tsx` description has no `/full-?stack/i`. Plus assert the
   new description via `app/layout.metadata.test.ts` (metadata is importable there).
   → impl: `app/opengraph-image.tsx` caption → "AI Engineer · London"; `lib/og-card.tsx`
   `ALT` → "akds : AI Engineer, London"; `app/layout.tsx` description → the rewrite
   (pending decision 2); fix the comment in `app/about/opengraph-image.tsx`.

5. **Green gate + emitted-HTML check.**
   Run `npm run test`, `npm run typecheck`, `npm run lint`. Then `npm run build` and grep
   `.next/server/app/` for the emitted `<title>`/OG tags to confirm no "full-stack" /
   "Software Engineer ·" reaches the rendered HTML (per CLAUDE.md's metadata note — Next's
   own resolution is where these bugs hide). Then `/ship`.

## Out of scope / risks

- **Dead hero fields.** `hero.name` / `hero.paragraphs` are unused (Hero renders `about.*`);
  the first dead paragraph still leads with a full-stack-ish stack line but never reaches the
  DOM. Not removing them here (unrelated cleanup); noted for a future tidy.
- **`hero.tsx` wrap measurements.** The comment at `hero.tsx:44` cites hand-measured px
  (453px full line) for the old role text. The new line is shorter, so the existing 520px
  breakpoint still holds; will re-check the comment isn't left misleading.
- **Double "AI Engineer".** The mono line and the lede both open with "AI Engineer" — this is
  per the ticket + CV; owner can chisel on-site if it reads repetitive. Not changing the
  canonical wording here.
- **Copy is owner-supplied.** Using the exact CV strings, inventing nothing.

## Notes
