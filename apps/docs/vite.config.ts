import { prestige } from "@lonik/prestige/vite";
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  plugins: [
    prestige({
      title: "Prestige",
      license: {
        label: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      github: "https://github.com/lukonik/prestige",
      collections: [
        {
          id: "docs",
          items: [
            {
              label: "Introduction",
              slug: "docs/introduction",
            },
            {
              label: "Getting Started",
              slug: "docs/getting-started",
            },
          ],
        },
      ],
    }),
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
