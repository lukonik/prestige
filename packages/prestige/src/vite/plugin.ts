import { ViteDevServer, type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/config";
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
  return {
    name: "vite-plugin-prestige",
    async configureServer(server) {
      const { sources } = await loadPrestigeConfig();
      watchConfigChange(server, sources);
    },
    buildStart: async () => {
      const { config } = await loadPrestigeConfig();
      console.log(config);
    },
  };
}
