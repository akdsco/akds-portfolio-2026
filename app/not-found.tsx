import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-6 px-4 py-16">
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Nothing here yet.
        </h1>
        <p className="text-muted-foreground max-w-prose">
          This page isn&apos;t built. Head back to the homepage.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back home
        </Link>
      </main>
    </>
  );
}
