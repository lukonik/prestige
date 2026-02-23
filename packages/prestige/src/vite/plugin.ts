import { normalizePath, type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/config";
import { PrestigeConfig } from "./config/config.types";
import { join } from "pathe";
import picomatch, { type Matcher } from "picomatch";

import { watchConfigChange, watchMarkdownChange } from "./utils/watcher";
export default function prestige(): Plugin {
  let config: PrestigeConfig;
  let docsDir: string;
  let sources: string[];
  let isDocsMatcher: Matcher;
  return {
    name: "vite-plugin-prestige",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig, sources: loaderSources } = await loadPrestigeConfig(
        resolvedConfig.root,
      );
      config = loadedConfig;
      sources = loaderSources;
      docsDir = join(resolvedConfig.root, normalizePath(config.docsDir));
      isDocsMatcher = picomatch(join(docsDir, "**/*.md"));
    },
    async configureServer(server) {
      watchConfigChange(server, sources);
      watchMarkdownChange(server, docsDir);
    },
    handleHotUpdate({ file, server }) {
      if (isDocsMatcher(file)) {
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}
