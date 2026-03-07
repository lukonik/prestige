import { it, describe, expect, vi, beforeEach } from "vitest";
import { resolveLink, resolveSlug, resolveSidebars, SIDEBAR_VIRTUAL_ID } from "./content-sidebar.store";
import { getFileBySlug } from "../core/content/content.store";
import { compileFrontmatter } from "./content-compiler";
import { pathExists } from "../utils/file-utils";
import { readdir } from "node:fs/promises";
import { PrestigeError } from "../utils/errors";
import { Collections } from "../core/content/content.types";
import logger from "../utils/logger";

vi.mock("../core/content/content.store", () => ({
  getFileBySlug: vi.fn(),
}));

vi.mock("./content-compiler", () => ({
  compileFrontmatter: vi.fn(),
}));

vi.mock("../utils/file-utils", () => ({
  pathExists: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  readdir: vi.fn(),
}));

vi.mock("../utils/logger", () => ({
  default: {
    warn: vi.fn(),
  },
}));

describe("resolveLink", () => {
  it("should return link when specified", () => {
    expect(resolveLink({ link: "/test", label: "test" })).toBe("/test");
  });
  it("should return empty string when no link is specified", () => {
    expect(resolveLink({ label: "test" } as any)).toBe("");
  });
});

describe("resolveSlug", () => {
  it("should return slug when string is passed", () => {
    expect(resolveSlug("test")).toBe("test");
  });
  it("should return slug when object with slug is passed", () => {
    expect(resolveSlug({ slug: "test", label: "test" })).toBe("test");
  });
  it("should return empty when slug is not specified", () => {
    expect(resolveSlug({ label: "test" } as any)).toBe("");
  });
});

describe("resolveSidebars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const contentDir = "/content";

  it("should resolve a simple internal collection link", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          { slug: "getting-started", label: "Getting Started" }
        ],
        defaultLink: "getting-started"
      }
    ];

    const store = await resolveSidebars(collections, contentDir);
    expect(store.get("docs")).toEqual({
      items: [
        { label: "Getting Started", slug: "getting-started" }
      ],
      defaultLink: "getting-started"
    });
  });

  it("should resolve internal collection link via string", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          "getting-started"
        ]
      }
    ];

    vi.mocked(getFileBySlug).mockResolvedValue("file content" as any);
    vi.mocked(compileFrontmatter).mockResolvedValue({ label: "Getting Started" } as any);

    const store = await resolveSidebars(collections, contentDir);
    expect(store.get("docs")).toEqual({
      items: [
        { label: "Getting Started", slug: "getting-started" }
      ],
      defaultLink: "getting-started"
    });
  });

  it("should throw if slug starts or ends with slash", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          { slug: "/getting-started", label: "Getting Started" }
        ]
      }
    ];
    await expect(resolveSidebars(collections, contentDir)).rejects.toThrow(PrestigeError);
    await expect(resolveSidebars(collections, contentDir)).rejects.toThrow("The slug /getting-started cannot start or end with a slash");
  });

  it("should throw if slug is empty", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          { slug: "", label: "Empty" }
        ]
      }
    ];
    await expect(resolveSidebars(collections, contentDir)).rejects.toThrow(PrestigeError);
  });

  it("should fallback to basename if no label is found in frontmatter", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          "some/path/getting-started"
        ]
      }
    ];

    vi.mocked(getFileBySlug).mockResolvedValue("file content" as any);
    vi.mocked(compileFrontmatter).mockResolvedValue({} as any); // no label

    const store = await resolveSidebars(collections, contentDir);
    expect(store.get("docs")).toEqual({
      items: [
        { label: "getting-started", slug: "some/path/getting-started" }
      ],
      defaultLink: "some/path/getting-started"
    });
  });

  it("should throw if markdown file not found for string link without label", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          "not-found"
        ]
      }
    ];

    vi.mocked(getFileBySlug).mockResolvedValue(null);

    await expect(resolveSidebars(collections, contentDir)).rejects.toThrow(PrestigeError);
  });

  it("should resolve a generic sidebar link", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          { link: "https://example.com", label: "Example" }
        ]
      }
    ];

    const store = await resolveSidebars(collections, contentDir);
    expect(store.get("docs")).toEqual({
      items: [
        { label: "Example", link: "https://example.com" }
      ],
      defaultLink: "https://example.com"
    });
  });

  it("should throw if generic link is empty", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          { link: "", label: "Empty" }
        ]
      }
    ];

    await expect(resolveSidebars(collections, contentDir)).rejects.toThrow(PrestigeError);
  });

  it("should resolve a sidebar group", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          {
            label: "Group 1",
            collapsible: true,
            items: [
              { slug: "child", label: "Child" }
            ]
          }
        ]
      }
    ];

    const store = await resolveSidebars(collections, contentDir);
    expect(store.get("docs")).toEqual({
      items: [
        {
          label: "Group 1",
          collapsible: true,
          items: [
            { slug: "child", label: "Child" }
          ]
        }
      ],
      defaultLink: "child"
    });
  });

  it("should autogenerate a sidebar group", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          {
            label: "Autogen Group",
            autogenerate: { directory: "auto-dir" }
          }
        ]
      }
    ];

    vi.mocked(pathExists).mockResolvedValue(true);
    vi.mocked(readdir).mockImplementation(async (path) => {
      if (path.toString().includes("subdir")) {
        return [];
      }
      return [
        { name: "a-file1.md", isFile: () => true, isDirectory: () => false },
        { name: "b-subdir", isFile: () => false, isDirectory: () => true },
        { name: "c-file2.mdx", isFile: () => true, isDirectory: () => false },
        { name: "ignore.txt", isFile: () => true, isDirectory: () => false }
      ] as any;
    });

    vi.mocked(getFileBySlug).mockResolvedValue("content" as any);
    vi.mocked(compileFrontmatter).mockResolvedValue({}); // will fallback to basename

    const store = await resolveSidebars(collections, contentDir);
    expect(store.get("docs")).toEqual({
      items: [
        {
          label: "Autogen Group",
          collapsible: undefined,
          items: [
            { label: "a-file1", slug: "auto-dir/a-file1" },
            { 
              label: "b-subdir", 
              collapsible: undefined,
              items: []
            },
            { label: "c-file2", slug: "auto-dir/c-file2" }
          ]
        }
      ],
      defaultLink: "auto-dir/a-file1"
    });
  });

  it("should handle autogenerate when directory doesn't exist", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          {
            label: "Autogen Group",
            autogenerate: { directory: "missing-dir" }
          }
        ],
        defaultLink: "fallback"
      }
    ];

    vi.mocked(pathExists).mockResolvedValue(false);

    const store = await resolveSidebars(collections, contentDir);
    expect(store.get("docs")).toEqual({
      items: [
        {
          label: "Autogen Group",
          collapsible: undefined,
          items: []
        }
      ],
      defaultLink: "fallback"
    });
    expect(logger.warn).toHaveBeenCalledWith("Directory doesn't exist: missing-dir");
  });

  it("should warn if group has both items and autogenerate, and prioritize items", async () => {
    const collections: Collections = [
      {
        id: "docs",
        items: [
          {
            label: "Mixed Group",
            items: [{ slug: "explicit", label: "Explicit" }],
            autogenerate: { directory: "auto-dir" }
          }
        ]
      }
    ];

    const store = await resolveSidebars(collections, contentDir);
    expect(logger.warn).toHaveBeenCalledWith("Mixed Group has both items and autogenerate. Only items will be used.");
    expect(store.get("docs")).toEqual({
      items: [
        {
          label: "Mixed Group",
          collapsible: undefined,
          items: [{ slug: "explicit", label: "Explicit" }]
        }
      ],
      defaultLink: "explicit"
    });
  });

  it("should throw if no default link is found in collection", async () => {
    const collections: Collections = [
      {
        id: "empty",
        items: []
      }
    ];

    await expect(resolveSidebars(collections, contentDir)).rejects.toThrow(PrestigeError);
  });

  it("should export SIDEBAR_VIRTUAL_ID", () => {
    expect(SIDEBAR_VIRTUAL_ID).toBe("virtual:prestige/sidebar/");
  });
});
