import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { defineConfig, loadPrestigeConfig, validateConfig } from "../../../src/vite/config/config";
import { PrestigeConfig } from "../../../src/vite/config/config.types";

export function readHelloWorld(path: string) {
  return readFileSync(path, "utf-8");
}

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
  it("should load config from specified directory", async () => {
    // Create a temporary directory
    const tmpDir = mkdtempSync(join(tmpdir(), "prestige-test-"));
    const configPath = join(tmpDir, "prestige.config.ts");

    try {
      // Write the config file to the temporary directory
      writeFileSync(
        configPath,
        `
        export default {
          title: "Test Config"
        }
      `,
      );

      // Load config using the temporary directory as cwd
      const { config } = await loadPrestigeConfig(tmpDir);

      expect(config.title).toBe("Test Config");
    } finally {
      // Clean up
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
