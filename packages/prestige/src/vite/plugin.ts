import { join } from "pathe";
import picomatch, { type Matcher } from "picomatch";
import { EnvironmentModuleNode, type Plugin } from "vite";
import { resolvePrestigeConfig } from "./config/config";
import { PrestigeConfig, PrestigeConfigInput } from "./config/config.types";

import { genObjectFromValues } from "knitwork";
import { warmupCompiler } from "./content/content-compiler";
import { resolveContentLinks } from "./content/content-links";
import {
  resolveSidebars,
  SIDEBAR_VIRTUAL_ID,
} from "./content/content-sidebar.store";
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
  InternalSidebarLinkType,
  SidebarType,
} from "./core/content/content.types";
import { genExportDefault, genExportUndefined } from "./utils/code-generation";
import { extractVirtualId } from "./utils/file-utils";

export const CONFIG_VIRTUAL_ID = "virtual:prestige/config";

export default function prestige(inlineConfig?: PrestigeConfigInput): Plugin {
  let config: PrestigeConfig;
  let contentDir: string;
  let isDocsMatcher: Matcher;
  let collections: Collections = [];
  let linksMap: Map<string, InternalSidebarLinkType[]>;
  let collectionNavigations: string;
  let sidebarsMap: Map<string, SidebarType>;
  return {
    name: "vite-plugin-prestige",
    enforce: "pre",
    async configResolved(resolvedConfig) {
      const { config: loadedConfig } = await resolvePrestigeConfig(
        inlineConfig,
        resolvedConfig.root,
      );
      config = loadedConfig;
      contentDir = join(resolvedConfig.root, "src/content");
      isDocsMatcher = picomatch(join(contentDir, "**/*.{md,mdx}"));
      collections = config.collections ?? [];
      sidebarsMap = await resolveSidebars(collections, contentDir);

      collectionNavigations = resolveCollectionNavigations(collections);

      const routesDir = join(resolvedConfig.root, "src", "routes");
      linksMap = resolveContentLinks(sidebarsMap);
      await compileRoutes(linksMap, routesDir);

      // Warm up the MDX compiler to pre-initialize the syntax highlighter (e.g. Shiki)
      // We do this non-blocking so it doesn't slow down the Vite startup.
      warmupCompiler(config.markdown);
    },
    resolveId(id) {
      // even though the import will be import * from "virtual:prestige/docs/introduction"
      // it is not guaranteed that some other plugin doesn't modify this import and attach full path
      // we call extractVirtualId to trim the import      

      if (id.includes(CONFIG_VIRTUAL_ID)) {
        return extractVirtualId(id, CONFIG_VIRTUAL_ID);
      }

      if (id.includes(CONTENT_VIRTUAL_ID)) {
        return extractVirtualId(id, CONTENT_VIRTUAL_ID);
      }

      if (id.includes(COLLECTION_VIRTUAL_ID)) {
        return extractVirtualId(id, COLLECTION_VIRTUAL_ID);
      }

      if (id.includes(SIDEBAR_VIRTUAL_ID)) {
        return extractVirtualId(id, SIDEBAR_VIRTUAL_ID);
      }

      return null;
    },
    async load(id) {
      if (id === `\0${CONFIG_VIRTUAL_ID}`) {
        return genExportDefault(JSON.stringify(config));
      }
      if (id.includes(CONTENT_VIRTUAL_ID)) {
        return await resolveContent(id, linksMap, contentDir);
      }
      if (id.includes(COLLECTION_VIRTUAL_ID)) {
        return collectionNavigations;
      }

      if (id.includes(SIDEBAR_VIRTUAL_ID)) {
        const sidebarId = id.replace(SIDEBAR_VIRTUAL_ID, "").replace("\0", "");
        const sidebar = sidebarsMap.get(sidebarId);
        if (!sidebar) {
          return genExportUndefined();
        }
        return genExportDefault(genObjectFromValues(sidebar));
      }

      return null;
    },

    async hotUpdate({ file, timestamp }) {
      if (isDocsMatcher(file)) {
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
          this.environment.hot.send({ type: "full-reload" });
        }
      }
    },
  };
}
