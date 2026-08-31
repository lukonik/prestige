import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Sidebar, mapDocumentsToSidebar } from "../src/sidebar.js";

import type { SidebarItem } from "../src/sidebar.js";

const items = [
  {
    type: "link",
    label: "Overview",
    href: "/docs/overview",
  },
  {
    type: "group",
    label: "Guides",
    items: [
      {
        type: "group",
        label: "Advanced",
        collapsed: true,
        items: [
          {
            type: "link",
            label: "Release workflow",
            href: "/docs/release-workflow",
          },
        ],
      },
    ],
  },
] satisfies ReadonlyArray<SidebarItem>;

describe("Sidebar", () => {
  it("renders recursive link and group items", () => {
    const markup = renderToStaticMarkup(<Sidebar items={items} />);

    expect(markup).toContain('<nav aria-label="Documentation"');
    expect(markup).toContain('data-depth="0"');
    expect(markup).toContain('data-depth="2"');
    expect(markup).toContain("<summary");
    expect(markup).toContain("Guides");
    expect(markup).toContain("Advanced");
    expect(markup).toContain('href="/docs/release-workflow"');
  });

  it("marks the current link and supports custom link rendering", () => {
    const renderLink = vi.fn((item, state) => (
      <span data-current={state.active}>{item.label}</span>
    ));
    const markup = renderToStaticMarkup(
      <Sidebar
        currentHref="/docs/overview"
        items={items}
        renderLink={renderLink}
      />,
    );

    expect(markup).toContain('<span data-current="true">Overview</span>');
    expect(renderLink).toHaveBeenCalledTimes(2);
  });
});

describe("mapDocumentsToSidebar", () => {
  it("maps document summaries to grouped sidebar links", () => {
    const sidebar = mapDocumentsToSidebar(
      [
        {
          _meta: { path: "overview" },
          title: "Overview",
          topic: "package",
        },
        {
          _meta: { path: "agent-skills" },
          title: "Agent skills",
          topic: "skill",
        },
        {
          _meta: { path: "release" },
          title: "Release",
          topic: "package",
        },
      ],
      {
        groupBy: (document) => document.topic,
        groupLabel: (group) => group.toUpperCase(),
      },
    );

    expect(sidebar).toEqual([
      {
        type: "group",
        label: "PACKAGE",
        items: [
          {
            type: "link",
            label: "Overview",
            href: "/docs/overview",
          },
          {
            type: "link",
            label: "Release",
            href: "/docs/release",
          },
        ],
      },
      {
        type: "group",
        label: "SKILL",
        items: [
          {
            type: "link",
            label: "Agent skills",
            href: "/docs/agent-skills",
          },
        ],
      },
    ]);
  });
});
