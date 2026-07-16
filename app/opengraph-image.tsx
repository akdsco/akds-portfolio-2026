import { ImageResponse } from "next/og";

import { profile } from "@/data/portfolio";
import { SOCIAL_IMAGE } from "@/lib/site";

// Site-wide social card. Next serves this for `og:image`; app/twitter-image.tsx
// re-exports it for the Twitter card. Dimensions and alt come from SOCIAL_IMAGE
// so pages that reference the card in their own `openGraph` describe the same
// image this route actually renders. 1200×630 is the standard large-image size.
export const size = { width: SOCIAL_IMAGE.width, height: SOCIAL_IMAGE.height };
export const contentType = "image/png";
export const alt = SOCIAL_IMAGE.alt;

// Dark palette from app/theme.css, converted to hex — Satori (the ImageResponse
// renderer) doesn't parse oklch. Keep in sync with the `.dark` tokens there.
const COLORS = {
  base: "#0e1116", // --base
  ink: "#f1f3f5", // --ink
  dim: "#a8adb4", // --dim
  faint: "#7c828a", // --faint
  brand: "#4fd8c9", // --brand (cyan prompt)
  hi: "#e8654a", // --hi (coral accent)
  line: "rgba(255,255,255,0.1)", // --line
};

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.base,
        padding: "72px 80px",
        borderLeft: `10px solid ${COLORS.hi}`,
      }}
    >
      {/* terminal prompt, echoing the site's `$` motif */}
      <div
        style={{
          display: "flex",
          fontSize: 30,
          fontFamily: "monospace",
          color: COLORS.brand,
        }}
      >
        $ whoami
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: COLORS.ink,
            lineHeight: 1.05,
          }}
        >
          {profile.fullName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 42,
            color: COLORS.dim,
            marginTop: 20,
          }}
        >
          Software Engineer · {profile.location}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 26,
          fontFamily: "monospace",
          color: COLORS.faint,
          borderTop: `1px solid ${COLORS.line}`,
          paddingTop: 28,
        }}
      >
        <span>arkadiusz.tech</span>
        <span style={{ color: COLORS.brand }}>
          Selected work · case studies
        </span>
      </div>
    </div>,
    { ...size },
  );
}
