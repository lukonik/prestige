import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: true,
  failOnWarn: "ci-only",
});
