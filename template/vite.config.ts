import { prestige } from "@lonik/prestige/vite";
import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import { ohImage } from "@lonik/oh-image/plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
const config = defineConfig({
  plugins: [
    ohImage({
      outDir: ".output/public",
    }),
    prestige(),
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] }, renderer: false }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
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
