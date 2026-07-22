# palette label in name

- Date: 2026-07-22 11:15
- Branch: palette-label-in-name

## Problem / Context

Lighthouse (axe) flags a **serious** WCAG 2.5.3 (Label in Name) failure on the
`HeroPrompt` trigger button (`components/command-palette.tsx`):

- Visible text: `$ cat ~/about.md` (plus a `try / ⌘K` hint on desktop)
- Accessible name: `Open command palette` (from `aria-label`)

The `aria-label` fully overrides the visible text, so the accessible name shares
nothing with what's on screen. A voice-control user who says "click cat about
md" cannot activate it, and the visible label and spoken name are divorced.

Scored 0 by the audit but weighted 0 in the category, so it doesn't dent the
100 — but it's the one genuine accessibility defect in the report.

## Plan

Make the accessible name **contain** the visible command text while still
announcing the control's purpose, and stop non-label decoration leaking into the
comparison:

- `aria-label={`${command}, open command palette`}` — leads with the visible
  command (so it is a substring of the name) and keeps the purpose. Comma, not a
  dash (house style).
- `aria-hidden="true"` on the decorative `$`, the blinking cursor, and the
  `try / ⌘K` hint span — they are ornament/hint, not the label, so they should
  not count as visible text for the label-in-name comparison (the hint is also
  `hidden` on mobile, so it only appears on desktop).
- The `{command}` span stays the visible label.

Generic across all three call sites (`cat ~/about.md`, `ls ~/projects`,
`cat ~/projects/<slug>.md`).

The existing `command-palette.keyboard.test.tsx` `trigger()` helper matches the
button by the old `aria-label` copy ("Open command palette"); decouple it to a
role + `/command palette/i` name so a wording change stops breaking unrelated
behaviour tests (house testing convention).

## Increments (test-first)

1. test: the trigger's accessible name **includes its visible command text**
   (`getByRole('button', { name: /cat ~\/about\.md/i })`) — WCAG 2.5.3 (red:
   current name is "Open command palette") → impl: `aria-label` leads with
   `${command}`, decoration `aria-hidden` (green). Also assert the name still
   communicates the action (`/command palette/i`).
2. refactor: repoint the `trigger()` helper to the role + `/command palette/i`
   name; whole suite + typecheck green.

## Notes

- Verified against a real browser is not required here — the accessible-name
  computation is exactly what jsdom + Testing Library's `getByRole` name option
  evaluates, so the unit test is faithful. A follow-up Lighthouse re-run on the
  deployed change is the end-to-end confirmation.
