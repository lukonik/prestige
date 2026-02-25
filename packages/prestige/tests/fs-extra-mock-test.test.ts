import { describe, expect, it } from "vitest";
import { outputFile } from "fs-extra";
import { fs } from "memfs";

describe("fs-extra", () => {
  it("should use memfs", async () => {
    await outputFile("/test.txt", "hello");
    expect(fs.readFileSync("/test.txt", "utf8")).toBe("hello");
  });
});
