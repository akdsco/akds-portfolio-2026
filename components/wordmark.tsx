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
 * `flare` splits the mark into per-letter spans and buys the headroom the
 * lift needs, for the coral wave shared by the nav and the footer. Two triggers
 * drive the same wave: `runId` (the nav, bumped per hover so the keyframe
 * replays) and `play` (the footer, flipped true once at the bottom of the page).
 * Opt-in, because the split costs kerning (see `fontKerning`) and only these
 * surfaces need it.
 */
export function Wordmark({
  className,
  style,
  flare = false,
  runId = 0,
  play = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  /** Split into letters for the coral wave, and add the lift's headroom. */
  flare?: boolean;
  /** Nav trigger: bump to replay the wave (re-keys the letters to restart it). */
  runId?: number;
  /** Footer trigger: run the wave once (no replay). */
  play?: boolean;
}) {
  return (
    <span
      // shrink-0: this is a flex item, and letting it shrink below the mark's
      // width means `overflow-hidden` (the crop) clips the last letter sideways.
      // Kept at content width, the crop only ever bites the bottom, as intended.
      className={cn("flex shrink-0 overflow-hidden", className)}
      // Absent until a trigger actually fires, so the letters sit still on mount.
      data-wave={flare && (runId > 0 || play) ? "" : undefined}
      style={{
        height: flare
          ? `calc(${WORDMARK_CLIP_HEIGHT} + ${WORDMARK_LIFT_HEIGHT})`
          : WORDMARK_CLIP_HEIGHT,
        // The headroom the lift travels through. The box grows upward by exactly
        // what the text is pushed down by, so the bottom cut — the edge the nav
        // border lines up with — does not move.
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
        {flare
          ? Array.from(WORDMARK).map((letter, i) => (
              <span
                // Index is the identity: the letters are a fixed string. runId
                // in the key forces the remount that replays the nav's wave (CSS
                // won't restart a keyframe on a live element); the footer plays
                // once, so its stable 0 is fine.
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
