#!/usr/bin/env node
import { cancel, intro, isCancel, outro, spinner, text } from "@clack/prompts";
import { downloadTemplate } from "giget";
import fs from "node:fs/promises";
import path from "node:path";
import { installDependencies } from "nypm";
import pc from "picocolors";

async function main() {
  intro(pc.inverse(" create-prestige "));

  const projectName = await text({
    message: "What is your project named?",
    placeholder: "my-prestige-docs",
    defaultValue: "my-prestige-docs",
  });

  if (isCancel(projectName)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  const cwd = process.cwd();
  const projectDir = path.resolve(cwd, projectName as string);

  const s = spinner();

  s.start(`Creating project in ${projectDir}`);

  try {
    // Check if directory already exists and is not empty
    const dirExists = await fs
      .access(projectDir)
      .then(() => true)
      .catch(() => false);

    if (dirExists) {
      const files = await fs.readdir(projectDir);
      if (files.length > 0) {
        cancel(`Directory ${projectDir} is not empty.`);
        process.exit(1);
      }
    }

    // Download template from GitHub using giget
    await downloadTemplate("github:lukonik/prestige/template", {
      dir: projectDir,
      force: true,
    });

    s.stop(`Created project directory`);
  } catch (err) {
    s.stop("Failed to create project");
    console.error(err);
    process.exit(1);
  }

  // Update vite.config.ts with the project name
  s.start("Configuring project");
  try {
    const viteConfigPath = path.join(projectDir, "vite.config.ts");
    const viteConfigExists = await fs
      .access(viteConfigPath)
      .then(() => true)
      .catch(() => false);

    if (viteConfigExists) {
      let viteConfig = await fs.readFile(viteConfigPath, "utf-8");
      viteConfig = viteConfig.replace(
        /__PROJECT_TITLE__/g,
        projectName as string
      );
      await fs.writeFile(viteConfigPath, viteConfig);
    }

    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJsonExists = await fs
      .access(packageJsonPath)
      .then(() => true)
      .catch(() => false);

    if (packageJsonExists) {
      const pkg = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
      pkg.name = projectName as string;
      await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
    }
    
    s.stop("Project configured");
  } catch (err) {
    s.stop("Failed to configure project");
    console.error(err);
  }

  // Install dependencies
  s.start("Installing dependencies...");
  try {
    await installDependencies({ cwd: projectDir });
    s.stop("Successfully installed dependencies!");
  } catch (err) {
    s.stop(
      "Failed to install dependencies. Please run your package manager's install command manually.",
    );
    console.error(err);
  }

  outro(pc.green("✔ Prestige project is ready!"));
  console.log("\nNext steps:");
  console.log(`  cd ${projectName}`);
  console.log(`  npm run dev (or yarn/pnpm equivalent)\n`);
}

main().catch(console.error);