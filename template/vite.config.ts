import { prestige } from "@prestigia/docs/vite";
import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    prestige(),
    devtools(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
      },
      sitemap: { enabled: true, host: "https://example.com/" },
    }),
    viteReact(),
  ],
});

export default config;
