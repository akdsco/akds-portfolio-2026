import {
  WORDMARK,
  WORDMARK_CLIP_HEIGHT,
  WORDMARK_LIFT_HEIGHT,
  WORDMARK_TRACKING,
} from "@/lib/wordmark";
import { cn } from "@/lib/utils";

/**
 * The "akds" wordmark, cut off by the bottom of its own box.
 *
 * One component rather than two call sites styling their own, because the crop
 * is easy to get subtly wrong: `line-height: 1` has to be on the CLIP CONTAINER,
 * not just the text. A container without it inherits Tailwind's 1.5 strut, whose
 * half-leading shifts the glyphs down inside the box — so the nav cut 16.6% of
 * the font above the baseline while the footer cut 6.0%, despite both clipping
 * at an identical 0.74 of the font size. Same ratio, different glyph position.
 *
 * `display: flex` matters for the same reason: a flex item's line box is its own
 * line-height with no strut, which is what makes the text sit flush at offset 0
 * and matches how Satori lays the social cards out.
 *
 * `animated` splits the mark into per-letter spans so the nav's flare can
 * stagger them, and buys the headroom their lift needs. Opt-in, because the
 * split costs kerning — see `fontKerning` below.
 */
export function Wordmark({
  className,
  style,
  animated = false,
  runId = 0,
}: {
  className?: string;
  style?: React.CSSProperties;
  /** Render one span per letter, for the nav's flare. Nothing else needs it. */
  animated?: boolean;
  /** Bumped per flare; re-keys the letters so the animation restarts. */
  runId?: number;
}) {
  return (
    <span
      className={cn("flex overflow-hidden", className)}
      // Only once a flare has actually run, so the letters sit still on mount.
      data-wave={animated && runId > 0 ? "" : undefined}
      style={{
        height: animated
          ? `calc(${WORDMARK_CLIP_HEIGHT} + ${WORDMARK_LIFT_HEIGHT})`
          : WORDMARK_CLIP_HEIGHT,
        // The headroom the lift travels through. The box grows upward by exactly
        // what the text is pushed down by, so the bottom cut — the edge the nav
        // border lines up with — does not move.
        ...(animated && { paddingTop: WORDMARK_LIFT_HEIGHT }),
        lineHeight: 1,
        // Splitting text into spans drops kerning across the boundaries, which
        // would leave the animated mark a hair wider than the plain one. The
        // point of lib/wordmark.ts is that every surface cuts the SAME mark, so
        // kerning is off everywhere and split/unsplit agree by construction.
        fontKerning: "none",
        ...style,
      }}
    >
      <span style={{ lineHeight: 1, letterSpacing: WORDMARK_TRACKING }}>
        {animated
          ? Array.from(WORDMARK).map((letter, i) => (
              <span
                // Index is the identity: the letters are a fixed string. runId
                // in the key is what forces the remount that restarts the sweep
                // (CSS won't replay a keyframe on a live element).
                key={`${String(runId)}-${String(i)}`}
                className="wordmark-letter"
                style={{ "--i": i } as React.CSSProperties}
              >
                {letter}
              </span>
            ))
          : WORDMARK}
      </span>
    </span>
  );
}
