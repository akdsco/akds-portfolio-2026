// The root card, verbatim — same art, same "AI Engineer · London" caption. `/`
// redirects here, so this link IS the home page and keeps the role caption
// rather than reading "About".
//
// It exists only so this segment OWNS an image. page.tsx declares its own
// openGraph to title the card "about", and a page-level openGraph replaces the
// layout's rather than merging into it — which drops the image /about would
// otherwise inherit from app/opengraph-image.tsx, and ships the page with no
// card at all.
export { default, size, contentType, alt } from "../opengraph-image";
