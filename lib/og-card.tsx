import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { WORDMARK, WORDMARK_TRACKING, wordmarkClipPx } from "@/lib/wordmark";

/** Sized so the mark spans the card; the crop ratio is shared, not the size. */
const WORDMARK_FONT_SIZE = 460;

/**
 * The social card, shared by every `opengraph-image`/`twitter-image` route.
 *
 * One brand mark, one varying caption: "akds" is always the art, and only the
 * small line changes (role + location on generic pages, the project name on a
 * case study). The wordmark bleeds off the bottom edge on purpose — these cards
 * are viewed at a couple of hundred pixels wide in a chat thread, where a
 * centred paragraph is unreadable but a cropped wordmark still reads.
 */
export const SIZE = { width: 1200, height: 630 };
export const CONTENT_TYPE = "image/png";
export const ALT = "akds : Software Engineer, London";

/** Dark palette from app/theme.css as hex — Satori doesn't parse oklch. */
const COLORS = {
  base: "#0e1116", // --base
  ink: "#f1f3f5", // --ink
  dim: "#a8adb4", // --dim
  faint: "#7c828a", // --faint
  hi: "#e8654a", // --hi (coral accent)
};

/**
 * Satori only reads ttf/otf/woff — **not woff2**, which is all
 * `next/font/google` emits. So the wordmark can't reuse the site's already-loaded
 * font and needs its own binary committed to the repo.
 *
 * Read from disk rather than `fetch(new URL(..., import.meta.url))`: these are
 * Node-runtime routes, where that resolves to a `file://` URL and Node's fetch
 * rejects it outright ("not implemented... yet...").
 *
 * No `outputFileTracingIncludes` needed for the .ttf files: @vercel/nft resolves
 * this `join()` statically, and every card route prerenders anyway, so the fonts
 * are only read at build. Verified 2026-07-16 by building with the tracing config
 * removed — all six routes still traced both files.
 */
async function loadFonts() {
  const dir = join(process.cwd(), "lib/fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(dir, "Geist-400.ttf")),
    readFile(join(dir, "Geist-800.ttf")),
  ]);
  return [
    {
      name: "Geist",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: bold,
      weight: 800 as const,
      style: "normal" as const,
    },
  ];
}

/** Renders the card with `caption` as the small line above the wordmark. */
export async function renderOgCard(caption: string) {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.base,
        fontFamily: "Geist",
        overflow: "hidden",
        borderLeft: `12px solid ${COLORS.hi}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 40,
          fontWeight: 400,
          color: COLORS.dim,
          position: "absolute",
          top: 64,
          left: 72,
        }}
      >
        {caption}
      </div>

      {/* Clip container pinned to the bottom edge; its height is the shared
          ratio of the font size (lib/wordmark.ts), so this crops identically to
          the nav and the footer. Satori needs concrete pixels, hence the helper
          rather than the `em` the CSS callers use. */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 0,
          left: 60,
          height: wordmarkClipPx(WORDMARK_FONT_SIZE),
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: WORDMARK_FONT_SIZE,
            fontWeight: 800,
            letterSpacing: WORDMARK_TRACKING,
            // faint, matching the nav. Unlike the site, this card can't respond
            // to the viewer's theme — it's a baked PNG, always the dark palette.
            color: COLORS.faint,
            lineHeight: 1,
          }}
        >
          {WORDMARK}
        </div>
      </div>
    </div>,
    { ...SIZE, fonts: await loadFonts() },
  );
}
