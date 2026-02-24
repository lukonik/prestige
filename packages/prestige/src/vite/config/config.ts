import { loadConfig } from "unconfig";
import { parseWithFriendlyErrors, PrestigeError } from "../utils/errors";
import { PrestigeConfigInput, PrestigeConfigSchema } from "./config.types";
import { pathExists } from "fs-extra";
import { join } from "pathe";
export function defineConfig(config: PrestigeConfigInput) {
  // purpose of this function, is to get Typescript intelisense for config
  // we use unconfig to load the config properly
  return config;
}

export function validateConfig(config: PrestigeConfigInput) {
  return parseWithFriendlyErrors(PrestigeConfigSchema, config, "Invalid schema");
}

export async function loadPrestigeConfig(root: string) {
  const configPath = join(root, "prestige.config.ts");

  const { config, sources } = await loadConfig<PrestigeConfigInput>({
    sources: [
      {
        files: configPath,
      },
    ],
  });
  if (!config) {
    throw new PrestigeError("Prestige config not found");
  }
  const validatedConfig = validateConfig(config);
  const docsDirPath = join(root, validatedConfig.docsDir);
  if (!(await pathExists(docsDirPath))) {
    throw new PrestigeError(`Docs! directory not found: ${docsDirPath}`);
  }
  return { config: validatedConfig, sources, fullDocsDir: docsDirPath };
}
