// The Twitter card reuses the OpenGraph card verbatim — same 1200×630 art.
// Re-exporting keeps a single source; Next picks these up via the file convention.
// `dynamic` can't be re-exported — Next must parse it directly in each route
// file — so it's declared here and the rest come from the single source.
export const dynamic = "force-static";
export { default, size, contentType, alt } from "./opengraph-image";
