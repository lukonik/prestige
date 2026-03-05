import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SidebarLinkType } from "../core/content/content.types";
import { rmSafe } from "../utils/file-utils";
export async function compileRoutes(
  linksMap: Map<string, SidebarLinkType[]>,
  routesDir: string,
) {
  const prestigePath = "(prestige)";
  const prestigeFullPath = join(routesDir, prestigePath);

  await rmSafe(prestigeFullPath);

  await mkdir(prestigeFullPath, { recursive: true });

  for (const [key, links] of linksMap) {
    const sidebarPath = key;
    const sidebarFullPath = join(prestigeFullPath, sidebarPath + ".lazy.tsx");
    await writeFile(sidebarFullPath, createLayoutRoute(key));

    for (const l of links) {
      const pathified = l.slug.replaceAll("/", ".") + ".lazy.tsx";

      const filePath = join(prestigeFullPath, pathified);
      await writeFile(filePath, createContentRoute(l.slug));
    }
  }
}

function createLayoutRoute(id: string) {
  const code = `
  
            import { createFileRoute,Outlet } from '@tanstack/react-router'
            import sidebar from "virtual:prestige/sidebar/${id}"
            import {CollectionRoute} from "@lonik/prestige/ui"
            
            export const Route = createFileRoute('/(prestige)/${id}')(CollectionRoute(sidebar,"${id}"))
            
            
  `;
  return code;
}

function createContentRoute(slug: string) {
  const code = `
import { createFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/${slug}";
import { ContentRoute } from "@lonik/prestige/ui";


          export const Route = createFileRoute('/${slug}')(ContentRoute(contentData))
          
        
        
  `;

  return code;
}
