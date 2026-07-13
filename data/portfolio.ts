/**
 * Portfolio data. Final structured output.
 *
 * Sculpted from PORTFOLIO_RESEARCH.md.
 *
 * Designed to drop into the new Next.js 16 (App Router) + Tailwind +
 * shadcn/ui repo. Shape is richer than the old `data/database.ts`:
 * categorised skills (no percentage bars), explicit hero + about copy,
 * portfolio cards as 4-field objects, and a visibility flag separating
 * the 5 default cards from the 2 collapsed "earlier work" cards.
 *
 * Strings are kept as plain markdown-free text so any component can
 * render them. Long-form paragraphs use \n\n separators.
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
  publicEmail: string; // for the website contact form
  cvEmail: string; // kept off the public site, for CV / direct outreach
  brandImage: string;
  aboutImage: string;
  cvFile: string;
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

export type PortfolioCard = {
  id: string;
  order: number;
  visible: boolean; // true = visible by default, false = under "earlier work"
  title: string;
  company: string; // generic / stealth-safe wording where required
  role: string;
  stack: string[];
  focus: string;
  image?: string;
  url?: string;
};

/**
 * A case study extends a PortfolioCard with long-form, section-based content.
 * The card fields (title, company, role, stack) still drive the index summary;
 * `hook` and `sections` drive the detail page at /work/[slug].
 *
 * Section bodies are arrays of plain-text paragraphs (no markdown), matching the
 * rest of this file. The render layer decides presentation.
 *
 * Proposed shape, not yet populated with data. Draft prose lives in
 * docs/case-studies/*.md until each study is promoted into a typed object here.
 */
export type CaseStudy = PortfolioCard & {
  /**
   * The one line under the project title on the detail page. Its only job is to
   * earn the next 30 seconds of reading. Keep every hook to these rules:
   *  1. One sentence, one idea. Push setup and context (stealth, dates, company
   *     stage) into the meta row and the `problem` section, not here.
   *  2. Lead with the verb or the outcome ("Owned...", "Cut...", "Shipped...").
   *  3. Be specific enough that a generic engineer could not have written the
   *     same sentence about themselves. Name the concrete, interesting thing.
   *  4. No marketing fluff. If it reads like a landing-page tagline, rewrite it.
   */
  hook: string;
  sections: {
    problem: string[];
    constraints: string[];
    approach: string[];
    contribution: string[];
    outcome: string[];
    reflection?: string[]; // optional, only when there is a real lesson to tell
  };
  testimonialId?: number; // optional: pull a relevant testimonial inline, by id
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
  availability:
    "Open to senior / staff / founding-engineer roles. Hybrid or remote.",
  publicEmail: "hire-arkadiusz@pm.me",
  cvEmail: "arkadiusz.ostrowski@protonmail.com",
  brandImage: "/images/brand-image.jpg",
  aboutImage: "/images/about-image.jpg",
  cvFile: "",
  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/akds/" },
    { label: "GitHub", url: "https://github.com/akdsco" },
    { label: "Stack Overflow", url: "https://stackoverflow.com/users/8598252/akds" },
    { label: "Pluralsight", url: "https://app.pluralsight.com/profile/akds" },
  ],
};

export const hero: HeroCopy = {
  name: "Arkadiusz Ostrowski",
  tagline: "I build production AI-native software end-to-end.",
  paragraphs: [
    "London-based. TypeScript, React, Node, Postgres, BullMQ, Vercel AI SDK. Currently wrapping up a 12-month contract at a stealth sales-AI startup, where I ran the proof-library product, built the server-side LLM tagging architecture, and wrote CEO-facing delivery summaries.",
    "Previously: three years at a documentary studio shipping AI-assisted research tools on GPT-3.5/4 in 2023, before \"AI-assisted coding\" was a phrase.",
    "Open to senior / staff / founding-engineer roles.",
  ],
};

export const about: AboutCopy = {
  name: "Arkadiusz Ostrowski",
  tagline: "Software Engineer · Full-Stack · TypeScript · React · Node",
  paragraphs: [
    "Based in London. Six years building production software, most recently shipping a social-proof OS for sales teams at GrowthNation and an AI research platform at Noah Media Group.",
    "Comfortable across the stack: TypeScript end-to-end, React/Next on the front, Node + Postgres + BullMQ + multi-provider LLM on the back. Two-year track record of delivering AI-assisted features in production, from a 2023 research tool on GPT-3.5/4 to a 2026 proof engine using the Vercel AI SDK, Anthropic, OpenAI, OpenRouter, and a custom MCP server layer.",
    "Career-changer. Worked in sales for ten years across Poland and the UK before self-teaching into software via OpenClassrooms and the London Java Community. Junior in 2020, mid in 2022, senior/lead by 2025.",
    "Available for senior / staff / founding-engineer roles. Hybrid or remote.",
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
      "\"Agent skills produce data\" pattern",
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

export const portfolio: PortfolioCard[] = [
  {
    id: "proof-library",
    order: 1,
    visible: true,
    title: "Proof Library",
    company: "Stealth sales-AI startup",
    role: "Owned the proof store end-to-end: dashboard, ingestion, server-side LLM tagging, and CEO-facing delivery summaries. Co-created and shipped an autonomous AI bug-triage system that opens fix PRs on its own.",
    stack: ["TypeScript", "React", "Supabase", "Vercel AI SDK", "MCP"],
    focus:
      "AI-native product development with architectural decisions driven by CEO-level requirements.",
  },
  {
    id: "slate-iq",
    order: 2,
    visible: true,
    title: "SlateIQ",
    company: "Noah Media Group",
    role: "Built the film-success prediction tool. Combined IMDB, social, piracy, and market data into a comp-matching workflow.",
    stack: ["TypeScript", "React", "Node", "MongoDB", "BullMQ", "OpenAI"],
    focus:
      "5+ third-party data integrations; pragmatic decision to keep comp-matching human-driven rather than over-engineer ML.",
    image: "/img/portfolio-slate-iq.png",
  },
  {
    id: "ai-research-assistant",
    order: 3,
    visible: true,
    title: "AI-powered research assistant",
    company: "Noah Media Group",
    role: "Co-built with the CTO. A documentary-research tool on GPT-3.5/4 in 2023. Paired on architecture and prompt strategy; owned significant chunks of the implementation.",
    stack: ["TypeScript", "React", "Node", "OpenAI", "Cheerio", "Puppeteer"],
    focus:
      "Early-adopter AI productisation; integration tests running live LLM calls with graded responses, years before this became standard practice.",
  },
  {
    id: "routes-wallet",
    order: 4,
    visible: true,
    title: "Routes Wallet",
    company: "Self-initiated mobile app (iOS)",
    role: "Solo-built a React Native iOS app to test market demand for a universal cycling-route wallet. A single home for routes scattered across Garmin, Strava, Komoot, Ride with GPS, and the inevitable Google Docs cycling clubs end up maintaining.",
    stack: ["React Native", "iOS", "TypeScript"],
    focus:
      "Product judgement under uncertainty. Real market test with a London cycling club returned an honest \"we have three apps already\" signal. Killed the project rather than push past the data.",
    image: "/img/portfolio-routes-wallet.png",
  },
  {
    id: "film-production-tracking",
    order: 5,
    visible: true,
    title: "Film production tracking platform",
    company: "Noah Media Group",
    role: "Worked directly with the CEO and Skyscanner co-founder Bonamy Grimes. Drove database design and early prototypes that gave leadership visibility into production progress.",
    stack: ["TypeScript", "React", "Node", "MongoDB"],
    focus:
      "Stakeholder-facing product work and executive collaboration. Database design exposed production progress at the leadership level.",
  },
  {
    id: "connect4-meetings",
    order: 6,
    visible: false,
    title: "Meeting productivity platform",
    company: "Connect4",
    role: "Ported the Blaze front-end to React; shipped agenda drag-and-drop and recurring meeting templates.",
    stack: ["React", "Meteor.js", "WebSockets"],
    focus: "Reactive DB-driven architectures; unidirectional data flow.",
  },
  {
    id: "wutzu-stores-panel",
    order: 7,
    visible: false,
    title: "Stores panel",
    company: "Wutzu Technologies",
    role: "Refactored the MVP codebase; shipped the first production stores panel, \"still in use in some areas to this day\" (Hevar Abrihem, 2021).",
    stack: ["JavaScript", "Node", "Payments API"],
    focus: "First production refactor at scale; junior → mid arc.",
  },
];

export const experience: WorkExperience[] = [
  {
    id: 6,
    period: "2025 Jul - 2026 Jun",
    position: "Senior Software Engineer / Product Engineer",
    company: "Stealth sales-AI startup (GrowthNation)",
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
    stack: ["TypeScript", "React", "Node", "Express", "MongoDB", "BullMQ", "OpenAI"],
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
      "\"Deliveroo for small independent London shops.\" Worked on order / basket creation and external payment integration via API. Intern → developer in 7 months.",
    highlights: [
      "Refactored the MVP codebase and shipped the first production stores panel (Hevar Abrihem: \"still in use in some areas to this day\").",
      "Built order and basket flows with external payment-API integration.",
      "Promoted from Intern to JavaScript Developer in seven months.",
    ],
    stack: ["JavaScript", "React", "Node", "Firebase", "Redux", "Webpack", "Payments API"],
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
    context: "Named industry figure (Snyk, Tessl); validates the freelance era.",
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
  portfolio,
  experience,
  education,
  certifications,
  testimonials,
};

export default portfolioData;
