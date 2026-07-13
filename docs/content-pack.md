# Content pack — akds portfolio (real content for the remaining surfaces)

Companion to the design brief. This is the real content for every surface except
the case-study detail page (which the brief already covered with Proof Library).
Attach this to the Claude design session so it designs Home, the Projects index,
and About against actual text, not lorem.

Naming note: the company formerly framed as "stealth sales-AI startup" is named
openly as **GrowthNation** (stealth, pre-product-market-fit). Testimonial quotes
are verbatim and must not be edited.

---

## Profile / identity (used in nav, hero, footer)

- **Name:** Arkadiusz Ostrowski ("akds")
- **Title:** Software Engineer · Full-Stack · TypeScript · React · Node
- **Location:** London, UK
- **Availability:** Open to senior / staff / founding-engineer roles. Hybrid or remote.
- **Social links (nav):** GitHub (github.com/akdsco), LinkedIn (linkedin.com/in/akds),
  Stack Overflow, Pluralsight
- **No contact form, no email field.** GitHub + LinkedIn only.
- **Résumé/CV:** a downloadable PDF (link only; file supplied later).

---

## HOME (`/`) — hero copy

**Tagline:** I build production AI-native software end-to-end.

**Hero paragraphs:**
1. London-based. TypeScript, React, Node, Postgres, BullMQ, Vercel AI SDK.
   Recently wrapped a 12-month contract at GrowthNation, a stealth sales-AI
   startup, where I ran the proof-library product, built the server-side LLM
   tagging architecture, and wrote CEO-facing delivery summaries.
2. Previously: three years at a documentary studio shipping AI-assisted research
   tools on GPT-3.5/4 in 2023, before "AI-assisted coding" was a phrase.
3. Open to senior / staff / founding-engineer roles.

---

## ABOUT (`/about`) — long-form bio

**Tagline:** Software Engineer · Full-Stack · TypeScript · React · Node

**Paragraphs:**
1. Based in London. Six years building production software, most recently
   shipping a social-proof OS for sales teams at GrowthNation and an AI research
   platform at Noah Media Group.
2. Comfortable across the stack: TypeScript end-to-end, React/Next on the front,
   Node + Postgres + BullMQ + multi-provider LLM on the back. Two-year track
   record of delivering AI-assisted features in production, from a 2023 research
   tool on GPT-3.5/4 to a 2026 proof engine using the Vercel AI SDK, Anthropic,
   OpenAI, OpenRouter, and a custom MCP server layer.
3. Career-changer. Worked in sales for ten years across Poland and the UK before
   self-teaching into software via OpenClassrooms and the London Java Community.
   Junior in 2020, mid in 2022, senior/lead by 2025.
4. Available for senior / staff / founding-engineer roles. Hybrid or remote.

---

## PROJECTS index (`/work`) — cards

Each card: title, company, one-line hook, stack chips. The first four link to a
case-study detail page. Film production tracking is a card only (no detail page).
Connect4 and Wutzu sit behind an "earlier work" toggle.

### Visible cards

1. **Proof Library** — GrowthNation (stealth, pre-PMF) · has detail page
   Hook: Owned the proof store behind a sales-AI product: ingestion, a user-facing
   dashboard with search, and a tagging layer that kept every customer's library
   organized on its own.
   Stack: TypeScript · React · Supabase · Vercel AI SDK · custom MCP servers · BullMQ

2. **SlateIQ** — Noah Media Group · has detail page
   Hook: Built a film-success predictor that pulled IMDB, social, piracy, and
   market data into one comp-matching tool the studio used in real pitch decisions.
   Stack: TypeScript · React · Node · MongoDB · BullMQ · OpenAI

3. **AI-powered research assistant** — Noah Media Group · has detail page
   Hook: Co-built a documentary research assistant on GPT-3.5/4 in 2023, before
   AI-assisted tooling was a category: give it a subject, it returned biographical
   leads and story angles worth chasing.
   Stack: TypeScript · React · Node · OpenAI · Cheerio · Puppeteer

4. **Routes Wallet** — Self-initiated (iOS) · has detail page
   Hook: Solo-shipped an iOS app to test whether cyclists wanted one home for
   routes scattered across Garmin, Strava, Komoot, and club Google Docs, then
   killed it when the market said no.
   Stack: React Native · iOS · TypeScript

5. **Film production tracking platform** — Noah Media Group · card only, no detail
   Hook: Worked directly with the CEO and Skyscanner co-founder Bonamy Grimes on
   database design and early prototypes that gave leadership visibility into
   production progress.
   Stack: TypeScript · React · Node · MongoDB

### Earlier work (behind a toggle)

6. **Meeting productivity platform** — Connect4
   Ported the Blaze front-end to React; shipped agenda drag-and-drop and recurring
   meeting templates.
   Stack: React · Meteor.js · WebSockets

7. **Stores panel** — Wutzu Technologies
   Refactored the MVP codebase; shipped the first production stores panel, still in
   use in some areas to this day.
   Stack: JavaScript · Node · Payments API

---

## SKILLS section (Home or About) — 9 categories

Headings + tag lists. Uneven counts (4 to 14). No bars, stars, or levels.

- **Languages:** TypeScript, JavaScript, SQL, Java (early-career)
- **Frontend:** React, Next.js, Tailwind CSS, Radix UI, shadcn/ui, TanStack Query,
  Zustand, Redux Toolkit + RTK Query, Vite, React Router, TipTap, Framer Motion,
  Recharts, Three.js (R3F + drei)
- **Backend:** Node.js, Express, BullMQ, Redis, WebSockets, Drizzle ORM, Zod,
  Puppeteer, Cheerio, Sharp
- **AI / LLM:** Vercel AI SDK, OpenAI, Anthropic Claude, OpenRouter, DeepSeek,
  Langfuse, Model Context Protocol (custom MCP servers), LLM-in-the-loop
  integration testing, Firecrawl, ElevenLabs, AI-assisted product development
- **Databases & Data:** PostgreSQL, Supabase (Postgres, Auth, Storage, Realtime,
  Edge Functions), MongoDB, Upstash Redis, pgvector-ready architectures
- **Infrastructure & DevOps:** Vercel, Fly.io, Heroku, AWS, Google Cloud, Docker,
  GitHub Actions, Supabase preview branches, Blue-green deploys, Cron / scheduled
  jobs, Slack/PostHog/Sentry alerting
- **Testing & Quality:** Vitest, Jest, Cypress, Playwright, Supertest, Testing
  Library, Integration tests against live LLMs with graded responses, ESLint
  (custom in-repo rules), Prettier, Husky, lint-staged, Knip, Storybook
- **Observability & Product Analytics:** Sentry (typed wrapper with discriminated
  severity unions), Better Stack / Logtail, Winston, PostHog, GA4, Meta Pixel,
  Google Search Console
- **Practices & patterns:** Functional programming, Currying-based dependency
  injection, Ports-and-adapters, TDD, "Agent skills produce data" pattern,
  Pay-on-success cost tracking, AI-assisted coding with human-in-the-loop quality gates

---

## TESTIMONIALS (Home or About) — 6, verbatim

Quote lengths 162–327 chars. Needs a treatment that survives the variance
(line-clamp + expand is fine). Do not edit the quotes.

1. **Ben Ritchie** — Hands-on CTO · GenAI/ML Product Specialist (managed Arkadiusz directly, Noah Media Group)
   "Arkadiusz is a strong self-starter who is diligent and righteous when it comes
   to building product, but measured and pragmatic about delivery so doesn't allow
   himself to get pulled into over-engineering. He is an excellent team-member
   capable of learning quickly and mentoring those around him. His focus and
   selfless drive mean I would happily recommend or work with him again."

2. **Martijn Verburg** — Principal Engineering Group Manager at Microsoft (managed Arkadiusz directly, London Java Community)
   "Arkadiusz was amazing to work with, our community liked Arkadiusz's work so
   much that our hosting bandwidth needed to be readjusted to traffic demand twice
   the following day!"

3. **Hevar Abrihem** — Product & Growth Operator (Wutzu colleague, same team)
   "Arkadiusz's efforts at Wutzu were crucial to the first deployment of our new
   stores panel. Given the heavy task of unwinding the Wutzu codebase and
   refactoring the MVP, Arkadiusz stepped up to the challenge and handed back a
   well-documented & efficient application that is still in use in some areas to this day."

4. **Simon Maple** — Head of Developer Relations at Tessl (client, LJC Unconference website)
   "Arkadiusz worked very well in a team to gather requirements very accurately and
   turn them into visual results with a very fast turnaround. Arkadiusz is someone
   who gets the job done."

5. **Barry Cranford** — Founder of RecWorks (Tech Talent Agency, London) (client)
   "Arkadiusz was a pleasure to work with on our latest web project. He instantly
   had an appreciation for what we wanted to achieve… took initiative too… he
   wouldn't say no or find alternative solutions, instead he took the time to
   research what would be necessary to give us what we wanted."

6. **David McLeary** — Group IT Development Manager at Greencore (contractor predecessor on the Connect4 project Arkadiusz took over)
   "Developing good code is a mix of diligence, understanding the use case and good
   communication. In working with Arkadiusz I was able to see that he excels in
   each of these areas. He is able to work very well with a team, collaboratively
   and productively arguing a point when needed."

---

## EXPERIENCE timeline (About) — roles, newest first

Each role: period, position, company, location/type, one-line summary, stack chips
(3 to 27 chips — the chip treatment must survive the high end).

1. **Senior Software Engineer / Product Engineer** — GrowthNation (stealth sales-AI startup)
   2025 Jul – 2026 Jun · Remote · Contract (12 months)
   Built and ran the proof-store product across a CEO-driven pivot, from ingestion
   through dashboard to delivery summaries; server-side LLM tagging; co-created an
   autonomous AI bug-triage system that opens its own fix PRs.
   Stack: TypeScript, React 18, Vite, Tailwind, Supabase, Drizzle ORM, BullMQ,
   Vercel AI SDK, OpenAI, Anthropic Claude, OpenRouter, DeepSeek, Langfuse,
   ElevenLabs, MCP, Fly.io, Docker, Cypress, Vitest, PostHog, Sentry, Better Stack

2. **Lead Product Engineer** — Noah Media Group
   2025 Apr – 2025 Sep · London (hybrid) · Full-time
   Promoted to sole remaining technical IC after the CTO's departure; built the
   film production tracking platform working directly with the CEO and Skyscanner
   co-founder Bonamy Grimes.
   Stack: TypeScript, React, Node, Express, MongoDB, BullMQ, OpenAI

3. **Software Engineer** — Noah Media Group
   2022 Mar – 2025 Mar · London (hybrid) · Full-time
   Second engineer in NMG's tech arm; built three products 0→1 (SlateIQ, the AI
   research assistant, and more); adopted production LLM tooling ahead of the curve.
   Stack: TypeScript, React 17, Redux Toolkit + RTK Query, TanStack Query, MUI,
   Node, Express, MongoDB, BullMQ, OpenAI (GPT-3.5 + GPT-4), Cheerio, Puppeteer,
   Heroku, Google Cloud, AWS, Redis, Jest, Cypress, Sentry, GitHub Actions

4. **Software Engineer** — Connect4
   2020 Nov – 2022 Mar · Fully remote · Full-time
   First of three companies working alongside Ben Ritchie (mentor); B2B SaaS for
   meeting productivity. Ported the Blaze front-end to React; built agenda
   drag-and-drop and recurring templates.
   Stack: Meteor.js, Blaze, React, WebSockets, MongoDB

5. **Software Developer (Intern → JavaScript Developer)** — Wutzu Technologies
   2020 May – 2020 Nov · London · Full-time
   "Deliveroo for small independent London shops." Refactored the MVP and shipped
   the first production stores panel; intern → developer in 7 months.
   Stack: JavaScript, React, Node, Firebase, Redux, Webpack, Payments API

6. **Freelance Web Developer** — Self-employed
   2018 – 2019 · London · Freelance
   Built websites for the London Java Community and Meet a Mentor; mentored junior
   devs into their first roles via LJC.
   Stack: HTML5, CSS3, JavaScript

---

## EDUCATION (About)

- **Bachelor's degree, Software Developer** — OpenClassrooms (2019–2020)
  Degree-level diploma: JavaScript, REST APIs, OOP, React.js, MySQL, CSS3/HTML5,
  testing with Jasmine, Git. Real-world projects + weekly senior mentoring.
- **Software Development Specialization** — uCertify.com (2018–2019)
  Self-study track covering OCA Java SE 8 (1Z0-808) and MTA Software Development
  Fundamentals (98-361).

## CERTIFICATIONS (About)

- **Cloud Digital Leader** — Google (Feb 2023) — current
- **Oracle Certified Associate, Java SE 8 Programmer I** — Oracle (May 2018) — legacy
- **MTA: Software Development Fundamentals (98-361)** — Microsoft (Aug 2017) — legacy
