/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
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
      prestige({
        title: "Title",
        github: "https://github.com/lukonik/Prestige",
        description: " ee qweqwqeqeq  qweqw. ",
        docsDir: isTest ? "playground/src/content/docs" : undefined,
        algolia: {
          appId: "YOUR_APP_ID",
          apiKey: "YOUR_SEARCH_API_KEY",
          indexName: "YOUR_INDEX_NAME",
        },
        collections: [
          {
            id: "docs",
            defaultLink: "docs/introduction",
            items: [
              {
                label:"Google",
                link:"https://www.google.com"
              },
              {
                label: "Introduction",
                slug: "docs/introduction",
              },
              {
                label: "Installation",
                slug: "docs/installation",
              },
              { label: "Typescript", slug: "docs/typescript" },
              // {
              //   label: "Image",
              //   slug: "docs/image/component",
              // },
              { label: "Vite Plugin", slug: "docs/vite-plugin" },
              {
                label: "Loaders",
                items: [
                  // { label: "Overview", slug: "docs/image/loaders/overview" },
                  // { label: "Cloudflare", slug: "docs/loaders/cloudflare" },
                  // { label: "Cloudinary", slug: "docs/loaders/cloudinary" },
                  // { label: "Contentful", slug: "docs/loaders/contentful" },
                  // { label: "Imgproxy", slug: "docs/loaders/imgproxy" },
                  // { label: "Kontent", slug: "docs/loaders/kontent" },
                  // { label: "Netlify", slug: "docs/loaders/netlify" },
                  // { label: "Wordpress", slug: "docs/loaders/wordpress" },

                  {
                    label: "Custom Loader",
                    slug: "docs/image/loaders/custom-loader",
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
                slug: "api/prestige",
              },
            ],
          },
        ],
      }),
      ...(!isTest
        ? [
            tanstackStart({
              prerender: {
                enabled: false,
                // crawlLinks: true,
              },
              spa:{
                enabled:true
              }
            }),
            // Let TanStack Start own SSR rendering instead of falling back to playground/index.html.
            nitro({ preset: "bun", renderer: false }),
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
