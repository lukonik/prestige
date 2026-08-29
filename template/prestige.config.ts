import { defineConfig } from "@prestigia/docs/vite";

export default defineConfig({
  title: "__PROJECT_TITLE__",
  license: {
    label: "MIT",
    url: "https://opensource.org/licenses/MIT",
  },
  github: "https://github.com/lukonik/prestigia",
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
