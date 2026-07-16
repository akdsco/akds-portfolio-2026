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

  // The sentinel must render as text, never as a link to nowhere.
  it("renders a company with no live site as plain text", () => {
    render(<Experience />);

    expect(screen.getAllByText("Noah Media Group")[0]).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Noah Media Group" }),
    ).not.toBeInTheDocument();
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
