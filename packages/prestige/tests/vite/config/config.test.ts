import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defineConfig, loadPrestigeConfig, validateConfig } from "../../../src/vite/config/config";
import { PrestigeConfig } from "../../../src/vite/config/config.types";
import { mkdirSync } from "fs-extra";
import { getTempDir } from "../test-utils";

describe("defineConfig", () => {
  it("returns same config object", () => {
    const config: PrestigeConfig = {
      title: "test",
    } as any;
    const result = defineConfig(config);
    expect(result).toEqual(config);
  });
});

describe("validateConfig", () => {
  it("should throw error if config is invalid", () => {
    expect(() => {
      const config: any = {};
      validateConfig(config);
    }).toThrowError();
  });
});

describe("loadPrestigeConfig", () => {
  afterEach(() => {});

  beforeEach(() => {
    // vol.mkdirSync("/some/path/docs/src/content/docs", { recursive: true });
  });

  it.only("only", async () => {
    const tempDir = getTempDir("src/content/docs");
    console.log("TEMPDIR IS ", tempDir);
    mkdirSync(tempDir, { recursive: true });
    await expect(loadPrestigeConfig(getTempDir())).resolves.toBeTruthy();
  });

  it("should throw error on invalid config", async () => {
    await expect(loadPrestigeConfig("/some/path")).rejects.toThrowError();
  });

  async function checkProperty(mock: Partial<PrestigeConfig>, property: keyof PrestigeConfig) {
    const mockConfig = {
      ...mock,
    };

    await expect(loadPrestigeConfig("/some/path")).resolves.toMatchObject({
      config: { [property]: mockConfig[property] },
    });
  }

  it("should return title", async () => {
    await checkProperty({ title: "test" }, "title");
  });

  it("should return description", async () => {
    await checkProperty({ title: "test", description: "test" }, "description");
  });

  it("should return docsDir", async () => {
    await checkProperty({ title: "test", docsDir: "test" }, "docsDir");
  });
  // it("should return docsDir with default value", async () => {
  //   __setMockConfig({ title: "test" });
  //   await expect(loadPrestigeConfig("/some/path")).resolves.toMatchObject({
  //     config: { docsDir: "src/content/docs" },
  //   });
  // });
  // it("should throw error if directory doesn't exist", async () => {
  //   __setMockConfig({ title: "test" });
  //   await expect(loadPrestigeConfig("/some/undefined")).rejects.toThrowError();
  // });
});
