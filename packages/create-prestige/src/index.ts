#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import mri from "mri";
import pc from "picocolors";

async function main() {
  const args = mri(process.argv.slice(2));
  const projectName = args._[0] || "my-prestige-app";
  const targetDir = path.resolve(process.cwd(), projectName);

  console.log(pc.cyan(`Creating prestige project in ${targetDir}...`));

  // 1. Run tanstack-start cli to generate tanstack project
  execSync(`npx -y @tanstack/create-start@latest ${projectName} --framework React --no-examples --no-toolchain --package-manager npm --no-install --target-dir ${projectName}`, {
    stdio: "inherit",
  });

  // 2. Add prestige to that project
  console.log(pc.cyan("Adding @lonik/prestige..."));
  const pkgJsonPath = path.join(targetDir, "package.json");
  const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
  pkgJson.dependencies = pkgJson.dependencies || {};
  pkgJson.dependencies["@lonik/prestige"] = "latest"; 
  
  await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  // 3. update vite plugins array
  console.log(pc.cyan("Configuring vite.config.ts..."));
  const viteConfigPath = path.join(targetDir, "vite.config.ts");
  let viteConfig = await fs.readFile(viteConfigPath, "utf-8");
  
  viteConfig = viteConfig.replace(
    "import { tanstackStart } from '@tanstack/react-start/plugin/vite'",
    "import { tanstackStart } from '@tanstack/react-start/plugin/vite'\\nimport { prestige } from '@lonik/prestige/vite'"
  );

  viteConfig = viteConfig.replace(
    "plugins: [",
    "plugins: [\\n    prestige({\\n      collections: {\\n        docs: {\\n          introduction: 'content/docs/introduction.mdx',\\n        }\\n      }\\n    }),"
  );

  await fs.writeFile(viteConfigPath, viteConfig);

  // 4. create content/docs folder in src
  console.log(pc.cyan("Creating content/docs folder..."));
  const docsDir = path.join(targetDir, "src/content/docs");
  await fs.mkdir(docsDir, { recursive: true });

  // 5. create (prestige) folder in routes folder
  console.log(pc.cyan("Creating routes/(prestige) folder..."));
  const prestigeRoutesDir = path.join(targetDir, "src/routes/(prestige)");
  await fs.mkdir(prestigeRoutesDir, { recursive: true });

  // 6. add sample introduction.mdx in content/docs folder
  console.log(pc.cyan("Adding sample introduction.mdx..."));
  const introPath = path.join(docsDir, "introduction.mdx");
  const introContent = `---
title: Introduction
description: Welcome to your new prestige docs!
---

# Introduction
Welcome to your new prestige documentation!
`;
  await fs.writeFile(introPath, introContent);

  // 7. update style.css to use 
  console.log(pc.cyan("Updating style.css..."));
  const stylesPath = path.join(targetDir, "src/styles.css");
  const stylesContent = `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "@lonik/prestige/themes/primary-rose.css";
@import "@lonik/prestige/themes/default-slate.css";
@import "@lonik/prestige/themes/core.css";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

:root[data-theme="dark"] {
  --color-white: black;
}

:root {
  --color-white: white;
}

@theme {
  --font-rubik: "Rubik Wet Paint", system-ui;
  --font-sans: "Inter", sans-serif;
  --font-mono: "Geist Mono", monospace;
  --spacing-header: 64px;
  --height-main: calc(100vh - var(--spacing-header));
  --width-sidebar: 300px;

  --color-white: var(--color-white);
}
.prose {
  /* Shiki Dual Theme Dark Mode Overrides */
  :root .shiki,
  :root .shiki span {
    background-color: var(--color-default-50) !important;
  }

  :root[data-theme="dark"] .shiki,
  :root[data-theme="dark"] .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
`;
  await fs.writeFile(stylesPath, stylesContent);

  // 8. update _root to call createPrestigeRootRoute
  console.log(pc.cyan("Updating _root.tsx..."));
  const rootRoutePath = path.join(targetDir, "src/routes/__root.tsx");
  const rootRouteContent = `import { createPrestigeRootRoute } from '@lonik/prestige/ui';
import appCss from '../styles.css?url';

export const Route = createPrestigeRootRoute({
  title: "My Prestige App",
  appCss: appCss,
});
`;
  await fs.writeFile(rootRoutePath, rootRouteContent);

  // 9. update settings
  console.log(pc.cyan("Updating .vscode/settings.json..."));
  const vscodeDir = path.join(targetDir, ".vscode");
  await fs.mkdir(vscodeDir, { recursive: true });
  const settingsPath = path.join(vscodeDir, "settings.json");
  let settings: any = {};
  try {
    const existingSettings = await fs.readFile(settingsPath, "utf-8");
    settings = JSON.parse(existingSettings);
  } catch (e) {
    // File doesn't exist or isn't JSON
  }

  settings["files.watcherExclude"] = {
    ...settings["files.watcherExclude"],
    "**/routeTree.gen.ts": true,
    "**/(prestige)/**": true
  };
  settings["search.exclude"] = {
    ...settings["search.exclude"],
    "**/routeTree.gen.ts": true,
    "**/(prestige)/**": true
  };
  settings["files.readonlyInclude"] = {
    ...settings["files.readonlyInclude"],
    "**/routeTree.gen.ts": true,
    "**/(prestige)/**": true
  };

  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));

  console.log(pc.cyan("Installing dependencies..."));
  execSync(`npm install`, {
    cwd: targetDir,
    stdio: "inherit",
  });

  console.log(pc.green("Done! You can now run your app with 'npm run dev'"));
}

main().catch((err) => {
  console.error(pc.red(err.message));
  process.exit(1);
});
