#!/usr/bin/env node
import { cancel, intro, isCancel, outro, spinner, text } from "@clack/prompts";
import fs from "node:fs/promises";
import path from "node:path";
import { installDependencies } from "nypm";
import pc from "picocolors";

async function main() {
  intro(pc.inverse(" create-prestige "));

  const cwd = process.cwd();

  // Check for package.json to ensure we're in a project
  const packageJsonPath = path.join(cwd, "package.json");
  try {
    await fs.access(packageJsonPath);
  } catch {
    cancel(
      "No package.json found. Please run this command inside an existing TanStack Start project.",
    );
    process.exit(1);
  }

  outro(pc.yellow("Starting to add Prestige to your project"));

  const projectTitle = await text({
    message:
      "What is the title of your project? (This will be displayed in the browser tab)",
    placeholder: "My Prestige Docs",
    defaultValue: "My Prestige Docs",
  });

  if (isCancel(projectTitle)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  const s = spinner();

  // 1. Update package.json
  s.start("Adding @lonik/prestige dependency");
  try {
    const pkgStr = await fs.readFile(packageJsonPath, "utf-8");
    const pkg = JSON.parse(pkgStr);
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies["@lonik/prestige"] = "latest"; // or a specific version
    await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
    s.stop("Added @lonik/prestige to package.json");
  } catch (err) {
    s.stop("Failed to update package.json");
    console.error(err);
    process.exit(1);
  }

  // 2. Update vite.config.ts
  s.start("Configuring vite.config.ts");
  try {
    const viteConfigPaths = ["vite.config.ts", "vite.config.js"];
    let viteConfigPath = null;

    for (const p of viteConfigPaths) {
      try {
        await fs.access(path.join(cwd, p));
        viteConfigPath = path.join(cwd, p);
        break;
      } catch {}
    }

    if (viteConfigPath) {
      let configContent = await fs.readFile(viteConfigPath, "utf-8");

      // Simple string manipulation if magicast is tricky with tsx/react stuff
      // But we will use string replacement for reliability first
      if (!configContent.includes("prestige(")) {
        const importStatement = `import { prestige } from "@lonik/prestige/vite";
`;
        const pluginConfig = `prestige({
      title: "${projectTitle}",
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
            }
          ]
        }
      ]
    }),`;

        // Add import
        if (!configContent.includes("@lonik/prestige/vite")) {
          configContent = importStatement + configContent;
        }

        // Add plugin to array
        configContent = configContent.replace(
          /plugins:\s*\[/,
          `plugins: [
    ${pluginConfig}`,
        );

        await fs.writeFile(viteConfigPath, configContent);
        s.stop("Configured prestige plugin in vite.config");
      } else {
        s.stop("Prestige plugin already configured in vite.config");
      }
    } else {
      s.stop("Could not find vite.config.ts. Skipping.");
    }
  } catch (err) {
    s.stop("Failed to update vite.config.ts");
    console.error(err);
  }

  // 3. Create docs directory and introduction.mdx
  s.start("Creating content directory");
  try {
    // Prefer app/ over src/ if it exists (TanStack Start often uses app/)
    // But user specified 'it will create the content/docs folder in src'
    // Let's check if there is an app dir vs src dir. Let's default to src or app based on what exists.
    let rootDir = "src";
    const srcExists = await fs
      .access(path.join(cwd, "src"))
      .then(() => true)
      .catch(() => false);
    const appExists = await fs
      .access(path.join(cwd, "app"))
      .then(() => true)
      .catch(() => false);

    if (appExists && !srcExists) {
      rootDir = "app";
    }

    const docsDir = path.join(cwd, rootDir, "content", "docs");
    await fs.mkdir(docsDir, { recursive: true });

    const introPath = path.join(docsDir, "introduction.mdx");
    const mdxContent = `---
title: Introduction
description: Welcome to your new Prestige documentation site.
---

# Introduction

Welcome to Prestige! This is your generated documentation site.
`;
    await fs.writeFile(introPath, mdxContent);
    s.stop(`Created ${rootDir}/content/docs/introduction.mdx`);
  } catch (err) {
    s.stop("Failed to create content directory");
    console.error(err);
  }

  // 4. Update __root.tsx
  s.start("Updating root route");
  try {
    let rootDir = "src";
    const srcExists = await fs
      .access(path.join(cwd, "src"))
      .then(() => true)
      .catch(() => false);
    const appExists = await fs
      .access(path.join(cwd, "app"))
      .then(() => true)
      .catch(() => false);

    if (appExists && !srcExists) {
      rootDir = "app";
    }

    const rootRoutePath = path.join(cwd, rootDir, "routes", "__root.tsx");

    const rootContent = `import type { PrestigeShellProps } from '@lonik/prestige/ui';
import { PrestigeShell } from '@lonik/prestige/ui';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import config from "virtual:prestige/config";
import appCss from "../styles.css?url";

const options: PrestigeShellProps = {
  copyright: () => (
    <a
      className="underline"
      href="https://github.com/lukonik/Prestige"
      target="_blank"
      rel="norefferer"
    >
      Built with Prestige 🎩
    </a>
  ),
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: config.title },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PrestigeShell options={options}>
          <Outlet />
        </PrestigeShell>
        <Scripts />
      </body>
    </html>
  ),
});
`;

    // Ensure routes directory exists
    await fs.mkdir(path.dirname(rootRoutePath), { recursive: true });
    await fs.writeFile(rootRoutePath, rootContent);
    s.stop(`Updated ${rootDir}/routes/__root.tsx`);
  } catch (err) {
    s.stop("Failed to update root route");
    console.error(err);
  }

  // 5. Update styles.css
  s.start("Updating styles.css");
  try {
    let rootDir = "src";
    const srcExists = await fs
      .access(path.join(cwd, "src"))
      .then(() => true)
      .catch(() => false);
    const appExists = await fs
      .access(path.join(cwd, "app"))
      .then(() => true)
      .catch(() => false);

    if (appExists && !srcExists) {
      rootDir = "app";
    }

    const cssPath = path.join(cwd, rootDir, "styles.css");
    const cssContent = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
@import 'tailwindcss';
@import '@lonik/prestige/themes/primary-rose.css';
@import '@lonik/prestige/themes/default-slate.css';
@import '@lonik/prestige/themes/core.css';
@source "../node_modules/@lonik/prestige";

@theme {
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Geist Mono', monospace;
}
`;
    await fs.writeFile(cssPath, cssContent);
    s.stop(`Updated ${rootDir}/styles.css`);
  } catch (err) {
    s.stop("Failed to update styles.css");
    console.error(err);
  }

  // 5. Install dependencies
  s.start("Installing dependencies...");
  try {
    await installDependencies({ cwd });
    s.stop("Successfully installed dependencies!");
  } catch (err) {
    s.stop(
      "Failed to install dependencies. Please run your package manager's install command manually.",
    );
    console.error(err);
  }

  outro(pc.green("✔ Prestige is now configured in your project!"));
  console.log("\\nNext steps:");
  console.log(
    `1. Run ${pc.cyan(`npm run dev`)} (or yarn/pnpm equivalent) to start the development server\\n`,
  );
}

main().catch(console.error);
