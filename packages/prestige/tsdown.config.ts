import { defineConfig } from "tsdown";

export default defineConfig({
  platform: "neutral",
  exports: true,
  dts: true,
  sourcemap: true,
  publint: true,
  attw: {
    profile: "esm-only",
  },
});
