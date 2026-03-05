import { mkdir, writeFile } from "node:fs/promises";
import { SidebarLinkType, SidebarType } from "../core/content/content.types";
import { join } from "node:path";
import { rmSafe } from "../utils/file-utils";
export async function compileRoutes(sidebars: Map<string, SidebarType>, routesDir: string) {
  const prestigePath = "(prestige)";
  const prestigeFullPath = join(routesDir, prestigePath);

  await rmSafe(prestigeFullPath);

  await mkdir(prestigeFullPath, { recursive: true });

  for (const [key, value] of sidebars) {
    const sidebarPath = key;
    const sidebarFullPath = join(prestigeFullPath, sidebarPath + ".tsx");
    await writeFile(sidebarFullPath, createLayoutRoute(key));

    const links = value.items.filter((f) => !("items" in f)) as SidebarLinkType[];

    for (const l of links) {
      const pathified = l.slug.replace("/", ".") + ".tsx";

      const filePath = join(prestigeFullPath, pathified);
      await writeFile(filePath, createContentRoute(l.slug));
    }
  }
}

function createLayoutRoute(id: string) {
  const code = `
  
            import { createFileRoute,Outlet } from '@tanstack/react-router'
            import sidebar from "virtual:prestige/sidebar/${id}"
            import {CollectionComponent} from "@lonik/prestige/ui"
            
            export const Route = createFileRoute('/(prestige)/${id}')({
              component: RouteComponent,
            })
            
            function RouteComponent() {
              console.log(sidebar)
              return <>
              <CollectionComponent sidebar={sidebar} />
              <Outlet/>
              </> 
            }
            
  `;
  return code;
}

function createContentRoute(slug: string) {
  const code = `
import { createFileRoute } from "@tanstack/react-router";
import Content, * as rest from "virtual:prestige/content/${slug}";
import { ContentComponent } from "@lonik/prestige/ui";


          export const Route = createFileRoute('/${slug}')({
              component: RouteComponent,
            })
          
        
         
    
    function RouteComponent() {
      return (
        <ContentComponent {...rest}>
          <Content />
        </ContentComponent>
      );
    }
    
         
        
  `;

  return code;
}
