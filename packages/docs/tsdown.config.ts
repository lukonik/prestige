import { defineConfig } from "tsdown";

import type { UserConfig } from "tsdown";

const sharedConfig = {
  format: ["esm"],
  target: "es2022",
  fixedExtension: false,
  dts: true,
  sourcemap: true,
  failOnWarn: "ci-only",
} satisfies UserConfig;

export default defineConfig([
  {
    ...sharedConfig,
    entry: ["./src/index.ts"],
    platform: "neutral",
    clean: true,
  },
  {
    ...sharedConfig,
    entry: ["./src/vite.ts"],
    platform: "node",
    clean: false,
  },
]);
