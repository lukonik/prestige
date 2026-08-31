import path from "node:path";

import { loadConfigFromFile } from "vite";

import type {
  ConfigEnv,
  ModuleNode,
  Plugin,
  ResolvedConfig,
  ViteDevServer,
} from "vite";

import type { PrestigiaConfig } from "./config.js";

const virtualModuleId = "virtual:prestigia/config";
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

export interface PrestigiaPluginOptions {
  /** File name relative to the Vite project root. */
  configFile?: string;
}

/** Preserve the inferred config type while checking Prestigia fields. */
export function defineConfig<TConfig extends PrestigiaConfig>(
  config: TConfig,
): TConfig {
  return config;
}

function serializeConfig(config: PrestigiaConfig): string {
  const serialized = JSON.stringify(config);

  if (!serialized) {
    throw new Error("Prestigia config must export a serializable object.");
  }

  return serialized;
}

/** Load `prestigia.config.ts` and expose its resolved data as a virtual module. */
export function prestigia({
  configFile = "prestigia.config.ts",
}: PrestigiaPluginOptions = {}): Plugin {
  let configEnv: ConfigEnv = { command: "serve", mode: "development" };
  let configPath = path.resolve(process.cwd(), configFile);
  let devServer: ViteDevServer | undefined;
  let watchedConfigFiles = new Set([configPath]);

  async function loadPrestigiaConfig(): Promise<PrestigiaConfig> {
    const result = await loadConfigFromFile(
      configEnv,
      configPath,
      path.dirname(configPath),
      "silent",
      undefined,
      "bundle",
    );

    if (!result) {
      throw new Error(`Prestigia config was not found at ${configPath}.`);
    }

    if (typeof result.config !== "object" || Array.isArray(result.config)) {
      throw new Error("Prestigia config must export an object.");
    }

    watchedConfigFiles = new Set([configPath, ...result.dependencies]);
    devServer?.watcher.add([...watchedConfigFiles]);

    return result.config as PrestigiaConfig;
  }

  function invalidateVirtualModule(server: ViteDevServer): Array<ModuleNode> {
    const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);

    if (!module) return [];

    server.moduleGraph.invalidateModule(module);
    return [module];
  }

  return {
    name: "prestigia",
    enforce: "pre",
    config(_config, env) {
      configEnv = env;
    },
    configResolved(config: ResolvedConfig) {
      configPath = path.resolve(config.root, configFile);
      watchedConfigFiles = new Set([configPath]);
    },
    configureServer(server) {
      devServer = server;
      server.watcher.add([...watchedConfigFiles]);
    },
    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null;
    },
    async load(id) {
      if (id !== resolvedVirtualModuleId) return null;

      const config = await loadPrestigiaConfig();

      return [
        'import { resolvePrestigiaSidebar } from "@prestigia/docs";',
        'import { allDocs } from "content-collections";',
        `const sourceConfig = ${serializeConfig(config)};`,
        "export const sidebar = resolvePrestigiaSidebar(allDocs, sourceConfig.sidebar);",
        "const config = { ...sourceConfig, sidebar };",
        "export default config;",
      ].join("\n");
    },
    handleHotUpdate(context) {
      if (!watchedConfigFiles.has(path.resolve(context.file))) return [];

      return invalidateVirtualModule(context.server);
    },
  };
}

export type {
  PrestigiaConfig,
  PrestigiaSidebarAutogenerateItem,
  PrestigiaSidebarConfigItem,
  PrestigiaSidebarGroupItem,
  PrestigiaSidebarLinkItem,
  PrestigiaSidebarSlugItem,
  ResolvedPrestigiaConfig,
} from "./config.js";
