import { describe, expect, it } from "vitest";
import { ContentCollectionStore } from "../../../../src/vite/core/content/content-collection.store";

function createStore() {
  return new ContentCollectionStore();
}

describe("ContentCollectionStore", () => {
  describe("resolve", () => {
    it("returns virtualId on known id", () => {
      const store = createStore();
      expect(store.resolve("virtual:content-collection/all")).toBe(
        "\0virtual:content-collection/all",
      );
    });
    it("returns null on unknown id", () => {
      const store = createStore();
      expect(store.resolve("unknown")).toBe(null);
    });
  });
  describe("load", () => {
    it("returns null on unknown id", () => {
      const store = createStore();
      expect(store.load("unknown_import")).toBe(null);
    });
    it("returns empty object on empty collection", () => {
      const store = createStore();
      expect(() => store.load("\0virtual:content-collection/all")).toThrowError(
        /No collections found, add one in prestige plugin config/,
      );
    });
    it("returns object with collections", () => {
      const store = createStore();
      const collection = {
        id: "docs",
        items: [
          {
            label: "Get Started",
            items: [
              {
                label: "Introduction",
                slug: "docs/get-started/introduction",
              },
            ],
          },
          {
            label: "Theory",
            slug: "docs/theory",
          },
        ],
      };
      store.init([collection]);
      const result = store.load("\0virtual:content-collection/all");
      const expectedString = `export default {
  docs: {
    id: "docs",
    items: [
      {
        label: "Get Started",
        items: [
          {
            label: "Introduction",
            slug: "docs/get-started/introduction"
          }
        ]
      },
      {
        label: "Theory",
        slug: "docs/theory"
      }
    ]
  }
};`;
      expect(result).toContain(expectedString);
    });
  });
});
