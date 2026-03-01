/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { prestige } from "./src/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import Inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";

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
              { label: "Introduction", slug: "docs/introduction" },
              { label: "Installation", slug: "docs/installation" },
              { label: "Typescript", slug: "docs/typescript" },
              {
                label: "Image",
                slug: "docs/image/component",
              },
              { label: "Vite Plugin", slug: "docs/vite-plugin" },
              {
                label: "Loaders",
                items: [
                  { label: "Overview", slug: "docs/image/loaders/overview" },
                  { label: "Cloudflare", slug: "docs/loaders/cloudflare" },
                  { label: "Cloudinary", slug: "docs/loaders/cloudinary" },
                  { label: "Contentful", slug: "docs/loaders/contentful" },
                  { label: "Imgproxy", slug: "docs/loaders/imgproxy" },
                  { label: "Kontent", slug: "docs/loaders/kontent" },
                  { label: "Netlify", slug: "docs/loaders/netlify" },
                  { label: "Wordpress", slug: "docs/loaders/wordpress" },

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
                type: "slug",
                slug: "api/prestige",
              },
            ],
          },
        ],
      }),
      mdx(),
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
