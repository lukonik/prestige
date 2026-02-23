import { ViteDevServer } from "vite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { join } from "pathe";
import {
  watchConfigChange,
  watchFiles,
  watchMarkdownChange,
} from "../../../src/vite/utils/watcher";

describe("watchFiles", () => {
  let server: ViteDevServer;

  beforeEach(() => {
    // Basic mock of ViteDevServer
    server = {
      watcher: {
        add: vi.fn(),
        on: vi.fn(),
      },
      restart: vi.fn(),
    } as unknown as ViteDevServer;
  });

  it("should add sources to watcher", () => {
    const sources = ["/path/to/config.ts"];
    watchFiles(server, sources, () => {});
    expect(server.watcher.add).toHaveBeenCalledWith(sources);
  });

  it("should not restart server when other file changes", () => {
    const sources = ["/path/to/config.ts"];
    watchFiles(server, sources, () => {});

    const onCalls = (server.watcher.on as any).mock.calls;
    const changeCallback = onCalls.find((call: any[]) => call[0] === "change")?.[1];

    expect(changeCallback).toBeDefined();

    if (changeCallback) {
      changeCallback("/path/to/other.ts");
    }

    expect(server.restart).not.toHaveBeenCalled();
  });

  it("should call callback when config file changes", () => {
    const sources = ["/path/to/config.ts"];
    const callback = vi.fn();
    watchFiles(server, sources, callback);

    const onCalls = (server.watcher.on as any).mock.calls;
    const changeCallback = onCalls.find((call: any[]) => call[0] === "change")?.[1];

    expect(changeCallback).toBeDefined();

    if (changeCallback) {
      changeCallback("/path/to/config.ts");
    }

    expect(callback).toHaveBeenCalledWith("/path/to/config.ts");
  });
});

describe("watchConfigChange", () => {
  let server: ViteDevServer;

  beforeEach(() => {
    server = {
      watcher: {
        add: vi.fn(),
        on: vi.fn(),
      },
      restart: vi.fn(),
    } as unknown as ViteDevServer;
  });

  it("should add sources to watcher", () => {
    const sources = ["/path/to/config.ts"];
    watchConfigChange(server, sources);
    expect(server.watcher.add).toHaveBeenCalledWith(sources);
  });
});

describe("watchMarkdownChange", () => {
  let server: ViteDevServer;

  beforeEach(() => {
    server = {
      watcher: {
        add: vi.fn(),
        on: vi.fn(),
      },
      restart: vi.fn(),
    } as unknown as ViteDevServer;
  });

  it("should add markdown files to watcher", async () => {
    const dir = "/path/to/docs";
    await watchMarkdownChange(server, dir);
    expect(server.watcher.add).toHaveBeenCalledWith(join(dir, "**/*.md"));
  });
});
