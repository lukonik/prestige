import { type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/define-config";

export default function prestige(): Plugin {
  return {
    name: "vite-plugin-prestige",
    buildStart: async () => {
      const data = await loadPrestigeConfig();
      console.log(data);
    },
  };
}
