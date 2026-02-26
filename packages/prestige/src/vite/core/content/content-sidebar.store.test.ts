import { describe, expect, it, vi } from "vitest";
import { vol } from "memfs";
import { ContentSidebarStore } from "./content-sidebar.store";
import { parseMetadata } from "./content-parser";

vi.mock("./content-parser");

function createStore(contentDir?: string) {
  return new ContentSidebarStore(contentDir ?? "");
}

describe("ContentSidebarStore", () => {
  describe("resolveLabel", () => {
    it("returns label if it is defined", async () => {
      const store = createStore();
      expect(await store.resolveLabel({ label: "Test Label" })).toBe("Test Label");
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
    it("returns label if it doesn't have label and is string", async () => {
      vi.mocked(parseMetadata).mockResolvedValueOnce(null);
      const json = {
        "./docs/info.md": "# This is info page",
      };
      vol.fromJSON(json, "/app");
      const store = createStore("/app");
      const label = await store.resolveLabel("docs/info");
      expect(label).toBe("info");
    });
    it("returns label if it doesn't have label but have label in metadata", async () => {
      vi.mocked(parseMetadata).mockResolvedValueOnce({
        label: "Metadata Label",
      } as any);
      const json = {
        "./docs/meta-info.md": "---\nlabel: Metadata Label\n---\n# This is info page",
      };
      vol.fromJSON(json, "/app");
      const store = createStore("/app");
      const label = await store.resolveLabel("docs/meta-info");
      expect(label).toBe("Metadata Label");
    });
    it("returns file name if it reads from metadata but there is no label", async () => {
      vi.mocked(parseMetadata).mockResolvedValueOnce({} as any);
      const json = {
        "./docs/meta-info.md": "---\nlabel: Metadata Label\n---\n# This is info page",
      };
      vol.fromJSON(json, "/app");
      const store = createStore("/app");
      const label = await store.resolveLabel("docs/meta-info");
      expect(label).toBe("meta-info");
    });
  });
  describe("resolveSlug", () => {
    it("returns slug if it is string", () => {
      const store = createStore();
      expect(store.resolveSlug("docs/info")).toBe("docs/info");
    });
    it("returns slug if it is link", () => {
      const store = createStore();
      expect(store.resolveSlug({ slug: "docs/info", label: "info" })).toBe("docs/info");
    });
    it("returns empty for everything else", () => {
      const store = createStore();
      expect(store.resolveSlug({} as any)).toBe("");
    });
  });
});
