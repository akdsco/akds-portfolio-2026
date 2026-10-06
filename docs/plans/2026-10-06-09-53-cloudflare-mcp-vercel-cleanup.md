# cloudflare mcp + vercel cleanup

- Date: 2026-10-06 09:53
- Branch: add-cloudflare-mcp

## Tickets

- Resolves:
- Refs:

## Problem / Context

Follow-up to the Cloudflare migration (#20). Two jobs:

1. **Commit `.mcp.json`** so the Cloudflare MCPs (docs + graphql analytics,
   read-only) are available across machines, matching hub-velo's setup.
2. **Audit + remove residual Vercel-as-host references and refresh docs** now
   that the site is on Cloudflare Pages.

**Critical distinction from the audit** — two kinds of "Vercel" in the repo:
- **Vercel-as-our-host** → remove/update (this cleanup).
- **"Vercel AI SDK" / "Vercel" as tech akds actually used** in his CV, skills and
  case studies (`data/portfolio.ts`, `docs/content-pack.md`,
  `docs/portfolio-research.md`, `docs/case-studies/`, `docs/design-brief.md`) →
  **LEFT UNTOUCHED**. That's real professional history; rewriting it would falsify
  the CV (and violates the "never invent/alter history" rule).

Audit findings — code is already Vercel-free (deps + config removed in #20). What
remains to touch:
- `.gitignore` — stale `# vercel` / `.vercel` lines.
- `CLAUDE.md` — Stack lists `@vercel/analytics`; `.nvmrc` "for Vercel parity";
  Metadata section greps `.next/server/app/` (now `out/` under static export); no
  Deployment section.

Deliberately NOT touched (historical / not-our-host):
- `BOOTSTRAP_PROMPT.md`, old `docs/plans/*` — point-in-time records, kept as-is.
- `lib/og-card.tsx` comment's `@vercel/nft` — that's Next's internal file-tracer
  (Node File Trace), a build dep regardless of host; its point ("fonts read only
  at build") is still true under static export.

## Plan

1. Add `.mcp.json` (cloudflare-docs + cloudflare-graphql).
2. Drop the stale `.vercel` block from `.gitignore`.
3. `CLAUDE.md`: analytics → Cloudflare Web Analytics; `.nvmrc` parity wording →
   Cloudflare; Metadata grep target `.next/server/app/` → `out/`; add a concise
   `## Deployment` section (Cloudflare Pages static export, build cmd, out dir,
   `_redirects`/`_headers`, force-static, akds.dev).
4. Verify: typecheck + lint + test still green (no code touched, but prove it);
   PR. Owner merges.

## Increments (test-first)

Docs/config only — no unit surface. Verification is the existing green suite
(nothing in the app changed) plus a read-through for accuracy.

1. `.mcp.json` added.
2. `.gitignore` stale Vercel block removed.
3. `CLAUDE.md` updated (4 spots above).
4. `npm run typecheck && npm run lint && npm run test` all green.

## Notes

- `.mcp.json` committed (not gitignored) so it's shared — it only names public
  remote MCP endpoints; no secrets.
