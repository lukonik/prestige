import { defineConfig } from "@lonik/prestige/vite";

export default defineConfig({
  title: "__PROJECT_TITLE__",
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
          label: "Showcase",
          slug: "docs/showcase",
        },
      ],
    },
  ],
});
