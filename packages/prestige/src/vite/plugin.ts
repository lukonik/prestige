import { EnvironmentModuleNode, normalizePath, type Plugin } from "vite";
import { resolvePrestigeConfig } from "./config/config";
import { PrestigeConfig, PrestigeConfigInput } from "./config/config.types";
import { join } from "pathe";
import picomatch, { type Matcher } from "picomatch";

import { ContentStore } from "./core/content/content.store";
import { ContentCollectionStore } from "./core/content/content-collection.store";
import { Collections } from "./core/content/content.types";
import { ContentSidebarStore } from "./core/content/content-sidebar.store";

export default function prestige(inlineConfig?: PrestigeConfigInput): Plugin {
  let config: PrestigeConfig;
  let contentDir: string;
  let isDocsMatcher: Matcher;
  let contentStore: ContentStore;
  let contentCollectionStore: ContentCollectionStore;
  let collections: Collections = [];
  let contentSidebarStore: ContentSidebarStore;
  return {
    name: "vite-plugin-prestige",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig } = await resolvePrestigeConfig(
        inlineConfig,
        resolvedConfig.root,
      );
      config = loadedConfig;
      contentDir = join(resolvedConfig.root, normalizePath(config.docsDir));
      isDocsMatcher = picomatch(join(contentDir, "**/*.{md,mdx}"));
      collections = config.collections ?? [];

      contentStore = new ContentStore(contentDir);
      await contentStore.process();

      contentSidebarStore = new ContentSidebarStore(contentDir, contentStore);
      const sidebars = await contentSidebarStore.init(collections);

      contentCollectionStore = new ContentCollectionStore();
      contentCollectionStore.init(collections, sidebars);

      await contentStore.init(sidebars);
    },
    resolveId(id) {
      const sidebarId = contentSidebarStore.resolve(id);
      if (sidebarId) {
        return sidebarId;
      }
      const collectionId = contentCollectionStore.resolve(id);
      if (collectionId) {
        return collectionId;
      }
      const storeId = contentStore.resolve(id);
      if (storeId) {
        return storeId;
      }

      return null;
    },
    async load(id) {
      const sidebarId = contentSidebarStore.load(id);
      if (sidebarId) {
        return sidebarId;
      }
      const loadCollectionId = contentCollectionStore.load(id);
      if (loadCollectionId) {
        return loadCollectionId;
      }
      const loadId = contentStore.load(id);
      if (loadId) {
        return loadId;
      }

      return null;
    },

    async hotUpdate({ file, timestamp }) {
      if (isDocsMatcher(file)) {
        const invalidatedModules = new Set<EnvironmentModuleNode>();
        await contentStore.invalidate(file);
        const virtualModuleIds = contentStore.getVirtualModuleIdsForFile(file);
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
