import { defineConfig } from "./src/vite";

export default defineConfig({
  title: "Title",
  docsDir: "playground/src/content/docs",
  description: " ee qweqwqeqeq  qweqw. ",
  collections: [
    {
      id: "docs",
      items: [
        {
          label: "Text",
          type: "link",
          slug: "docs/demo",
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
});
