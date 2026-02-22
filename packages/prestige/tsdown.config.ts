import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    vite: "./src/vite",
  },
  platform: "neutral",
  // exports: true,
  dts: true,
  sourcemap: true,
  publint: true,
  attw: {
    profile: "esm-only",
  },
  skipNodeModulesBundle: true,
});
