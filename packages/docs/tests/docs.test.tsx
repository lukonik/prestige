import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Docs, createDocsRoute } from "../src/docs.js";

import type { SidebarItem } from "../src/sidebar.js";

const sidebar = [
  {
    type: "group",
    label: "Guides",
    items: [
      {
        type: "link",
        label: "Getting started",
        href: "/docs/getting-started",
      },
    ],
  },
] satisfies ReadonlyArray<SidebarItem>;

describe("Docs", () => {
  it("renders the sidebar next to child document content", () => {
    const markup = renderToStaticMarkup(
      <Docs
        className="page-shell"
        currentHref="/docs/getting-started"
        sidebar={sidebar}
      >
        <article>Document content</article>
      </Docs>,
    );

    expect(markup).toContain('<div class="prestigia-docs');
    expect(markup).toContain("page-shell");
    expect(markup).toContain('class="prestigia-docs-sidebar');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("Document content");
  });
});

describe("createDocsRoute", () => {
  it("creates a static parent layout for document routes", () => {
    const options = createDocsRoute({ sidebar });

    expect(options).not.toHaveProperty("ssr");
    expect(options).not.toHaveProperty("loader");
    expect(options.component).toBeTypeOf("function");
  });
});
