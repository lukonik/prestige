import { defineConfig } from "tsdown";
import { copyFileSync } from "node:fs";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    vite: "./src/vite/index.ts",
    ui: "./src/ui/index.ts",
  },
  platform: "neutral",
  exports: false,
  dts: true,
  sourcemap: true,
  publint: true,
  attw: {
    profile: "esm-only",
  },
  skipNodeModulesBundle: true,
  external: [
    "picocolors",
    "node:path",
    "node:fs/promises",
    "virtual:prestige/collection-all",
    "virtual:prestige/content-all",
    "virtual:prestige/config",
    "node:url",
  ],
  plugins: [
    {
      name: "copy-files",
      writeBundle() {
        copyFileSync("src/client.d.ts", "dist/client.d.ts");
        copyFileSync("README.md", "dist/README.md");
      },
    },
  ],
});
