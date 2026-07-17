import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { MobileToc } from "@/components/case-study/mobile-toc";

const sections = [
  { key: "problem", title: "Problem" },
  { key: "constraints", title: "Constraints" },
  { key: "approach", title: "Approach" },
];

const trigger = () =>
  screen.getByRole("button", { name: /jump to section/i });

describe("MobileToc", () => {
  test("is collapsed by default: trigger closed, panel inert", () => {
    render(<MobileToc sections={sections} />);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    // Collapse keeps the clipped list out of tab order / AT while closed.
    expect(document.getElementById("case-study-jump")).toHaveAttribute("inert");
  });

  test("opens on trigger click", () => {
    render(<MobileToc sections={sections} />);
    fireEvent.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("case-study-jump")).not.toHaveAttribute(
      "inert",
    );
  });

  test("renders one numbered jump link per section, in order", () => {
    render(<MobileToc sections={sections} />);
    fireEvent.click(trigger());
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "#problem");
    expect(links[0]).toHaveTextContent("01");
    expect(links[0]).toHaveTextContent("Problem");
    expect(links[1]).toHaveAttribute("href", "#constraints");
    expect(links[1]).toHaveTextContent("02");
    expect(links[2]).toHaveAttribute("href", "#approach");
    expect(links[2]).toHaveTextContent("03");
  });

  test("clicking a jump link closes the disclosure", () => {
    render(<MobileToc sections={sections} />);
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole("link", { name: /Problem/i }));
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });
});
