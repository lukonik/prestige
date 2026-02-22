import { ViteDevServer, type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/config";
import { PrestigeConfig } from "./config/config.types";
import logger from "./utils/logger";

export function watchConfigChange(server: ViteDevServer, sources: string[]) {
  server.watcher.add(sources);

  server.watcher.on("change", (file) => {
    if (sources.includes(file)) {
      logger.info("✅ config file has changed, restarting");
      server.restart();
    }
  });
}

export default function prestige(): Plugin {
  let config: PrestigeConfig;
  let sources: string[];
  return {
    name: "vite-plugin-prestige",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig, sources: loaderSources } = await loadPrestigeConfig(
        resolvedConfig.root,
      );
      config = loadedConfig;
      sources = loaderSources;
      console.log(config);
    },
    async configureServer(server) {
      watchConfigChange(server, sources);
    },
  };
}
