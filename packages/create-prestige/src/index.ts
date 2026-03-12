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
@import '@lonik/prestige/themes/primary-blue.css';
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

  // 6. Update routes/index.tsx
  s.start("Updating routes/index.tsx");
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

    const indexRoutePath = path.join(cwd, rootDir, "routes", "index.tsx");
    const indexRouteContent = `import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import config from "virtual:prestige/config";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="container mx-auto flex justify-center flex-col items-center">
        <h1 className="text-3xl lg:text-8xl font-medium leading-snug mt-2 lg:mt-10 uppercase">
          {config.title}
        </h1>
        <h2 className="text-3xl lg:text-6xl font-medium leading-snug">
          Your great project
        </h2>
        <div className="mt-10 flex lg:justify-start items-center justify-center gap-4">
          <Link to="/docs/introduction">
            <button className="rounded-full px-4 lg:px-8 bg-primary-600 text-white lg:h-14 h-12 flex items-center justify-center gap-4 cursor-pointer">
              Introduction <ArrowRight size={20} />
            </button>
          </Link>
          <a href="https://github.com/lukonik/Prestige" target="_blank" rel="noreferrer">
            <button className="rounded-full px-4 lg:px-8  h-14 flex items-center justify-center gap-4 cursor-pointer">
              Star on Github{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github-icon lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
`;
    await fs.mkdir(path.dirname(indexRoutePath), { recursive: true });
    await fs.writeFile(indexRoutePath, indexRouteContent);
    s.stop(`Updated ${rootDir}/routes/index.tsx`);
  } catch (err) {
    s.stop("Failed to update index route");
    console.error(err);
  }

  // 7. Install dependencies
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
