import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseWithFriendlyErrors, PrestigeError } from "../../../src/vite/utils/errors";

describe("parseWithFriendlyErrors", () => {
  function createSchema() {
    return z.object({
      title: z.string(),
    });
  }

  it("should throw prestige error if zod fails", () => {
    expect(() => {
      const schema = createSchema();
      parseWithFriendlyErrors(schema, {} as any, "you need to fill title");
    }).toThrow(PrestigeError);
  });

  it("should contain the message when it fials", () => {
    expect(() => {
      const schema = createSchema();
      parseWithFriendlyErrors(schema, {} as any, "you need to fill title");
    }).toThrow(/you need to fill title/);
  });

  it("should not throw error if zod passes", () => {
    expect(() => {
      const schema = createSchema();
      parseWithFriendlyErrors(schema, { title: "Title" }, "you need to fill title");
    }).not.toThrowError();
  });
});
