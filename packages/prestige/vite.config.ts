/// <reference types="vitest/config" />
import { ohImage } from "@lonik/oh-image/plugin";
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
      ohImage(),
      prestige({
        title: "Prestige",
        enableDebugLog: true,
        collections: [
          {
            id: "testfolder",
            items: [
              {
                label: "sub",
                autogenerate: { directory: "testfolder/sub" },
              },
            ],
          },
          {
            id: "docs",
            items: [
              {
                label: "Introduction",
                slug: "docs/introduction",
              },
              {
                label: "Showcase",
                slug: "docs/showcase",
              },
              {
                label: "Themer",
                slug: "docs/themer",
              },
              {
                label: "Installation",
                slug: "docs/installation",
              },
              { label: "Typescript", slug: "docs/typescript" },
              {
                label: "Google",
                link: "https://www.google.com",
              },
              { label: "Vite Plugin", slug: "docs/vite-plugin" },
              {
                label: "Loaders",
                collapsed: true,
                items: [
                  { label: "Overview", slug: "docs/image/loaders/overview" },
                  { label: "Cloudflare", link: "/docs/loaders/cloudflare" },
                  { label: "Cloudinary", slug: "docs/loaders/cloudinary" },
                  { label: "Contentful", link: "/docs/loaders/contentful" },
                  { label: "Imgproxy", link: "/docs/loaders/imgproxy" },
                  { label: "Kontent", link: "/docs/loaders/kontent" },
                  { label: "Netlify", link: "/docs/loaders/netlify" },
                  { label: "Wordpress", link: "/docs/loaders/wordpress" },
                  {
                    label: "Custom Loader",
                    slug: "docs/loaders/custom-loader",
                  },
                ],
              },
              {
                label: "Auto",
                autogenerate: { directory: "docs/auto" },
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
                crawlLinks: false,
              },
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
