import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Doc, createDocHead, createDocRoute } from "../src/doc.js";

const document = {
  content: "## Install\n\nRun the command.",
  description: "Learn how to install Prestigia.",
  title: "Getting started",
};

describe("Doc", () => {
  it("renders a complete Markdown documentation page", () => {
    const markup = renderToStaticMarkup(
      <Doc
        articleProps={{ themeCss: false }}
        className="page-shell"
        document={document}
      />,
    );

    expect(markup).toContain('<main class="prestigia-doc page-shell">');
    expect(markup).toContain('<a class="back-link" href="/">');
    expect(markup).toContain('<h1 id="document-title">Getting started</h1>');
    expect(markup).toContain('<h2 id="install">Install</h2>');
  });

  it("allows the surrounding page chrome to be configured", () => {
    const markup = renderToStaticMarkup(
      <Doc
        document={document}
        eyebrow={false}
        indexHref={false}
        articleProps={{ themeCss: false }}
      />,
    );

    expect(markup).not.toContain("back-link");
    expect(markup).not.toContain("eyebrow");
  });
});

describe("createDocHead", () => {
  it("creates title and description metadata", () => {
    expect(createDocHead(document)).toEqual({
      meta: [
        { title: "Getting started · Prestigia" },
        {
          name: "description",
          content: "Learn how to install Prestigia.",
        },
      ],
    });
  });

  it("supports unbranded fallback metadata", () => {
    expect(
      createDocHead(undefined, {
        fallbackTitle: "Guides",
        siteName: false,
      }),
    ).toEqual({ meta: [{ title: "Guides" }] });
  });
});

describe("createDocRoute", () => {
  it("selects a static document by its Content Collections path", () => {
    const routeDocument = {
      ...document,
      _meta: { path: "getting-started" },
    };
    const options = createDocRoute({
      documents: [routeDocument],
      siteName: "Acme",
    });

    expect(options.loader({ params: { slug: "getting-started" } })).toBe(
      routeDocument,
    );
    expect(options.head({ loaderData: routeDocument })).toEqual({
      meta: [
        { title: "Getting started · Acme" },
        {
          name: "description",
          content: "Learn how to install Prestigia.",
        },
      ],
    });
    expect(options).not.toHaveProperty("ssr");
    expect(options.component).toBeTypeOf("function");
  });
});
