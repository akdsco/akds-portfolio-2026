import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

/**
 * Guards the strictness of the ESLint config itself. Not presentation — these
 * assert that the type-aware strict rules are actually on for source files (and
 * correctly off for plain-JS config files), so a future edit that silently
 * loosens the config fails CI instead of sliding through.
 */
function severity(entry: unknown): number {
  // Flat config exposes rules as `severity` or `[severity, ...options]`.
  const level = Array.isArray(entry) ? (entry as unknown[])[0] : entry;
  if (level === "error" || level === 2) return 2;
  if (level === "warn" || level === 1) return 1;
  return 0;
}

async function configFor(file: string): Promise<Record<string, unknown>> {
  const eslint = new ESLint();
  const config = (await eslint.calculateConfigForFile(file)) as {
    rules?: Record<string, unknown>;
  };
  return config.rules ?? {};
}

describe("eslint config strictness", () => {
  it("enables type-aware strict rules as errors on source files", async () => {
    const rules = await configFor("components/command-palette.tsx");
    for (const rule of [
      "@typescript-eslint/no-floating-promises",
      "@typescript-eslint/no-misused-promises",
      "@typescript-eslint/no-explicit-any",
      "@typescript-eslint/no-unnecessary-condition",
      "@typescript-eslint/no-confusing-void-expression",
      "@typescript-eslint/restrict-template-expressions",
    ]) {
      expect(severity(rules[rule]), rule).toBe(2);
    }
  });

  it("allows numbers in template literals (the one relaxed strict default)", async () => {
    const rules = await configFor("components/command-palette.tsx");
    const entry = rules["@typescript-eslint/restrict-template-expressions"];
    expect(Array.isArray(entry)).toBe(true);
    expect((entry as [unknown, { allowNumber?: boolean }])[1]).toMatchObject({
      allowNumber: true,
    });
  });

  it("disables type-checked rules on plain-JS config files", async () => {
    const rules = await configFor("eslint.config.mjs");
    // A type-aware rule must be off here — .mjs has no type information.
    expect(severity(rules["@typescript-eslint/no-floating-promises"])).toBe(0);
  });
});
