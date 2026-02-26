import { describe, expect, it, vi } from "vitest";
import { vol } from "memfs";
import { ContentSidebarStore } from "./content-sidebar.store";
import { parseMetadata } from "./content-parser";
import logger from "../../utils/logger";

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
  describe("resolveSidebarLink", () => {
    it("calls resolveLabel and resolveSlug internally", async () => {
      // resolveLabel and resolveSlug are properly tested above,
      // so checking their call is enough here.
      const store = createStore();
      const resolveLabelSpy = vi.spyOn(store, "resolveLabel").mockResolvedValueOnce("mocked-label");
      const resolveSlugSpy = vi.spyOn(store, "resolveSlug").mockReturnValueOnce("mocked-slug");

      const result = await store.resolveSidebarLink("docs/info");

      expect(resolveLabelSpy).toHaveBeenCalledWith("docs/info");
      expect(resolveSlugSpy).toHaveBeenCalledWith("docs/info");
      expect(result).toEqual({ label: "mocked-label", slug: "mocked-slug" });
    });
  });
  describe("autogenerateSidebar", async () => {
    it("returns empty array if dir doesn't exist", async () => {
      await expect(createStore().autogenerateSidebar("/docs/info")).resolves.toEqual([]);
    });
    it("logs warning if dir doesn't exist", async () => {
      await createStore().autogenerateSidebar("/docs/info");
      expect(logger.warn).toHaveBeenCalledWith("Directory doesn't exist: /docs/info");
    });
    it("returns link array if the directory is flat and only contains files", () => {
      const json = {
        "./docs/info.md": "# This is info page",
        "./docs/about.md": "# This is about page",
      };
      vol.fromJSON(json, "/app");
      const store = createStore("/app");
      expect(store.autogenerateSidebar("docs")).resolves.toEqual([
        { label: "about", slug: "docs/about" },
        { label: "info", slug: "docs/info" },
      ]);
    });
    it("returns empty array with empty items if the directory is nested but no files in it", async () => {
      vol.mkdirSync("/app/docs", { recursive: true });
      vol.mkdirSync("/app/src/components", { recursive: true });

      const store = createStore("/app");
      expect(store.autogenerateSidebar("docs")).resolves.toEqual([]);
      expect(store.autogenerateSidebar("src/components")).resolves.toEqual([]);
    });
    it("returns group array if the directory is nested and contains files", async () => {
      const json = {
        "./docs/main/info.md": "# This is info page",
        "./docs/partial/about.md": "# This is about page",
      };
      vol.fromJSON(json, "/app");
      const store = createStore("/app");
      expect(store.autogenerateSidebar("docs")).resolves.toEqual([
        { label: "main", items: [{ label: "info", slug: "docs/main/info" }] },
        {
          label: "partial",
          items: [{ label: "about", slug: "docs/partial/about" }],
        },
      ]);
    });
    it("returns mixed array if the directory is nested and contains files", async () => {
      const json = {
        "./docs/main/info.md": "# This is info page",
        "./docs/partial/about.md": "# This is about page",
        "./docs/installation.md": "# Installation step",
      };
      vol.fromJSON(json, "/app");
      const store = createStore("/app");
      expect(store.autogenerateSidebar("docs")).resolves.toEqual([
        { label: "installation", slug: "docs/installation" },
        { label: "main", items: [{ label: "info", slug: "docs/main/info" }] },
        {
          label: "partial",
          items: [{ label: "about", slug: "docs/partial/about" }],
        },
      ]);
    });
    it("returns sorted array", () => {
      const json = {
        "./docs/main/info.md": "# This is info page",
        "./docs/main/about.md": "# this is about page",
        "./docs/before/stats.md": "# This is stats page",
        "./docs/abc.md": "#this is abc file",
      };
      vol.fromJSON(json, "/app");
      const store = createStore("/app");
      expect(store.autogenerateSidebar("docs")).resolves.toEqual([
        { label: "abc", slug: "docs/abc" },
        {
          label: "before",
          items: [{ label: "stats", slug: "docs/before/stats" }],
        },
        {
          label: "main",
          items: [
            { label: "about", slug: "docs/main/about" },
            { label: "info", slug: "docs/main/info" },
          ],
        },
      ]);
    });
  });
});
