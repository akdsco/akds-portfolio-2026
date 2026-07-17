# Repo rules — akds-portfolio-2026 (additive to core)

Read by `/ts-code-review` on top of its shipped `rules/00`–`40`. These add
house-specific invariants; they never lower a core severity.

## Inline style: dynamic-only — ⚠️ / 💡

This project styles with Tailwind v4 + theme tokens (`app/theme.css`). Inline
`style={{}}` is for values that CANNOT be a static class, not a shortcut around
one. The point of this rule is to keep the occasional legitimate inline style
(the wordmark's crop geometry, the flare's CSS-variable API) from drifting into
a habit of hand-styling in JSX.

**Flag (⚠️) — static design values inlined, bypassing the system:**

- A hardcoded colour / spacing / radius / font-weight literal in `style` that
  duplicates a theme token or an existing utility —
  `style={{ color: "#e2725b" }}`, `style={{ marginTop: 16 }}`. It won't track
  the token across light/dark, and the next hardcoded value will disagree with
  it. Use the token (`text-hi`, a `--*` var) or the utility.

**Flag (💡) — a static value that just wants to be a utility:**

- `style={{ lineHeight: 1 }}` → `leading-none`, `style={{ display: "flex" }}` →
  `flex`, and the like. Non-blocking; batch them.

**Allow (never flag) — genuinely dynamic, no static class form:**

- CSS custom properties: `style={{ "--i": i }}`, `--flare-*`, `--wordmark-lift`
  — the JS→keyframe API, where the value is the interface.
- `calc()` or values derived from a TS constant, e.g.
  `` height: `calc(${WORDMARK_CLIP_HEIGHT} + ${WORDMARK_LIFT_HEIGHT})` ``.
- Per-instance or prop-driven values — a `fontSize` passed by the caller, a
  computed transform.
- Properties with no core Tailwind utility (`fontKerning`) where an arbitrary
  class would be no cleaner than the inline declaration.

The test: **could this be a static class or token?** If yes, it should be. If
it's a variable, a computed value, or a prop, inline is correct — leave it.
