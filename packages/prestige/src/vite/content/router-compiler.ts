import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SidebarLinkType } from "../core/content/content.types";

export async function compileRoutes(
  linksMap: Map<string, SidebarLinkType[]>,
  routesDir: string,
) {
  const prestigePath = "(prestige)";
  const prestigeFullPath = join(routesDir, prestigePath);

  await mkdir(prestigeFullPath, { recursive: true });

  const generatedFiles = new Map<string, string>();

  for (const [key, links] of linksMap) {
    const sidebarPath = key;
    const sidebarFile = sidebarPath + ".lazy.tsx";
    generatedFiles.set(sidebarFile, createLayoutRoute(key));

    for (const l of links) {
      const pathified = l.slug.replaceAll("/", ".") + ".lazy.tsx";
      generatedFiles.set(pathified, createContentRoute(l.slug));
    }
  }

  await Promise.all(
    [...generatedFiles.entries()].map(([fileName, contents]) => {
      const filePath = join(prestigeFullPath, fileName);
      return writeFile(filePath, contents);
    }),
  );

  const existingFiles = await readdir(prestigeFullPath);
  const staleFiles = existingFiles.filter(
    (fileName) => fileName.endsWith(".lazy.tsx") && !generatedFiles.has(fileName),
  );

  await Promise.all(
    staleFiles.map((fileName) => unlink(join(prestigeFullPath, fileName))),
  );
}

function createLayoutRoute(id: string) {
  const code = `
  
            import { createLazyFileRoute,Outlet } from '@tanstack/react-router'
            import sidebar from "virtual:prestige/sidebar/${id}"
            import {CollectionRoute} from "@lonik/prestige/ui"
            
            export const Route = createLazyFileRoute('/(prestige)/${id}')(CollectionRoute(sidebar,"${id}"))
            
            
  `;
  return code;
}

function createContentRoute(slug: string) {
  const code = `
import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/${slug}";
import { ContentRoute } from "@lonik/prestige/ui";


          export const Route = createLazyFileRoute('/(prestige)/${slug}')(ContentRoute(contentData))
          
        
        
  `;

  return code;
}
