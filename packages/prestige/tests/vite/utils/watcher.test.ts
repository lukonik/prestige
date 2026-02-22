import { ViteDevServer } from "vite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { watchConfigChange } from "../../../src/vite/utils/watcher";

describe("watchConfigChange", () => {
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
    watchConfigChange(server, sources);
    expect(server.watcher.add).toHaveBeenCalledWith(sources);
  });

  it("should restart server when config file changes", () => {
    const sources = ["/path/to/config.ts"];
    watchConfigChange(server, sources);

    // Simulate change event
    // Find the callback passed to .on("change", callback)
    const onCalls = (server.watcher.on as any).mock.calls;
    const changeCallback = onCalls.find((call: any[]) => call[0] === "change")?.[1];

    expect(changeCallback).toBeDefined();

    if (changeCallback) {
      changeCallback("/path/to/config.ts");
    }

    expect(server.restart).toHaveBeenCalled();
  });

  it("should not restart server when other file changes", () => {
    const sources = ["/path/to/config.ts"];
    watchConfigChange(server, sources);

    const onCalls = (server.watcher.on as any).mock.calls;
    const changeCallback = onCalls.find((call: any[]) => call[0] === "change")?.[1];

    expect(changeCallback).toBeDefined();

    if (changeCallback) {
      changeCallback("/path/to/other.ts");
    }

    expect(server.restart).not.toHaveBeenCalled();
  });
});
