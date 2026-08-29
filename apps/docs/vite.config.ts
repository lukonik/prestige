import { prestige } from "@prestigia/docs/vite";
import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import { ohImage } from "@lonik/oh-image/plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

const config = defineConfig({
  base: "/prestige/",
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
        crawlLinks: true,
      },
      sitemap: { enabled: true, host: "https://lukonik.github.io/prestige/" },
    }),
    ohImage({
      outDir: "dist/client",
    }),
    viteReact(),
  ],
});

export default config;
