import { normalizePath, type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/config";
import { PrestigeConfig } from "./config/config.types";
import { join } from "pathe";
import picomatch, { type Matcher } from "picomatch";

import { watchConfigChange, watchMarkdownChange } from "./utils/watcher";
import { ContentStore, getContentByPath } from "./core/content/content-store";
import logger from "./utils/logger";
import { pathExists } from "fs-extra";
import { Sidebar } from "./core/content/content-types";
import { ContentGenerator } from "./core/content/content-generator";
import { SidebarGenerator } from "./core/content/sidebar-generator";
import { ContentCollection } from "./core/content/content-collection";

const ARTICLE_PREFIX = "@articles";

export default function prestige(): Plugin {
  let config: PrestigeConfig;
  let contentDir: string;
  let sources: string[];
  let isDocsMatcher: Matcher;
  let sidebars: Sidebar;
  const virtualSidebarModuleId = "virtual:sidebar";
  const resolveVirtualModuleSidebarId = "\0" + virtualSidebarModuleId;
  let contentGenerator: ContentGenerator;
  let sidebarGenerator: SidebarGenerator;
  let contentCollection: ContentCollection;
  let contentStore: ContentStore;
  return {
    name: "vite-plugin-prestige",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig, sources: loaderSources } =
        await loadPrestigeConfig(resolvedConfig.root);
      config = loadedConfig;
      sources = loaderSources;
      contentDir = join(resolvedConfig.root, normalizePath(config.docsDir));
      isDocsMatcher = picomatch(join(contentDir, "**/*.md"));
      if (config.sidebars) {
        sidebars = config.sidebars;
      }

      contentGenerator = new ContentGenerator(contentDir + "/docs");
      sidebarGenerator = new SidebarGenerator("docs", contentDir);
      contentCollection = new ContentCollection(contentDir);
      contentStore = new ContentStore(contentDir);

      await contentStore.build(sidebars);
      await contentCollection.build(sidebars);
      await sidebarGenerator.buildMap();
    },
    resolveId(id) {
      const storeId = contentStore.resolve(id);
      if (storeId) {
        return storeId;
      }
      return null;
    },
    async load(id) {
      const loadId = contentStore.load(id);
      if (loadId) {
        return loadId;
      }

      // const contentGeneratorId = contentGenerator.resolve(id);
      // if (contentGeneratorId) {
      //   return contentGeneratorId;
      // }

      // const sidebarContent = sidebarGenerator.load(id);

      // if (sidebarContent) {
      //   return sidebarContent;
      // }

      // if (id === resolveVirtualModuleSidebarId) {
      //   return `export default  ${JSON.stringify(sidebars)}`;
      // }
      // const content = await contentGenerator.load(id);
      // if (content !== null) {
      //   return content;
      // }
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
