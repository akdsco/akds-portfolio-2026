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
  tagline: string;
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

/**
 * A single project. Cards on /projects render from the top-level fields; a
 * project with a `caseStudy` also gets a /projects/[slug] detail page.
 */
export type Project = {
  slug: string; // URL segment + stable key
  title: string;
  company: string;
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
  period: string;
  position: string;
  company: string;
  location: string;
  employmentType: string;
  summary: string;
  highlights: string[];
  stack: string[];
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
  availability: "Open to remote or hybrid, senior engineering roles",
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
  tagline: "Software Engineer · Full-Stack · TypeScript · React · Node",
  paragraphs: [
    "Six years building production software, most recently shipping a social-proof OS for sales teams at GrowthNation and an AI research platform at Noah Media Group.",
    "Comfortable with the TypeScript stack end-to-end, React/Next on the front, Node + Postgres + BullMQ + multi-provider LLM on the back. Two-year track record of delivering AI-assisted features in production, from a 2023 research tool on GPT-3.5/4 to a 2026 proof engine using the Vercel AI SDK, Anthropic, OpenAI, OpenRouter, and a custom MCP server layer.",
    "Career-changer. Worked in sales for ten years across Poland and the UK before self-teaching into software via OpenClassrooms and the London Java Community. Junior in 2020, mid in 2022, senior/lead by 2025.",
  ],
};

export const skills: SkillCategory[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "SQL", "Java (early-career)"],
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
    title: "Databases & Data",
    items: [
      "PostgreSQL",
      "Supabase (Postgres, Auth, Storage, Realtime, Edge Functions)",
      "MongoDB",
      "Upstash Redis",
      "pgvector-ready architectures",
    ],
  },
  {
    title: "Infrastructure & DevOps",
    items: [
      "Vercel",
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
      "Integration tests against live LLMs with graded responses",
      "ESLint (custom in-repo rules)",
      "Prettier",
      "Husky",
      "lint-staged",
      "Knip",
      "Storybook",
    ],
  },
  {
    title: "Observability & Product Analytics",
    items: [
      "Sentry (typed wrapper with discriminated severity unions)",
      "Better Stack / Logtail",
      "Winston",
      "PostHog",
      "GA4",
      "Meta Pixel",
      "Google Search Console",
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
      "AI-assisted coding with human-in-the-loop quality gates",
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
    role: "Senior Software Engineer / Product Engineer (contract)",
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
          "Ingestion came first. The public-scrape lane runs end to end: paste a URL, it extracts, you preview, you save, it appears in the dashboard. On top of that, uploads of any kind (docs, PDFs, plain text) plus screenshots run through AI vision to pull quotes and testimonials straight out of images.",
          "Presentation was a user-facing dashboard that had to work for every workspace on real data, and the CEO wanted it front and center. It ran as two tabs. The Dashboard tab gave the overview: coverage percentage, total items, gaps, and last contribution across the top, then a coverage matrix broken down by ICP with a bar per pain point, rows you can expand to the underlying quotes and stats with their source, a consented-only filter, and a sidebar of live contributions. The Explore tab was for digging into the store itself, so a user could find a specific piece of proof by filtering, sorting, and fuzzy-searching across the whole database.",
          "The tagging layer was the decision that mattered most. Every new quote, stat, or case study gets tagged against the workspace's ICPs and pain points before the save call even returns, and when a workspace edits its ICPs or pain points, everything already stored gets re-tagged. That is what let a brand-new customer have a useful library on day one, and what kept it accurate as their positioning shifted.",
          "Alongside the store I took over an autonomous bug-triage system the CTO had started. It does root-cause analysis (ordering events in time, trusting server logs over client, fingerprinting errors, catching cascades) and opens its own fix PRs, so a triage points at the cause instead of whichever symptom surfaced first.",
        ],
        contribution: [
          "I owned the store, its ingestion, and its presentation, and exposed all of it over a custom MCP layer so agents could read it too. I wrote the delivery summaries that went out with each milestone, including what got left out on purpose: the first dashboard shipped behind a feature flag for every workspace, with the deferred items named openly rather than dropped without a word.",
          "To be accurate about scope: proof delivery and proof collection belonged to other engineers. My lane was the store they both read from. Where the work was shared, I've said so.",
        ],
        outcome: [
          "The store, dashboard, and tagging layer shipped and ran for every workspace on the platform. Real customers used it, some of them outside the US. The product was demoed at a conference in June 2026, and the company had earlier reached the top 10% of a YC application round. My twelve-month contract finished on schedule.",
        ],
        reflection: [
          "What made this work wasn't output speed. It was reading a founder-level ask, breaking it into layers, and making one call, tag on the way in and re-tag on change, that dealt with the empty-library problem and the drift problem together. The other half was staying honest about what the AI produced instead of shipping its guesses. A line from my manager stuck with me: you're allowed to have a conversation with uncertainty as an engineer, but you're not allowed to dress uncertainty up as certainty.",
        ],
      },
    },
  },
  {
    slug: "slate-iq",
    title: "SlateIQ",
    company: "Noah Media Group",
    stack: ["TypeScript", "React", "Node", "MongoDB", "BullMQ", "OpenAI"],
    hook: "Built a film-success predictor that pulled IMDB, social, piracy, and market data into one comp-matching tool the studio used in real pitch decisions.",
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
          "Internal-only tool, second engineer on a small team. No auth by design, since the CTO chose not to invest in it before there was external traction. The interesting call was what not to build: comp-matching is a human judgement in film, so we deliberately skipped a vector database or semantic-search layer we did not need.",
        ],
        approach: [
          "Pulled five-plus third-party sources into one pipeline: IMDB via its GraphQL API, Muso for piracy data, Audiense and SocialBlade and DemographicsPRO for social and audience, and bespoke Cheerio and Puppeteer scraping for the rest. Combined those into a comp view an analyst could read, and kept the actual comparison human-driven rather than dressing it up as an ML prediction.",
        ],
        contribution: [
          "Built the integrations and the tool end to end and shipped a working prototype.",
        ],
        outcome: [
          "Used in real pitch decisions. The bigger takeaway landed at the org level: documentary funding turned out to be driven by human storytelling, not statistics, which fed a strategic pivot away from data-led greenlighting. The tool did its job; the lesson was about the limits of the data.",
        ],
        reflection: [
          "Knowing what not to build is the signal here. Skipping the semantic-search layer kept the thing shippable and honest about where the real judgement sat.",
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
    role: "Software Engineer (paired with the CTO)",
    period: "2023",
    caseStudy: {
      status: "sunset",
      sections: {
        problem: [
          "The documentary research team spent real time finding leads and angles on a new subject. The question was whether an early LLM could surface threads worth pursuing and give researchers a faster starting point.",
        ],
        constraints: [
          "This was 2023, on GPT-3.5 and GPT-4, before there were patterns to copy. Early models were unreliable, and an internal creative team has a high bar for what it will trust. Getting output stable enough to be useful was the hard part.",
        ],
        approach: [
          "Input a subject name, get back biographical leads, story angles, and threads to pull. Paired with the CTO on architecture and prompt strategy, and owned significant chunks of the implementation. Built integration tests that run live OpenAI calls with graded responses, keeping output inside tolerance bands. That harness came years before checking LLMs in CI was standard, and the same pattern carried through to GrowthNation three years later.",
        ],
        contribution: [
          "A paired role, stated honestly: the CTO drove it, I paired and owned significant implementation chunks, including the graded-LLM test harness.",
        ],
        outcome: [
          'A capable, working tool. It was sunset because the creative research team preferred its traditional workflow, with the head of research objecting to "AI slop." The tech worked; adoption was blocked by preference, not capability.',
        ],
        reflection: [
          "The durable artifact is the graded-LLM integration test pattern, built well ahead of the curve. The temporal signal (production LLM work in 2023) matters more than the tool that got shelved.",
        ],
      },
    },
  },
  {
    slug: "routes-wallet",
    title: "Routes Wallet",
    company: "Self-initiated (iOS)",
    stack: ["React Native", "iOS", "TypeScript"],
    hook: "Solo-shipped an iOS app to test whether cyclists wanted one home for routes scattered across Garmin, Strava, Komoot, and club Google Docs, then killed it when the market said no.",
    featured: true,
    role: "Solo build",
    period: "Mar to Jun 2025",
    caseStudy: {
      status: "killed on the data",
      sections: {
        problem: [
          "Cycling routes end up scattered: Garmin, Strava, Komoot, Ride with GPS, and the inevitable Google Docs a club keeps maintaining by hand. The bet was that riders wanted a single wallet to hold all of them. The real question was whether that demand actually existed.",
        ],
        constraints: [
          "A solo, self-funded side project built to answer one thing: is this worth pursuing? Genuine uncertainty about demand, and no team or budget to hide behind.",
        ],
        approach: [
          "Built the app solo in React Native for iOS, then ran a real market test with a London cycling club rather than guessing from the outside.",
        ],
        contribution: ["Everything: the build and the test design."],
        outcome: [
          'The club\'s honest answer was "we have three apps already." Killed the project on that signal instead of pushing past it.',
        ],
        reflection: [
          "This is product judgement under uncertainty. The discipline was validating cheaply and stopping on the evidence, not defending a sunk cost. Shipping it, testing it, and killing it is a stronger story than quietly shelving it would have been.",
        ],
      },
    },
  },
  {
    slug: "film-production-tracking",
    title: "Film production tracking platform",
    company: "Noah Media Group",
    stack: ["TypeScript", "React", "Node", "MongoDB"],
    hook: "Drove database design and early prototypes with the CEO and Skyscanner co-founder Bonamy Grimes, giving leadership visibility into production progress.",
    featured: false,
  },
  {
    slug: "connect4-meetings",
    title: "Meeting productivity platform",
    company: "Connect4",
    stack: ["React", "Meteor.js", "WebSockets"],
    hook: "Ported the Blaze front-end to React and shipped agenda drag-and-drop plus recurring meeting templates.",
    featured: false,
  },
  {
    slug: "wutzu-stores-panel",
    title: "Stores panel",
    company: "Wutzu Technologies",
    stack: ["JavaScript", "Node", "Payments API"],
    hook: "Refactored the MVP and shipped the first production stores panel, still in use in some areas to this day.",
    featured: false,
  },
];

export const experience: WorkExperience[] = [
  {
    id: 6,
    period: "2025 Jul - 2026 Jun",
    position: "Senior Software Engineer / Product Engineer",
    company: "GrowthNation",
    location: "Remote",
    employmentType: "Contract (12 months)",
    summary:
      "Joined a small founding team building a social-proof OS for sales teams. Built and ran the proof-store product across a CEO-driven pivot, from ingestion through dashboard to delivery summaries.",
    highlights: [
      "Built the Proof Library / Proof Store: ingestion (URL scrape, file upload, AI-vision screenshot extraction), dashboard with coverage matrix, and MCP/agentic access.",
      "Server-side LLM tagging as an architectural unlock. Every new quote, stat, or case study is tagged against the workspace's ICPs and pain points before save returns, with fan-out re-tag on edits.",
      "Co-created an autonomous AI bug-triage system that performs root-cause analysis (temporal ordering, source prioritisation, fingerprinting, cascade detection) and opens clean fix PRs on its own.",
    ],
    stack: [
      "TypeScript",
      "React 18",
      "Vite",
      "Tailwind CSS",
      "Supabase (Postgres, Auth, Storage, Realtime, Edge Functions)",
      "Drizzle ORM",
      "BullMQ",
      "Vercel AI SDK",
      "OpenAI",
      "Anthropic Claude",
      "OpenRouter",
      "DeepSeek",
      "Langfuse",
      "ElevenLabs",
      "Model Context Protocol (custom MCP servers)",
      "Fly.io",
      "Docker",
      "Cypress",
      "Vitest",
      "PostHog",
      "Sentry",
      "Better Stack",
    ],
  },
  {
    id: 5,
    period: "2025 Apr - 2025 Sep",
    position: "Lead Product Engineer",
    company: "Noah Media Group",
    location: "London (hybrid)",
    employmentType: "Full-time",
    summary:
      "Promoted to Lead Product Engineer as the sole remaining technical IC after the CTO's departure. Continued to drive product work directly with the CEO and Skyscanner co-founder Bonamy Grimes until the tech arm wound down.",
    highlights: [
      "Built the film production tracking platform: database design, problem definition, early prototypes.",
      "Worked closely with the CEO and Bonamy Grimes on prioritisation and stakeholder framing.",
    ],
    stack: [
      "TypeScript",
      "React",
      "Node",
      "Express",
      "MongoDB",
      "BullMQ",
      "OpenAI",
    ],
  },
  {
    id: 4,
    period: "2022 Mar - 2025 Mar",
    position: "Software Engineer",
    company: "Noah Media Group",
    location: "London (hybrid)",
    employmentType: "Full-time",
    summary:
      "Second engineer in NMG's newly-formed tech arm. Built three products 0→1 across the team's lifetime, worked directly with leadership, and adopted production LLM tooling years ahead of mainstream curve.",
    highlights: [
      "SlateIQ: film success prediction. Combined IMDB, social, piracy, and market data into a comp-matching tool used in pitch decisions.",
      "AI-powered research assistant on GPT-3.5/4 in 2023. Integration tests ran live LLM calls with graded responses to stabilise output, years before this became standard practice.",
      "Established currying-based dependency injection as a team pattern (carries through to GrowthNation three years later).",
    ],
    stack: [
      "TypeScript",
      "React 17",
      "Redux Toolkit + RTK Query",
      "TanStack Query",
      "Material UI",
      "styled-components",
      "Node.js",
      "Express",
      "MongoDB",
      "BullMQ",
      "OpenAI (GPT-3.5 + GPT-4)",
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
  {
    id: 3,
    period: "2020 Nov - 2022 Mar",
    position: "Software Engineer",
    company: "Connect4",
    location: "Fully remote (pandemic)",
    employmentType: "Full-time",
    summary:
      "First of three companies working alongside Ben Ritchie, who mentored Akds from junior into mid-level. B2B SaaS for productivity around online meetings: agendas, structured notes, planning, meeting history.",
    highlights: [
      "Ported the Blaze front-end to React without breaking production.",
      "Built agenda creation with drag-and-drop and recurring meeting templates.",
      "Internalised unidirectional data flow and reactive DB-driven background refresh patterns.",
    ],
    stack: ["Meteor.js", "Blaze", "React", "WebSockets", "MongoDB"],
  },
  {
    id: 2,
    period: "2020 May - 2020 Nov",
    position: "Software Developer (Intern → JavaScript Developer)",
    company: "Wutzu Technologies",
    location: "London",
    employmentType: "Full-time",
    summary:
      '"Deliveroo for small independent London shops." Worked on order / basket creation and external payment integration via API. Intern → developer in 7 months.',
    highlights: [
      'Refactored the MVP codebase and shipped the first production stores panel (Hevar Abrihem: "still in use in some areas to this day").',
      "Built order and basket flows with external payment-API integration.",
      "Promoted from Intern to JavaScript Developer in seven months.",
    ],
    stack: [
      "JavaScript",
      "React",
      "Node",
      "Firebase",
      "Redux",
      "Webpack",
      "Payments API",
    ],
  },
  {
    id: 1,
    period: "2018 - 2019",
    position: "Freelance Web Developer",
    company: "Self-employed",
    location: "London",
    employmentType: "Freelance",
    summary:
      "Built websites for the London Java Community and Meet a Mentor; took a few paid freelance projects; mentored junior devs into their first roles via LJC.",
    highlights: [
      "Built websites for the London Java Community and Meet a Mentor (referenced by Martijn Verburg and Simon Maple).",
      "Mentored junior developers into their first software roles via LJC, having started as a mentee in the same community.",
      "Took paid client work including the LJC Unconference site and a project for RecWorks (Barry Cranford).",
    ],
    stack: ["HTML5", "CSS3", "JavaScript"],
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
    author: "Hevar Abrihem",
    designation: "Product & Growth Operator",
    relationship: "Wutzu colleague, same team",
    date: "Apr 28, 2021",
    quote:
      "Arkadiusz's efforts at Wutzu were crucial to the first deployment of our new stores panel. Given the heavy task of unwinding the Wutzu codebase and refactoring the MVP, Arkadiusz stepped up to the challenge and handed back a well-documented & efficient application that is still in use in some areas to this day.",
    context: "Validates Wutzu output and legitimises the short tenure.",
  },
  {
    id: 4,
    order: 4,
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
    id: 5,
    order: 5,
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
    id: 6,
    order: 6,
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
