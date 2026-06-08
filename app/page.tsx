import { SiteNav } from "@/components/site-nav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Hi, I&apos;m Arkadiusz
        </h1>
      </main>
    </>
  );
}
