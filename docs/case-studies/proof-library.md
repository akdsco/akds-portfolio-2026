<!--
CASE STUDY #1 - DRAFT for owner review.
Source of every claim: data/portfolio.ts + docs/portfolio-research.md. Nothing invented.
Naming: company named openly as GrowthNation (owner's call, 2026-07-13, reverses the
earlier stealth-framing in docs/portfolio-handoff.md). Framed as a stealth, pre-product-
market-fit startup that pivoted repeatedly; that churn shows adaptability, not disparagement.
Voice: de-AI pass applied 2026-07-13 per docs/portfolio-handoff.md rules (no em dashes,
no triad padding, no "not X but Y", no bolded-bullet formula, no filler intensifiers).
This draft exists to FIND the CaseStudy shape (section set, length, voice), not to ship.
-->

# Proof Library

**Hook:** At GrowthNation, a stealth startup still hunting for product-market fit, I owned the proof store: how evidence got in, the dashboard the CEO worked from, and a tagging layer that kept each customer's library organized on its own.

- **Company:** GrowthNation (stealth, pre-product-market-fit) · **Role:** Senior Software Engineer / Product Engineer (contract)
- **Period:** Jul 2025 to Jun 2026
- **Stack:** TypeScript · React · Supabase · Vercel AI SDK · custom MCP servers · BullMQ

---

## Problem

GrowthNation was a stealth startup still looking for product-market fit, and it looked by pivoting. It started in AI content marketing. About three months before my contract ended, the CEO moved the whole product to a "social proof OS for sales teams." (After I left it pivoted again, toward AI-driven org optimization: interviewing employees with AI to surface improvements people used to find by hand.) Shipping real product across those swings was the actual job.

The sales pivot needed one place to hold a company's proof: case studies, customers, testimonials, stats. Other parts of the product would read from it to assemble tailored pitches. It didn't exist yet, and the two surfaces that would consume it, proof delivery and proof collection, were being built at the same time by other engineers. Someone had to own the store in the middle and make it real. That was me.

## Constraints

A few things shaped how it got built.

The scope came from the founder, who judged the work on business impact rather than implementation detail. Every major delivery went out with a written summary he could read in a couple of minutes. The skill there was being a reliable human in the loop, not producing more words.

The team was small and shipped fast on heavy AI assistance, which also meant tech debt stacking up quickly. What I was paid for was direction, judgement, and knowing when the AI output was wrong.

An empty proof store is useless, so onboarding a new customer had to produce a usable, organized library straight away.

## Approach

I split the store into three layers and built each one with AI assistance under my own review.

Ingestion came first. The public-scrape lane runs end to end: paste a URL, it extracts, you preview, you save, it appears in the dashboard. On top of that, uploads of any kind (docs, PDFs, plain text) plus screenshots run through AI vision to pull quotes and testimonials straight out of images.

Presentation was the surface the CEO wanted, and it had to work for every workspace on real data. Coverage percentage, total items, gaps, and last contribution across the top. A coverage matrix broken down by ICP, with a bar per pain point. Rows you can expand to see the underlying quotes and stats with their source. A filter for consented-only proof, and a sidebar of live contributions.

The tagging layer was the decision that mattered most. Every new quote, stat, or case study gets tagged against the workspace's ICPs and pain points before the save call even returns, and when a workspace edits its ICPs or pain points, everything already stored gets re-tagged. That is what let a brand-new customer have a useful library on day one, and what kept it accurate as their positioning shifted.

Alongside the store I took over an autonomous bug-triage system the CTO had started. It does root-cause analysis (ordering events in time, trusting server logs over client, fingerprinting errors, catching cascades) and opens its own fix PRs, so a triage points at the cause instead of whichever symptom surfaced first.

## Contribution

I owned the store, its ingestion, and its presentation, and exposed all of it over a custom MCP layer so agents could read it too. I wrote the delivery summaries that went out with each milestone, including what got left out on purpose: the first dashboard shipped behind a feature flag for every workspace, with the deferred items named openly rather than dropped without a word.

To be accurate about scope: proof delivery and proof collection belonged to other engineers. My lane was the store they both read from. Where the work was shared, I've said so.

## Outcome

The store, dashboard, and tagging layer shipped and ran for every workspace on the platform. Real customers used it, some of them outside the US. The product was demoed at a conference in June 2026, and the company had earlier reached the top 10% of a YC application round. My twelve-month contract finished on schedule.

## Reflection *(optional, candidate section)*

What made this work wasn't output speed. It was reading a founder-level ask, breaking it into layers, and making one call, tag on the way in and re-tag on change, that dealt with the empty-library problem and the drift problem together. The other half was staying honest about what the AI produced instead of shipping its guesses. A line from my manager stuck with me: you're allowed to have a conversation with uncertainty as an engineer, but you're not allowed to dress uncertainty up as certainty.

---

<!--
SHAPE NOTES (feeding the CaseStudy type):
- Sections that earned their place: hook, meta(company/role/period/stack),
  problem, constraints, approach, contribution, outcome, reflection?(optional).
- "constraints" pulled its weight: the AI-orchestration honesty and founder-scope
  context live here and would otherwise leak into every other section.
- "approach" wants a short lead-in then prose blocks, not a rigid numbered list.
- "contribution" needs an explicit not-my-lane line to keep solo-claims honest.
- Proposed shape lands in data/portfolio.ts as an extension of PortfolioCard (separate
  commit, for review): CaseStudy = PortfolioCard + { hook, sections, testimonialId? }.
-->
