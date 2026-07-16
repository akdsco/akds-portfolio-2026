// The hover-lift shared by testimonial and project cards.
//
// Two things this gets right that a plain `hover:-translate-y-1` on the card
// does not:
//
// 1. The hover target is the wrapper, which never moves. Hovering the card
//    itself lifts it out from under the cursor, which un-hovers it, which drops
//    it back onto the cursor — it oscillates for as long as you rest in the
//    bottom few px. The wrapper keeps the card's resting footprint, so the
//    hover state is stable wherever the cursor sits.
// 2. The shadow fades a pseudo-element's opacity instead of animating
//    box-shadow. Animating the shadow itself repaints a 34px blur every frame;
//    opacity composites. Only transform and opacity move here.
//
// Reduced motion keeps the shadow fade (opacity is not travel) and drops the
// lift.
//
// Note the transition names `translate`, not `transform`: Tailwind v4 emits
// `-translate-y-1` as the standalone `translate` property. Listing `transform`
// (as this did before) transitions a property nothing is animating, so the lift
// snaps 4px instantly while the shadow eases — which is what read as "jumpy".

/** Goes on the static wrapper — the element the cursor actually hovers. */
export const cardLiftWrap = "group";

/**
 * Goes on the card inside that wrapper. The card must establish its own
 * containing block (`relative`) and set its own radius — the shadow inherits it.
 */
export const cardLift = [
  "transition-[translate,border-color] duration-200 ease-out",
  "group-hover:-translate-y-1",
  "motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
  "after:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.6)]",
  "after:opacity-0 after:transition-opacity after:duration-200 after:ease-out",
  "group-hover:after:opacity-100",
].join(" ");
