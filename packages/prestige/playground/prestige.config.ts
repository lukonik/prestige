import { defineConfig } from "../src/vite";

export default defineConfig({
  title: "Title",
  description: " ee qweqwqeqeq  qweqw. ",
  collections: [
    {
      id: "docs",
      items: [
        {
          label: "Introduction",
          type: "link",
          slug: "docs/introduction",
        },
        {
          label: "Demo",
          type: "link",
          slug: "docs/demo",
        },
      ],
    },
  ],
});
