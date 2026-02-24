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
          slug: "/demo",
        },

        {
          label: "opaaaa",
          type: "link",
          slug: "/demo",
        },
        {
          label: "opaa22aa",
          type: "link",
          slug: "/demo",
        },
      ],
    },
    {
      id: "test",
      items: [
        {
          label: "Text",
          type: "link",
          slug: "/demo",
        },

        {
          label: "opaaaa",
          type: "link",
          slug: "/demo",
        },
        {
          label: "opaa22aa",
          type: "link",
          slug: "/demo",
        },
      ],
    },
  ],
});
