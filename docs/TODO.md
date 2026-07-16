# TODO

Open work, deliberately kept out of `CLAUDE.md` — that file is loaded into every
AI session, so it holds rules that stay true, not state that goes stale. Delete
items here when they land; the code and git history are the record, so there's no
value in a graveyard of ticked boxes.

## Open

- **OG card renders in the wrong typeface.** `app/opengraph-image.tsx` sets
  `fontFamily: "monospace"` on the `$ whoami` prompt and the footer, but Satori
  (the `ImageResponse` renderer) ships only a default sans and silently ignores
  fonts it hasn't been given — so the terminal motif isn't actually landing. Fix
  is to load a mono font file and pass it via the `fonts` option. Cosmetic, and
  invisible unless you compare the card against the site.
- **`app/sitemap.ts` emits no `lastModified`.** Crawlers use it to prioritise
  recrawls. Needs a real source of truth — a hand-maintained date per project in
  `data/portfolio.ts`, or git commit times at build. Skipped so far because a
  fabricated timestamp (e.g. `new Date()` at build) is worse than none: it tells
  Google everything changed on every deploy.

## Ideas, not committed

- **Mono favicon.** `app/icon.png` is derived from the owner's portrait, so it
  reads soft at 16px. An "akds" glyph or wordmark would be sharper at tab size.
  Swap is a file replace — see the Icons note in `CLAUDE.md`.
