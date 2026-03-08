import { parseWithFriendlyErrors, PrestigeError } from "../utils/errors";
import { PrestigeConfigInput, PrestigeConfigSchema } from "./config.types";
import { join } from "pathe";
import { pathExists } from "../utils/file-utils";

export function validateConfig(config: PrestigeConfigInput) {
  return parseWithFriendlyErrors(PrestigeConfigSchema, config, "Invalid schema");
}

export async function resolvePrestigeConfig(
  configInput: PrestigeConfigInput | undefined,
  root: string,
) {
  if (!configInput) {
    throw new PrestigeError("Prestige config is required");
  }

  const validatedConfig = validateConfig(configInput);
  const docsDirPath = join(root, "src/content");

  if (!(await pathExists(docsDirPath))) {
    throw new PrestigeError(`Docs! directory not found: ${docsDirPath}`);
  }

  return { config: validatedConfig, fullDocsDir: docsDirPath };
}
