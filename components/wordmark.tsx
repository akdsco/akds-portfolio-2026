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
 * One component rather than call sites styling their own, because the crop is
 * easy to get subtly wrong: `line-height: 1` has to be on the CLIP CONTAINER,
 * not just the text. A container without it inherits Tailwind's 1.5 strut, whose
 * half-leading shifts the glyphs down inside the box — so the nav cut 16.6% of
 * the font above the baseline while the footer cut 6.0%, despite both clipping
 * at an identical 0.74 of the font size. Same ratio, different glyph position.
 *
 * `display: flex` matters for the same reason: a flex item's line box is its own
 * line-height with no strut, which is what makes the text sit flush at offset 0
 * and matches how Satori lays the social cards out.
 *
 * Two surfaces animate the mark and both need it split into per-letter spans:
 * `flare` is the nav's coral hover sweep (and buys the headroom its lift needs);
 * `assemble` is the footer's once-per-visit rise-into-place (no headroom — it
 * rises from below). The split is opt-in because it costs kerning (see
 * `fontKerning`), and only these two need it.
 */
export function Wordmark({
  className,
  style,
  ref,
  flare = false,
  runId = 0,
  assemble = false,
  play = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLSpanElement>;
  /** Nav: split into letters for the coral hover flare; adds the lift's headroom. */
  flare?: boolean;
  /** Bumped per flare; re-keys the letters so the keyframe replays. */
  runId?: number;
  /** Footer: split into letters for the once-per-visit assemble. */
  assemble?: boolean;
  /** Footer: run the assemble now — set once the mark has scrolled into view. */
  play?: boolean;
}) {
  const split = flare || assemble;
  return (
    <span
      ref={ref}
      className={cn("flex overflow-hidden", className)}
      // Each trigger stays absent until its animation is actually asked for, so
      // the letters sit still on mount.
      data-wave={flare && runId > 0 ? "" : undefined}
      data-assemble={assemble && play ? "" : undefined}
      style={{
        height: flare
          ? `calc(${WORDMARK_CLIP_HEIGHT} + ${WORDMARK_LIFT_HEIGHT})`
          : WORDMARK_CLIP_HEIGHT,
        // The headroom the flare's lift travels through. The box grows upward by
        // exactly what the text is pushed down by, so the bottom cut — the edge
        // the nav border lines up with — does not move. The assemble rises from
        // below into rest, so it needs none of this.
        ...(flare && {
          paddingTop: WORDMARK_LIFT_HEIGHT,
          // Same constant drives the keyframe, so the letters can't rise further
          // than the headroom bought for them.
          "--wordmark-lift": WORDMARK_LIFT_HEIGHT,
        }),
        lineHeight: 1,
        // Splitting text into spans drops kerning across the boundaries, which
        // would leave a split mark a hair wider than a plain one. The point of
        // lib/wordmark.ts is that every surface cuts the SAME mark, so kerning is
        // off everywhere and split/unsplit agree by construction.
        fontKerning: "none",
        ...style,
      }}
    >
      <span style={{ lineHeight: 1, letterSpacing: WORDMARK_TRACKING }}>
        {split
          ? Array.from(WORDMARK).map((letter, i) => (
              <span
                // Index is the identity: the letters are a fixed string. runId
                // in the key is what forces the remount that replays the flare
                // (CSS won't restart a keyframe on a live element); the assemble
                // plays once, so its stable 0 is fine.
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
