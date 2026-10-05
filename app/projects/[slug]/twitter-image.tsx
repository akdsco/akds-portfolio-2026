// The Twitter card reuses the case-study OpenGraph card verbatim — same art,
// same caption. Re-exporting keeps a single source.
// `dynamic` can't be re-exported — Next must parse it directly in each route
// file — so it's declared here and the rest come from the single source.
export const dynamic = "force-static";
export {
  default,
  size,
  contentType,
  alt,
  generateStaticParams,
} from "./opengraph-image";
