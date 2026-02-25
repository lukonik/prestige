import { describe, expect, it, vi } from "vitest";
import { fs, vol } from "memfs";
import path from "node:path";
import { ContentSidebarStore } from "../../../../src/vite/core/content/content-sidebar.store";

vi.mock("fs-extra", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs-extra")>();
  return {
    ...actual,
    outputFile: async (file: string, data: any) => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, data);
    },
  };
});

function createStore(contentDir?: string) {
  return new ContentSidebarStore(contentDir ?? "");
}

describe("ContentSidebarStore", () => {
  describe("resolveLabel", () => {
    it("returns label if it is defined", async () => {
      const store = createStore();
      expect(await store.resolveLabel({ label: "Test Label" })).toBe(
        "Test Label",
      );
    });
    it("returns label if it is group with items", async () => {
      const store = createStore();
      const label = await store.resolveLabel({
        label: "Test Label",
        items: [
          {
            label: "child",
            slug: "child",
          },
        ],
      });
      expect(label).toBe("Test Label");
    });
    it("returns label if it is group with autogenerate", async () => {
      const store = createStore();
      const label = await store.resolveLabel({
        label: "Test Label",
        autogenerate: { directory: "docs" },
      });
      expect(label).toBe("Test Label");
    });
    it.only("returns label if it is string", async () => {
      const path = "/docs/info";
      vol.mkdirSync(path, { recursive: true });
      vol.writeFileSync(path + ".md", "# This is info page");
      const store = createStore("/docs");
      const label = await store.resolveLabel("info");
      expect(label).toBe("info");
    });
  });
});
