import { describe, it, expect, vi, beforeEach } from "vitest";
import prestige from "../../src/vite/plugin";
import { loadPrestigeConfig } from "../../src/vite/config/config";
import { Plugin } from "vite";

// Mock the config loader
vi.mock("../../src/vite/config/config", () => ({
  loadPrestigeConfig: vi.fn(),
}));

// Mock watchers to avoid side effects if configureServer is called (though we might not call it)
vi.mock("../../src/vite/utils/watcher", () => ({
  watchConfigChange: vi.fn(),
  watchMarkdownChange: vi.fn(),
}));

describe("prestige vite plugin", () => {
  let plugin: Plugin;
  let mockServer: any;

  beforeEach(() => {
    vi.clearAllMocks();
    plugin = prestige();
    mockServer = {
      ws: {
        send: vi.fn(),
      },
      watcher: {
        on: vi.fn(),
        add: vi.fn(),
      },
    };
  });

  const setupPlugin = async (root: string, docsDir: string) => {
    (loadPrestigeConfig as any).mockResolvedValue({
      config: { docsDir: docsDir },
      sources: [],
    });

    if (plugin.configResolved) {
      // @ts-ignore
      await plugin.configResolved({ root: root } as any);
    }
  };

  it("handleHotUpdate triggers full-reload for markdown files in docsDir", async () => {
    const root = "/project";
    const docsDir = "docs";
    await setupPlugin(root, docsDir);

    const file = "/project/docs/foo.md";
    // @ts-ignore
    await plugin.handleHotUpdate({ file, server: mockServer, modules: [] });

    expect(mockServer.ws.send).toHaveBeenCalledWith({
      type: "full-reload",
      path: "*",
    });
  });

  it("handleHotUpdate ignores non-markdown files", async () => {
    const root = "/project";
    const docsDir = "docs";
    await setupPlugin(root, docsDir);

    const file = "/project/docs/foo.ts";
    // @ts-ignore
    await plugin.handleHotUpdate({ file, server: mockServer, modules: [] });

    expect(mockServer.ws.send).not.toHaveBeenCalled();
  });

  it("handleHotUpdate ignores markdown files outside docsDir", async () => {
    const root = "/project";
    const docsDir = "docs";
    await setupPlugin(root, docsDir);

    const file = "/project/other/foo.md";
    // @ts-ignore
    await plugin.handleHotUpdate({ file, server: mockServer, modules: [] });

    expect(mockServer.ws.send).not.toHaveBeenCalled();
  });
});
