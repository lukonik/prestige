import { describe, expect, it } from "vitest";

import { resolvePrestigiaSidebar } from "../src/config.js";

const documents = [
  { _meta: { path: "overview" }, title: "Overview" },
  { _meta: { path: "guides/configuration" }, title: "Configuration" },
  { _meta: { path: "guides/deployment/cloud" }, title: "Cloud" },
  { _meta: { path: "guides/installation" }, title: "Installation" },
];

describe("resolvePrestigiaSidebar", () => {
  it("resolves document labels and configured groups", () => {
    expect(
      resolvePrestigiaSidebar(documents, [
        "overview",
        {
          label: "Guides",
          collapsed: true,
          items: [
            { slug: "guides/installation", label: "Install" },
            { label: "Status", link: "/status" },
          ],
        },
      ]),
    ).toEqual([
      { type: "link", label: "Overview", href: "/docs/overview" },
      {
        type: "group",
        label: "Guides",
        collapsed: true,
        items: [
          {
            type: "link",
            label: "Install",
            href: "/docs/guides/installation",
          },
          { type: "link", label: "Status", href: "/status" },
        ],
      },
    ]);
  });

  it("autogenerates nested directory navigation from documents", () => {
    expect(
      resolvePrestigiaSidebar(documents, [
        {
          label: "Guides",
          autogenerate: { directory: "guides", collapsed: true },
        },
      ]),
    ).toEqual([
      {
        type: "group",
        label: "Guides",
        collapsed: undefined,
        items: [
          {
            type: "link",
            label: "Configuration",
            href: "/docs/guides/configuration",
          },
          {
            type: "group",
            label: "deployment",
            collapsed: true,
            items: [
              {
                type: "link",
                label: "Cloud",
                href: "/docs/guides/deployment/cloud",
              },
            ],
          },
          {
            type: "link",
            label: "Installation",
            href: "/docs/guides/installation",
          },
        ],
      },
    ]);
  });

  it("generates a filesystem-shaped sidebar when config is omitted", () => {
    expect(resolvePrestigiaSidebar(documents)).toHaveLength(2);
  });

  it("rejects configured slugs missing from the content collection", () => {
    expect(() => resolvePrestigiaSidebar(documents, ["missing"])).toThrow(
      "unknown document slug: missing",
    );
  });
});
