import { join } from "pathe";
import { loadConfigFromFile, type ConfigEnv } from "vite";
import { DEFAULT_DOCS_DIR, PRESTIGE_CONFIG_NAME } from "../constants";
import { parseWithFriendlyErrors, PrestigeError } from "../utils/errors";
import { pathExists } from "../utils/file-utils";
import { PrestigeConfigInput, PrestigeConfigSchema } from "./config.types";

export function defineConfig(config: PrestigeConfigInput): PrestigeConfigInput {
  return config;
}

export function validateConfig(config: PrestigeConfigInput) {
  return parseWithFriendlyErrors(
    PrestigeConfigSchema,
    config,
    "Invalid schema",
  );
}

async function loadPrestigeConfig(root: string, configEnv: ConfigEnv) {
  const configFile = join(root, PRESTIGE_CONFIG_NAME);

  if (!(await pathExists(configFile))) {
    throw new PrestigeError(`Prestige config file not found: ${configFile}`);
  }

  const loadedConfig = await loadConfigFromFile(configEnv, configFile, root);

  if (!loadedConfig) {
    throw new PrestigeError(
      `Failed to load Prestige config file: ${configFile}`,
    );
  }

  return {
    config: loadedConfig.config as PrestigeConfigInput,
    configPath: configFile,
  };
}

export async function resolvePrestigeConfig(
  root: string,
  configEnv: ConfigEnv = { command: "serve", mode: "development" },
) {
  const { config, configPath } = await loadPrestigeConfig(root, configEnv);
  const validatedConfig = validateConfig(config);
  const docsDirPath = join(root, DEFAULT_DOCS_DIR);

  if (!(await pathExists(docsDirPath))) {
    throw new PrestigeError(`Docs! directory not found: ${docsDirPath}`);
  }

  return { config: validatedConfig, configPath, fullDocsDir: docsDirPath };
}
