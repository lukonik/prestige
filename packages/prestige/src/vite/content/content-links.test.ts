import { describe, expect, it } from "vitest";
import { SidebarType } from "../core/content/content.types";
import { resolveContentLinks } from "./content-links";

describe("resolveContentLinks", () => {
  it("should extract internal links from a flat sidebar", () => {
    const sidebars = new Map<string, SidebarType>([
      [
        "docs",
        {
          defaultLink: "getting-started",
          items: [
            { slug: "getting-started", label: "Getting Started" },
            { slug: "installation", label: "Installation" },
            { link: "https://example.com", label: "External Link" }, // Should be included
          ],
        },
      ],
    ]);

    const links = resolveContentLinks(sidebars);

    expect(links.get("docs")).toEqual([
      { slug: "getting-started", label: "Getting Started" },
      { slug: "installation", label: "Installation" },
      { link: "https://example.com", label: "External Link" },
    ]);
  });

  it("should extract internal links from a nested sidebar", () => {
    const sidebars = new Map<string, SidebarType>([
      [
        "guides",
        {
          defaultLink: "intro",
          items: [
            { slug: "intro", label: "Introduction" },
            {
              label: "Advanced",
              items: [
                { slug: "advanced/setup", label: "Setup" },
                {
                  label: "Deep Dive",
                  items: [
                    { slug: "advanced/deep-dive/internals", label: "Internals" },
                  ],
                },
                { link: "https://example.com/advanced", label: "Advanced Guide" }, // Should be included
              ],
            },
          ],
        },
      ],
    ]);

    const links = resolveContentLinks(sidebars);

    expect(links.get("guides")).toEqual([
      { slug: "intro", label: "Introduction" },
      { slug: "advanced/setup", label: "Setup" },
      { slug: "advanced/deep-dive/internals", label: "Internals" },
      { link: "https://example.com/advanced", label: "Advanced Guide" },
    ]);
  });

  it("should handle multiple sidebars", () => {
    const sidebars = new Map<string, SidebarType>([
      [
        "docs",
        {
          defaultLink: "getting-started",
          items: [{ slug: "getting-started", label: "Getting Started" }],
        },
      ],
      [
        "api",
        {
          defaultLink: "api-reference",
          items: [{ slug: "api-reference", label: "API Reference" }],
        },
      ],
    ]);

    const links = resolveContentLinks(sidebars);

    expect(links.get("docs")).toEqual([
      { slug: "getting-started", label: "Getting Started" },
    ]);
    expect(links.get("api")).toEqual([
      { slug: "api-reference", label: "API Reference" },
    ]);
  });

  it("should handle an empty sidebar", () => {
    const sidebars = new Map<string, SidebarType>([
      [
        "empty",
        {
          defaultLink: "default",
          items: [],
        },
      ],
    ]);

    const links = resolveContentLinks(sidebars);

    expect(links.get("empty")).toEqual([]);
  });

  it("should handle an empty sidebars map", () => {
    const sidebars = new Map<string, SidebarType>();
    const links = resolveContentLinks(sidebars);
    expect(links.size).toBe(0);
  });
});
