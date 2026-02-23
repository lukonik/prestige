import { normalizePath, type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/config";
import { PrestigeConfig } from "./config/config.types";
import { join } from "node:path";
import { watchConfigChange, watchMarkdownChange } from "./utils/watcher";
export default function prestige(): Plugin {
  let config: PrestigeConfig;
  let docsDir: string;
  let sources: string[];
  return {
    name: "vite-plugin-prestige",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig, sources: loaderSources } = await loadPrestigeConfig(
        resolvedConfig.root,
      );
      config = loadedConfig;
      sources = loaderSources;
      docsDir = join(resolvedConfig.root, normalizePath(config.docsDir));
    },
    async configureServer(server) {
      watchConfigChange(server, sources);
      watchMarkdownChange(server, docsDir);
    },
  };
}
