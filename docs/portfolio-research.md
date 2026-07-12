# Portfolio Research — Working Document

Captured during interview sessions with Akds. Source of truth while we
sculpt the data for the new portfolio. Move to the new repo when ready.

Status legend: ✅ captured, 🟡 partial, ❌ not started

---

## Timeline overview

| Period | Role | Company | Type |
|---|---|---|---|
| 2018 – 2019 | Freelance Web Developer | Self-employed | ✅ (drop/condense) |
| 2020 May – Nov | Software Developer (Intern → JS Developer) | Wutzu Technologies | ✅ (merged) |
| 2020 Nov – 2022 Mar | Software Engineer | Connect4 | ✅ |
| 2022 Mar – 2025 Mar | Software Engineer | Noah Media Group | ✅ |
| 2025 Apr – 2025 Sep | Lead Product Engineer | Noah Media Group | ✅ |
| 2025 Jul 14 – 2026 Jun (end) | Senior Software Engineer / Product Engineer | GrowthNation (contract) | ✅ |
| 2026 Jun – present | Available | — | — |

NMG end-of-contract overlapped with GrowthNation start (Jul 2025) — clean
narrative: garden leave during transition into next role.

---

## Noah Media Group 🟡

**Company:** Noah Media Group — documentary studio behind "14 Peaks"
(Netflix), founded by Skyscanner co-founders Barry Smith and Bonamy
Grimes. Investment from 14 Peaks success funded the tech arm.

**Dates:** 2022 Mar – 2025 Sep

**Title progression:**
- Software Engineer: 2022 Mar – 2025 Mar (~3 years)
- Lead Product Engineer: 2025 Apr – 2025 Sep (~5–6 months)

**Location:** London (hybrid, 2 days in office)

**Team:** No direct reports. Peer-level throughout — Akds + Dmitry (senior)
+ Ben Ritchie (CTO, long-term partner; **second of three companies
worked together**, after Connect4). Team shrank: Dmitry let go before
research pivot, then Ben let go ~Apr 2025, leaving Akds as sole technical IC.

**Summary:**
Second engineer in NMG's newly-formed tech arm. Built three products 0→1
across the team's lifetime, worked directly with leadership including
Skyscanner co-founder Bonamy Grimes, and was promoted to Lead Product
Engineer as the last technical IC after the CTO's departure.

### Projects shipped

**1. SlateIQ** — film success prediction
- Combined IMDB, social media, piracy data, market data
- Goal: predict potential success of films based on past similar titles
- Working prototype, used in pitch decisions
- Strategic insight gained: documentary funding decisions are driven by
  human storytelling, not statistics — led to pivot away from data-led
  greenlighting

**2. AI-powered research assistant** — for documentary research team
- Built **ahead of mainstream LLM tooling adoption**
- Input: subject name. Output: biographical leads, story angles, threads
  worth pursuing
- Capable, working tool
- Sunset due to creative team's preference for traditional research
  workflow ("AI slop" objection from head of research)
- Earlier pivot attempt: grass-roots football shorts content tool — not
  funded internally

**3. Film production tracking platform** — 3–4 months, direct
collaboration with CEO + Bonamy Grimes
- Goal: streamline film production process, give management visibility
  into project progress, intervene where struggles emerge
- Akds owned: database design, problem definition, early prototypes
- Killed when tech arm wound down (funding pressure + industry shift to
  YouTube/grassroots content disrupting documentary market)

### Tech stack

- **Languages:** TypeScript (full-stack)
- **Frontend:** React 17, Redux Toolkit + RTK Query, TanStack Query,
  **Material UI + styled-components + some raw CSS**
- **Backend:** Node.js, Express, MongoDB, BullMQ
- **Patterns:** Functional programming, currying-based dependency
  injection (same pattern that carries through to GrowthNation)
- **AI / LLM:** **OpenAI GPT-3.5 + GPT-4** (research assistant tool,
  ahead-of-curve adoption — CTO Ben was a bleeding-edge AI adopter
  from the moment ChatGPT dropped, ~late 2022). **Deliberately no
  vector DB / embeddings** — comp-matching for SlateIQ was a human
  task (film industry term: "comps" / "comparable titles"), so the
  team built no semantic-search layer they didn't need. Pragmatic
  call.
- **External data integrations:**
  - **IMDB GraphQL API** (data sourced through AWS-hosted pipelines)
  - **Muso** — piracy data via API
  - **Audiense / SocialBlade / DemographicsPRO** — social + audience
    data
  - **Cheerio + Puppeteer** — bespoke scraping for the rest
- **Hosting / infra:**
  - **Heroku** primary app host
  - **Google Cloud** for log storage
  - **AWS** partial (entry path for IMDB GraphQL data)
  - **Redis** (for BullMQ)
- **Auth:** **none by design** — internal-only tooling, CTO chose not
  to invest until external traction emerged. Pragmatic over-
  engineering avoidance.
- **Testing:**
  - **Jest** unit
  - **Cypress** E2E
  - **Integration tests against real OpenAI** with canned input →
    AI response → in-code grading to keep responses stable within
    tolerance bands. (Same harness pattern as GrowthNation 3 years
    later — Akds was doing it first.)
- **Monitoring:** **Sentry** for errors; **Winston** logging dumped
  into Google Cloud
- **DevOps:** GitHub Actions, CI testing

### End context

- Tech arm wound down due to company financial pressure + industry shift
- 3 months garden leave
- Started GrowthNation contract during garden leave (Jul 14, 2025)
- Clean amicable departure

### Gaps to fill (NMG)

All 8 original gaps now closed. Remaining open if/when needed:

- [ ] Exact year of research-tool launch (for the "ahead of mainstream
  LLM adoption" framing — was it 2023? early 2024?)
- [ ] Prompt-engineering framework / pattern used (any structured
  prompts framework, or raw OpenAI calls?)
- [ ] Concrete scale signals (users, queries/day, films analysed) for
  SlateIQ + research tool
- [ ] Any public-facing surface or just internal pitch deck use?

---

## GrowthNation 🟡

**Company:** GrowthNation (growthnation.ai) — stealth startup, not publicly
visible / no LinkedIn presence yet.

**Dates:** 2025 Jul 14 – 2026 Jun (end of month) — ~12 months

**Title:** Senior Software Engineer / Product Engineer

**Employment type:** Contract

**Notice:** One month, handed start of June 2026

**Team:** CTO/CEO + PM/Engineer (product-heavy, light on engineering, also
a strong designer) + Akds. Direct collaboration with leadership.

### Product evolution

- **Jul 2025 – Apr 2026** (~9 months): AI search visibility / content
  marketing — blog generation, SEO/AIO improvements
- **Apr 2026 – Jun 2026** (~3 months): Pivoted to "social proof OS for
  sales teams"

### Team (as of May 2026)

- **James** — CEO/founder (always CEO, never CTO). Impatient, evaluating
  talent deployment, focused on business impact + executive-level
  communication
- **Ben Ritchie** — CTO. Was Akds's direct manager, acted as "shield"
  from James. **Worked with Akds across three companies** (Connect4 →
  NMG → GrowthNation); mentored Akds from junior → mid → senior
- **Danny** — Started as PM, evolved into Product Engineer / Manager
  hybrid (writes code now)
- **Jelena** — Side helper, **SEO expert**; contributed mostly to the
  initial marketing product (Phase 1)
- **Kamil** ("Camille" in my earlier notes was wrong) — 17 y/o
  entry-level software developer who joined ~May 2026

### Product timeline

**Phase 1 (Jul 2025 – Apr 2026, ~9 months): AI search visibility /
content marketing**
- Generate SEO-optimised blog content, publish via WordPress
- Magic-link auth (Supabase), per-user auth (later org-level)
- Paddle payment integration (sandbox → live)
- Freemium funnel with Meta ad acquisition, mobile-first
- (Note: **Sparks are sales tokens** — case-study / customer-proof
  bundled into a coherent sales pitch document. They were not a Phase 1
  marketing artefact; they belong to Phase 2.)

**Phase 2 (Apr 2026 – Jun 2026, ~3 months): Proof engine pivot**
- Canonical tagline: **"The social proof OS for sales teams"**
- **Why the pivot happened** (verified): James (CEO) was being
  redirected back to marketers; marketing budgets were dry, blog
  generation became commoditised by AI (no moat), and James felt he
  could sell into sales teams. Pivot was a CEO call, executed mostly
  by **Ben + Danny leaning heavily on AI** to get the 80% in place.
  Akds executed Proof Store + dashboard scope inside that pivot
  rather than driving the strategy.
- Two-layer architecture written down 2026-04-27: PLG first
  (individual AE), Org/CRM second. **Reality check:** PLG is a
  long-haul motion GrowthNation isn't resourced for. James has been
  pushing sales-led acquisition instead — selling directly to teams.
- Competitor benchmark: **UserEvidence** (discovered first; closest
  competitor by category — B2B social proof) + **Mutiny** ($50M
  raised 2022, $500M valuation — closest comparable by what
  GrowthNation is trying to do)
- Background stats lifted from the pivot doc (Gartner / Forrester):
  11 stakeholders in average B2B buying committee, ½ close rate
  single- vs multi-threaded — these were *company context* used to
  frame the pivot, not Akds's personal claim
- Pricing in the pivot doc was Apollo-style tiers — not externally
  confirmed, omit from CV
- **Differentiator**: collects *consented* proof vs. generic content
- Existing assets that mapped cleanly into Phase 2: **Brand Brain**
  (org's brand understanding) + onboarding flows + content
  generation pipeline; Customer Voice scraping/extraction also
  carried over
- Core concepts:
  - **Sparks**: sales tokens / case-study + customer-proof bundled into
    a coherent sales-pitch document, tailored to a specific pipeline deal
  - **Proof Library**: case studies, customers, companies, testimonials,
    stats — unified Customer Voice section with tabbed views
  - **Vouch system**: verified customer proof collection
  - **Pipeline-deal-to-proof matching**: system matches relevant proof
    to revenue opportunities automatically

**What Akds owned in Phase 2** (confirmed verbatim in "The Core Social
Proof Engine" doc: "Aim is to build and own the customer social proof
store, build it and to fortify the assets in it")

- **Proof Library / Proof Store** end-to-end — build, fortify, and
  expose via MCP / agentic access
- **Data presentation** → the dashboard / explore tab. Real-data Proof
  Library dashboard that worked for every workspace on the platform
  (hero band with coverage %, total proof items, gaps, last
  contribution; coverage matrix per-ICP with per-pain-point bars;
  expandable rows showing underlying quotes / stats / case studies
  with source chips; "Show only consented" filter pill; live
  contributions sidebar). **CEO-demanded surface, scoped + delivered
  by Akds with AI assistance.**
- **Data ingestion** for the new sales-oriented spark: extract proof
  from URLs (public-scrape lane wired end-to-end: paste URL → extract
  → preview → save → appears in dashboard) and uploaded files of all
  sorts — docs, PDFs, text, and **screenshots/images using AI vision
  to extract quotes + testimonials**
- **Architectural unlock** — server-side auto-tagging: every new
  quote / stat / case study runs an LLM tagging pass against the
  workspace's ICPs and pain points before the save call returns; plus
  fan-out re-tag of *all* proofs when a workspace edits its ICPs or
  pain points. Made every onboarding viable from day one and kept
  libraries continuously in sync. **Honest framing:** Akds did the
  scoping, presentation layer (driven by CEO requirements), and
  architectural decisions; AI did most of the line-by-line
  implementation. The skill on display is *direction + judgement + AI
  orchestration*, not raw coding throughput.
- **Bug Triage** — AI-automated bug fixer that can see errors, propose
  root-cause analysis, and open clean fix PRs autonomously.
  **Sparked by Ben (CTO) → handed to Akds to care for and build up.**

**Not owned by Akds** (correcting earlier note): **Spark** + **Vouch**
were the other two surfaces of the proof engine. Spark = delivers
proof to a prospect (Ben's / Danny's territory); Vouch = collects
consent + approves proof from a user (Ben's / Danny's territory).
Akds's lane was the *underlying store + ingestion + presentation* that
Spark and Vouch read from.

### Org restructure (May 2026)

James pushed everyone to own a customer persona vertical. Three-way split:
- **Prospects** — people receiving sparks. Ben + Danny lobbied James
  to give Akds this ownership. James pushed back: too big a
  responsibility for Akds at that moment. Compromise: Akds stayed
  focused on **Proof Store / Proof Library** developments instead.
- **Ben → Existing Customers**
- **Danny → Reps** — onboarding, Chrome extension, holistic rep experience

Direct reporting lines opened up to James — Ben no longer the only path.
Akds put under direct James spotlight with "weeks runway, not months"
expectation. Required to "operate at executive level, communicate
business impact without technical details."

### Concrete work shipped by Akds (selected from standups)

**Aug 2025 (early)**
- WordPress integration + custom plugin (handled OAuth limitations,
  pushed articles as drafts to customer WordPress sites)
- Mailchimp newsletter integration
- Supabase auth flows
- Major PR: ~6,000 lines in 3 days with AI-assisted coding using ports
  & adapters architecture

**May 2026 (peak shipping, sampled from one End-of-Week summary)**
- **Customer Voice unified section** with tabbed views (case studies,
  customers, companies, testimonials, stats) — set up Sparks to draw
  from one library
- **Spark Edit Mode v2** — inline editing of hero headline/bullets and
  prospect-outcomes table; evidence stays read-only
- **Scalable root-cause detection in triage pipeline** — temporal
  ordering, source prioritisation (server > client), error
  fingerprinting, cascade detection. Result: triage titles point at root
  cause not downstream symptom
- **betterStack structured logs dedup fix** — empty `structuredLogs`
  was tripping early-return and neutering dedup; now fetches correctly
  or short-circuits with explicit "no logs"
- **BUG_REGISTER.md prod fetch** — `.dockerignore` was stripping it,
  cwd-relative path; now fetches from GitHub raw at runtime, fail-fast
- **Release bot PR attribution fix** — `filter-pr-commits.sh` strips
  `/merge-main` commits so release notes only credit the PR's own work
- **Image handling system** — pre-commit hook + Supabase Storage
  migration for binary images, `/image` skill + `getStaticAssetUrl()`
  helper. Stops git bloat + broken preview-branch images
- **DataForSEO locale fix** — threading project location through
  keyword research pipeline so UK/EU customers stop getting US-only data
- **Supabase signup UX fix** — `user_repeated_signup` was silent; now
  gives clear user feedback

**Jun 2026 (final stretch — Demo / YC application)**
- Demo prep for Friday conference (vouch system wiring, overview page
  redesign, feature flagging for demo vs. shipping new functionality)
- **Pain points editing** — users can edit, add their own, system
  retags automatically
- **Archive** — soft-delete for ICPs and pain points
- **Screenshot-to-proof ingestion** — Ctrl+V image/text, AI extracts
  proof from it
- **Onboarding improvements** — first-run setup reliability
- **Better proof library rows** — expandable, "why nothing was
  extracted" explanations, live progress while ingesting
- YC application resubmission (previously top 10%)

### Standout artefacts (CV-grade)

**"Proof Library — Tuesday delivery (CEO summary)"** — 2026-05-29
- Direct CEO communication: "For: James · From: Arkadiusz"
- Recorded a **Fathom walkthrough video** alongside the written doc
- Explicit V1 discipline section ("Explicitly NOT for Tuesday") —
  shipped a real-data Proof Library dashboard behind a PostHog flag
  for every workspace, deferred 8 named items to follow-ups
- Architectural unlock written in a way a CEO can evaluate
- Pattern worth keeping: every major delivery had a written CEO
  summary. **Built with AI assistance + careful work walking through
  hallucinations** — the skill is being trustworthy as the human in
  the loop, not raw writing.

**Ben coaching distillation** — captured in own notes (optional, use
for "what's the most valuable thing a mentor taught you" interview
question, or as a sidebar quote in the portfolio)
- > "you're allowed to have a conversation with uncertainty as an
  engineer but you're not allowed to dress uncertainty as certainty"

**AppError self-critique** — 2025-12-12 sync with Ben
- Akds built a custom error-handling layer that *would have worked*
  but was implemented badly: enforced across the entire app instead
  of being opt-in only. Real bug, real fix, real lesson.
- Notes contain the receipt: "I didn't do a good system design
  session… I should have consulted this with you before trying to
  'fix' this on my own"
- Useful for the "tell me about a time you failed and learned"
  interview answer. The fix was the hybrid approach + custom lint
  rule `no-catch-without-throw` to prevent regressions.

### Architectural patterns / signals across the year

- AI-assisted coding adopted aggressively across the team (CTO, Akds,
  Danny all coding with Claude Code)
- Custom **`.claude/` skills** layer — release, plan, interview, weekly
  briefing, deal-room prep, `/image`, etc.
- Honest tradeoff captured in own notes: "AI requires constant guidance
  but still faster than manual coding" + "Challenge: letting go of 100%
  control for ~90% accuracy" + accumulating tech debt at speed
- **Triage pipeline** with fingerprinting, dedup, cascade detection,
  cross-references prod `BUG_REGISTER.md`
- Defensive multi-layer fixes (e.g., proof-library empty cards: one-shot
  migration + DB CHECK + `listVoices` filter + `findOrCreateVoice`
  fail-fast)
- Ports & adapters architecture (from Aug 2025)

### Customers + traction signals

- Real paying customers, including **non-US** (UK customer bhoday.co.uk
  surfaced via DataForSEO locale issue)
- YC application previously top 10%
- Demo at conference scheduled June 2026
- James actively in sales calls (video recordings reviewed by team)

### End-of-contract narrative (private, for cover letters / interviews)

- 12-month contract was time-bound from the start (Jul 14 2025 –
  Jun 30 2026)
- One month early notice in early June 2026
- Driver: **business funding/traction pressure**, not performance —
  Camille joining as alternative resource, James "constantly evaluating
  talent deployment and budget", company "lacking traction and funding"
- Clean recruiter framing: "12-month contract concluded; company was
  pre-traction and reduced engineering spend during their founding pivot
  to social proof OS"

### Tech stack (comprehensive — captured wide)

**Frontend:**
- React 18 + TypeScript 5.7 + Vite (monorepo workspace)
- Tailwind CSS with CVA (class-variance-authority) + cn() / tailwind-merge
- Radix UI primitives, Lucide icons, Framer Motion, Lottie, Embla Carousel
- TipTap WYSIWYG editor (markdown, tables, images, link, color)
- Zustand (client state) + TanStack React Query (server state)
- React Router 7
- Recharts (data viz), Three.js + @react-three/fiber + drei (3D)
- Vercel AI SDK (`ai`, `@ai-sdk/react`) + `@assistant-ui/react` for streaming
  agent chat
- @dnd-kit (drag/drop), @floating-ui, react-day-picker, DOMPurify
- @elevenlabs/react (voice agents), @paddle/paddle-js (billing)

**Backend:**
- Node.js 22 + Express 5 + TypeScript (built with tsup)
- Supabase (Postgres, Auth, Storage, Realtime, Edge Functions) —
  @supabase/supabase-js
- Drizzle ORM + drizzle-zod for schema/types
- BullMQ + ioredis + Bull Board for distributed jobs / scheduled work
- Puppeteer, Cheerio, Sharp, Satori + @resvg/resvg-js, pdf-parse, mammoth,
  ffmpeg-static
- Winston + @logtail/winston logging
- helmet, express-rate-limit, multer, nodemailer, ws
- Zod everywhere for validation + LLM tool schemas

**AI / LLM:**
- Vercel AI SDK as abstraction layer (streaming, tool calling, structured
  output)
- Providers: OpenAI, Anthropic Claude, OpenRouter, DeepSeek
- Langfuse tracing (+ OpenTelemetry SDK), @posthog/ai for LLM analytics,
  internal cost-tracking wrapper
- Firecrawl (LLM-augmented web scraping)
- DataForSEO (SEO/keyword research)
- ElevenLabs (voice agents for "proof interviews" + isolation/TTS)

**Database & storage:**
- PostgreSQL via Supabase (managed)
- SQL migrations (`supabase/migrations/`) + `seed.sql` for preview branches
- Supabase Storage buckets (static assets + user content split)
- Supabase Realtime broadcast channels (invalidation-only payloads)
- Upstash Redis (BullMQ + caching)

**Third-party integrations:**
- HubSpot CRM (`@hubspot/api-client`)
- Paddle (subscriptions + webhooks)
- Webflow API (CMS publishing)
- Notion API (internal knowledge base + ticket sync)
- Slack (bot triage + team notifications)
- PostHog (product analytics + feature flags)
- Better Stack / Logtail (remote logs)
- Sentry (errors + perf, typed wrapper with severity discriminated union)
- Google Search Console, Meta Pixel, GA4
- Cloudflare Turnstile (bot detection)
- Tremendous (gift card payouts)

**Infrastructure & DevOps:**
- Fly.io (Docker-based deploy on push to main, blue-green)
- Docker multi-stage build (Node 22 + Chromium for Puppeteer)
- GitHub Actions — unit/int CI, Cypress matrix, agent/LLM tests,
  preview-branch Fly apps, scheduled crons, Claude-Code review workflow
- Supabase preview branches per PR (auto-seeded)

**Testing:**
- Vitest (unit + integration with real Postgres + real LLM calls)
- Supertest for HTTP routes (imported app, no running server)
- Cypress + cypress-real-events + cypress-terminal-report (full E2E matrix
  in CI)
- Playwright (selective)
- Happy DOM / JSDOM, @testing-library/react

**Build, tooling & quality:**
- ESLint 9 (typescript-eslint, react, react-hooks, import) + custom
  in-repo rules:
  - `local/no-swallowed-exception`
  - `local/no-unsatisfied-json-response`
  - `local/no-direct-sentry-capture`
  - `local/no-client-postgrest`
- Prettier, Husky + simple-git-hooks, lint-staged, Knip
- Storybook (+ in-app component catalogue)
- ts-morph + zod-to-json-schema for code generation
- Model Context Protocol (MCP) SDK — custom MCP servers as workspace
- Chrome extension workspace (CRXJS + Vite)

**Architectural patterns:**
- Monorepo workspaces: `client`, `server`, `shared`, `mcp-server`, `extension`
- Shared wire contracts: `shared/*Types.ts` —
  `res.json({...} satisfies XResponse)` server-side,
  `api.post<XResponseData>(...)` client-side
- Currying-style DI: `(deps) => (args) => result` — no DI container,
  no class mocking
- "Agent skills produce data" pattern: skills write structured data via
  tool calls; UI renders from Supabase, not raw stream text
- BullMQ job pipeline with automatic stalled-job recovery via
  `lockDuration`
- Typed Sentry capture wrapper: discriminated `SentryImpact` union,
  compile-time exhaustiveness check
- Pay-on-success cost model with per-operation cost tracking
- TDD + integration tests against real Postgres + real LLMs
- `.claude/` skills + slash commands — substantial internal agent tooling
  layer (release, plan, interview, weekly briefing, deal-room prep, etc.)

### Notion read log

Pages fully fetched (✅ = read, content extracted into this doc):

| Date | Page | Why |
|---|---|---|
| — | 👷🏻 Work (schema only) | Workspace orientation |
| 2025-08-04 | ✅ Standup notes (earliest) | WordPress integration era |
| 2025-12-12 | ✅ Sync with Ben 12th Dec | Phase 1 mid-period, AppError self-critique |
| 2026-04-27 | ✅ Product Vision: Sales Proof Engine | The pivot doc itself |
| 2026-05-02 | ✅ The Core Social Proof Engine | Akds ownership of Proof Store confirmed |
| 2026-05-22 | ✅ End of Week summary | PR list / shipped work |
| 2026-05-29 | ✅ Proof Library — Tuesday delivery (CEO summary) | CV-grade artefact |
| 2026-05-30 | ✅ 1:1 with Ben | Org restructure context |
| 2026-06-08 | ✅ Standup (most recent) | Final state, demo prep |
| — | ✅ Akds:Ben Notes (index) | Lists all 1:1 / sync pages |

Pages discovered but NOT yet read (candidates if more depth needed):

- 2025-12-15 Standup notes — only Dec standup
- 2026-01-12 Sync with Ben — early-year tone
- 2026-01-13 1:1 Chat
- 2026-01-23 Sync with Ben — used "data pipelines vs workflows"
- 2026-01-27 Sync with Ben 29th Jan
- 2026-02-09 Next sync with Ben — WordPress + Jetpack
- 2026-02-16 Ben:Akds 16th Feb
- 2026-02-24 Create Missing Social Proof — *pre-pivot* social-proof
  thinking, possibly the origin moment
- 2026-03-02 1:1 with Ben - March 2nd
- 2026-04-20 Auto Publish follow up after monday test
- 2026-04-21 Social Proof Score: Design & Calculation
- 2026-04-30 The social proof agentic future
- 2026-05-17 GrowthNation Social Proof Playbook
- 2026-05-18 GrowthNation (root product doc)
- 2026-05-19 Consolidate proof pages into single "Proof library" page
- 2026-05-28 Proof Store dashboard mock — spike for June 10 demo
- 2026-05-29 Proof library — design alignment
- 2026-05-29 Watch Sentry GROWTHNATION-BBW for 48h post-PR #1484
- 2026-06-01 Investigate why GROWTHNATION-BBW was only a Sentry warning
- 2026-06-01 Sentry alert rule
- 2026-06-02 Skill: ticket-creation default-assign to invoker
- 2026-06-02 Proof Library V2 — C1 (remove dev mocks)
- 2026-06-02 Proof Library V2 — B1+A6 (consent default bug + 3-tier)
- 2026-06-02 Verify prod proof-library coverage ≥ 60% after PR #1573
- 2026-06-02 🧹 Shorten proof_library_quotes HubSpot label
- 2026-06-03 GrowthNation LinkedIn extension
- 2026-06-03 Proof Library Explore tab — retrieval surface
- 2026-06-03 Vouch Phase 2 — proof requests + tiered incentive
- 2026-06-04 UAT: Proof Library Explore PostHog events (PR #1624)
- 2026-06-05 Negative control — non-growthnation viewer (PR #1641)
- 2026-06-05 Proof Library V2 — deferred + V1 findings
- 2026-06-08 growthnation.ai (root product doc, updated)

### Gaps to fill (GrowthNation)

- [ ] Full project list (post-Notion crawl)
- [ ] Scope split: what Akds owned vs. team
- [ ] Customer-facing exposure
- [ ] PR / code review culture
- [ ] Scale: users, revenue, LLM volume, jobs/day, etc.
- [ ] Pivot involvement: strategic input or execution-only?
- [ ] Social proof OS — did it ship? Any customers?
- [ ] Chrome extension purpose
- [ ] MCP servers — what do they expose, for whom?
- [ ] Internal Claude tooling productivity impact (measurable?)
- [ ] Voice agent / proof interview details
- [ ] End-of-contract context (funding? strategic? mutual?)
- [ ] Proudest wins
- [ ] Lessons learned

---

## Connect4 ✅

**Dates:** 2020 Nov – 2022 Mar (~16 months)

**Title:** Software Engineer (effectively junior on entry, mid-level by
the end — Connect4 used a single flat title)

**Location:** Fully remote (pandemic). **First of three companies with
Ben Ritchie** — where Ben first mentored Akds.

**Product:**
B2B SaaS for productivity around online meetings. Pandemic-era product:
"remote working tools were shit — no meeting notes, no agendas, no
meeting planning, no structured note taking." Connect4 built a
multi-person meeting platform with agendas, structured notes, planning,
and meeting history. (Product no longer live — platform is down.)

**Tech stack:**
- **Meteor.js** with **Blaze** front-end being **ported to React** —
  Akds's primary role
- WebSockets behind the scenes; reactive DB subscriptions; one-way
  data flow from DB → backend → frontend → React, with FE kept as
  "dumb" as possible

**Key learnings (worth name-dropping in interviews):**
- Reactivity + DB-driven background refresh patterns
- Importance of **unidirectional data flow** — internalised early
- Migrating a working frontend stack (Blaze → React) without breaking
  production

**Shipped (concrete):**
- **Agenda creation with drag-and-drop**
- **Templates for recurring meetings**

---

## Wutzu Technologies ✅ (merged single entry)

**Dates:** 2020 May – 2020 Nov (~7 months total, Intern → Junior JS
Developer)

**Title:** Software Developer — Intern (May–Jul) → JavaScript Developer
(Jul–Nov)

**Product:**
"Deliveroo for small independent London shops." The thesis: Deliveroo
only served restaurants, leaving small independent shops across diverse
cuisines (African, Turkish, Polish, etc.) without a delivery platform.
Wutzu aimed to fill that gap.

**Akds's role:**
Very junior JavaScript developer. Worked on **order / basket creation
and external payment integration via API**.

**Why left:**
Role was not full-time and the investor was unstable. Moved on to
Connect4.

**Framing notes (for CV):**
- The intern → developer progression in 7 months is a clean micro-story
  of "got hired, got promoted, kept going"
- Skip detailed feature list — too long ago, too junior to claim
  detailed ownership credibly

---

## Freelance / Self-employed (2018–2019) ✅ (recommend condense, not cut)

**User's preference:** drop.

**My counter-recommendation:** **don't drop entirely — relocate** to a
condensed "Community + early work" line under the Education section,
*not* as a standalone job entry.

**Why not cut entirely:**
- It dates your career start at **2018, not 2020** — that's a 2-year
  longer "years of experience" number on LinkedIn and recruiter
  filters, for free
- LJC mentee → mentor arc is a community / leadership signal that's
  hard to fake
- A 6-month gap between graduation (2019) and first job (May 2020)
  reads more cleanly if filled with "freelance + community"

**Why not keep as a full job entry:**
- 8 years ago, pre-career-pivot, very little technical relevance
- Recruiter eyes don't go past the top 3 jobs anyway
- Risks signalling you're padding the CV

**What I'd condense it to (one-line bio fragment):**
> 2018–2019: Built websites for **London Java Community** and **Meet
> a Mentor**, took a few paid freelance projects, mentored junior
> devs into their first roles.

**Final call is yours** — I'll leave it as a sidebar item by default
and you can decide at render time.

**Details captured for future use:**
- LJC = London Java Community. Akds learned Java early in their
  programming journey but couldn't break in (corporate Java roles
  required CS degrees + new-grad pipelines). Stayed connected as a
  mentee, became a mentor.
- Meet a Mentor — similar community arc; Akds built their website.
- A few paid client projects in parallel.
- Tech was "pure trifecta of web dev" — HTML/CSS/JS.

---

## Top section / Bio copy ✅

### Hero strip (home page) — chosen: Option B

> # Arkadiusz Ostrowski
> ### I build production AI-native software end-to-end.
>
> London-based. TypeScript, React, Node, Postgres, BullMQ, Vercel AI
> SDK. Currently wrapping up a 12-month contract at a stealth sales-AI
> startup — owned the proof-library product end-to-end, shipped
> server-side LLM tagging architecture, and wrote CEO-facing delivery
> summaries.
>
> Previously: three years at a documentary studio shipping AI-assisted
> research tools on GPT-3.5/4 in 2023, before "AI-assisted coding"
> was a phrase.
>
> Open to senior / staff / founding-engineer roles.

### About / long-form — chosen: Option A

> # Arkadiusz Ostrowski
> ### Software Engineer · Full-Stack · TypeScript · React · Node
>
> Based in London. Six years building production software, most
> recently shipping a social-proof OS for sales teams at GrowthNation
> and an AI research platform at Noah Media Group.
>
> Comfortable across the stack — TypeScript end-to-end, React/Next on
> the front, Node + Postgres + BullMQ + multi-provider LLM on the
> back. Two-year track record of shipping AI-assisted features in
> production, from a 2023 research tool built on GPT-3.5/4 to a 2026
> proof engine built with the Vercel AI SDK, Anthropic, OpenAI,
> OpenRouter, and a custom MCP server layer.
>
> Career-changer — worked in sales for ten years across Poland and
> the UK before self-teaching into software via OpenClassrooms and
> the London Java Community. Junior in 2020, mid in 2022,
> senior/lead by 2025.
>
> Available for senior / staff / founding-engineer roles. London-based,
> hybrid or remote.

**Notes for whoever renders this:**
- The two stacks should stay aligned on tone — hero is the punchier
  cut, About is the fuller version. Don't repeat both verbatim on the
  same page.
- "12-month contract at a stealth sales-AI startup" is the **public
  framing** for GrowthNation until the company is publicly visible.
  We can name it on the dedicated work page where there's more
  context. Keep the company unnamed in the hero strip.
- The "ten years in sales" line in About is the career-changer arc —
  it should appear once and only once.

---

## Portfolio entries — philosophy ✅

User's call (verbatim spirit):
> "I sense listing projects involved with, no code, just what was the
> core technology, focus is enough to just keep them in conversation
> and then the actual sales job happens during the interviews… they
> won't care if you shared some code or not."

Translation to structure:

**Each portfolio entry is a small card, not a case study.** Four
fields, max:
1. **Project name** + 1-line description
2. **Role / contribution** — what *you* did (1 line)
3. **Core stack chips** — 3–5 tags, not 15
4. **Outcome / focus** — 1 line of what was shipped or learned

No screenshots required (though hero image OK if it exists). No code
links. No long case-study writeups. **Total time on each card by a
recruiter: ~8 seconds.** That's the design target.

**Why this works at senior+ level:**
- Recruiters scan, they don't read
- "Show me code" filters are junior interviews
- The interview itself is where trust is built; the portfolio just
  has to earn the interview
- Stealth / NDA'd work (GrowthNation) can still appear with a
  generic-enough description — no logos, no screenshots needed

**Constraint:** GrowthNation is stealth, no public visibility, no
logo, no screenshots. Phrase any GrowthNation card as "Stealth
sales-AI startup" with no naming.

---

### Final portfolio set (5 visible + earlier work toggle)

**Visible by default — recruiter scan layer:**

**1. Proof Library — stealth sales-AI startup**
*Role:* Owned the proof store end-to-end — dashboard, ingestion,
server-side LLM tagging, CEO-facing delivery summaries. Also shipped
an autonomous AI bug-triage system that opens fix PRs on its own.
*Stack:* TypeScript · React · Supabase · Vercel AI SDK · MCP
*Focus:* AI-native product development with architectural decisions
driven by CEO-level requirements.

**2. SlateIQ — Noah Media Group**
*Role:* Built the film-success prediction tool. Combined IMDB, social,
piracy, and market data into a comp-matching workflow.
*Stack:* TypeScript · React · Node · MongoDB · BullMQ · OpenAI
*Focus:* 5+ third-party data integrations; pragmatic decision to keep
comp-matching human-driven rather than over-engineer ML.

**3. AI-powered research assistant — Noah Media Group**
*Role:* Designed and shipped a documentary-research tool built on
GPT-3.5/4 in 2023, ahead of mainstream LLM tooling adoption.
*Stack:* TypeScript · React · Node · OpenAI · Cheerio · Puppeteer
*Focus:* Early-adopter AI productisation; integration tests running
live LLM calls with graded responses, years before this became
standard practice.

**4. Routes Wallet — self-initiated mobile app (iOS)**
*Role:* Solo-built and shipped a React Native iOS app to test
market demand for a universal cycling-route wallet — a single home
for routes scattered across Garmin, Strava, Komoot, Ride with GPS,
and the inevitable Google Docs cycling clubs end up maintaining.
*Stack:* React Native · iOS · TypeScript
*Focus:* End-to-end product judgement — built, ran a real market
test with a target user base (a London cycling club), got honest
"we already have three apps, no appetite for a fourth" signal, and
**killed the project rather than push past the data**. Open-sourcing
remains a future option.

**5. Film production tracking platform — Noah Media Group**
*Role:* Direct collaboration with the CEO and Skyscanner co-founder
Bonamy Grimes. Owned database design + early prototypes giving
leadership visibility into production progress.
*Stack:* TypeScript · React · Node · MongoDB
*Focus:* Stakeholder-facing product work + executive collaboration.

---

**"Earlier work" — collapsed by default:**

**6. Meeting productivity platform — Connect4**
*Role:* Ported the Blaze front-end to React; shipped agenda
drag-and-drop and recurring meeting templates.
*Stack:* React · Meteor.js · WebSockets
*Focus:* Reactive DB-driven architectures; unidirectional data flow.

**7. Stores panel — Wutzu Technologies**
*Role:* Refactored the MVP codebase; shipped the first production
stores panel — "still in use in some areas to this day"
(Hevar Abrihem, 2021).
*Stack:* JavaScript · Node · Payments API
*Focus:* First production refactor at scale; junior → mid arc.

---

### Decisions locked in

- **5 visible cards** in scan order: Proof Library → SlateIQ → AI
  Research → Routes Wallet → Film Production. **2 collapsed** under
  "earlier work" (Connect4 + Wutzu).
- **Routes Wallet sits at #4** — a *killed* side-project is a
  staff-level signal when framed honestly. Don't bury it; lead with
  it after the AI-heavy professional work.
- **Bug Triage folded into Proof Library card** — one stealth-NDA
  description, two impressive surfaces inside it. Avoids stretching
  the GrowthNation framing across two cards.
- **No screenshots required, no code links, no long writeups.** Cards
  fit the 8-second scan target.
- **Stealth/NDA work** described generically ("stealth sales-AI
  startup") — no name, no logo. The dedicated work page can name
  GrowthNation with more context once the company is publicly
  visible (or if asked under NDA-respecting framing).

---

## Skills section (DRAFT) — proposed structure ✅

Replaces the current `data/database.ts` skills array with the
percentage bars. Categorised, no levels, recruiter-scannable, ordered
by "most current / strategic" first.

### Languages
TypeScript · JavaScript · SQL · Java (early-career)

### Frontend
React · Next.js · Tailwind CSS · Radix UI · shadcn/ui · TanStack Query
· Zustand · Redux Toolkit + RTK Query · Vite · React Router · TipTap ·
Framer Motion · Recharts · Three.js (R3F + drei)

### Backend
Node.js · Express · BullMQ · Redis · WebSockets · Drizzle ORM · Zod ·
Puppeteer · Cheerio · Sharp · ffmpeg

### AI / LLM
Vercel AI SDK · OpenAI · Anthropic Claude · OpenRouter · DeepSeek ·
Langfuse · Model Context Protocol (custom MCP servers) ·
LLM-in-the-loop integration testing · Firecrawl · ElevenLabs ·
AI-assisted product development

### Databases & Data
PostgreSQL · Supabase (Postgres, Auth, Storage, Realtime, Edge
Functions) · MongoDB · Upstash Redis · pgvector-ready architectures

### Infrastructure & DevOps
Vercel · Fly.io · Heroku · AWS · Google Cloud · Docker · GitHub
Actions · Supabase preview branches · Blue-green deploys · Cron /
scheduled jobs · Slack/PostHog/Sentry alerting

### Testing & Quality
Vitest · Jest · Cypress · Playwright · Supertest · Testing Library ·
Integration tests against live LLMs with graded responses · ESLint
(custom in-repo rules) · Prettier · Husky · lint-staged · Knip ·
Storybook

### Observability & Product Analytics
Sentry (typed wrapper with discriminated severity unions) ·
Better Stack / Logtail · Winston · PostHog · GA4 · Meta Pixel ·
Google Search Console

### Practices & patterns
Functional programming · currying-based dependency injection ·
ports-and-adapters · TDD · "agent skills produce data" pattern ·
pay-on-success cost tracking · CEO-level written delivery summaries ·
AI-assisted coding with human-in-the-loop quality gates ·
"don't dress uncertainty as certainty"

### Integrations shipped against
HubSpot · Paddle · Webflow · Notion · Slack · WordPress (custom
plugin) · Mailchimp · DataForSEO · IMDB GraphQL · Muso · Audiense ·
SocialBlade · Cloudflare Turnstile · Tremendous

---

**Decisions encoded in the above:**
1. **No percentages, no levels, no stars.** That format reads as
   junior portfolio.
2. **Modern stack leads.** TypeScript/React/AI come before legacy
   (jQuery, Bootstrap, Photoshop — all dropped from LinkedIn list).
3. **"Practices & patterns" exists deliberately.** This is the
   staff-level differentiator — anyone can list TypeScript; not
   everyone can list "currying-based DI" and "agent skills produce
   data" with three years of receipts.
4. **"Integrations shipped against" is the brag wall.** Recruiters
   skim it as breadth; interviewers can drill into any one of them.
5. **Java listed but tagged "early-career"** — honest, doesn't claim
   current Java skills, but preserves the OCA Java SE 8 cert
   narrative.
6. **MongoDB stays** but is positioned after Postgres + Supabase —
   honest current emphasis.
7. **LLM-in-the-loop integration testing called out twice** (under
   AI/LLM *and* Testing & Quality) because it's the same pattern
   shipped at two shops, three years apart. Worth the repetition.

**Open question:** keep the "Integrations shipped against" section
as a 10th category, or fold it into the work-history bullets per
role? My instinct says keep it as a section — recruiter eyes catch
named brands faster than they read prose.

---

## Education ✅

**OpenClassrooms** — Bachelor's degree, Software Developer (2019–2020)
> Developed skills in JavaScript, REST API, OO Programming, React.js,
> jQuery, MySQL, Bootstrap 4, CSS3, HTML5, Software testing with
> Jasmine, Git & GitHub.

**uCertify.com** — Software Development Specialization (2018–2019)
> Self-study certification track. Covered the OCA Java SE 8 Programmer I
> (1Z0-808) and MTA Software Development Fundamentals (98-361).

**Recommendation:** lead with OpenClassrooms Bachelor's. Mention
uCertify only if space allows — it reads as "self-taught preparation"
which is the right framing for a career-changer.

---

## Licenses & Certifications ✅

**Keep prominent:**
- **Cloud Digital Leader** — Google · Feb 2023 (expires Feb 2026).
  Recent + cloud-relevant. Pin this.

**Keep optional / for completeness only:**
- **Oracle Certified Associate Java SE 8 Programmer I** — Oracle ·
  May 2018. Old, but evidence of the self-taught grind period.
- **MTA: Software Development Fundamentals (98-361)** — Microsoft ·
  Aug 2017. **Microsoft retired the MTA track in 2022** — only useful
  as a "started the journey here" signal, not as a current credential.
  Probably drop from portfolio; keep on LinkedIn.

---

## Pre-dev work history (do NOT put on portfolio)

These exist on LinkedIn and stay there. Listed here only so we don't
re-discover them later and panic.

| Period | Role | Company |
|---|---|---|
| Dec 2007 – Dec 2009 | Warehouse & Logistics Admin | Volvo Maszyny Budowlane Polska |
| Jan 2010 – Jul 2012 | Sales Representative | ING |
| Oct 2013 – Jul 2018 | Sales & Corporate Events Coordinator | The Book People Ltd |

**Career-changer narrative:** ~10 years across logistics + sales
(Poland → UK), then self-taught into software via uCertify (2017–18) +
OpenClassrooms (2019–20) + LJC community, broke in via freelance 2018,
first full-time dev role May 2020 (Wutzu), staff-level by 2026.

---

## Recommendations / Testimonials (from LinkedIn) ✅

All six are CV-grade. Listed in order of strategic value:

**1. Ben Ritchie** — Hands-on CTO · GenAI/ML Product Specialist
*Feb 18, 2022 — managed Arkadiusz directly (NMG)*
> "Arkadiusz is a strong self-starter who is diligent and righteous
> when it comes to building product, but measured and pragmatic about
> delivery so doesn't allow himself to get pulled into over-engineering.
> He is an excellent team-member capable of learning quickly and
> mentoring those around him. His focus and selfless drive mean I
> would happily recommend or work with him again."

→ **Headline testimonial.** Use as the lead quote.

**2. Martijn Verburg** — Principal Engineering Group Manager (Java,
Golang & Python) at Microsoft · ex-CEO at jClarity (acquired by
Microsoft)
*Nov 7, 2017 — managed Arkadiusz directly*
> "Arkadiusz was amazing to work with, our community liked Arkadiusz's
> work so much that our hosting bandwidth needed to be readjusted to
> traffic demand twice the following day!"

→ **Massive social proof.** Martijn is a UK Java community legend
(former London JUG leader, jClarity → Microsoft acquisition).

**3. Hevar Abrihem** — Product & Growth Operator (Wutzu colleague)
*Apr 28, 2021 — same team at Wutzu*
> "Arkadiusz's efforts at Wutzu were crucial to the first deployment
> of our new stores panel. Given the heavy task of unwinding the Wutzu
> codebase and refactoring the MVP, Arkadiusz stepped up to the
> challenge and handed back a well-documented & efficient application
> that is still in use in some areas to this day."

→ **Validates Wutzu output** — exactly what we needed to legitimise
the short tenure. Now we can say "shipped the new stores panel,
refactored the MVP" with a third-party receipt.

**4. Simon Maple** — Head of Developer Relations at Tessl
*Nov 14, 2017 — Simon was Arkadiusz's client (LJC Unconference website)*
> "Arkadiusz worked very well in a team to gather requirements very
> accurately and turn them into visual results with a very fast
> turnaround. Arkadiusz is someone who gets the job done."

→ Named industry figure (Snyk, Tessl); validates the freelance era.

**5. Barry Cranford** — Founder of RecWorks (Tech Talent Agency,
London)
*Nov 7, 2017 — Barry was Arkadiusz's client*
> "Arkadiusz was a pleasure to work with on our latest web project.
> He instantly had an appreciation for what we wanted to achieve…
> took initiative too… he wouldn't say no or find alternative
> solutions, instead he took the time to research what would be
> necessary to give us what we wanted."

→ **Recruiter-targeted social proof** — Barry literally runs a London
tech recruitment agency. Useful when applying via agency channels.

**6. David McLeary** — Group IT Development Manager at Greencore
*Jul 22, 2021 — worked on the same team at Connect4*
> "Developing good code is a mix of diligence, understanding the use
> case and good communication. In working with Arkadiusz I was able
> to see that he excels in each of these areas. He is able to work
> very well with a team, collaboratively and productively arguing a
> point when needed."

→ **Context (now confirmed):** David was a contractor at Connect4 who
prototyped the project Akds later took over. Once Ben joined as
full-time CTO, Akds + Ben continued building David's prototype into a
production product. "Greencore" in his title is David's later
employer, not a Connect4 reference. Recommendation is valid; light
context line in the testimonial may help: "*David — predecessor on the
Connect4 project I took over.*"

---

## LinkedIn skills snapshot

Raw list captured for reference (mix of current + legacy). Will be
consolidated in the skills restructure step:

JavaScript · TypeScript · React.js · CSS3 · Front-end Development ·
Responsive Web Design · HTML5 · HTML · CSS · SASS · Bootstrap ·
MySQL · MongoDB · Git · GitHub · JSON · Webpack · Meteor.js · Java ·
Java SE 8 · OOP · Cloud Computing · Adobe Photoshop · Java Application
Development · Core programming · SDLC · Software Development

**Note for the skills restructure step:** the LinkedIn list is *stale*
and skewed toward 2018-2020 self-taught keywords. Our captured 2022-2026
stack (TypeScript, Next.js, Supabase, Drizzle, BullMQ, Vercel AI SDK,
multi-provider LLM, Tailwind, etc.) is the source of truth — LinkedIn
is the floor, not the ceiling.

---

## Cross-cutting work to do

- ✅ Skills section restructure drafted (9 categories, no percentages)
- ✅ Portfolio entries finalised — 5 visible + 2 collapsed earlier
  work
- ✅ Bio / About copy drafted (Options A + B chosen)
- ✅ Contact email — `hire-arkadiusz@pm.me` for **the website**
  (public-facing, throw-away-able). `arkadiusz.ostrowski@protonmail.com`
  for **the CV / direct outreach** (keep off the public site).
- ✅ Education + certifications (captured from LinkedIn)
- ✅ `services` — **DROP.** Akds doesn't want to offer services
  proactively; inbound asks handled via contact email.
- ✅ `blogs` — **DROP.** No time to write, and recruiters don't
  read them at hiring time anyway. Add later if/when there's a real
  post to publish.
- ✅ Testimonials — 6 captured from LinkedIn (Ben, Martijn, Hevar,
  Simon, Barry, David). David needs Greencore-context clarification.

---

## Strategic observations (for the user)

1. **You should target Staff Engineer / Founding Engineer roles**, not
   just Senior. GrowthNation surface area supports it: MCP servers,
   internal Claude tooling, custom ESLint rules, multi-provider LLM
   abstraction with cost tracking, real LLM CI tests, typed Sentry
   discriminated unions. This is staff-level engineering.

2. **The "before LLMs were mainstream" framing for NMG's research tool**
   is strong recruiter signal. Pin a year (when did you build it?) and
   foreground it.

3. **Capture a brag-doc as you go.** Critical lesson — the gaps in NMG
   are because nothing was captured at the time. Start one for the rest
   of GrowthNation before the contract ends.

4. **Honest framing wins.** The "Lead Product Engineer for 5 months
   under restructuring" arc is more compelling honestly told than dressed
   up. Don't over-claim, don't under-claim.
