/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { prestige } from "./src/vite";

export default defineConfig(({ mode }) => ({
  root: "./playground",
  plugins: [react(), mode !== "test" && prestige()],
  test: {
    root: ".",
    projects: [
      {
        // add "extends: true" to inherit the options from the root config
        extends: true,
        test: {
          include: ["tests/vite/**/*.test.{ts,js}"],
          environment: "node",
          setupFiles: ["tests/setup.ts"],
        },
      },
      // {
      //   test: {
      //     include: ["tests/**/*.{node}.test.{ts,js}"],
      //     // color of the name label can be changed
      //     name: { label: "node", color: "green" },
      //     environment: "node",
      //   },
      // },
    ],
    //   test:"eqe",

    // }]
    // browser: {
    //   enabled: true,
    //   provider: playwright(),
    //   instances: [{ browser: "chromium" }],
    //   headless: true,
    // },
  },
}));
