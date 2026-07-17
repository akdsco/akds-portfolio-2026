/**
 * The "akds" wordmark, cut off by whatever edge it sits against — the nav's
 * bottom border, the page's bottom edge, the social card's frame.
 *
 * The crop is a RATIO of the font size, never a pixel offset. That's the whole
 * point of this file: the three places render at wildly different sizes (38px in
 * the nav, ~208px in the footer, 460px on a card), and when each carried its own
 * hand-tuned offset they drifted to 76% / 56% / 74% visible — near enough to look
 * like a mistake rather than a motif. One number keeps them identical.
 */
export const WORDMARK = "akds";

/**
 * Fraction of the em box left visible; the rest is cut off by the edge.
 *
 * Geist's baseline sits ~0.80em below the em-box top, so this is what decides how
 * far into the letterforms the cut bites: 0.74 shaved only ~12% of the x-height
 * (barely a sliver), 0.67 takes ~25%, 0.63 takes ~33% (too much — the bowls of
 * "a" and "s" go). Below ~0.58 the mark stops being legible at all, and it has to
 * survive at the nav's 38px, not just the card's 460px.
 */
export const WORDMARK_VISIBLE = 0.67;

/** Tight tracking is part of the mark — it reads as a logo, not as running text. */
export const WORDMARK_TRACKING = "-0.055em";

/**
 * How far a letter rises at the peak of the nav's hover flare — a ratio of font
 * size, for the same reason the crop is (3px is a hop at 38px and invisible at
 * 460px).
 *
 * The mark has no headroom by default: the text sits flush at the top of a box
 * that clips, so a letter animated upward gets its head cut off rather than
 * lifted. The clip box grows by exactly this much and the text is pushed down to
 * match, which buys travel while leaving the bottom cut — the thing the nav
 * border lines up with — exactly where it was.
 */
export const WORDMARK_LIFT = 0.08;

/**
 * CSS height for a clip container: `74%` of its own font size. Requires the
 * container to set `font-size` and `overflow: hidden`, with the text inside at
 * `line-height: 1` so the em box and the line box agree. The container must not
 * shrink below its content width (`shrink-0` when it's a flex item), or the
 * overflow clip bites the mark sideways instead of only cropping the bottom.
 */
export const WORDMARK_CLIP_HEIGHT = `${WORDMARK_VISIBLE}em`;

/** CSS length of the flare's lift, for the clip box's headroom and the keyframe. */
export const WORDMARK_LIFT_HEIGHT = `${WORDMARK_LIFT}em`;

/**
 * How far the whole word rises on hover (nav mark), as a ratio of font size like
 * everything else here. This is a UNISON lift of all letters at once — the plain
 * hover response — distinct from the staggered flare wave above.
 *
 * It stacks with the wave: a hovered mark that then dwells long enough to flare
 * has both lifts on at once. So the clip box reserves headroom for BOTH (this +
 * the flare lift), or a waving-while-hovered letter would rise past its own clip
 * edge and lose its top. `Wordmark`'s `hoverLift` adds exactly this much on top
 * of the flare headroom.
 */
export const WORDMARK_HOVER_LIFT = 0.08;

/** CSS length of the hover lift, for the clip box's headroom and the transform. */
export const WORDMARK_HOVER_LIFT_HEIGHT = `${WORDMARK_HOVER_LIFT}em`;

/** Pixel height of the clip container for a given font size — for Satori, which
 *  needs concrete numbers rather than `em`. */
export const wordmarkClipPx = (fontSize: number) =>
  Math.round(fontSize * WORDMARK_VISIBLE);
