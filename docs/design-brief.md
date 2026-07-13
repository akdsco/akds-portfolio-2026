# Design brief — akds portfolio (portable kickoff for a Claude design session)

This is a self-contained brief. Paste it into a fresh Claude session and ask for
an **Artifact**. It has everything the design needs: direction, references,
constraints, and real content. No repo access required.

---

## The one-line ask

Design the **case-study detail page** for a senior/staff software engineer's
portfolio, in a **"tasteful dev-coded"** style, as a self-contained responsive
HTML artifact that works in both light and dark. Use the real content embedded
below. Give me **two directional variations** so I can compare.

Design this one screen fully and deeply rather than sketching the whole site.
It is the highest-signal, hardest surface; once its look and its component
system are right, everything else inherits from it.

---

## Who this is for

- **Owner:** Arkadiusz ("akds"), London-based software engineer, ~6 years,
  targeting senior / staff / founding-engineer roles.
- **Audience:** technical recruiters and hiring managers who scan fast. They
  land already knowing roughly who he is; the site earns the interview, it does
  not do lead-gen.
- **Tone of the person:** dense, specific, no fluff. Ships real things, cares
  about craft. Not a security specialist, not a "hacker."

## Visual direction: "tasteful dev-coded"

Dark-first, engineer-with-taste. The vibe is "this person builds real software
and sweats the details," not costume.

**Do:**
- Dark-first palette (design dark as the primary, then a real light mode too).
- One signal accent color, used sparingly.
- Monospace as an **accent** type only (labels, metadata, section numbers, stack
  chips, breadcrumbs), never for body copy.
- Code-block / terminal-adjacent cues used with restraint: a `~/work/proof-library`
  style breadcrumb, mono section numbers, a subtle prompt glyph. Suggestion, not theme-park.
- Generous, confident typographic hierarchy. Real information density handled gracefully.
- Precise spacing and alignment. The craft signal lives in the details.

**Don't (anti-patterns that read as cosplay):**
- Matrix rain, falling code, neon-green-on-black, glitch effects, "[ACCESS GRANTED]"
  copy, a fake terminal that types out the bio. All too much.
- Monospace body text. Heavy animation. Skull/biohazard iconography.
- Generic startup-landing gradients and blob shapes.

**Guardrail:** if it would be embarrassing to demo to a senior engineer over Zoom,
it is too much. A small mono breadcrumb, a section number, a subtle scanline on a
hero: fine. "I am the network" energy: no.

**Reference sites (study the restraint, not any one look):**
brian.lovin.com, leerob.com, rauchg.com, maxleiter.com (closest to dev-coded),
mxstbr.com. Darker end: unkey.dev, resend.com, railway.app. For how mono is used
as accent: linear.app, vercel.com.

## Hard constraints

- **Light and dark both first-class.** The viewer's theme decides; design both.
- **No contact form, no mailto.** Contact is GitHub + LinkedIn icons only. Do not
  add a contact section, email field, or "get in touch" CTA.
- **Implementation target (design to be portable to it):** Next.js + Tailwind CSS
  v4 + shadcn/ui (Base UI). Keep it implementable in plain CSS/Tailwind. Use
  web-safe or Google-available fonts. Current baseline fonts are **Geist** (sans)
  and **Geist Mono** — feel free to propose alternatives, but keep them freely web-available.
- **Annotate the system** so it ports into Tailwind tokens: name the type scale,
  the color tokens (as hex or oklch), spacing rhythm, and radii. This matters more
  than pixel perfection.

## The anchor screen: case-study detail (`/work/[slug]`)

Design the page for the real case study below. It must gracefully render every
element present here. Components this screen establishes (and the rest of the site reuses):

- **Breadcrumb / back-to-work** affordance (dev-coded cue lives well here)
- **Page title** (project name)
- **Hook** — the one lede line under the title; largest non-title text; its job is
  to pull the reader in
- **Meta row** — company, role, period, stack chips (mono accent candidate)
- **Section blocks** — Problem, Constraints, Approach, Contribution, Outcome,
  Reflection. Body is multi-paragraph prose. Design the section heading treatment
  (mono section numbers? kicker labels?) and comfortable reading measure.
- **Stack chips** — small tag pills, 6 here but up to ~27 on other projects, so
  the treatment must survive wrapping to several rows.
- **Inline testimonial** — an optional pulled quote with author + designation.

### Real content for the anchor screen

> **Project:** Proof Library
>
> **Hook:** Owned the proof store behind a sales-AI product: ingestion, a
> user-facing dashboard with search, and a tagging layer that kept every
> customer's library organized on its own.
>
> **Company:** GrowthNation (stealth, pre-product-market-fit) · **Role:** Senior
> Software Engineer / Product Engineer (contract) · **Period:** Jul 2025 to Jun 2026
>
> **Stack:** TypeScript · React · Supabase · Vercel AI SDK · custom MCP servers · BullMQ
>
> **Problem.** GrowthNation was a stealth startup still looking for product-market
> fit, and it looked by pivoting. It started in AI content marketing. About three
> months before my contract ended, the CEO moved the whole product to a "social
> proof OS for sales teams." (After I left it pivoted again, toward AI-driven org
> optimization: interviewing employees with AI to surface improvements people used
> to find by hand.) Shipping real product across those swings was the actual job.
> The sales pivot needed one place to hold a company's proof: case studies,
> customers, testimonials, stats. Other parts of the product would read from it to
> assemble tailored pitches. It didn't exist yet, and the two surfaces that would
> consume it, proof delivery and proof collection, were being built at the same
> time by other engineers. Someone had to own the store in the middle and make it real.
>
> **Constraints.** The scope came from the founder, who judged the work on business
> impact rather than implementation detail. Every major delivery went out with a
> written summary he could read in a couple of minutes. The team was small and
> shipped fast on heavy AI assistance, which also meant tech debt stacking up
> quickly. What I was paid for was direction, judgement, and knowing when the AI
> output was wrong. An empty proof store is useless, so onboarding a new customer
> had to produce a usable, organized library straight away.
>
> **Approach.** I split the store into three layers and built each with AI
> assistance under my own review. Ingestion came first: paste a URL, it extracts,
> you preview, you save, it appears in the dashboard, plus uploads of any kind and
> screenshots run through AI vision to pull quotes out of images. Presentation was a
> user-facing dashboard the CEO wanted front and center, running as two tabs: a
> Dashboard tab (coverage overview, matrix by ICP, expandable rows, consented
> filter, live sidebar) and an Explore tab (find a specific proof by filtering,
> sorting, and fuzzy search across the whole database). The tagging layer was the
> decision that mattered most: every new quote, stat, or case study gets tagged
> against the workspace's ICPs and pain points before the save returns, and edits
> to a workspace's ICPs re-tag everything already stored. That is what let a new
> customer have a useful library on day one and kept it accurate as positioning shifted.
>
> **Contribution.** I owned the store, its ingestion, and its presentation, and
> exposed all of it over a custom MCP layer so agents could read it too. To be
> accurate about scope: proof delivery and collection belonged to other engineers.
> My lane was the store they both read from.
>
> **Outcome.** The store, dashboard, and tagging layer shipped and ran for every
> workspace on the platform. Real customers used it, some outside the US. The
> product demoed at a conference in June 2026, and the company had earlier reached
> the top 10% of a YC application round. My twelve-month contract finished on schedule.
>
> **Reflection.** What made this work wasn't output speed. It was reading a
> founder-level ask, breaking it into layers, and making one call (tag on the way
> in, re-tag on change) that dealt with the empty-library and drift problems
> together, then staying honest about what the AI produced.

### Inline testimonial to design into the page

> "Arkadiusz is a strong self-starter who is diligent and righteous when it comes
> to building product, but measured and pragmatic about delivery so doesn't allow
> himself to get pulled into over-engineering."
> — **Ben Ritchie**, Hands-on CTO · managed Arkadiusz directly

## The wider system (design the anchor screen aware of these)

The same visual language will cover these other surfaces. Do not design them now;
just do not paint the anchor into a corner that cannot extend to them.

- **Home / showcase:** hero (name, one-line tagline, a 2–3 sentence bio), then a
  grid of work cards, a skills section, testimonials. GitHub + LinkedIn in the nav.
- **`/work` index:** 4 case-study cards (Proof Library, SlateIQ, AI research
  assistant, Routes Wallet) plus an "earlier work" toggle revealing 2 more.
- **Skills section:** 9 categories, each a heading plus a list of tags. Item counts
  are uneven, from 4 up to 14. No progress bars, no star ratings, no levels.
- **Testimonials:** 6 total, quote lengths 162–327 characters, each with author +
  designation. Needs a treatment that survives that variance (line-clamp + expand is fine).
- **Experience timeline** (on an about/resume surface): roles with 3 to 27 stack
  chips each. The chip treatment must not break at the high end.

## Deliverable

1. **Two directional variations** of the case-study detail page as **self-contained
   responsive HTML artifacts** (inline CSS, no external assets), each working in
   light and dark and from mobile to desktop.
2. For each: a short note on the **design tokens** — type scale, color tokens
   (hex/oklch), spacing rhythm, radii, and how monospace is used — so it ports
   cleanly into Tailwind v4.
3. Call out any **hero-moment or signature detail** you introduced (the one thing
   that makes it memorable) so it can be applied consistently elsewhere.

Optimize for a concentrated, opinionated look I can react to, not safe defaults.
