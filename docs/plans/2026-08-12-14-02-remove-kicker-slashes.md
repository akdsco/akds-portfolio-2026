# remove kicker slashes

- Date: 2026-08-12 14:02
- Branch: remove-kicker-slashes

## Tickets

<!-- The ticket(s) this plan's PR RESOLVES vs merely REFS (coordination). Paste the
     Notion URL(s); the machine keys on the UUID in the URL. /ship links the PR +
     marks In progress; /cleanup closes Resolves to Done on merge. Refs are never
     auto-closed. The TB-xx label is optional human sugar. -->

- Resolves:
- Refs:

## Problem / Context

The `Kicker` section header (`◆ // LABEL ────`) renders a decorative `//` glyph
before every section label. Reads as an AI-designer tell; owner wants it gone.

## Plan

Drop the `//` span from `components/kicker.tsx`. Keep the diamond + label +
dashed rule. Update the leading comment to match.

## Increments (test-first)

<!-- Ordered, commit-sized steps. Each becomes one meaningful commit. -->

1. Purely decorative removal, no logic and no unit surface — `Kicker` is
   presentation, which this repo deliberately does not unit-test. Verified by
   typecheck + lint + build (preflight) and the Vercel preview render.

## Notes
