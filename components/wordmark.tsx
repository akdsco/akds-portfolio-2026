import {
  WORDMARK,
  WORDMARK_CLIP_HEIGHT,
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
 */
export function Wordmark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("flex overflow-hidden", className)}
      style={{ height: WORDMARK_CLIP_HEIGHT, lineHeight: 1, ...style }}
    >
      <span style={{ lineHeight: 1, letterSpacing: WORDMARK_TRACKING }}>
        {WORDMARK}
      </span>
    </span>
  );
}
