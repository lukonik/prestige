import { loadConfig } from "unconfig";
import { parseWithFriendlyErrors } from "../utils/errors";
import { PrestigeConfig, PrestigeConfigSchema } from "./config.types";
export function defineConfig(config: PrestigeConfig) {
  // purpose of this function, is to get Typescript intelisense for config
  // we use unconfig to load the config properly
  return config;
}

export function validateConfig(config: PrestigeConfig) {
  return parseWithFriendlyErrors(PrestigeConfigSchema, config, "Invalid schema");
}

export async function loadPrestigeConfig(cwd?: string) {
  const { config, sources } = await loadConfig<PrestigeConfig>({
    sources: [
      {
        files: "prestige.config.ts",
      },
    ],
    ...(cwd ? { cwd } : {}),
  });

  if (!config) {
    throw new Error("Prestige config not found");
  }

  return { config: validateConfig(config), sources };
}
