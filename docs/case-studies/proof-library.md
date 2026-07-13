<!--
CASE STUDY #1 — DRAFT for owner review.
Source of every claim: data/portfolio.ts + docs/portfolio-research.md. Nothing invented.
Naming: company named openly as GrowthNation (owner's call, 2026-07-13 — reverses the
earlier stealth-framing in docs/portfolio-handoff.md). Framed as a stealth, pre-product-
market-fit startup that pivoted repeatedly; that churn is used to show adaptability, not
to disparage. Testimonial-style quotes, if used, stay verbatim.
This draft exists to FIND the CaseStudy shape (section set, length, voice), not to ship.
-->

# Proof Library

**Hook:** Owned the proof store end-to-end at GrowthNation, a stealth pre-product-market-fit startup — ingestion, a CEO-facing dashboard, and a server-side LLM tagging layer that kept every customer's evidence library in sync automatically.

- **Company:** GrowthNation (stealth, pre-product-market-fit) · **Role:** Senior Software Engineer / Product Engineer (contract)
- **Period:** Jul 2025 – Jun 2026 · **Lane:** the underlying proof store, ingestion, and presentation
- **Stack:** TypeScript · React · Supabase · Vercel AI SDK · custom MCP servers · BullMQ

---

## Problem

GrowthNation was a stealth, pre-product-market-fit startup, and it hunted for that fit by pivoting: it began in AI content marketing, and roughly three months before the contract ended the CEO pivoted it to a "social proof OS for sales teams." (It has since pivoted again, after I left, toward AI-driven org optimization — interviewing employees with AI to surface improvements that used to be done by hand.) Delivering real product through that churn was the job.

The sales-tool pivot needed a single place to hold a company's proof — case studies, customers, testimonials, stats — that other surfaces could read from to assemble tailored sales pitches. That store didn't exist yet, and the two surfaces that would consume it (proof *delivery* and proof *collection*) were being built in parallel by other engineers. Someone had to own the thing in the middle and make it real.

## Constraints

- **CEO-driven scope, executive-level communication.** Requirements came from the founder, who evaluated work on business impact, not implementation detail. Every major delivery shipped with a written CEO summary — the discipline was being a trustworthy human-in-the-loop, not raw output.
- **Small team, AI-heavy delivery.** A founding team leaning hard on AI-assisted coding to get to 80% fast, while accumulating tech debt at speed. The skill on display is direction, judgement, and AI orchestration — not line-by-line throughput.
- **Had to work for every workspace from day one.** A proof store is worthless empty; onboarding a new customer had to produce a usable, organised library immediately.

## Approach

Scoped the store as three layers and drove each with AI assistance under a human quality gate:

1. **Ingestion** — a public-scrape lane wired end-to-end (paste URL → extract → preview → save → appears in dashboard), plus uploads of every kind: docs, PDFs, plain text, and **screenshots/images run through AI vision** to pull quotes and testimonials out of pixels.
2. **Presentation** — a real-data dashboard that worked for every workspace: a hero band (coverage %, total proof items, gaps, last contribution), a per-ICP coverage matrix with per-pain-point bars, expandable rows exposing the underlying quotes and stats with source chips, a "show only consented" filter, and a live-contributions sidebar. This was a CEO-demanded surface, scoped and delivered under that pressure.
3. **The architectural unlock — server-side auto-tagging.** Every new quote, stat, or case study runs an LLM tagging pass against the workspace's ICPs and pain points *before the save call returns*, with a fan-out re-tag of all existing proof whenever a workspace edits its ICPs or pain points. That one decision is what made onboarding viable from day one and kept libraries continuously in sync as a customer's positioning evolved.

Folded in alongside: an **autonomous AI bug-triage system** (sparked by the CTO, handed over to build up) that does root-cause analysis — temporal ordering, server-over-client source prioritisation, error fingerprinting, cascade detection — and opens clean fix PRs on its own, so triage points at the root cause rather than the downstream symptom.

## Contribution

Owned the proof store, ingestion, and presentation end-to-end, and exposed it over a custom MCP layer for agentic access. Wrote the CEO-facing delivery summaries that shipped with each milestone, including explicit V1 discipline — shipping a real-data dashboard behind a feature flag for every workspace while naming what was deliberately deferred to follow-ups.

Honest scope line: proof *delivery* and proof *collection* were other engineers' lanes; this was the store they read from. Where the work was collaborative, it's framed that way.

## Outcome

The store, dashboard, and tagging layer shipped and ran for every workspace on the platform. It underpinned a product with real paying customers (including non-US), demoed at a June 2026 conference, on the back of a startup that had previously placed top 10% in a YC application. The 12-month contract concluded on schedule.

## Reflection *(optional — candidate section)*

The lesson worth telling: the leverage wasn't in typing faster. It was in scoping a CEO-level requirement into three layers, making one non-obvious architectural call (tag on the way in, re-tag on change) that quietly solved the empty-library and drift problems at once, and staying trustworthy as the human walking AI output through its hallucinations. "You're allowed to have a conversation with uncertainty as an engineer, but you're not allowed to dress uncertainty as certainty." — a mentor's line that became the working standard.

---

<!--
SHAPE NOTES (feeding the CaseStudy type):
- Sections that earned their place here: hook, meta(company/role/period/stack),
  problem, constraints, approach, contribution, outcome, reflection?(optional).
- "constraints" pulled its weight — the AI-orchestration honesty and CEO-scope
  context live here and would otherwise leak into every other section.
- "approach" wants sub-items with an optional lead-in sentence, not flat paragraphs.
- "contribution" needs an explicit not-my-lane line to keep solo-claims honest.
- Proposed shape lands in data/portfolio.ts as an extension of PortfolioCard (separate
  commit, for review) — CaseStudy = PortfolioCard + { hook, sections, testimonialId? }.
-->
