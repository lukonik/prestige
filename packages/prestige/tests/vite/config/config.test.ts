import { describe, expect, it } from "vitest";

import { defineConfig, loadPrestigeConfig, validateConfig } from "../../../src/vite/config/config";
import { PrestigeConfig } from "../../../src/vite/config/config.types";
import { mkdir, writeFile } from "fs-extra";
import { getTempDir } from "../test-utils";
import { DEFAULT_DOCS_DIR } from "../../../src/vite/constants";

function createConfigFile() {
  return `
  export default ({
    title: "test",
    description: "test",
  });
  `;
}

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
  it("should throw error on invalid config", async () => {
    await expect(loadPrestigeConfig("/some/path")).rejects.toThrowError();
  });

  async function checkProperty(mock: Partial<PrestigeConfig>, property: keyof PrestigeConfig) {
    const mockConfig = {
      ...mock,
    };
    await mkdir(getTempDir(), { recursive: true });
    await mkdir(getTempDir(DEFAULT_DOCS_DIR), { recursive: true });
    const prestigePath = getTempDir("prestige.config.ts");
    await writeFile(prestigePath, createConfigFile());

    await expect(loadPrestigeConfig(getTempDir())).resolves.toMatchObject({
      config: { [property]: mockConfig[property] },
    });
  }

  it("should return title", async () => {
    await checkProperty({ title: "test" }, "title");
  });

  it.only("should return description", async () => {
    await checkProperty({ title: "test", description: "test" }, "description");
  });

  it("should return docsDir", async () => {
    await mkdir(getTempDir("test"), { recursive: true });
    await checkProperty({ title: "test", docsDir: "test" }, "docsDir");
  });
});
