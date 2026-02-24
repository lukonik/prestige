import { normalizePath, type Plugin } from "vite";
import { loadPrestigeConfig } from "./config/config";
import { PrestigeConfig } from "./config/config.types";
import { join } from "pathe";
import picomatch, { type Matcher } from "picomatch";

import { watchConfigChange, watchMarkdownChange } from "./utils/watcher";
import { getContentByPath } from "./core/content/content-store";
import logger from "./utils/logger";
import { pathExists } from "fs-extra";
import { Sidebar } from "./core/content/content-types";

const ARTICLE_PREFIX = "@articles";

export default function prestige(): Plugin {
  let config: PrestigeConfig;
  let docsDir: string;
  let sources: string[];
  let isDocsMatcher: Matcher;
  let sidebar: Sidebar;
  const virtualSidebarModuleId = "virtual:sidebar";
  const resolveVirtualModuleSidebarId = "\0" + virtualSidebarModuleId;

  return {
    name: "vite-plugin-prestige",
    resolveId(id) {
      if (id === virtualSidebarModuleId) {
        return resolveVirtualModuleSidebarId;
      }
      return null;
    },
    load(id) {
      if (id === resolveVirtualModuleSidebarId) {
        return `export default  ${JSON.stringify(sidebar)}`;
      }
      return null;
    },
    async configResolved(resolvedConfig) {
      const { config: loadedConfig, sources: loaderSources } = await loadPrestigeConfig(
        resolvedConfig.root,
      );
      config = loadedConfig;
      sources = loaderSources;
      docsDir = join(resolvedConfig.root, normalizePath(config.docsDir));
      isDocsMatcher = picomatch(join(docsDir, "**/*.md"));
      if (config.sidebar) {
        sidebar = config.sidebar;
      }
    },
    async configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) {
          return next();
        }
        if (req.url.includes(ARTICLE_PREFIX)) {
          try {
            const strippedUrl = req.url.replace(ARTICLE_PREFIX, "");
            const markdownPath = join(docsDir, strippedUrl);
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
      watchMarkdownChange(server, docsDir);
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
