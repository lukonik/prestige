import { describe, expect, it, vi } from "vitest";
import { DirectoryJSON, vol } from "memfs";
import { ContentSidebarStore } from "./content-sidebar.store";
import { parseMetadata } from "./content-parser";
import logger from "../../utils/logger";
import { CollectionItem } from "./content.types";
import { genExportUndefined } from "../../utils/code-generation";

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
    function createDirWithStore(json: DirectoryJSON) {
      vol.fromJSON(json, "/app");
      const store = createStore("/app");
      return store;
    }
    it("returns empty array if dir doesn't exist", async () => {
      await expect(createStore().autogenerateSidebar("/docs/info")).resolves.toEqual([]);
    });
    it("logs warning if dir doesn't exist", async () => {
      await createStore().autogenerateSidebar("/docs/info");
      expect(logger.warn).toHaveBeenCalledWith("Directory doesn't exist: /docs/info");
    });
    it("returns link array if the directory is flat and only contains files", async () => {
      const json = {
        "./docs/info.md": "# This is info page",
        "./docs/about.md": "# This is about page",
      };
      const store = createDirWithStore(json);
      await expect(store.autogenerateSidebar("docs")).resolves.toEqual([
        { label: "about", slug: "docs/about" },
        { label: "info", slug: "docs/info" },
      ]);
    });
    it("returns empty array with empty items if the directory is nested but no files in it", async () => {
      vol.mkdirSync("/app/docs", { recursive: true });
      vol.mkdirSync("/app/src/components", { recursive: true });

      const store = createStore("/app");
      await expect(store.autogenerateSidebar("docs")).resolves.toEqual([]);
      await expect(store.autogenerateSidebar("src/components")).resolves.toEqual([]);
    });
    it("returns group array if the directory is nested and contains files", async () => {
      const json = {
        "./docs/main/info.md": "# This is info page",
        "./docs/partial/about.md": "# This is about page",
      };
      const store = createDirWithStore(json);
      await expect(store.autogenerateSidebar("docs")).resolves.toEqual([
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
      const store = createDirWithStore(json);
      await expect(store.autogenerateSidebar("docs")).resolves.toEqual([
        { label: "installation", slug: "docs/installation" },
        { label: "main", items: [{ label: "info", slug: "docs/main/info" }] },
        {
          label: "partial",
          items: [{ label: "about", slug: "docs/partial/about" }],
        },
      ]);
    });
    it("returns sorted array", async () => {
      const json = {
        "./docs/main/info.md": "# This is info page",
        "./docs/main/about.md": "# this is about page",
        "./docs/before/stats.md": "# This is stats page",
        "./docs/abc.md": "#this is abc file",
      };
      const store = createDirWithStore(json);
      await expect(store.autogenerateSidebar("docs")).resolves.toEqual([
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

  describe("resolveSidebarGroup", () => {
    it("returns label in response", async () => {
      const response = await createStore().resolveSidebarGroup({
        label: "Test Label",
      });
      expect(response).toEqual({
        label: "Test Label",
        items: [],
      });
    });
    it("returns collapsible in response", async () => {
      const response = await createStore().resolveSidebarGroup({
        label: "Test Label",
        collapsible: true,
      });
      expect(response).toEqual({
        label: "Test Label",
        items: [],
        collapsible: true,
      });
    });
    it("returns items as empty array even if collection doesn't have one", async () => {
      const response = await createStore().resolveSidebarGroup({} as any);
      expect(response).toEqual({
        label: "",
        collapsible: undefined,
        items: [],
      });
    });
    it("returns items similar to collection items", async () => {
      const items: CollectionItem[] = [
        {
          label: "docs",
          items: [
            {
              label: "info",
              slug: "docs/info",
            },
          ],
        },
        {
          label: "api",
          items: [
            {
              label: "index",
              slug: "api/index",
            },
          ],
        },
        { label: "llm", slug: "llm" },
      ];
      const response = await createStore().resolveSidebarGroup({
        label: "DOCS",
        items: items,
      });
      expect(response.items).toEqual(items);
    });
    it("log warning if items and autogenerate are both declare", async () => {
      await createStore().resolveSidebarGroup({
        label: "DOCS",
        items: [
          {
            label: "docs",
            slug: "docs/info",
          },
        ],
        autogenerate: { directory: "docs" },
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "DOCS has both items and autogenerate. Only items will be used.",
      );
    });
    it("returns only items if both items and autogenerate are declared", async () => {
      const store = createStore();
      const autogenerateSpy = vi
        .spyOn(store, "autogenerateSidebar")
        .mockResolvedValue([{ label: "autogenerated", slug: "docs/autogenerated" }]);
      const response = await store.resolveSidebarGroup({
        label: "DOCS",
        items: [
          {
            label: "docs",
            slug: "docs/info",
          },
        ],
        autogenerate: { directory: "apps/info" },
      });
      expect(response.items).toEqual([
        {
          label: "docs",
          slug: "docs/info",
        },
      ]);
      expect(autogenerateSpy).not.toHaveBeenCalled();
    });
  });

  describe("processItem", () => {
    async function createStoreWithMockedProcessItem(mockReturnValue: any, processValue: any) {
      const store = createStore();
      const resolveSidebarLinkSpy = vi
        .spyOn(store, "resolveSidebarLink")
        .mockResolvedValueOnce(mockReturnValue);
      const resolveSidebarGroupSpy = vi
        .spyOn(store, "resolveSidebarGroup")
        .mockResolvedValueOnce(mockReturnValue);

      await expect(store.processItem(processValue)).resolves.toEqual(mockReturnValue);
      return [resolveSidebarLinkSpy, resolveSidebarGroupSpy];
    }
    it("calls resolveSidebarLink when string is passed", async () => {
      const [resolveSidebarLinkSpy] = await createStoreWithMockedProcessItem(
        {
          label: "mocked-label",
          slug: "mocked-slug",
        },
        "docs/info",
      );
      expect(resolveSidebarLinkSpy).toHaveBeenCalledWith("docs/info");
    });
    it("calls resolveSidebarLink when link object is passed", async () => {
      const [resolveSidebarLinkSpy] = await createStoreWithMockedProcessItem(
        {
          label: "mocked-label",
          slug: "mocked-slug",
        },
        { label: "mocked-label", slug: "mocked-slug" },
      );
      expect(resolveSidebarLinkSpy).toHaveBeenCalledWith({
        label: "mocked-label",
        slug: "mocked-slug",
      });
    });
    it("calls resolveSidebarGroup when group object is passed", async () => {
      const [_, resolveSidebarGroupSpy] = await createStoreWithMockedProcessItem(
        { label: "mocked-label", items: [] },
        { label: "mocked-label", items: [] },
      );
      expect(resolveSidebarGroupSpy).toHaveBeenCalledWith({
        label: "mocked-label",
        items: [],
      });
    });
  });

  describe("init", () => {
    it("processes all collections and sets them in the store", async () => {
      const store = createStore();
      const processCollectionSpy = vi
        .spyOn(store, "processCollection")
        .mockImplementation(async (collection: any) => ({
          items: [
            {
              label: `Processed ${collection.id}`,
              slug: `slug-${collection.id}`,
            },
          ],
        }));

      const collections = [
        { id: "col1", items: [] },
        { id: "col2", items: [] },
      ];

      await store.init(collections as any);

      expect(processCollectionSpy).toHaveBeenCalledTimes(2);
      expect(processCollectionSpy).toHaveBeenNthCalledWith(1, collections[0]);
      expect(processCollectionSpy).toHaveBeenNthCalledWith(2, collections[1]);

      expect((store as any)._store.get("col1")).toEqual({
        items: [{ label: "Processed col1", slug: "slug-col1" }],
      });
      expect((store as any)._store.get("col2")).toEqual({
        items: [{ label: "Processed col2", slug: "slug-col2" }],
      });
    });
  });

  describe("processCollection", () => {
    it("returns empty items array if collection has no items", async () => {
      const store = createStore();
      const result = await store.processCollection({ id: "test", items: [] });
      expect(result).toEqual({ items: [] });
    });

    it("processes all items in the collection", async () => {
      const store = createStore();
      const processItemSpy = vi
        .spyOn(store, "processItem")
        .mockImplementation(async (item: any) => ({
          label: `Processed ${item}`,
          slug: `slug-${item}`,
        }));

      const collection = {
        id: "test",
        items: ["item1", "item2"],
      };

      const result = await store.processCollection(collection as any);

      expect(processItemSpy).toHaveBeenCalledTimes(2);
      expect(processItemSpy).toHaveBeenNthCalledWith(1, "item1");
      expect(processItemSpy).toHaveBeenNthCalledWith(2, "item2");
      expect(result).toEqual({
        items: [
          { label: "Processed item1", slug: "slug-item1" },
          { label: "Processed item2", slug: "slug-item2" },
        ],
      });
    });
  });

  describe("resolve", () => {
    it("returns virtualId on known id", () => {
      const store = createStore();
      expect(store.resolve("virtual:prestige/sidebar/docs")).toBe(
        "\0virtual:prestige/sidebar/docs",
      );
    });
    it("returns null on unknown id", () => {
      const store = createStore();
      expect(store.resolve("unknown")).toBe(null);
    });
  });
  describe("load", () => {
    it("returns null for unknown id", () => {
      const store = createStore();
      expect(store.load("unknown")).toBe(null);
    });
    it("returns undefined export if there was no id suffix", () => {
      const store = createStore();
      expect(store.load("\0" + "virtual:prestige/sidebar/")).toBe(genExportUndefined());
    });
    it("returns undefined export if there was no sidebar", () => {
      const store = createStore();
      expect(store.load("\0" + "virtual:prestige/sidebar/docs")).toBe(genExportUndefined());
    });
    it("returns sidebar on correct key", async () => {
      const store = createStore();
      await store.init([
        {
          id: "app",
          items: [
            {
              label: "docs",
              slug: "docs/info",
            },
          ],
        },
      ]);
      expect(store.load("\0" + "virtual:prestige/sidebar/app")).toMatchInlineSnapshot(`
        "export default {
          items: [
            {
              label: "docs",
              slug: "docs/info"
            }
          ]
        };"
      `);
    });
  });
});
