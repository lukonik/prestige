import { prestige } from "@lonik/prestige/vite";
import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

const config = defineConfig({
  plugins: [
    prestige({
      title: "Prestige",
      license: {
        label: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      github: "https://github.com/lukonik/prestige",
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
                  label: "Core Architecture",
                  slug: "docs/guides/core-architecture",
                },
                {
                  label: "Collection",
                  slug: "docs/guides/collection",
                },
                {
                  label: "Page",
                  slug: "docs/guides/page",
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
                  label: "Plugin Reference",
                  slug: "docs/reference/plugin-reference",
                },
              ],
            },
          ],
        },
      ],
    }),
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
