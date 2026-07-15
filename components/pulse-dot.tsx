/**
 * Decorative "live status" dot with a soft pulse + glow.
 *
 * Alignment is the caller's job: put it in a flex row with `items-center` and
 * the dot sits dead-centre on the text block — correct for a single line and
 * for a wrapped multi-line label alike. (No line-height wrapper: that would
 * pin the dot to the first line instead of centring on the whole block.)
 */
export function PulseDot() {
  return (
    <span
      aria-hidden
      className="bg-hi animate-pulse-dot size-[7px] shrink-0 rounded-full shadow-[0_0_8px_var(--hi)]"
    />
  );
}
