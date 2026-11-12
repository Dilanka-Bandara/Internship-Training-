import { describe, it, expect } from "vitest";
import {
  allowedTransitions,
  canTransition,
} from "../../src/modules/requests/status-rules.js";

// The most important business rule: which status changes are allowed.
// docs/data-model.md, section 4.

const ALL = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

const ALLOWED = new Set([
  "OPEN->IN_PROGRESS",
  "OPEN->CLOSED",
  "IN_PROGRESS->RESOLVED",
  "RESOLVED->CLOSED",
  "RESOLVED->IN_PROGRESS",
]);

describe("canTransition", () => {
  // Check every one of the 16 from/to pairs, so any change to the rules
  // that is not also made here makes a test fail.
  for (const from of ALL) {
    for (const to of ALL) {
      const key = `${from}->${to}`;
      const expected = ALLOWED.has(key);
      it(`${expected ? "allows" : "blocks"} ${key}`, () => {
        expect(canTransition(from, to)).toBe(expected);
      });
    }
  }

  it("treats CLOSED as final (no way out)", () => {
    expect(allowedTransitions.CLOSED).toEqual([]);
  });
});
