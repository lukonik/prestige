import { prestige } from "@lonik/prestige/vite";
import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import { ohImage } from "@lonik/oh-image/plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

const config = defineConfig({
  base: "/prestige/",
  plugins: [
    prestige({
      title: "Prestige",
      collections: [
        {
          id: "docs",
          items: [
            {
              label: "Introduction",
              slug: "docs/introduction",
            },
            {
              label: "Getting Started",
              slug: "docs/getting-started",
            },
            {
              label: "Guides",
              items: [
                {
                  label: "Overview",
                  slug: "docs/guides/overview",
                },
                {
                  label: "Collection",
                  slug: "docs/guides/collection",
                },
                {
                  label: "Prestige Shell",
                  slug: "docs/guides/prestige-shell",
                },
                {
                  label: "Page",
                  slug: "docs/guides/page",
                },
                {
                  label: "Vite Plugin",
                  slug: "docs/guides/vite-plugin",
                },
              ],
            },
            {
              label: "Reference",
              items: [
                {
                  label: "Frontmatter Reference",
                  slug: "docs/reference/frontmatter-reference",
                },
                {
                  label: "Prestige Shell Reference",
                  slug: "docs/reference/prestige-shell-reference",
                },
                {
                  label: "Vite Plugin Reference",
                  slug: "docs/reference/plugin-reference",
                },
                {
                  label: "create-prestige Reference",
                  slug: "docs/reference/create-prestige-reference",
                },
              ],
            },
          ],
        },
      ],
    }),
    devtools(),
    nitro({
      rollupConfig: { external: [/^@sentry\//] },
      baseURL: "/prestige",
      renderer: false,
    }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    ohImage({
      outDir: ".output/public",
    }),
    viteReact(),
  ],
});

export default config;
