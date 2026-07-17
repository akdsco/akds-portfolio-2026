import Link from "next/link";

// Nav + footer come from the root layout; render only the page content here.
export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col items-start justify-center gap-6 px-6 pt-24 pb-6 md:px-10">
      <p className="text-faint font-mono text-sm">404</p>
      <h1 className="text-ink text-4xl font-semibold tracking-tight sm:text-5xl">
        Nothing here yet.
      </h1>
      <p className="text-dim max-w-prose">
        This page isn&apos;t built. Head back to the homepage.
      </p>
      <Link
        href="/about"
        className="border-line bg-chip text-ink hover:border-hi rounded-md border px-4 py-2 font-mono text-sm transition-colors"
      >
        Back home
      </Link>
    </div>
  );
}
