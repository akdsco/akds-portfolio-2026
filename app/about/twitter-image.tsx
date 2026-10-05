// The Twitter card reuses the /about OpenGraph card verbatim.
// `dynamic` can't be re-exported — Next must parse it directly in each route
// file — so it's declared here and the rest come from the single source.
export const dynamic = "force-static";
export { default, size, contentType, alt } from "./opengraph-image";
