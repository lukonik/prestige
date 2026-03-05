import { mkdir, writeFile } from "node:fs/promises";
import { SidebarLinkType } from "../core/content/content.types";
import { join } from "node:path";
import { rmSafe } from "../utils/file-utils";
export async function compileRoutes(linksMap: Map<string, SidebarLinkType[]>, routesDir: string) {
  const prestigePath = "(prestige)";
  const prestigeFullPath = join(routesDir, prestigePath);

  await rmSafe(prestigeFullPath);

  await mkdir(prestigeFullPath, { recursive: true });

  for (const [key, links] of linksMap) {
    const sidebarPath = key;
    const sidebarFullPath = join(prestigeFullPath, sidebarPath + ".tsx");
    await writeFile(sidebarFullPath, createLayoutRoute(key));

    for (const l of links) {
      const pathified = l.slug.replaceAll("/", ".") + ".tsx";

      const filePath = join(prestigeFullPath, pathified);
      await writeFile(filePath, createContentRoute(l.slug));
    }
  }
}

function createLayoutRoute(id: string) {
  const code = `
  
            import { createFileRoute,Outlet } from '@tanstack/react-router'
            import sidebar from "virtual:prestige/sidebar/${id}"
            import {CollectionComponent,collectionLoader} from "@lonik/prestige/ui"
            
            export const Route = createFileRoute('/(prestige)/${id}')({
              component: RouteComponent,
              loader:({location})=>collectionLoader(location,sidebar,"${id}")
            })
            
            function RouteComponent() {
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
