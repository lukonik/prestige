import { mkdir, writeFile } from "node:fs/promises";
import { join } from "pathe";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("vite", () => ({
  loadConfigFromFile: vi.fn(),
}));

import { loadConfigFromFile } from "vite";
import {
  defineConfig,
  resolvePrestigeConfig,
  validateConfig,
} from "../../../src/vite/config/config";
import { PrestigeError } from "../../../src/vite/utils/errors";

function minimalConfig() {
  return {
    title: "Prestige",
    collections: [],
  };
}

async function createDefaultDirs(root: string) {
  await mkdir(join(root, "src/content"), { recursive: true });
}

async function createConfigFile(root: string) {
  await mkdir(root, { recursive: true });
  await writeFile(join(root, "prestige.config.ts"), "export default {}");
}

describe("CONFIG", () => {
  beforeEach(() => {
    vi.mocked(loadConfigFromFile).mockReset();
  });

  describe("validateConfig", () => {
    it("should throw error if config is invalid", () => {
      expect(() => {
        const config: any = {};
        validateConfig(config);
      }).toThrowError();
    });

    it("should return config passed to defineConfig", () => {
      const config = minimalConfig();

      expect(defineConfig(config)).toBe(config);
    });
  });

  describe("resolvePrestigeConfig", () => {
    it("should throw error if prestige config file is not provided", async () => {
      await expect(resolvePrestigeConfig("/some/path")).rejects.toThrowError(
        PrestigeError,
      );
    });

    it("should throw error if content dir does not exist", async () => {
      const dir = "/dummy/no-content";
      await createConfigFile(dir);
      vi.mocked(loadConfigFromFile).mockResolvedValue({
        path: join(dir, "prestige.config.ts"),
        config: minimalConfig(),
        dependencies: [],
      } as Awaited<ReturnType<typeof loadConfigFromFile>>);

      await expect(resolvePrestigeConfig(dir)).rejects.toThrowError(PrestigeError);
    });

    it("should return fullDocs dir", async () => {
      const dir = "/dummy/dir";
      await createDefaultDirs(dir);
      await createConfigFile(dir);
      vi.mocked(loadConfigFromFile).mockResolvedValue({
        path: join(dir, "prestige.config.ts"),
        config: minimalConfig(),
        dependencies: [],
      } as Awaited<ReturnType<typeof loadConfigFromFile>>);

      await expect(
        resolvePrestigeConfig(dir),
      ).resolves.toMatchObject({
        fullDocsDir: join(dir, "src/content"),
      });
    });
  });
});
