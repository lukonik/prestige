import { defineConfig } from "../src/vite";

export default defineConfig({
  title: "Title",
  description: " ee qweqwqeqeq  qweqw. ",
  sidebars: [
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
  ],
});
