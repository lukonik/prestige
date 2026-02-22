/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";
import { prestige } from "./src/vite";
export default defineConfig({
  root: "./playground",
  plugins: [react(), prestige()],
  test: {
    root: ".",
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      headless: true,
    },
  },
});
