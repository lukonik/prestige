import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CONTENT_VIRTUAL_ID,
  resolveSiblings,
  resolveMarkdown,
  resolveContent,
  getPathBySlug,
  getFileBySlug,
  getVirtualModuleIdsForFile,
  getSlugByPath,
} from "./content.store";
import { glob } from "tinyglobby";
import { read } from "to-vfile";
import { compileMarkdown, compileFrontmatter } from "./content-compiler";

vi.mock("tinyglobby", () => ({
  glob: vi.fn(),
}));

vi.mock("to-vfile", () => ({
  read: vi.fn(),
}));

vi.mock("./content-compiler", () => ({
  compileMarkdown: vi.fn(),
  compileFrontmatter: vi.fn(),
}));

describe("content.store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("CONTENT_VIRTUAL_ID", () => {
    it("should be defined correctly", () => {
      expect(CONTENT_VIRTUAL_ID).toBe("virtual:prestige/content/");
    });
  });

  describe("resolveSiblings", () => {
    const linksMap = new Map([
      [
        "docs",
        [
          { slug: "docs/getting-started", label: "Getting Started" },
          { slug: "docs/installation", label: "Installation" },
          { slug: "docs/advanced", label: "Advanced" },
        ],
      ],
      [
        "mixed",
        [
          { slug: "mixed/first", label: "First" },
          { link: "mixed/second", label: "Second" },
          { link: "https://example.com", label: "External" },
          { slug: "mixed/third", label: "Third" },
        ] as any,
      ],
      [
        "empty",
        []
      ]
    ]);

    it("should return undefined if base not found in map", () => {
      const result = resolveSiblings("unknown", "unknown/slug", linksMap);
      expect(result).toEqual({ prev: undefined, next: undefined });
    });

    it("should return undefined if links array is empty", () => {
      const result = resolveSiblings("empty", "empty/slug", linksMap);
      expect(result).toEqual({ prev: undefined, next: undefined });
    });

    it("should return correct next sibling for first item", () => {
      const result = resolveSiblings("docs", "docs/getting-started", linksMap);
      expect(result).toEqual({
        prev: undefined,
        next: { slug: "docs/installation", label: "Installation" },
      });
    });

    it("should return correct prev and next siblings for middle item", () => {
      const result = resolveSiblings("docs", "docs/installation", linksMap);
      expect(result).toEqual({
        prev: { slug: "docs/getting-started", label: "Getting Started" },
        next: { slug: "docs/advanced", label: "Advanced" },
      });
    });

    it("should return correct prev sibling for last item", () => {
      const result = resolveSiblings("docs", "docs/advanced", linksMap);
      expect(result).toEqual({
        prev: { slug: "docs/installation", label: "Installation" },
        next: undefined,
      });
    });

    it("should include internal links and ignore external links in mixed arrays", () => {
      const resultFirst = resolveSiblings("mixed", "mixed/first", linksMap);
      expect(resultFirst).toEqual({
        prev: undefined,
        next: { link: "mixed/second", label: "Second" },
      });

      const resultSecond = resolveSiblings("mixed", "mixed/second", linksMap);
      expect(resultSecond).toEqual({
        prev: { slug: "mixed/first", label: "First" },
        next: { slug: "mixed/third", label: "Third" },
      });

      const resultThird = resolveSiblings("mixed", "mixed/third", linksMap);
      expect(resultThird).toEqual({
        prev: { link: "mixed/second", label: "Second" },
        next: undefined,
      });
    });
  });

  describe("getPathBySlug", () => {
    it("should resolve path using glob", async () => {
      vi.mocked(glob).mockResolvedValue(["/mock/content/docs/intro.md"]);
      
      const result = await getPathBySlug("docs/intro", "/mock/content");
      
      expect(glob).toHaveBeenCalledWith("/mock/content/docs/intro.{md,mdx}");
      expect(result).toBe("/mock/content/docs/intro.md");
    });
  });

  describe("getFileBySlug", () => {
    it("should read file after resolving path", async () => {
      vi.mocked(glob).mockResolvedValue(["/mock/content/docs/intro.md"]);
      const mockVFile = { value: "content" } as any;
      vi.mocked(read).mockResolvedValue(mockVFile);

      const result = await getFileBySlug("docs/intro", "/mock/content");

      expect(glob).toHaveBeenCalledWith("/mock/content/docs/intro.{md,mdx}");
      expect(read).toHaveBeenCalledWith("/mock/content/docs/intro.md");
      expect(result).toBe(mockVFile);
    });
  });

  describe("resolveMarkdown", () => {
    it("should compile markdown and frontmatter", async () => {
      vi.mocked(glob).mockResolvedValue(["/mock/content/docs/intro.md"]);
      const mockVFile = { path: "/mock/content/docs/intro.md" } as any;
      vi.mocked(read).mockResolvedValue(mockVFile);
      
      const mockFrontmatter = { title: "Intro" };
      vi.mocked(compileFrontmatter).mockResolvedValue(mockFrontmatter as any);
      
      const mockCode = "export default function MDX() {}";
      const mockToc = [{ depth: 1, value: "Intro", id: "intro" }];
      vi.mocked(compileMarkdown).mockResolvedValue({ code: mockCode, toc: mockToc } as any);

      const result = await resolveMarkdown("docs/intro", "/mock/content");

      expect(result).toEqual({
        code: mockCode,
        toc: mockToc,
        frontmatter: mockFrontmatter,
      });
      // The pathToFileURL converts absolute paths to file:// URLs, we check it indirectly
      expect(compileMarkdown).toHaveBeenCalledWith(
        mockVFile,
        expect.stringContaining("file://"),
      );
    });
  });

  describe("resolveContent", () => {
    it("should resolve full virtual module content string", async () => {
      // Setup linksMap
      const linksMap = new Map([
        [
          "docs",
          [
            { slug: "docs/getting-started", label: "Getting Started" },
            { slug: "docs/intro", label: "Intro" },
          ],
        ]
      ]);

      // Mock dependencies for resolveMarkdown inside resolveContent
      vi.mocked(glob).mockResolvedValue(["/mock/content/docs/intro.md"]);
      vi.mocked(read).mockResolvedValue({} as any);
      vi.mocked(compileFrontmatter).mockResolvedValue({ title: "Intro" } as any);
      vi.mocked(compileMarkdown).mockResolvedValue({ 
        code: "const code = 'compiled';", 
        toc: [{ depth: 1, value: "Intro", id: "intro" }] 
      } as any);

      const result = await resolveContent(
        `\0${CONTENT_VIRTUAL_ID}docs/intro`,
        linksMap,
        "/mock/content"
      );

      expect(result).toContain("const code = 'compiled';");
      expect(result).toContain("export const toc = [{\"depth\":1,\"value\":\"Intro\",\"id\":\"intro\"}]");
      expect(result).toContain("export const prev = {\"slug\":\"docs/getting-started\",\"label\":\"Getting Started\"}");
      expect(result).toContain("export const next = undefined");
      expect(result).toContain("export const frontmatter = {\"title\":\"Intro\"}");
    });
  });

  describe("getSlugByPath", () => {
    it("should extract slug correctly for nested files", () => {
      const result = getSlugByPath("/mock/content/docs/intro.mdx", "/mock/content");
      // path joins use platform separators. `pathe` might standardize them or we can just replace them
      expect(result.replace(/\\/g, '/')).toBe("docs/intro");
    });

    it("should extract slug correctly for root files", () => {
      const result = getSlugByPath("/mock/content/index.md", "/mock/content");
      expect(result.replace(/\\/g, '/')).toBe("index");
    });
  });

  describe("getVirtualModuleIdsForFile", () => {
    it("should generate proper virtual module IDs", () => {
      const result = getVirtualModuleIdsForFile("/mock/content/docs/intro.md", "/mock/content");
      expect(result[0]?.replace(/\\/g, '/')).toBe(`\0${CONTENT_VIRTUAL_ID}docs/intro`);
    });
  });
});
