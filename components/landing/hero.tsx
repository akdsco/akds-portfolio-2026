import Image from "next/image";

import { about, hero, profile } from "@/data/portfolio";

const HIGHLIGHT = "AI-native software";
const [ledeBefore, ledeAfter] = hero.tagline.split(HIGHLIGHT);

export function Hero() {
  return (
    <section className="border-line relative border-b">
      <div className="scanline pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-6 py-14 md:px-10">
        {/* Brand photo, pinned top-right with corner ticks. */}
        <div className="absolute top-12 right-6 hidden -rotate-2 md:block">
          <div className="relative">
            <div className="border-line h-[132px] w-[116px] overflow-hidden rounded-[3px] border">
              <Image
                src={profile.brandImage}
                alt={profile.fullName}
                width={116}
                height={132}
                priority
                className="h-full w-full scale-[1.24] object-cover object-[50%_34%]"
              />
            </div>
            <span className="border-hi absolute -top-[5px] -left-[5px] size-3 border-t border-l" />
            <span className="border-hi absolute -top-[5px] -right-[5px] size-3 border-t border-r" />
            <span className="border-hi absolute -bottom-[5px] -left-[5px] size-3 border-b border-l" />
            <span className="border-hi absolute -right-[5px] -bottom-[5px] size-3 border-r border-b" />
          </div>
        </div>

        {/* Terminal prompt (static; wired to the command palette later). */}
        <div className="text-dim mb-6 flex items-center gap-2 font-mono text-[12.5px]">
          <span className="text-brand">$</span>
          <span>cat ~/about.md</span>
          <span className="bg-brand animate-blink inline-block h-[15px] w-2 translate-y-0.5" />
        </div>

        <h1 className="text-ink mb-2 text-4xl font-semibold tracking-tight sm:text-[44px]">
          {about.name}
        </h1>
        <div className="text-brand mb-6 font-mono text-[13px]">
          {about.tagline}
        </div>

        <p className="text-ink mb-6 max-w-xl text-xl leading-relaxed font-medium text-pretty">
          {ledeBefore}
          <span className="text-hi">{HIGHLIGHT}</span>
          {ledeAfter}
        </p>

        {about.paragraphs.map((para) => (
          <p
            key={para.slice(0, 24)}
            className="text-dim mb-3.5 max-w-2xl text-base leading-7 text-pretty"
          >
            {para}
          </p>
        ))}

        <div className="text-dim mt-6 flex items-center gap-2 font-mono text-xs">
          <span className="bg-hi animate-pulse-dot size-[7px] rounded-full shadow-[0_0_8px_var(--hi)]" />
          <span>
            {profile.availability} · {profile.location}
          </span>
        </div>
      </div>
    </section>
  );
}
