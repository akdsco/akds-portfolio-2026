<!--
CASE STUDY #3 (AI research assistant) - ROUGH DRAFT for owner review.
Source of every claim: data/portfolio.ts + docs/portfolio-research.md. Nothing invented.
IMPORTANT (from portfolio-handoff.md): role is "co-built with the CTO". Ben drove it,
Akds paired and owned significant implementation chunks. DO NOT solo-claim.
Rough on purpose. Owner chisels on the rendered site. Voice: de-AI rules (no em dashes).
-->

# AI-powered research assistant

**Hook:** Co-built a documentary research assistant on GPT-3.5/4 in 2023, before AI-assisted tooling was a category: give it a subject, it returned biographical leads and story angles worth chasing.

- **Company:** Noah Media Group · **Role:** Software Engineer (paired with the CTO)
- **Period:** 2023 · **Stack:** TypeScript · React · Node · OpenAI (GPT-3.5 + GPT-4) · Cheerio · Puppeteer

---

## Problem

The documentary research team spent real time finding leads and angles on a new subject. The question was whether an early LLM could surface threads worth pursuing and give researchers a faster starting point.

## Constraints

This was 2023, on GPT-3.5 and GPT-4, before there were patterns to copy. Early models were unreliable, and an internal creative team has a high bar for what it will trust. Getting output stable enough to be useful was the hard part.

## Approach

Input a subject name, get back biographical leads, story angles, and threads to pull. Paired with the CTO on architecture and prompt strategy, and owned significant chunks of the implementation. Built integration tests that run live OpenAI calls with graded responses, keeping output inside tolerance bands. That harness came years before checking LLMs in CI was standard, and the same pattern carried through to GrowthNation three years later.

## Contribution

A paired role, stated honestly: the CTO drove it, I paired and owned significant implementation chunks, including the graded-LLM test harness. (Rough: confirm which components were mine to name specifically.)

## Outcome

A capable, working tool. It was sunset because the creative research team preferred its traditional workflow, with the head of research objecting to "AI slop." The tech worked; adoption was blocked by preference, not capability.

## Reflection *(optional, candidate section)*

The durable artifact is the graded-LLM integration test pattern, built well ahead of the curve. The temporal signal (production LLM work in 2023) matters more than the tool that got shelved.
