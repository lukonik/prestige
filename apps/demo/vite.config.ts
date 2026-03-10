import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import { prestige } from "@lonik/prestige/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

const config = defineConfig({
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    prestige({
      title: "Title",
      description: " ee qweqwqeqeq  qweqw. ",
      collections: [
        {
          id: "docs",
          items: [
            {
              label: "Text",
              type: "link",
              slug: "demo",
            },
            {
              label: "opaaaa",
              type: "link",
              slug: "demo",
            },
            {
              label: "opaa22aa",
              type: "link",
              slug: "demo",
            },
          ],
        },
      ],
    }) as any,
  ],
});

export default config;
