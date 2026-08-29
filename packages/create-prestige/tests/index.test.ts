import { describe, expect, it } from "vitest";

import { main, packageName } from "../src/index.js";

describe("@prestigia/cli", () => {
  it("retains its public package identity", () => {
    expect(packageName).toBe("@prestigia/cli");
  });

  it("has an executable placeholder", () => {
    expect(main()).toContain("ready");
  });
});
