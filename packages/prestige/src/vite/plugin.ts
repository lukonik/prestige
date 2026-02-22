import { type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/define-config";
import logger from "./utils/logger";

export default function prestige(): Plugin {
  return {
    name: "vite-plugin-prestige",
    async configureServer(server) {
      const { sources } = await loadPrestigeConfig();
      server.watcher.add(sources);

      server.watcher.on("change", (file) => {
        if (sources.includes(file)) {
          logger.info("✅ config file has changed, restarting");
          server.restart();
        }
      });
    },
    buildStart: async () => {
      const { config } = await loadPrestigeConfig();
      console.log(config);
    },
  };
}
