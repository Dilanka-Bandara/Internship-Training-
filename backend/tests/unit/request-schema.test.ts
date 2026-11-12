import { describe, it, expect } from "vitest";
import { z } from "zod";
import { createRequestSchema } from "../../src/modules/requests/schema.js";

const valid = {
  title: "Printer not working",
  description: "The 2nd floor printer shows error E04.",
  category: "IT",
  priority: "HIGH",
};

function fieldErrors(input: unknown) {
  const result = createRequestSchema.safeParse(input);
  expect(result.success).toBe(false);
  if (result.success) throw new Error("expected validation to fail");
  return z.flattenError(result.error).fieldErrors;
}

describe("createRequestSchema", () => {
  it("accepts a valid body and trims spaces", () => {
    const parsed = createRequestSchema.parse({
      ...valid,
      title: "  Printer not working  ",
    });
    expect(parsed.title).toBe("Printer not working");
  });

  it("drops fields the client may not set (status, id)", () => {
    const parsed = createRequestSchema.parse({
      ...valid,
      status: "CLOSED",
      id: "x",
    });
    expect(parsed).not.toHaveProperty("status");
    expect(parsed).not.toHaveProperty("id");
  });

  // Regression test for evidence/Day-08/bug-log.md:
  // an empty title used to return TWO messages ("required" + "at least 3").
  it("returns only 'Title is required' for a title of only spaces", () => {
    expect(fieldErrors({ ...valid, title: "   " }).title).toEqual([
      "Title is required",
    ]);
  });

  it("returns only 'Description is required' for an empty description", () => {
    expect(fieldErrors({ ...valid, description: "" }).description).toEqual([
      "Description is required",
    ]);
  });

  it("rejects a title shorter than 3 characters", () => {
    expect(fieldErrors({ ...valid, title: "ab" }).title).toEqual([
      "Title must be at least 3 characters",
    ]);
  });

  it("rejects a title longer than 120 characters", () => {
    expect(fieldErrors({ ...valid, title: "a".repeat(121) }).title).toEqual([
      "Title must be at most 120 characters",
    ]);
  });

  it("rejects an unknown priority", () => {
    expect(
      fieldErrors({ ...valid, priority: "URGENT" }).priority,
    ).toBeDefined();
  });
});
