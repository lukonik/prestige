import path from "node:path";

import { loadConfigFromFile } from "vite";
import { describe, expect, it, vi } from "vitest";

import { defineConfig, prestigia } from "../src/vite.js";

import type {
  HmrContext,
  MinimalPluginContextWithoutEnvironment,
  ModuleNode,
  ResolvedConfig,
  UserConfig,
  ViteDevServer,
} from "vite";

vi.mock("vite", () => ({ loadConfigFromFile: vi.fn() }));

describe("Prestigia Vite plugin", () => {
  it("preserves config inference", () => {
    const config = defineConfig({ sidebar: ["overview"], title: "Docs" });

    expect(config.title).toBe("Docs");
  });

  it("loads config into a Content Collections-backed virtual module", async () => {
    vi.mocked(loadConfigFromFile).mockResolvedValue({
      path: "/project/prestigia.config.ts",
      dependencies: ["/project/sidebar.ts"],
      config: { sidebar: ["overview"] } as unknown as UserConfig,
    });
    const plugin = prestigia();
    const configResolved = plugin.configResolved;
    const configureServer = plugin.configureServer;
    const resolveId = plugin.resolveId;
    const load = plugin.load;
    const handleHotUpdate = plugin.handleHotUpdate;
    const virtualModule = {} as ModuleNode;
    const server = {
      watcher: { add: vi.fn() },
      moduleGraph: {
        getModuleById: vi.fn(() => virtualModule),
        invalidateModule: vi.fn(),
      },
    } as unknown as ViteDevServer;

    if (
      typeof configResolved !== "function" ||
      typeof configureServer !== "function" ||
      typeof resolveId !== "function" ||
      typeof load !== "function" ||
      typeof handleHotUpdate !== "function"
    ) {
      throw new TypeError("Expected function-form Vite hooks.");
    }

    const pluginContext = {} as MinimalPluginContextWithoutEnvironment;
    const resolveContext = {} as ThisParameterType<typeof resolveId>;
    const loadContext = {} as ThisParameterType<typeof load>;

    configResolved.call(pluginContext, { root: "/project" } as ResolvedConfig);
    configureServer.call(pluginContext, server);

    const resolvedId = await resolveId.call(
      resolveContext,
      "virtual:prestigia/config",
      undefined,
      { isEntry: false },
    );
    const source = await load.call(loadContext, String(resolvedId), {
      ssr: false,
    });

    expect(source).toContain('import { allDocs } from "content-collections";');
    expect(source).toContain("resolvePrestigiaSidebar(allDocs");
    expect(server.watcher.add).toHaveBeenCalledWith([
      "/project/prestigia.config.ts",
      "/project/sidebar.ts",
    ]);

    const updatedModules = handleHotUpdate.call(pluginContext, {
      file: path.resolve("/project/sidebar.ts"),
      server,
    } as HmrContext);

    expect(updatedModules).toEqual([virtualModule]);
    expect(server.moduleGraph.invalidateModule).toHaveBeenCalledWith(
      virtualModule,
    );
  });
});
