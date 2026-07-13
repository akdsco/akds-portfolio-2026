<!--
CASE STUDY #2 (SlateIQ) - ROUGH DRAFT for owner review.
Source of every claim: data/portfolio.ts + docs/portfolio-research.md. Nothing invented.
Rough on purpose: right facts + full section skeleton, hook + a few sentences per section.
Owner chisels exact copy on the rendered site. Voice: de-AI rules (no em dashes etc).
-->

# SlateIQ

**Hook:** Built a film-success predictor that pulled IMDB, social, piracy, and market data into one comp-matching tool the studio used in real pitch decisions.

- **Company:** Noah Media Group (documentary studio behind Netflix's "14 Peaks") · **Role:** Software Engineer
- **Period:** 2022 to 2025 · **Stack:** TypeScript · React · Node · MongoDB · BullMQ · OpenAI

---

## Problem

The studio wanted to gauge a film's potential the way the industry actually thinks about it: by comparison to past titles ("comps"). The signals for that lived in a dozen different places, from IMDB to social audience data to piracy numbers. Nobody had them in one view.

## Constraints

Internal-only tool, second engineer on a small team. No auth by design, since the CTO chose not to invest in it before there was external traction. The interesting call was what not to build: comp-matching is a human judgement in film, so we deliberately skipped a vector database or semantic-search layer we did not need.

## Approach

Pulled five-plus third-party sources into one pipeline: IMDB via its GraphQL API, Muso for piracy data, Audiense and SocialBlade and DemographicsPRO for social and audience, and bespoke Cheerio and Puppeteer scraping for the rest. Combined those into a comp view an analyst could read, and kept the actual comparison human-driven rather than dressing it up as an ML prediction.

## Contribution

Built the integrations and the tool end to end and shipped a working prototype. (Rough: confirm exact split of what was solo vs shared with the team.)

## Outcome

Used in real pitch decisions. The bigger takeaway landed at the org level: documentary funding turned out to be driven by human storytelling, not statistics, which fed a strategic pivot away from data-led greenlighting. The tool did its job; the lesson was about the limits of the data.

## Reflection *(optional, candidate section)*

Knowing what not to build is the signal here. Skipping the semantic-search layer kept the thing shippable and honest about where the real judgement sat.
