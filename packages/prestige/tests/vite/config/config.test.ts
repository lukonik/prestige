import { describe, expect, it } from "vitest";

import { defineConfig, loadPrestigeConfig, validateConfig } from "../../../src/vite/config/config";
import { PrestigeConfig } from "../../../src/vite/config/config.types";
import { mkdir, outputFileSync } from "fs-extra";
import { getTempDir } from "../test-utils";
import { PrestigeError } from "../../../src/vite/utils/errors";
import { DEFAULT_DOCS_DIR } from "../../../src/vite/constants";

function createConfigFile(props: any) {
  return `
  export default (${JSON.stringify(props)});
  `;
}

function minimalConfig() {
  return {
    title: "test",
    sidebars: [],
  };
}

async function createDefaultDirs(initConfig?: any, dir?: string) {
  const prestigePath = getTempDir("prestige.config.ts");
  await outputFileSync(
    prestigePath,
    createConfigFile(
      initConfig ?? {
        title: "dummy",
        sidebars: [],
      },
    ),
  );
  await mkdir(getTempDir(dir ?? DEFAULT_DOCS_DIR), { recursive: true });
}

async function checkProperty(mock: Partial<PrestigeConfig>, property: keyof PrestigeConfig) {
  const mockConfig = {
    ...mock,
  };
  await createDefaultDirs(mock);
  await expect(loadPrestigeConfig(getTempDir())).resolves.toMatchObject({
    config: { [property]: mockConfig[property] },
  });
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
  it("should throw error if config file does not exist", async () => {
    await expect(loadPrestigeConfig("/some/path")).rejects.toThrowError(PrestigeError);
  });
  it("should return title", async () => {
    await checkProperty({ ...minimalConfig(), title: "test" }, "title");
  });

  it("should return description", async () => {
    await checkProperty({ ...minimalConfig(), description: "test22" }, "description");
  });

  it("should return docsDir", async () => {
    await mkdir(getTempDir("test"), { recursive: true });
    await checkProperty({ ...minimalConfig(), docsDir: "test" }, "docsDir");
  });
  it("should throw error if docsDir does not exist", async () => {
    await expect(loadPrestigeConfig("notfound/path")).rejects.toThrowError(PrestigeError);
  });
  it("should return source", async () => {
    await createDefaultDirs();
    await expect(loadPrestigeConfig(getTempDir())).resolves.toMatchObject({
      sources: [getTempDir("prestige.config.ts")],
    });
  });
  it("should return fullDocs dir", async () => {
    const dir = "/dummy/dir";
    await createDefaultDirs(
      {
        ...minimalConfig(),
        docsDir: dir,
      },
      dir,
    );
    await expect(loadPrestigeConfig(getTempDir())).resolves.toMatchObject({
      fullDocsDir: getTempDir(dir),
    });
  });
});
