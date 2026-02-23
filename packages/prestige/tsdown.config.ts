import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    vite: "./src/vite/index.ts",
    ui: "./src/ui/index.ts",
  },
  platform: "neutral",
  exports: true,
  dts: true,
  sourcemap: true,
  publint: true,
  attw: {
    profile: "esm-only",
  },
  skipNodeModulesBundle: true,
  external: ["picocolors", "node:path", "fs-extra"],
});
