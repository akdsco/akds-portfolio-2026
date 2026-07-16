import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { experience } from "@/data/portfolio";

import { Experience } from "./experience";

const roleFor = (company: string) =>
  experience.find((r) => r.company === company)!;

describe("Experience", () => {
  it("links a company that still has a site", () => {
    render(<Experience />);

    const link = screen.getAllByRole("link", { name: "GrowthNation" })[0]!;
    expect(link).toHaveAttribute("href", "https://growthnation.ai");
    expect(link).toHaveAttribute("target", "_blank");
  });

  // The sentinel must render as text, never as a link to nowhere. Connect4's
  // origin is unreachable, so it's the honest fixture for a dead site.
  it("renders a company with no live site as plain text", () => {
    render(<Experience />);

    expect(screen.getAllByText("Connect4")[0]).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Connect4" }),
    ).not.toBeInTheDocument();
  });

  // jsdom derives the list role from the tag, so getByRole("list") passes with
  // or without this — hence the explicit attribute assertion. Tailwind preflight
  // sets list-style:none, and WebKit drops list semantics when it does, so the
  // role has to be stated or VoiceOver never announces "list, N items".
  it("keeps list semantics under list-style:none", () => {
    render(<Experience />);
    const role = roleFor("GrowthNation");

    expect(
      screen.getByRole("list", { name: `${role.position} at ${role.company}` }),
    ).toHaveAttribute("role", "list");
  });

  it("renders every highlight for a role", () => {
    render(<Experience />);
    const role = roleFor("GrowthNation");

    const list = screen.getByRole("list", {
      name: `${role.position} at ${role.company}`,
    });
    expect(within(list).getAllByRole("listitem")).toHaveLength(
      role.highlights.length,
    );
  });

  it("linkifies an inline link inside a highlight", () => {
    render(<Experience />);

    const link = screen.getByRole("link", { name: "SlateIQ" });
    expect(link).toHaveAttribute("href", "https://slateiq.com/");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the highlight prose around the link, not the raw markup", () => {
    render(<Experience />);

    expect(screen.queryByText(/\]\(https/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/film success prediction/, { exact: false }),
    ).toBeInTheDocument();
  });
});
