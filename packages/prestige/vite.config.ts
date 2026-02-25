/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { prestige } from "./src/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import Inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode: _ }) => ({
  root: "./playground",
  plugins: [
    Inspect(),
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        crawlLinks: true,
      },
    }),
    prestige(),
    tailwindcss(),
    react(),
  ],
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
