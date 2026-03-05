import { join } from "pathe";
import picomatch, { type Matcher } from "picomatch";
import { EnvironmentModuleNode, normalizePath, type Plugin } from "vite";
import { resolvePrestigeConfig } from "./config/config";
import { PrestigeConfig, PrestigeConfigInput } from "./config/config.types";

import { compileRoutes } from "./content/router-compiler";
import {
  COLLECTION_VIRTUAL_ID,
  resolveCollectionNavigations,
} from "./core/content/content-collection.store";
import { resolveContentLinks } from "./core/content/content-links";
import { ContentSidebarStore } from "./core/content/content-sidebar.store";
import {
  CONTENT_VIRTUAL_ID,
  resolveContent,
} from "./core/content/content.store";
import { Collections, SidebarLinkType } from "./core/content/content.types";

export default function prestige(inlineConfig?: PrestigeConfigInput): Plugin {
  let config: PrestigeConfig;
  let contentDir: string;
  let isDocsMatcher: Matcher;
  let collections: Collections = [];
  let contentSidebarStore: ContentSidebarStore;
  let linksMap: Map<string, SidebarLinkType[]>;
  let collectionNavigations: string;
  return {
    name: "vite-plugin-prestige",
    enforce: "pre",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig } = await resolvePrestigeConfig(
        inlineConfig,
        resolvedConfig.root,
      );
      config = loadedConfig;
      contentDir = join(resolvedConfig.root, normalizePath(config.docsDir));
      isDocsMatcher = picomatch(join(contentDir, "**/*.{md,mdx}"));
      collections = config.collections ?? [];

      contentSidebarStore = new ContentSidebarStore(contentDir);
      const sidebars = await contentSidebarStore.init(collections);

      collectionNavigations = resolveCollectionNavigations(collections);

      const routesDir = join(resolvedConfig.root, "src", "routes");
      linksMap = resolveContentLinks(sidebars);

      await compileRoutes(linksMap, routesDir);
    },
    resolveId(id) {
      if (id.includes(CONTENT_VIRTUAL_ID)) {
        return "\0" + id;
      }
      if (id.includes(COLLECTION_VIRTUAL_ID)) {
        return "\0" + id;
      }

      const sidebarId = contentSidebarStore.resolve(id);
      if (sidebarId) {
        return sidebarId;
      }

      return null;
    },
    async load(id) {
      if (id.includes(CONTENT_VIRTUAL_ID)) {
        return await resolveContent(id, linksMap, contentDir);
      }
      if (id.includes(COLLECTION_VIRTUAL_ID)) {
        return collectionNavigations;
      }

      const sidebarId = contentSidebarStore.load(id);
      if (sidebarId) {
        return sidebarId;
      }

      return null;
    },

    async hotUpdate({ file, timestamp }) {
      if (isDocsMatcher(file)) {
        const invalidatedModules = new Set<EnvironmentModuleNode>();
        const virtualModuleIds = `${CONTENT_VIRTUAL_ID}${file}`;
        for (const id of virtualModuleIds) {
          const module = this.environment.moduleGraph.getModuleById(id);
          if (module) {
            this.environment.moduleGraph.invalidateModule(
              module,
              invalidatedModules,
              timestamp,
              true,
            );
          }
        }
      }
    },
  };
}
