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
  copy: [
    "../../template/AGENTS.md",
    "../../template/README.md",
    "../../template/_gitignore",
    "../../template/components.json",
    "../../template/content-collections.ts",
    "../../template/eslint.config.js",
    "../../template/package.json",
    "../../template/pnpm-lock.yaml",
    "../../template/pnpm-workspace.yaml",
    "../../template/tsconfig.json",
    "../../template/tsr.config.json",
    "../../template/vite.config.ts",
    { from: "../../template/content", to: "dist/template" },
    { from: "../../template/src", to: "dist/template" },
  ].map((entry) =>
    typeof entry === "string" ? { from: entry, to: "dist/template" } : entry,
  ),
});
