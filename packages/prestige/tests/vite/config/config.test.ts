import { afterEach, describe, expect, it } from "vitest";

// @ts-expect-error - mocked module
import { __setMockConfig } from "unconfig";
import { defineConfig, loadPrestigeConfig, validateConfig } from "../../../src/vite/config/config";
import { PrestigeConfig } from "../../../src/vite/config/config.types";

describe("defineConfig", () => {
  it("returns same config object", () => {
    const config: PrestigeConfig = {
      title: "test",
    };
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
  afterEach(() => {
    __setMockConfig({});
  });

  it("should throw error on invalid config", async () => {
    const mockConfig = {};
    __setMockConfig(mockConfig);

    await expect(loadPrestigeConfig("/some/path")).rejects.toThrowError();
  });

  async function checkProperty(mock: Partial<PrestigeConfig>, property: keyof PrestigeConfig) {
    const mockConfig = {
      ...mock,
    };
    __setMockConfig(mockConfig);

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
  it("should return docsDir with default value", async () => {
    __setMockConfig({ title: "test" });
    await expect(loadPrestigeConfig("/some/path")).resolves.toMatchObject({
      config: { docsDir: "src/content/docs" },
    });
  });
});
