import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  {
    ignores: ["**/coverage/**", "**/dist/**"],
  },
  ...tanstackConfig,
];
