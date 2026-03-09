import { describe, expect, it } from "vitest";

import { resolvePrestigeConfig, validateConfig } from "../../../src/vite/config/config";
import { PrestigeError } from "../../../src/vite/utils/errors";
import { mkdir } from "node:fs/promises";
import { join } from "pathe";

function minimalConfig() {
  return {
    collections: [],
  };
}

function getTempDir(path?: string, options?: any) {
  return path + options;
}

async function createDefaultDirs(dir?: string) {
  await mkdir(getTempDir(dir ?? "src/content"), { recursive: true });
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

    it("should throw error if content dir does not exist", async () => {
      await expect(resolvePrestigeConfig(minimalConfig(), "notfound/path")).rejects.toThrowError(
        PrestigeError,
      );
    });

    it("should return fullDocs dir", async () => {
      const dir = getTempDir("/dummy/dir");
      await createDefaultDirs(join(dir, "src/content"));
      
      await expect(
        resolvePrestigeConfig(
          minimalConfig(),
          dir,
        ),
      ).resolves.toMatchObject({
        fullDocsDir: join(dir, "src/content"),
      });
    });
  });
});
