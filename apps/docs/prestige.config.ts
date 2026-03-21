import { defineConfig } from "@lonik/prestige/vite";

export default defineConfig({
  title: "Prestige",
  prestigeShellProps: {
    license: {
      label: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    github: "https://github.com/lukonik/prestige",
    algolia: {
      appId: "IYIAYOLJHX",
      apiKey: "137a443b7b9b637b8b76b11a2c82c15e",
      indices: ["prestigeprestige"],
    },
  },
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
              label: "Prestige Config",
              slug: "docs/guides/prestige-config",
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
              label: "Prestige Config Reference",
              slug: "docs/reference/prestige-config-reference",
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
});
