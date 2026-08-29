import { describe, expect, it } from "vitest";

import { packageName } from "../src/index.js";

describe("@prestigia/docs", () => {
  it("retains its public package identity", () => {
    expect(packageName).toBe("@prestigia/docs");
  });
});
