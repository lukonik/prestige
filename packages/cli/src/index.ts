#!/usr/bin/env node

import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const packageName = "@prestigia/cli";

export const defaultProjectDirectory = "prestigia-docs";

const ignoredTemplateDirectories = new Set([
  ".content-collections",
  ".git",
  "dist",
  "node_modules",
]);

export type CreateProjectOptions = {
  cwd?: string;
  directory?: string;
  templateDirectory?: string;
};

export type MainOptions = {
  cwd?: string;
};

function getTemplateDirectory(): string {
  const currentModuleDirectory = path.dirname(fileURLToPath(import.meta.url));

  return path.join(currentModuleDirectory, "template");
}

function getWorkspaceTemplateDirectory(): string {
  const currentModuleDirectory = path.dirname(fileURLToPath(import.meta.url));

  return path.resolve(currentModuleDirectory, "../../../template");
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveTemplateDirectory(
  explicitTemplateDirectory?: string,
): Promise<string> {
  if (explicitTemplateDirectory) return explicitTemplateDirectory;

  const bundledTemplateDirectory = getTemplateDirectory();

  if (await pathExists(bundledTemplateDirectory)) {
    return bundledTemplateDirectory;
  }

  const workspaceTemplateDirectory = getWorkspaceTemplateDirectory();

  if (await pathExists(workspaceTemplateDirectory)) {
    return workspaceTemplateDirectory;
  }

  throw new Error("The Prestigia project template could not be found.");
}

function toPackageName(directoryName: string): string {
  const projectPackageName = directoryName
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "");

  return projectPackageName || defaultProjectDirectory;
}

async function assertDestinationIsEmpty(destination: string): Promise<void> {
  if (!(await pathExists(destination))) return;

  const entries = await readdir(destination);

  if (entries.length > 0) {
    throw new Error(
      `Cannot create a Prestigia project in ${destination}: the directory is not empty.`,
    );
  }
}

export async function createProject(
  options: CreateProjectOptions = {},
): Promise<string> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const directory = options.directory ?? defaultProjectDirectory;
  const destination = path.resolve(cwd, directory);
  const templateDirectory = await resolveTemplateDirectory(
    options.templateDirectory,
  );

  await assertDestinationIsEmpty(destination);
  await mkdir(destination, { recursive: true });
  await cp(templateDirectory, destination, {
    recursive: true,
    filter: (source) => {
      const [topLevelEntry] = path
        .relative(templateDirectory, source)
        .split(path.sep);

      return !topLevelEntry || !ignoredTemplateDirectories.has(topLevelEntry);
    },
  });

  const templateGitignore = path.join(destination, "_gitignore");

  if (await pathExists(templateGitignore)) {
    await rename(templateGitignore, path.join(destination, ".gitignore"));
  }

  const packageJsonPath = path.join(destination, "package.json");
  const packageJson = JSON.parse(
    await readFile(packageJsonPath, "utf8"),
  ) as Record<string, unknown>;

  packageJson.name = toPackageName(path.basename(destination));
  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, undefined, 2)}\n`,
    "utf8",
  );

  return destination;
}

function helpText(): string {
  return [
    "Prestigia CLI",
    "",
    "Usage:",
    "  prestigia create [directory]",
    "  prestigia --help",
    "",
    `The default directory is ${defaultProjectDirectory}.`,
  ].join("\n");
}

export async function main(
  args: Array<string> = process.argv.slice(2),
  options: MainOptions = {},
): Promise<string> {
  const [command, directory, ...rest] = args;

  if (!command || command === "--help" || command === "-h") {
    return helpText();
  }

  if (command !== "create") {
    throw new Error(`Unknown command: ${command}\n\n${helpText()}`);
  }

  if (rest.length > 0) {
    throw new Error("The create command accepts at most one directory.");
  }

  const destination = await createProject({
    cwd: options.cwd,
    directory,
  });
  const relativeDestination = path.relative(
    path.resolve(options.cwd ?? process.cwd()),
    destination,
  );

  return [
    `Created a Prestigia project in ${destination}.`,
    "",
    "Next steps:",
    `  cd ${relativeDestination || "."}`,
    "  pnpm install",
    "  pnpm dev",
  ].join("\n");
}

const entry = process.argv[1];

if (entry && import.meta.url === pathToFileURL(entry).href) {
  main()
    .then((message) => {
      process.stdout.write(`${message}\n`);
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`${message}\n`);
      process.exitCode = 1;
    });
}
