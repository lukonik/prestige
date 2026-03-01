import { describe, expect, it } from "vitest";

import { resolvePrestigeConfig, validateConfig } from "../../../src/vite/config/config";
import { PrestigeError } from "../../../src/vite/utils/errors";
import { DEFAULT_DOCS_DIR } from "../../../src/vite/constants";
import { mkdir } from "node:fs/promises";

function minimalConfig() {
  return {
    title: "test",
    collections: [],
  };
}

function getTempDir(path?: string, options?: any) {
  return path + options;
}

async function createDefaultDirs(dir?: string) {
  await mkdir(getTempDir(dir ?? DEFAULT_DOCS_DIR), { recursive: true });
}

describe.skip("CONFIG ", () => {
  describe("validateConfig", () => {
    it("should throw error if config is invalid", () => {
      expect(() => {
        const config: any = {};
        validateConfig(config);
      }).toThrowError();
    });
  });

  describe("resolvePrestigeConfig", () => {
    it("should throw error if config object is not provided", async () => {
      await expect(resolvePrestigeConfig(undefined, "/some/path")).rejects.toThrowError(
        PrestigeError,
      );
    });

    it("should return title", async () => {
      await createDefaultDirs();
      await expect(
        resolvePrestigeConfig({ ...minimalConfig(), title: "test" }, getTempDir()),
      ).resolves.toMatchObject({
        config: { title: "test" },
      });
    });

    it("should return description", async () => {
      await createDefaultDirs();
      await expect(
        resolvePrestigeConfig({ ...minimalConfig(), description: "test22" }, getTempDir()),
      ).resolves.toMatchObject({
        config: { description: "test22" },
      });
    });

    it("should return docsDir", async () => {
      await mkdir(getTempDir("test"), { recursive: true });
      await expect(
        resolvePrestigeConfig({ ...minimalConfig(), docsDir: "test" }, getTempDir()),
      ).resolves.toMatchObject({
        config: { docsDir: "test" },
      });
    });

    it("should throw error if docsDir does not exist", async () => {
      await expect(resolvePrestigeConfig(minimalConfig(), "notfound/path")).rejects.toThrowError(
        PrestigeError,
      );
    });

    it("should return fullDocs dir", async () => {
      const dir = "/dummy/dir";
      await createDefaultDirs(dir);
      await expect(
        resolvePrestigeConfig(
          {
            ...minimalConfig(),
            docsDir: dir,
          },
          getTempDir(),
        ),
      ).resolves.toMatchObject({
        fullDocsDir: getTempDir(dir),
      });
    });
  });
});
