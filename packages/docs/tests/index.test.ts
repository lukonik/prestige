import { describe, expect, it } from "vitest";

import { Doc, createDocRoute, packageName } from "../src/index.js";

describe("@prestigia/docs", () => {
  it("retains its public package identity", () => {
    expect(packageName).toBe("@prestigia/docs");
  });

  it("exports the document route primitives", () => {
    expect(Doc).toBeTypeOf("function");
    expect(createDocRoute).toBeTypeOf("function");
  });
});
