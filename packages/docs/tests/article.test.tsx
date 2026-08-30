import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Article } from "../src/article.js";

describe("Article", () => {
  it("renders Markdown inside a semantic article", () => {
    const markup = renderToStaticMarkup(
      <Article
        aria-label="Guide"
        className="docs-prose"
        content={"## Getting started\n\nRead the **guide**."}
        themeCss={false}
      />,
    );

    expect(markup).toContain(
      '<article aria-label="Guide" class="prestigia-article docs-prose">',
    );
    expect(markup).toContain('<h2 id="getting-started">Getting started</h2>');
    expect(markup).toContain("Read the <strong>guide</strong>.");
  });

  it("highlights fenced code and includes the default theme", () => {
    const markup = renderToStaticMarkup(
      <Article content={"```ts\nconst answer: number = 42\n```"} />,
    );

    expect(markup).toContain("data-prestigia-article-theme");
    expect(markup).toContain('<pre class="tm-code" data-lang="ts">');
    expect(markup).toContain('class="th-token th-keyword"');
  });

  it("forwards renderer customization and supports custom highlighting", () => {
    const markup = renderToStaticMarkup(
      <Article
        content={"## Custom\n\n```txt\nplain\n```"}
        highlighter={(code) => `<mark>${code.toUpperCase()}</mark>`}
        markdownOptions={{
          codeLineNumbers: true,
          components: {
            h2: (props) => <h3 data-custom-heading {...props} />,
          },
          headingIds: false,
        }}
        themeCss=".prestigia-article { --custom-theme: 1; }"
      />,
    );

    expect(markup).toContain('<h3 data-custom-heading="true">Custom</h3>');
    expect(markup).toContain("<mark>PLAIN</mark>");
    expect(markup).toContain("--custom-theme: 1");
    expect(markup).toContain("tm-code--line-numbers");
  });

  it("can disable highlighting and theme injection", () => {
    const markup = renderToStaticMarkup(
      <Article
        content={"```unknown\n<unsafe>\n```"}
        highlighter={false}
        themeCss={false}
      />,
    );

    expect(markup).not.toContain("<style");
    expect(markup).toContain("&lt;unsafe&gt;");
  });
});
