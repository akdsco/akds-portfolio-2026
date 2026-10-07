import Image from "next/image";
import { Fragment } from "react";

import { HeroPrompt } from "@/components/command-palette";
import { HeroBand } from "@/components/hero-band";
import { LinkedText } from "@/components/linked-text";
import { PulseDot } from "@/components/pulse-dot";
import { about, hero, profile } from "@/data/portfolio";
import { splitLede } from "@/lib/hero-lede";

const {
  before: ledeBefore,
  highlight: ledeHighlight,
  after: ledeAfter,
} = splitLede(hero.tagline);

export function Hero() {
  return (
    <HeroBand className="max-w-3xl py-14">
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
              className="h-full w-full scale-[1.04] object-cover object-[50%_38%]"
            />
          </div>
          <span className="border-hi absolute -top-[5px] -left-[5px] size-3 border-t border-l" />
          <span className="border-hi absolute -top-[5px] -right-[5px] size-3 border-t border-r" />
          <span className="border-hi absolute -bottom-[5px] -left-[5px] size-3 border-b border-l" />
          <span className="border-hi absolute -right-[5px] -bottom-[5px] size-3 border-r border-b" />
        </div>
      </div>

      {/* Terminal prompt: opens the command palette. */}
      <div className="mb-6">
        <HeroPrompt command="cat ~/about.md" />
      </div>

      <h1 className="text-ink mb-2 text-4xl font-semibold tracking-tight sm:text-[44px]">
        {about.name}
      </h1>
      {/* "AI Engineer · TypeScript · Python" on one line, held there down to the
          375px target (the whole string is ~255px at 13px mono, and the content
          box is ~327px at 375px). It only wraps below that, and when it does each
          "·" stays glued to the chunk before it: every non-last chunk carries its
          trailing separator *inside* the same `whitespace-nowrap` group, and the
          only break opportunity is the ordinary space between groups. So a "·"
          can never lead a line or jump down with the chunk that follows it. */}
      <div className="text-brand mb-6 font-mono text-[13px]">
        {about.tagline.map((chunk, i) => (
          <Fragment key={chunk}>
            {i > 0 && " "}
            <span className="whitespace-nowrap">
              <span>{chunk}</span>
              {i < about.tagline.length - 1 && <span> ·</span>}
            </span>
          </Fragment>
        ))}
      </div>

      <p className="text-ink mb-6 max-w-xl text-xl leading-relaxed font-medium text-pretty">
        {ledeBefore}
        <span className="text-hi">{ledeHighlight}</span>
        {ledeAfter}
      </p>

      {/* Keyed by index: a prose prefix is no longer a safe key now that a
          paragraph may carry `[label](url)` link markup. */}
      {about.paragraphs.map((para, index) => (
        <p
          key={index}
          className="text-dim mb-3.5 max-w-2xl text-base leading-7 text-pretty"
        >
          <LinkedText text={para} />
        </p>
      ))}

      <div className="text-dim mt-6 flex items-center gap-2 font-mono text-xs">
        <PulseDot />
        <span>
          {profile.availability} · {profile.location}
        </span>
      </div>
    </HeroBand>
  );
}
