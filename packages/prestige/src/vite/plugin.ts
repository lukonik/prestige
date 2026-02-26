import { normalizePath, type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/config";
import { PrestigeConfig } from "./config/config.types";
import { join } from "pathe";
import picomatch, { type Matcher } from "picomatch";

import { watchConfigChange, watchMarkdownChange } from "./utils/watcher";
import { ContentStore, getContentByPath } from "./core/content/content.store";
import logger from "./utils/logger";
import { ContentCollectionStore } from "./core/content/content-collection.store";
import { Collections } from "./core/content/content.types";
import { pathExists } from "./utils/file-utils";
import { ContentSidebarStore } from "./core/content/content-sidebar.store";

const ARTICLE_PREFIX = "@articles";

export default function prestige(): Plugin {
  let config: PrestigeConfig;
  let contentDir: string;
  let sources: string[];
  let isDocsMatcher: Matcher;
  let contentStore: ContentStore;
  let contentCollectionStore: ContentCollectionStore;
  let collections: Collections = [];
  let contentSidebarStore: ContentSidebarStore;
  return {
    name: "vite-plugin-prestige",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig, sources: loaderSources } = await loadPrestigeConfig(
        resolvedConfig.root,
      );
      config = loadedConfig;
      sources = loaderSources;
      contentDir = join(resolvedConfig.root, normalizePath(config.docsDir));
      isDocsMatcher = picomatch(join(contentDir, "**/*.md"));
      collections = config.collections ?? [];

      contentStore = new ContentStore(contentDir);
      contentCollectionStore = new ContentCollectionStore();
      contentCollectionStore.init(collections);

      contentSidebarStore = new ContentSidebarStore(contentDir);
      contentSidebarStore.init(collections);

      await contentStore.build(collections);
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

    async configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) {
          return next();
        }
        if (req.url.includes(ARTICLE_PREFIX)) {
          try {
            const strippedUrl = req.url.replace(ARTICLE_PREFIX, "");
            const markdownPath = join(contentDir, strippedUrl);
            if (!(await pathExists(markdownPath))) {
              res.statusCode = 404;
              res.end();
              return;
            }
            const article = await getContentByPath(markdownPath);
            if (!article) {
              res.statusCode = 404;
              res.end();
              return;
            }
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(article));
            return;
          } catch (err) {
            logger.error(err);
            res.statusCode = 500;
            res.end();
            return;
          }
        }

        next();
      });

      watchConfigChange(server, sources);
      watchMarkdownChange(server, contentDir);
    },
    handleHotUpdate({ file, server }) {
      if (isDocsMatcher(file)) {
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}
