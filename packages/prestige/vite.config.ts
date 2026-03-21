/// <reference types="vitest/config" />
import { ohImage } from "@lonik/oh-image/plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import { prestige } from "./src/vite";

export default defineConfig(({ mode }) => {
  const isTest = mode === "test" || process.env.VITEST === "true";

  return {
    root: "./playground",
    plugins: [
      Inspect(),
      tsconfigPaths(),
      ohImage(),
      prestige(),
      ...(!isTest
        ? [
            tanstackStart({
              prerender: {
                enabled: false,
                crawlLinks: false,
              },
            }),
          ]
        : []),
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
            include: ["src/**/*.test.{ts,js}", "tests/**/*.test.{ts,js}"],
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
  };
});
