/**
 * Portfolio data. Final structured output.
 *
 * Sculpted from PORTFOLIO_RESEARCH.md.
 *
 * Consumed by the Next.js 16 (App Router) + Tailwind v4 + Base UI site.
 * One `Project` type drives both the /projects cards and the
 * /projects/[slug] detail pages: a project with a `caseStudy` gets a detail
 * page; `featured` splits top cards from the "earlier work" toggle. Skills are
 * categorised (no levels/bars); hero + about copy are explicit.
 *
 * Strings are plain, markdown-free text so any component can render them;
 * long-form sections are arrays of paragraphs.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SocialLink = {
  label: string;
  url: string;
};

export type Profile = {
  name: string;
  fullName: string;
  title: string;
  location: string;
  availability: string;
  publicEmail: string; // hire contact; kept in data, intentionally NOT surfaced on the site (no contact form, no mailto)
  cvEmail: string; // kept off the public site, for CV / direct outreach
  brandImage: string;
  socials: SocialLink[];
};

export type HeroCopy = {
  name: string;
  tagline: string;
  paragraphs: string[];
};

export type AboutCopy = {
  name: string;
  /** Chunks that wrap as whole units. As one string the browser broke it
   *  wherever it liked and stranded a "·" at the line end; each chunk now stays
   *  intact and the renderer supplies the separator between them. */
  tagline: string[];
  paragraphs: string[];
};

export type SkillCategory = {
  title: string;
  items: string[];
};

/**
 * Long-form, section-based case-study body. Each section is an array of
 * plain-text paragraphs (no markdown); the render layer decides presentation.
 */
export type CaseStudy = {
  sections: {
    problem: string[];
    constraints: string[];
    approach: string[];
    contribution: string[];
    outcome: string[];
    reflection?: string[]; // optional, only when there is a real lesson to tell
  };
  testimonialId?: number; // pull a relevant testimonial inline, by id
  status?: string; // short honest label shown in the meta card, e.g. "shipped"
};

/** Every company (or self-directed stint) that appears in the work history. */
export type CompanyName =
  | "GrowthNation"
  | "Noah Media Group"
  | "Connect4"
  | "Wutzu Technologies"
  | "Self-employed"
  | "Self-initiated (iOS)";

/**
 * A company's site, or the reason there isn't one. Deliberately required and not
 * an optional `url?`: a company rendering without a link should be a decision on
 * record, not something nobody got around to filling in. The two sentinels are
 * distinct because they mean different things — "sold, domain gone" is not the
 * same as "a solo project never had a site", and flattening both to `undefined`
 * loses that.
 */
export type CompanySite =
  | `https://${string}`
  | "url-no-longer-active"
  | "no-public-url";

/**
 * Keyed by `CompanyName`, so this is exhaustive: add a company to the union
 * without deciding its site and it won't compile. Checked live 2026-07-16.
 */
export const companySites: Record<CompanyName, CompanySite> = {
  GrowthNation: "https://growthnation.ai",
  "Noah Media Group": "https://www.noahmediagroup.com/",
  Connect4: "url-no-longer-active",
  "Wutzu Technologies": "url-no-longer-active",
  "Self-employed": "no-public-url",
  "Self-initiated (iOS)": "no-public-url",
};

const isUrl = (site: CompanySite): site is `https://${string}` =>
  site.startsWith("https://");

/**
 * The company's link, or `null` when there deliberately isn't one. Narrowing
 * here is what stops a sentinel ever reaching the DOM as an href.
 */
export function companyHref(company: CompanyName): string | null {
  const site = companySites[company];
  return isUrl(site) ? site : null;
}

/**
 * A single project. Cards on /projects render from the top-level fields; a
 * project with a `caseStudy` also gets a /projects/[slug] detail page.
 */
export type Project = {
  slug: string; // URL segment + stable key
  title: string;
  company: CompanyName;
  stack: string[];
  /**
   * One line: the card blurb and the detail-page lede. Its only job is to earn
   * the next 30 seconds of reading. Rules: one sentence, one idea; lead with the
   * verb or outcome; specific enough that a generic engineer could not have
   * written it; no marketing fluff.
   */
  hook: string;
  featured: boolean; // true = top card on /projects; false = "earlier work" toggle
  role?: string; // detail meta row (job title)
  period?: string; // detail meta row
  caseStudy?: CaseStudy; // present => has a detail page
};

export type WorkExperience = {
  id: number;
  start: string;
  end: string;
  position: string;
  company: CompanyName;
  location: string; // city + country only; remote/hybrid belongs in workType
  workType: "Remote" | "Hybrid" | "On-site";
  employmentType: string;
  summary: string;
  /**
   * Bullets under the summary. Supports inline `[text](url)` links — see
   * `components/linked-text.tsx`. Only https URLs are linkified.
   */
  highlights: string[];
  stack: { lead: string[]; rest: string[] }; // lead has to fit one line
};

export type Education = {
  id: number;
  period: string;
  qualification: string;
  institution: string;
  details: string;
};

export type Certification = {
  id: number;
  title: string;
  issuer: string;
  issued: string;
  status: "current" | "legacy";
  note?: string;
};

export type Testimonial = {
  id: number;
  order: number;
  author: string;
  designation: string;
  relationship: string;
  date: string;
  quote: string;
  context?: string;
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const profile: Profile = {
  name: "Arkadiusz",
  fullName: "Arkadiusz Ostrowski",
  title: "Software Engineer · Full-Stack · TypeScript · React · Node",
  location: "London, UK",
  availability: "Open to senior engineering roles",
  publicEmail: "hire-arkadiusz@pm.me",
  cvEmail: "arkadiusz.ostrowski@protonmail.com",
  brandImage: "/images/brand-image.webp",
  // Full set of profile links (data). The nav DISPLAYS only GitHub + LinkedIn;
  // Stack Overflow + Pluralsight are kept here for reference / future use, not shown.
  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/akds/" },
    { label: "GitHub", url: "https://github.com/akdsco" },
    {
      label: "Stack Overflow",
      url: "https://stackoverflow.com/users/8598252/akds",
    },
    { label: "Pluralsight", url: "https://app.pluralsight.com/profile/akds" },
  ],
};

export const hero: HeroCopy = {
  name: "Arkadiusz Ostrowski",
  tagline: "I build production AI-native software end-to-end.",
  paragraphs: [
    "London-based. TypeScript, React, Node, Postgres, BullMQ, Vercel AI SDK. Recently wrapped a 12-month contract at GrowthNation, a stealth sales-AI startup, where I ran the proof-library product, built the server-side LLM tagging architecture, and wrote CEO-facing delivery summaries.",
    'Previously: three years at a documentary studio shipping AI-assisted research tools on GPT-3.5/4 in 2023, before "AI-assisted coding" was a phrase.',
    "Open to senior / staff / founding-engineer roles.",
  ],
};

export const about: AboutCopy = {
  name: "Arkadiusz Ostrowski",
  // Role, then stack — the two halves a reader would split it into anyway.
  tagline: ["Software Engineer · Full-Stack", "TypeScript · React · Node"],
  paragraphs: [
    "Six years building production software, the last two shipping AI features: a research tool at [Noah Media Group](https://www.noahmediagroup.com/) in 2023 (GPT-3.5/4) and a social-proof engine at [GrowthNation](https://growthnation.ai) in 2026 (Vercel AI SDK, Anthropic, OpenAI, a custom MCP layer).",
    "The most recent build I'm proudest of is the code factory, co-built with the CTO: a pipeline of skills, plans, worktrees and automated gates that let a designer and a junior dev pick up tickets and ship straight to production. It cut engineering costs by more than 30%.",
    "Career-changer: ten years in sales across Poland and the UK before self-teaching into software.",
  ],
};

// Order is deliberate, not alphabetical. These render in a 2-column grid, where
// every row is as tall as its taller cell — so categories are paired both by
// relevance (what's built / core engineering / platform / how it's built /
// production surface) and by similar bulk, which keeps the short one from
// carving a hole beside the tall one. Reordering or adding a category will
// re-open those gaps; re-measure at desktop width if you do.
export const skills: SkillCategory[] = [
  {
    title: "AI / LLM",
    items: [
      "Vercel AI SDK",
      "OpenAI",
      "Anthropic Claude",
      "OpenRouter",
      "DeepSeek",
      "Langfuse",
      "Model Context Protocol (custom MCP servers)",
      "LLM-in-the-loop integration testing",
      "Firecrawl",
      "ElevenLabs",
      "AI-assisted product development",
    ],
  },
  {
    title: "Frontend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Radix UI",
      "shadcn/ui",
      "TanStack Query",
      "Zustand",
      "Redux Toolkit + RTK Query",
      "Vite",
      "React Router",
      "TipTap",
      "Framer Motion",
      "Recharts",
      "Three.js (R3F + drei)",
    ],
  },
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "SQL", "Java (early-career)"],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express",
      "BullMQ",
      "Redis",
      "WebSockets",
      "Drizzle ORM",
      "Zod",
      "Puppeteer",
      "Cheerio",
      "Sharp",
    ],
  },
  {
    title: "Databases & Data",
    items: [
      "PostgreSQL",
      "Supabase (Auth, Storage, Realtime, Edge Fns)",
      "MongoDB",
      "Upstash Redis",
      "pgvector-ready architectures",
    ],
  },
  {
    title: "Infrastructure & DevOps",
    items: [
      "Vercel",
      "Cloudflare",
      "Fly.io",
      "Heroku",
      "AWS",
      "Google Cloud",
      "Docker",
      "GitHub Actions",
      "Supabase preview branches",
      "Blue-green deploys",
      "Cron / scheduled jobs",
      "Slack/PostHog/Sentry alerting",
    ],
  },
  {
    title: "Testing & Quality",
    items: [
      "Vitest",
      "Jest",
      "Cypress",
      "Playwright",
      "Supertest",
      "Testing Library",
      "LLM Integration Tests",
      "ESLint (custom in-repo rules)",
      "Husky",
      "lint-staged",
      "Knip",
      "Storybook",
    ],
  },
  {
    title: "Practices & patterns",
    items: [
      "Functional programming",
      "Currying-based dependency injection",
      "Ports-and-adapters",
      "TDD",
      '"Agent skills produce data" pattern',
      "Pay-on-success cost tracking",
      "AI-assisted programming",
    ],
  },
  {
    title: "Observability & Product Analytics",
    items: [
      "Sentry",
      "Better Stack / Logtail",
      "Winston",
      "PostHog",
      "GA4",
      "Meta Pixel",
      "Google Search Console",
    ],
  },
  {
    title: "Integrations shipped against",
    items: [
      "HubSpot",
      "Paddle",
      "Notion",
      "Slack",
      "WordPress (custom plugin)",
      "Mailchimp",
      "DataForSEO",
      "IMDB GraphQL",
      "Muso",
      "Audiense",
      "SocialBlade",
      "Cloudflare Turnstile",
      "Tremendous",
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "proof-library",
    title: "Proof Library",
    company: "GrowthNation",
    stack: [
      "TypeScript",
      "React",
      "Supabase",
      "Vercel AI SDK",
      "custom MCP servers",
      "BullMQ",
    ],
    hook: "Owned the proof store behind a sales-AI product: ingestion, a user-facing dashboard with search, and a tagging layer that kept every customer's library organized on its own.",
    featured: true,
    role: "Product Engineer",
    period: "Jul 2025 to Jun 2026",
    caseStudy: {
      status: "shipped",
      testimonialId: 1,
      sections: {
        problem: [
          'GrowthNation was a stealth startup still looking for product-market fit, and it looked by pivoting. It started in AI content marketing. About three months before my contract ended, the CEO moved the whole product to a "social proof OS for sales teams." (After I left it pivoted again, toward AI-driven org optimization: interviewing employees with AI to surface improvements people used to find by hand.) Shipping real product across those swings was the actual job.',
          "The sales pivot needed one place to hold a company's proof: case studies, customers, testimonials, stats. Other parts of the product would read from it to assemble tailored pitches. It didn't exist yet, and the two surfaces that would consume it, proof delivery and proof collection, were being built at the same time by other engineers. Someone had to own the store in the middle and make it real. That was me.",
        ],
        constraints: [
          "The scope came from the founder, who judged the work on business impact rather than implementation detail. Every major delivery went out with a written summary he could read in a couple of minutes. The skill there was being a reliable human in the loop, not producing more words.",
          "The team was small and shipped fast on heavy AI assistance, which also meant tech debt stacking up quickly. What I was paid for was direction, judgement, and knowing when the AI output was wrong.",
          "An empty proof store is useless, so onboarding a new customer had to produce a usable, organized library straight away.",
        ],
        approach: [
          "I split the store into three layers and built each one with AI assistance under my own review.",
          "Ingestion came first. The public-scrape lane runs end to end: paste a URL, it extracts, and appears in the dashboard. On top of that, uploads of any kind (docs, PDFs, plain text) plus screenshots run through AI vision to pull quotes and testimonials straight out of images.",
          "Presentation was a user-facing dashboard that had to work for every workspace on real data, and the CEO wanted it front and center. It ran as two tabs. The Dashboard tab gave the overview: coverage percentage, total items, gaps, and last contribution across the top, then a coverage matrix broken down by ICP with a bar per pain point, rows you can expand to the underlying quotes and stats with their source, a consented-only filter, and a sidebar of live contributions. The Explore tab was for digging into the store itself, so a user could find a specific piece of proof by filtering, sorting, and fuzzy-searching across the whole database.",
          "The tagging layer was the decision that mattered most. Every new quote, stat, or case study gets tagged against the workspace's ICPs and pain points before the save call even returns, and when a workspace edits its ICPs or pain points, everything already stored gets re-tagged. That is what let a brand-new customer have a useful library on day one, and what kept it accurate as their positioning shifted.",
          "Alongside the store I took over an autonomous bug-triage system the CTO had started. It does root-cause analysis (ordering events in time, trusting server logs over client, fingerprinting errors, catching cascades) and opens its own fix PRs, so a triage points at the cause instead of whichever symptom surfaced first.",
        ],
        contribution: [
          "I owned the store, its ingestion, and its presentation, and exposed all of it over a custom MCP layer so agents could read it too. I wrote the delivery summaries that went out with each milestone, including what got left out on purpose: the first dashboard shipped behind a feature flag for every workspace, with the deferred items named openly rather than dropped without a word.",
        ],
        outcome: [
          "The store, dashboard, and tagging layer shipped and ran for every workspace on the platform. The product was demoed at a conference in June 2026, and the company had earlier reached the top 10% of a YC application round.",
        ],
        reflection: [
          "The lasting lesson here was about altitude, not code. The technical side was hard in its own right: the dashboard was a blank-page design problem, and getting to a working prototype inside a week leaned on skilful use of AI. What I grew most, though, was operating at the founder's level, reporting in business outcomes he could act on rather than implementation detail he didn't need.",
        ],
      },
    },
  },
  {
    slug: "routes-wallet",
    title: "RoutesWallet",
    company: "Self-initiated (iOS)",
    stack: ["React Native", "iOS", "TypeScript"],
    hook: "Solo-shipped an iOS app to test whether cyclists wanted one home for routes scattered across Garmin, Strava, Komoot, and club Google Docs, then killed it when the market said no.",
    featured: true,
    role: "All hats were mine",
    period: "Mar to Jun 2025",
    caseStudy: {
      status: "canned",
      sections: {
        problem: [
          "Cycling routes end up scattered: Garmin, Strava, Komoot, Ride with GPS, and the inevitable Google Docs a club keeps maintaining by hand. The bet was that riders wanted a single wallet to hold all of them. The real question was whether that demand actually existed.",
        ],
        constraints: [
          "A solo, self-funded side project built to answer one thing: is this worth pursuing? Genuine uncertainty about demand, and no team or budget to hide behind.",
        ],
        approach: [
          "Built the app solo in React Native for iOS, then ran a real market test with my cycling club rather than guessing from the outside.",
        ],
        contribution: ["Everything: the concept, design, build and test."],
        outcome: [
          "I put it in front of 12 riders from my cycling club. The reaction was weak: one used it and found it genuinely useful, one couldn't get past Strava account limitations, and most never cared enough to install it at all. The signal was clear, so I killed the project rather than push past it.",
        ],
        reflection: [
          'The build was the cheap part. The point of a solo, self-funded project like this is to buy a real answer to "does anyone want this" before spending a year finding out, and the answer was no. Shipping something is easy to be proud of; stopping on the evidence is the harder discipline.',
        ],
      },
    },
  },
  {
    slug: "slate-iq",
    title: "SlateIQ",
    company: "Noah Media Group",
    stack: ["TypeScript", "React", "Node", "MongoDB", "BullMQ", "OpenAI"],
    hook: "Built a film-success predictor that pulled IMDB, social, piracy, and market data into one tool that matched a film against comparable past titles, used by the studio in real pitch decisions.",
    featured: true,
    role: "Software Engineer",
    period: "2022 to 2025",
    caseStudy: {
      status: "shipped",
      sections: {
        problem: [
          'The studio wanted to gauge a film\'s potential the way the industry actually thinks about it: by comparison to past titles ("comps"). The signals for that lived in a dozen different places, from IMDB to social audience data to piracy numbers. Nobody had them in one view.',
        ],
        constraints: [
          "An internal-only tool, two engineers on a small team. No auth, by design: not worth building before the product had traction. The more interesting constraint was self-imposed, knowing what not to build. Judging a film against comparable titles is human work, so we deliberately skipped a vector database and semantic-search layer we did not need.",
        ],
        approach: [
          "We pulled third-party sources into one pipeline: IMDB via its GraphQL API, Muso for piracy data, Audiense and SocialBlade and DemographicsPRO for social and audience, and bespoke Cheerio and Puppeteer scraping for the rest. Combined those into a set of views/charts directly into Google Presentation, and kept the actual comparison human-driven rather than dressing it up as an ML prediction.",
        ],
        contribution: [
          "Built the integrations and the tool end to end, and shipped a working prototype with one other engineer and a CTO who was only partially hands-on.",
          "The part that stuck with me wasn't mine. The other engineer brought BullMQ in to help us manage long running jobs, and pairing with him on it is where I learned what a job queue is actually for: every third-party pull and Puppeteer scrape is slow, rate-limited, and fails on someone else's schedule, so none of it belongs on the request path. Getting the why and the where from someone who had already made those calls, rather than just the how, is what I took off this project.",
        ],
        outcome: [
          "Used in real pitch decisions. The bigger takeaway landed at the org level: documentary funding turned out to be driven by human storytelling, not statistics, which fed a strategic pivot away from data-led greenlighting. The tool did its job; the lesson was about the limits of the data.",
        ],
        reflection: [
          "The lesson was knowing what not to build, and it showed up twice. In the code, skipping the semantic-search layer kept the tool shippable and honest about where the judgement sat, with a human reading the comparables rather than a model. In the product, the modest version worked because it read past data to see what not to bet on. The grander ambition underneath, predicting the next film, never could. Past performance tells you what happened, not what is coming.",
        ],
      },
    },
  },
  {
    slug: "ai-research-assistant",
    title: "AI-powered research assistant",
    company: "Noah Media Group",
    stack: [
      "TypeScript",
      "React",
      "Node",
      "OpenAI (GPT-3.5 + GPT-4)",
      "Cheerio",
      "Puppeteer",
    ],
    hook: "Co-built a documentary research assistant on GPT-3.5/4 in 2023, before AI-assisted tooling was a category: give it a subject, it returned biographical leads and story angles worth chasing.",
    featured: true,
    role: "Software Engineer",
    period: "2023",
    caseStudy: {
      status: "sunset",
      sections: {
        problem: [
          "Documentary research is slow by nature: a new subject means days of reading before anyone knows whether there is a story in it, and that time caps how many subjects ever get looked at. The obvious question was whether an early LLM could shorten it. The better one was whether it could widen it, surfacing angles a researcher would not have thought to go looking for. The target was not a faster researcher. It was a researcher with a wider net.",
        ],
        constraints: [
          "This was 2023, on GPT-3.5 and GPT-4, before there were patterns to copy. Early models were unreliable, and an internal creative team has a high bar for what it will trust. Getting output stable enough to be useful was the hard part.",
        ],
        approach: [
          "Input a subject name, get back biographical leads, story angles, and threads to pull. Built integration tests that run live OpenAI calls with graded responses, keeping output inside tolerance bands. That harness came years before checking LLMs in CI was standard, and the same pattern carried through to GrowthNation three years later.",
        ],
        contribution: [
          "The CTO drove the project and we paired on architecture and prompt strategy. The build was mine: the frontend, the data ingestion, the API connections, and the prompting layer, which refused to sit still. It started as prompt engineering and became tool calling when OpenAI shipped it partway through the build, with the model pulling the specific facts we needed out of what the pipeline fetched. Every research run went out and got fresh data.",
          "Stabilising it is where the engineering was. The graded-LLM test harness came out of that, and canned data feeds alongside it: a prompt change can only be judged against a fixed input, or you cannot tell whether the output moved because you improved something or because the web did.",
        ],
        outcome: [
          'A capable, working tool that went unused. The research team preferred its traditional workflow and the head of research objected to "AI slop". Underneath the objection sat a positioning problem: a studio built on high-end, long-form documentary had no appetite for stories mined and told at volume, so the thing the tool was good at was the thing they did not want. The tech worked; adoption was blocked by preference, not capability.',
        ],
        reflection: [
          "The part that outlived the tool is the graded-LLM test harness, and the fact of shipping production LLM work in 2023 at all. That is the transferable engineering. The tool itself I file under timing: it did what a wave of YouTube channels turned into a format three years later, and it still died in-house, because being right too early is hard to tell apart from being wrong.",
        ],
      },
    },
  },
];

export const experience: WorkExperience[] = [
  {
    id: 6,
    start: "2025 Jul",
    end: "2026 Jun",
    position: "Product Engineer",
    company: "GrowthNation",
    location: "London, UK",
    workType: "Remote",
    employmentType: "Contract (12 months)",
    summary:
      "Founding-team engineer on a social-proof OS for sales teams, through a CEO-driven pivot.",
    highlights: [
      'Joined during the initial product build for marketing function, helping SME\'s and Agencies streamline their AIO/SEO tactics, I built user auth, custom integrations and setup "code factory" workflow with the CTO to enable build contributions from all team members (product/design)',
      "Built the Proof Library: ingestion (domain scrape, file upload, AI-vision screenshot extraction), dashboard with coverage matrix, and MCP/agentic access.",
      "Server-side LLM tagging, every new quote, stat, or case study was tagged against the workspace's ICPs and pain points before save returns, with fan-out re-tag on edits.",
      "Co-created an autonomous AI bug-triage system that performs root-cause analysis (temporal ordering, source prioritisation, fingerprinting, cascade detection) and opens clean fix PRs with plans and implementations on its own.",
    ],
    stack: {
      lead: [
        "TypeScript",
        "React 18",
        "Supabase",
        "Vercel AI SDK",
        "MCP servers",
      ],
      rest: [
        "Vite",
        "Tailwind CSS",
        "Drizzle ORM",
        "BullMQ",
        "OpenAI",
        "Anthropic Claude",
        "OpenRouter",
        "DeepSeek",
        "Langfuse",
        "ElevenLabs",
        "Fly.io",
        "Docker",
        "Cypress",
        "Vitest",
        "PostHog",
        "Sentry",
        "Better Stack",
      ],
    },
  },
  {
    id: 5,
    start: "2025 Apr",
    end: "2025 Sep",
    position: "Lead Product Engineer",
    company: "Noah Media Group",
    location: "London, UK",
    workType: "Hybrid",
    employmentType: "Full-time",
    summary:
      "Promoted to lead as the sole remaining technical IC after the CTO's departure, and iterated on the new product until the tech arm wound down.",
    highlights: [
      "Built the film production tracking platform: database design, problem definition, early prototypes.",
      "Worked closely with the CEO and the former Skyscanner CTO, Bonamy Grimes on prioritisation and stakeholder framing.",
    ],
    stack: {
      lead: [
        "TypeScript",
        "React",
        "Node",
        "Express",
        "MongoDB",
        "BullMQ",
        "OpenAI",
      ],
      rest: [],
    },
  },
  {
    id: 4,
    start: "2022 Apr",
    end: "2025 Apr",
    position: "Software Engineer",
    company: "Noah Media Group",
    location: "London, UK",
    workType: "Hybrid",
    employmentType: "Full-time",
    summary:
      "First engineer in NMG's newly formed tech arm, building two products from scratch over three years.",
    highlights: [
      "[SlateIQ](https://slateiq.com/): film success prediction. Combined IMDB, social, piracy, and market data into a comp-matching tool used in pitch decisions.",
      "AI-powered research assistant on GPT-3.5/4 in 2023. Integration tests ran live LLM calls with graded responses to stabilise output, years before this became standard practice.",
      "Established currying-based dependency injection as a team pattern, saving us from elaborate testing effort",
    ],
    stack: {
      lead: [
        "TypeScript",
        "React 17",
        "Node.js",
        "MongoDB",
        "OpenAI (GPT-3.5 + GPT-4)",
      ],
      rest: [
        "Redux Toolkit + RTK Query",
        "TanStack Query",
        "Material UI",
        "styled-components",
        "Express",
        "BullMQ",
        "IMDB GraphQL",
        "Muso",
        "Audiense",
        "SocialBlade",
        "DemographicsPRO",
        "Cheerio",
        "Puppeteer",
        "Heroku",
        "Google Cloud",
        "AWS",
        "Redis",
        "Jest",
        "Cypress",
        "Sentry",
        "Winston",
        "GitHub Actions",
      ],
    },
  },
  {
    id: 3,
    start: "2020 Nov",
    end: "2022 Apr",
    position: "Software Developer",
    company: "Connect4",
    location: "London, UK",
    workType: "Remote",
    employmentType: "Full-time",
    summary:
      "B2B SaaS for online-meeting productivity. Hired as the first employee developer to take over after the initial contract prototype build.",
    highlights: [
      "Ported the error prone Blaze front-end to React, reducing frontend error rate roughly by 30% and without breaking production.",
      "Internalised unidirectional data flow and reactive DB-driven background refresh patterns to eliminate backend/frontend data sync issues",
      "Built agenda creation feature with drag-and-drop and recurring meeting templates.",
    ],
    stack: {
      lead: ["Meteor.js", "Blaze", "React", "WebSockets", "MongoDB"],
      rest: [],
    },
  },
  {
    id: 2,
    start: "2020 May",
    end: "2020 Nov",
    position: "JavaScript Developer",
    company: "Wutzu Technologies",
    location: "London, UK",
    workType: "Hybrid",
    employmentType: "Full-time",
    summary:
      '"Deliveroo for small independent London shops." Hired as the second of two engineers on the product.',
    highlights: [
      "Refactored the MVP codebase and shipped the first production stores panel.",
      "Built order and basket flows with external payment-API integration.",
    ],
    stack: {
      lead: [
        "JavaScript",
        "React",
        "Node",
        "Firebase",
        "Redux",
        "Webpack",
        "Payments API",
      ],
      rest: [],
    },
  },
  {
    id: 1,
    start: "2018 Sep",
    end: "2020 May",
    position: "Web Developer",
    company: "Self-employed",
    location: "London, UK",
    workType: "Remote",
    employmentType: "Freelance",
    summary:
      "Community sites and paid client work, through the London Java Community.",
    highlights: [
      "Built websites for the London Java Community and Meet a Mentor (referenced by Martijn Verburg and Simon Maple).",
      "Mentored junior developers into their first software roles via LJC, having started as a mentee in the same community.",
      "Took paid client work including the LJC Unconference site and a project for RecWorks (Barry Cranford).",
    ],
    stack: { lead: ["HTML5", "CSS3", "JavaScript"], rest: [] },
  },
];

export const education: Education[] = [
  {
    id: 2,
    period: "2019 - 2020",
    qualification: "Bachelor's degree, Software Developer",
    institution: "OpenClassrooms",
    details:
      "Degree-level diploma combining JavaScript, REST APIs, OOP, React.js, MySQL, CSS3/HTML5, software testing with Jasmine, and Git. Delivered through real-world projects and weekly mentoring sessions with senior developers.",
  },
  {
    id: 1,
    period: "2018 - 2019",
    qualification: "Software Development Specialization",
    institution: "uCertify.com",
    details:
      "Self-study certification track. Covered the OCA Java SE 8 Programmer I (1Z0-808) and MTA Software Development Fundamentals (98-361).",
  },
];

export const certifications: Certification[] = [
  {
    id: 1,
    title: "Cloud Digital Leader",
    issuer: "Google",
    issued: "Feb 2023",
    status: "current",
    note: "Expires Feb 2026. Pin this: recent and cloud-relevant.",
  },
  {
    id: 2,
    title: "Oracle Certified Associate, Java SE 8 Programmer I",
    issuer: "Oracle",
    issued: "May 2018",
    status: "legacy",
    note: "Evidence of the self-taught grind period.",
  },
  {
    id: 3,
    title: "MTA: Software Development Fundamentals (98-361)",
    issuer: "Microsoft",
    issued: "Aug 2017",
    status: "legacy",
    note: "Microsoft retired the MTA track in 2022. Keep on LinkedIn; drop from portfolio.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    order: 1,
    author: "Ben Ritchie",
    designation: "Hands-on CTO · GenAI/ML Product Specialist",
    relationship: "Managed Arkadiusz directly (Noah Media Group)",
    date: "Feb 18, 2022",
    quote:
      "Arkadiusz is a strong self-starter who is diligent and righteous when it comes to building product, but measured and pragmatic about delivery so doesn't allow himself to get pulled into over-engineering. He is an excellent team-member capable of learning quickly and mentoring those around him. His focus and selfless drive mean I would happily recommend or work with him again.",
    context: "Headline testimonial. Use as the lead quote.",
  },
  {
    id: 2,
    order: 2,
    author: "Martijn Verburg",
    designation: "Principal Engineering Group Manager at Microsoft",
    relationship: "Managed Arkadiusz directly (London Java Community)",
    date: "Nov 7, 2017",
    quote:
      "Arkadiusz was amazing to work with, our community liked Arkadiusz's work so much that our hosting bandwidth needed to be readjusted to traffic demand twice the following day!",
    context:
      "Massive social proof. Martijn is a UK Java community legend: former London JUG leader, ex-CEO at jClarity (acquired by Microsoft). Leads Java, Golang & Python engineering at Microsoft today.",
  },
  {
    id: 3,
    order: 3,
    author: "Simon Maple",
    designation: "Head of Developer Relations at Tessl",
    relationship: "Client (LJC Unconference website)",
    date: "Nov 14, 2017",
    quote:
      "Arkadiusz worked very well in a team to gather requirements very accurately and turn them into visual results with a very fast turnaround. Arkadiusz is someone who gets the job done.",
    context:
      "Named industry figure (Snyk, Tessl); validates the freelance era.",
  },
  {
    id: 4,
    order: 4,
    author: "Barry Cranford",
    designation: "Founder of RecWorks (Tech Talent Agency, London)",
    relationship: "Client",
    date: "Nov 7, 2017",
    quote:
      "Arkadiusz was a pleasure to work with on our latest web project. He instantly had an appreciation for what we wanted to achieve… took initiative too… he wouldn't say no or find alternative solutions, instead he took the time to research what would be necessary to give us what we wanted.",
    context:
      "Recruiter-targeted social proof. Barry runs a London tech recruitment agency.",
  },
  {
    id: 5,
    order: 5,
    author: "David McLeary",
    designation: "Group IT Development Manager at Greencore",
    relationship:
      "Contractor predecessor on the Connect4 project Arkadiusz took over",
    date: "Jul 22, 2021",
    quote:
      "Developing good code is a mix of diligence, understanding the use case and good communication. In working with Arkadiusz I was able to see that he excels in each of these areas. He is able to work very well with a team, collaboratively and productively arguing a point when needed.",
    context:
      "David was a contractor at Connect4 who prototyped the project Arkadiusz later took over. Once Ben joined as full-time CTO, Arkadiusz + Ben continued building David's prototype into a production product. Greencore is David's later employer, not a Connect4 reference.",
  },
];

// ---------------------------------------------------------------------------
// Default export: bundle for convenience
// ---------------------------------------------------------------------------

const portfolioData = {
  profile,
  hero,
  about,
  skills,
  projects,
  experience,
  education,
  certifications,
  testimonials,
};

export default portfolioData;
