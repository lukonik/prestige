/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { prestige } from "./src/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import Inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isTest = mode === "test" || process.env.VITEST === "true";

  return {
    root: "./playground",
    plugins: [
      Inspect(),
      tsconfigPaths(),
      ...(!isTest
        ? [
            tanstackStart({
              prerender: {
                enabled: false,
              },
              spa: {
                enabled: true,
              },
            }),
          ]
        : []),
      prestige({
        title: "Title",
        description: " ee qweqwqeqeq  qweqw. ",
        docsDir: isTest ? "playground/src/content/docs" : undefined,
        collections: [
          {
            id: "docs",
            items: [
              {
                label: "first",
                items: [
                  {
                    label: "demo",
                    slug: "docs/first/demo",
                  },
                  {
                    label: "introduction",
                    slug: "docs/first/introduction",
                  },
                ],
              },
              {
                label: "second",
                items: [
                  {
                    label: "demo",
                    slug: "docs/second/demo",
                  },
                  {
                    label: "introduction",
                    slug: "docs/second/introduction",
                  },
                ],
              },
            ],
          },
          {
            id: "api",
            label: "API",
            items: [
              {
                label: "Prestige",
                type: "link",
                slug: "api/prestige",
              },
            ],
          },
        ],
      }),
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
