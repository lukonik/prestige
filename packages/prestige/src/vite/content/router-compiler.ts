import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SidebarLinkType } from "../core/content/content.types";
import logger from "../utils/logger";

export async function compileRoutes(
  linksMap: Map<string, SidebarLinkType[]>,
  routesDir: string,
) {
  const prestigePath = "(prestige)";
  const prestigeFullPath = join(routesDir, prestigePath);

  try {
    await mkdir(prestigeFullPath, { recursive: true });

    const generatedFiles = new Map<string, string>();

    for (const [key, links] of linksMap) {
      const onlyInternalLinks = links.filter((l) => "slug" in l);

      const sidebarPath = key;
      const sidebarFile = sidebarPath + ".lazy.tsx";
      generatedFiles.set(sidebarFile, createLayoutRoute(key));

      for (const l of onlyInternalLinks) {
        const pathified = l.slug.replaceAll("/", ".") + ".lazy.tsx";
        generatedFiles.set(pathified, createContentRoute(l.slug));
      }
    }

    // Write files only if they have changed or do not exist
    await Promise.all(
      [...generatedFiles.entries()].map(async ([fileName, contents]) => {
        const filePath = join(prestigeFullPath, fileName);
        try {
          const existingContent = await readFile(filePath, "utf-8");
          if (existingContent === contents) {
            return; // Skip writing if identical
          }
        } catch (e) {
          // File doesn't exist yet, proceed to write
        }
        logger.info(`Writing route file: ${fileName}`, { timestamp: true });
        return writeFile(filePath, contents);
      }),
    );

    const existingFiles = await readdir(prestigeFullPath);
    const staleFiles = existingFiles.filter(
      (fileName) =>
        fileName.endsWith(".lazy.tsx") && !generatedFiles.has(fileName),
    );

    await Promise.all(
      staleFiles.map((fileName) => {
        logger.info(`Removing stale route file: ${fileName}`, {
          timestamp: true,
        });
        return unlink(join(prestigeFullPath, fileName));
      }),
    );
  } catch (error) {
    logger.error(
      `[Prestige Router Compiler] Failed to compile routes: ${error}`,
      { timestamp: true },
    );
    console.error(
      "[Prestige Router Compiler] Failed to compile routes:",
      error,
    );
  }
}

function createLayoutRoute(id: string) {
  return (
    `
import { createLazyFileRoute } from '@tanstack/react-router';
import sidebar from "virtual:prestige/sidebar/${id}";
import { CollectionRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/${id}')(CollectionRoute(sidebar, "${id}"));
`.trim() + "\n"
  );
}

function createContentRoute(slug: string) {
  return (
    `
import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/${slug}";
import { ContentRoute } from "@lonik/prestige/ui";

export const Route = createLazyFileRoute('/(prestige)/${slug}')(ContentRoute(contentData));
`.trim() + "\n"
  );
}
