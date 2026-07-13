# Handoff from old-repo research phase

Two files were produced in the old portfolio repo and moved into this one:

- **`data/portfolio.ts`** — final structured data. Polished and length-balanced.
  Types are self-describing (`Profile`, `HeroCopy`, `AboutCopy`,
  `SkillCategory`, `PortfolioCard`, `WorkExperience`, `Education`,
  `Certification`, `Testimonial`).
- **`docs/portfolio-research.md`** (or wherever it landed) — raw research doc.
  Long-form context: interview answers, standup receipts, Notion crawl
  extracts, testimonial history, and the "why" behind every decision in
  `portfolio.ts`. Use it when you need **why**, not **what**.

**Read `data/portfolio.ts` fully before proposing schema changes.**

---

## Decisions locked (do not re-litigate)

- **Portfolio cards:** 5 visible + 2 collapsed (`visible: boolean` on each).
  Order is intentional. Routes Wallet at position 4 is deliberate — a killed
  side project is a staff-level signal when framed honestly.
- **Bug Triage folded into the Proof Library card**, not a separate card. One
  stealth-NDA description, two impressive surfaces inside it.
- **Bio:** Hero uses "Option B" copy, About uses "Option A". Both drafted
  verbatim in `hero.paragraphs` and `about.paragraphs`.
- **No services section, no blog.** Deliberate. Do not add them.
- **Two emails:** `hire-arkadiusz@pm.me` (public, website) and
  `arkadiusz.ostrowski@protonmail.com` (CV only, keep off the site).
- **Skills:** 9 categories, no percentage bars, no stars, no levels. That
  format reads as junior portfolio.
- **GrowthNation is stealth-framed** as "Stealth sales-AI startup" everywhere
  public. The private `experience[0].company` field carries the name in
  parens for internal reference only.
- **Testimonial quotes are verbatim from real people. Do not edit them.**

## Non-obvious framing to preserve

- **AI research assistant card**: role reads "Co-built with the CTO" on
  purpose. Ben Ritchie drove it; Akds paired. Do not solo-claim.
- **Ben Ritchie is CTO across three companies with Akds** (Connect4 → NMG →
  GrowthNation). That's the mentor arc — surface it once, not three times.
- **David McLeary testimonial**: he was a contractor at Connect4 who
  prototyped the project Akds later took over. Greencore in his title is
  David's later employer, **not** a Connect4 reference. See `testimonials[5].context`.
- **Career-changer narrative**: ~10 years sales in Poland + UK before
  self-teaching into software (2017 uCertify → 2019 OpenClassrooms → 2020
  first dev role). This arc appears **once** in About copy. Do not repeat.
- **Old jobs** (Volvo, ING, The Book People) are explicitly excluded from
  portfolio, kept on LinkedIn only.

## Open — needs decisions

**Content / product**
- Case study expansion: each `PortfolioCard` is currently 4 fields (role,
  focus, stack, title). The plan is to extend into per-project case studies.
  Extend the shape; don't replace.
- Start with the Proof Library card — the stealth-NDA framing is already
  worked out, so nothing new to invent.

**Design (data does not need to change; render layer does)**
- Skills card overflow. Category item counts vary 4-14. Options: expandable /
  bento grid / `+N more` chip. Do not artificially pad or cut valid skills.
- Experience stack chips have the same overflow (3-27 items per role).
- Testimonial quote lengths vary 162-327 chars. Recommend line-clamp
  ~180 chars + "Read more" affordance.
- The `context` field on testimonials **does not render** — it's a private
  note for future editors. Ignore its length variance.

## Suggested next steps

1. Read `data/portfolio.ts` end-to-end. Types encode most of the decisions.
2. Skim `docs/portfolio-research.md` for GrowthNation and NMG sections when
   drafting case studies — the standup receipts and Notion extracts have
   quantifiable detail that isn't in `portfolio.ts`.
3. Extend the `PortfolioCard` shape into a `CaseStudy` shape. Don't replace.
4. Draft case study #1 for Proof Library. Everything else follows.

## What was intentionally cut

- Solo-authorship claims where work was collaborative (fixed on AI research
  card mid-editing pass).
- Em dashes throughout (AI-writing tell). Do not reintroduce.
- "Owned end-to-end" repetition (was 9×, now 3×). Keep it that way.
- Duplicated "before X was a category / ahead of mainstream" phrasing (was
  4×, now 1×).
