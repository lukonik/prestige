import { describe, it, expect, vi, beforeEach } from "vitest";
import prestige from "../../src/vite/plugin";
import { resolvePrestigeConfig } from "../../src/vite/config/config";
import { Plugin } from "vite";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

// Mock the config loader
vi.mock("../../src/vite/config/config", () => ({
  resolvePrestigeConfig: vi.fn(),
}));

// Mock watchers to avoid side effects if configureServer is called (though we might not call it)
vi.mock("../../src/vite/utils/watcher", () => ({
  watchMarkdownChange: vi.fn(),
}));

describe.skip("prestige vite plugin", () => {
  let plugin: Plugin;
  let mockServer: any;

  beforeEach(() => {
    vi.clearAllMocks();
    plugin = prestige();
    mockServer = {
      ws: {
        send: vi.fn(),
      },
      moduleGraph: {
        getModuleById: vi.fn(),
        invalidateModule: vi.fn(),
      },
      watcher: {
        on: vi.fn(),
        add: vi.fn(),
      },
    };
  });

  const setupPlugin = async (root: string, docsDir: string) => {
    (resolvePrestigeConfig as any).mockResolvedValue({
      config: { docsDir: docsDir, collections: [] },
    });

    if (plugin.configResolved) {
      // @ts-ignore
      await plugin.configResolved({ root: root } as any);
    }
  };

  const createProjectFile = async (docsDir: string, relativePath: string) => {
    const root = await mkdtemp(join(tmpdir(), "prestige-plugin-test-"));
    const docsPath = join(root, docsDir);
    const fullFilePath = join(docsPath, relativePath);

    await mkdir(dirname(fullFilePath), { recursive: true });
    await writeFile(fullFilePath, "# title\n\ncontent");

    return { root, file: fullFilePath };
  };

  it("handleHotUpdate triggers full-reload for markdown files in docsDir", async () => {
    const docsDir = "docs";
    const { root, file } = await createProjectFile(docsDir, "foo.md");
    await setupPlugin(root, docsDir);

    // @ts-ignore
    await plugin.handleHotUpdate({ file, server: mockServer, modules: [] });

    expect(mockServer.ws.send).toHaveBeenCalledWith({
      type: "full-reload",
      path: "*",
    });
  });

  it("handleHotUpdate invalidates virtual content modules before full reload", async () => {
    const docsDir = "docs";
    const { root, file } = await createProjectFile(docsDir, "introduction.mdx");
    await setupPlugin(root, docsDir);

    const moduleById = { id: "\0virtual:prestige/content/introduction" };
    mockServer.moduleGraph.getModuleById.mockImplementation((id: string) => {
      if (id === "\0virtual:prestige/content/introduction") {
        return moduleById;
      }
      return null;
    });

    // @ts-ignore
    await plugin.handleHotUpdate({ file, server: mockServer, modules: [] });

    expect(mockServer.moduleGraph.getModuleById).toHaveBeenCalledWith(
      "\0virtual:prestige/content/introduction",
    );
    expect(mockServer.moduleGraph.getModuleById).toHaveBeenCalledWith(
      "\0virtual:prestige/content-all",
    );
    expect(mockServer.moduleGraph.invalidateModule).toHaveBeenCalledWith(moduleById);
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
