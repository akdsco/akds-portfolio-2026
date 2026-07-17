# TODO

Open work, deliberately kept out of `CLAUDE.md` — that file is loaded into every
AI session, so it holds rules that stay true, not state that goes stale. Delete
items here when they land; the code and git history are the record, so there's no
value in a graveyard of ticked boxes.

## Open

- **`app/sitemap.ts` emits no `lastModified`.** Crawlers use it to prioritise
  recrawls. Needs a real source of truth — a hand-maintained date per project in
  `data/portfolio.ts`, or git commit times at build. Skipped so far because a
  fabricated timestamp (e.g. `new Date()` at build) is worse than none: it tells
  Google everything changed on every deploy.

- **Short case studies don't light every TOC entry on tall viewports.** The
  scrollspy in `components/case-study/toc.tsx` marks a section current once its
  heading crosses a reading line near the top of the viewport, and forces the
  last section at the foot of the page. On the shortest case study
  (`ai-research-assistant`) at a viewport over ~840px tall, the page runs out of
  scroll before the second-to-last section (Outcome) reaches the line, so it
  never highlights. The real fix is a longer page: an endorsement, or writing the
  section bodies out further. A viewport-proportional pad under the content would
  also do it but costs most of a screen of whitespace under every study.

## Ideas, not committed

- **Mono favicon.** `app/icon.png` is derived from the owner's portrait, so it
  reads soft at 16px. An "akds" glyph or wordmark would be sharper at tab size.
  Swap is a file replace — see the Icons note in `CLAUDE.md`.
