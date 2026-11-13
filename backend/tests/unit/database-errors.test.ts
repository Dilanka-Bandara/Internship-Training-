import { describe, it, expect } from "vitest";
import { isDatabaseUnavailable } from "../../src/middleware/database-errors.js";

describe("isDatabaseUnavailable", () => {
  it("recognises the pg error seen when the database stops", () => {
    expect(
      isDatabaseUnavailable(new Error("Connection terminated unexpectedly")),
    ).toBe(true);
  });

  it("recognises a refused connection by its code", () => {
    const err = Object.assign(new Error("connect failed"), {
      code: "ECONNREFUSED",
    });
    expect(isDatabaseUnavailable(err)).toBe(true);
  });

  it("looks inside wrapped errors (cause)", () => {
    const inner = Object.assign(new Error("x"), { code: "57P01" });
    const outer = new Error("query failed", { cause: inner });
    expect(isDatabaseUnavailable(outer)).toBe(true);
  });

  it("does not treat ordinary errors as database outages", () => {
    expect(isDatabaseUnavailable(new Error("Something else broke"))).toBe(
      false,
    );
    expect(isDatabaseUnavailable(new TypeError("x is undefined"))).toBe(false);
    expect(isDatabaseUnavailable(undefined)).toBe(false);
    expect(isDatabaseUnavailable("text")).toBe(false);
  });
});
