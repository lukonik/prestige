import { join } from "pathe";
import picomatch, { type Matcher } from "picomatch";
import { EnvironmentModuleNode, type Plugin } from "vite";
import { resolvePrestigeConfig } from "./config/config";
import { PrestigeConfig } from "./config/config.types";

import { genObjectFromValues } from "knitwork";
import { resolveContentLinks } from "./content/content-links";
import {
  resolveSidebars,
  SIDEBAR_VIRTUAL_ID,
} from "./content/content-sidebar.store";
import { initContentWatcher } from "./content/content-watcher";
import {
  CONTENT_VIRTUAL_ID,
  getSlugByPath,
  resolveContent,
} from "./content/content.store";
import { compileRoutes } from "./content/router-compiler";
import {
  COLLECTION_VIRTUAL_ID,
  resolveCollectionNavigations,
} from "./core/content/content-collection.store";
import {
  Collections,
  SidebarLinkType,
  SidebarType,
} from "./core/content/content.types";
import { genExportDefault, genExportUndefined } from "./utils/code-generation";
import { extractVirtualId } from "./utils/file-utils";
import { createLogger, Logger } from "./utils/logger";

export const CONFIG_VIRTUAL_ID = "virtual:prestige/config";

export default function prestige(): Plugin {
  let config: PrestigeConfig;
  let contentDir: string;
  let isDocsMatcher: Matcher;
  let collections: Collections = [];
  let linksMap: Map<string, SidebarLinkType[]>;
  let collectionNavigations: string;
  let sidebarsMap: Map<string, SidebarType>;
  let logger: Logger;

  return {
    name: "vite-plugin-prestige",
    enforce: "pre",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig, fullDocsDir } = await resolvePrestigeConfig(
        resolvedConfig.root,
        {
          command: resolvedConfig.command,
          mode: resolvedConfig.mode,
        },
      );

      config = loadedConfig;
      logger = createLogger({
        disabled: config.disableLog,
        debug: config.enableDebugLog,
      });

      contentDir = fullDocsDir;
      isDocsMatcher = picomatch(join(contentDir, "**/*.{md,mdx}"));
      collections = config.collections ?? [];

      logger.debug("Resolving sidebars...");
      sidebarsMap = await resolveSidebars(collections, contentDir, logger);

      logger.debug("Resolving content links...");
      linksMap = resolveContentLinks(sidebarsMap);

      logger.debug("Resolving collection navigations....");
      collectionNavigations = resolveCollectionNavigations(
        collections,
        linksMap,
      );
      const routesDir = join(resolvedConfig.root, "src", "routes");

      logger.debug("Compiling routes...");
      await compileRoutes(linksMap, routesDir, logger);
    },
    configureServer(server) {
      initContentWatcher(contentDir, server);
    },
    resolveId(id) {
      // even though the import will be import * from "virtual:prestige/docs/introduction"
      // it is not guaranteed that some other plugin doesn't modify this import and attach full path
      // we call extractVirtualId to trim the import

      if (id.includes(CONFIG_VIRTUAL_ID)) {
        logger.debug(`Resolving config virtual ID: ${id}`);
        return extractVirtualId(id, CONFIG_VIRTUAL_ID);
      }

      if (id.includes(CONTENT_VIRTUAL_ID)) {
        logger.debug(`Resolving content virtual ID: ${id}`);
        return extractVirtualId(id, CONTENT_VIRTUAL_ID);
      }

      if (id.includes(COLLECTION_VIRTUAL_ID)) {
        logger.debug(`Resolving collection virtual ID: ${id}`);
        return extractVirtualId(id, COLLECTION_VIRTUAL_ID);
      }

      if (id.includes(SIDEBAR_VIRTUAL_ID)) {
        logger.debug(`Resolving sidebar virtual ID: ${id}`);
        return extractVirtualId(id, SIDEBAR_VIRTUAL_ID);
      }

      return null;
    },
    async load(id) {
      if (id === `\0${CONFIG_VIRTUAL_ID}`) {
        logger.debug(`Loading config virtual module: ${id}`);
        return genExportDefault(JSON.stringify(config));
      }
      if (id.includes(CONTENT_VIRTUAL_ID)) {
        logger.debug(`Loading content virtual module: ${id}`);
        return await resolveContent(id, linksMap, contentDir, logger);
      }
      if (id.includes(COLLECTION_VIRTUAL_ID)) {
        logger.debug(`Loading collection virtual module: ${id}`);
        return collectionNavigations;
      }

      if (id.includes(SIDEBAR_VIRTUAL_ID)) {
        logger.debug(`Loading sidebar virtual module: ${id}`);
        const sidebarId = id.replace(SIDEBAR_VIRTUAL_ID, "").replace("\0", "");
        const sidebar = sidebarsMap.get(sidebarId);
        if (!sidebar) {
          return genExportUndefined();
        }
        return genExportDefault(genObjectFromValues(sidebar));
      }

      return null;
    },

    async hotUpdate({ file, timestamp, type }) {
      if (type !== "update" || !isDocsMatcher(file)) {
        return;
      }
      logger.debug(`Invalidating module ${file}...`);
      const invalidatedModules = new Set<EnvironmentModuleNode>();
      const slug = getSlugByPath(file, contentDir);
      const virtualModuleId = `\0${CONTENT_VIRTUAL_ID}${slug}`;
      const module =
        this.environment.moduleGraph.getModuleById(virtualModuleId);
      if (module) {
        this.environment.moduleGraph.invalidateModule(
          module,
          invalidatedModules,
          timestamp,
          true,
        );
        logger.debug(`Reloading application...`);
        this.environment.hot.send({ type: "full-reload" });
      }
    },
  };
}
