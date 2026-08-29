import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  platform: "neutral",
  target: "es2022",
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: true,
  failOnWarn: "ci-only",
});
