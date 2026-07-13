# Command palette (AI slash-commands): design brief + implementation reference

A "nice to have" enhancement for the landing hero. This file is both the prompt to
paste into the Claude design session and our own reference for building it later.

Concept: the hero already renders a terminal prompt (`$ cat ~/about.md`). Make that
prompt interactive. Pressing `/` or Enter (or Cmd/Ctrl+K) opens a small command
palette styled as AI slash-commands, offering real navigation actions. It is a wink
at what the owner actually builds (Claude Code skills, MCP servers), so the metaphor
is earned, not decorative.

---

## Prompt for the Claude design session

Extend the landing hero you designed. The hero shows a terminal prompt
(`$ cat ~/about.md`). Turn it into an interactive command palette, in the same
"tasteful dev-coded" style (dark-first, monospace accent, one signal accent color,
no cosplay). Deliver it as a self-contained interactive HTML artifact (inline JS/CSS)
that actually works, in both light and dark, on desktop and mobile.

### Interaction

- **Idle state:** the hero prompt shows a blinking caret and a quiet hint, e.g.
  `try /` or a small `⌘K` chip. Understated, not shouty.
- **Open:** pressing `/` or Enter (when the hero is focused) or `⌘K` / `Ctrl+K`
  (global) opens the palette anchored to the prompt. A new prompt line appears with
  a caret ready for input.
- **Suggest + filter:** a mono list of commands drops down. Typing fuzzy-filters it.
  Each row: the command (mono), a short description, and a subtle action-type tag
  (go / download / external / toggle).
- **Run:** Up/Down move the highlight, Enter runs the highlighted command, Esc
  closes, click/tap also runs. On mobile (no physical keyboard shortcut), the prompt
  itself is tappable and opens the same palette.

### Commands (all real actions, no joke commands)

- `/projects` : go to the Projects index (`/projects`)
- `/skills` : scroll to the Skills section
- `/experience` : scroll to the Experience timeline
- `/testimonials` : scroll to Testimonials
- `/resume` : download the CV PDF  (download)
- `/github` : open GitHub  (external)
- `/linkedin` : open LinkedIn  (external)
- `/theme` : toggle light / dark
- `/top` : back to top
- Optional single tasteful easter egg (discoverable, not slapstick), e.g.
  `/whoami` echoing a one-line identity. No `/jiggle`-style gimmicks that do nothing.

### Hard guardrails

1. **Progressive enhancement. It must never block content.** The whole landing is
   fully scannable and usable without ever opening the palette. Someone who never
   discovers it loses nothing; someone who does gets a small delight.
2. **Accessible.** Proper roles (combobox/listbox or dialog), keyboard-complete,
   visible focus, focus returns to the trigger on close, no focus trap beyond the
   open palette, respects `prefers-reduced-motion`. Screen-reader labels on every
   command.
3. **Every command is useful.** It is a real keyboard-navigation layer, not a toy.
4. **Restraint.** Matches the hero's type and spacing. One accent color. Subtle
   open/close motion, nothing bouncy.

### Deliverable

A working interactive HTML artifact showing all states (idle hint, open, typing/
filtering, highlighted selection, light and dark, mobile and desktop), plus a short
note on the tokens and the open/close/keyboard behavior so it ports to
Next.js + Tailwind v4 + Base UI (shadcn). Keep it implementable in plain CSS/JS.

---

## Implementation notes (for us, later)

- Build target: Next.js 16 App Router, Tailwind v4, Base UI primitives. Base UI has
  no prebuilt command menu; consider building on its Dialog/Popover + a listbox, or
  a small headless combobox. Reduced-motion via CSS `@media (prefers-reduced-motion)`.
- Actions map to: in-page scroll (Skills/Experience/Testimonials/top), route push
  (`/projects`), file download (`profile.cvFile`, currently empty, gate `/resume`
  until the PDF exists), external links (`profile.socials`), theme toggle (next-themes
  `setTheme`, read at click time per the hydration rule in CLAUDE.md).
- This is Phase D polish: build the core landing + pages first, add the palette after.
- Keep it optional and non-blocking so it can ship in a later, separate PR.
