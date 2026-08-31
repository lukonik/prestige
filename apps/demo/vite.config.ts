import { defineConfig } from "vite";

import contentCollections from "@content-collections/vite";
import { prestigia } from "@prestigia/docs/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    contentCollections(),
    prestigia(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: ({ path }) => !/[?#]/u.test(path),
      },
    }),
    viteReact(),
  ],
});

export default config;
