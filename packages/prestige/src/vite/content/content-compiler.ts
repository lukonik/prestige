import { compile } from "@mdx-js/mdx";
import { Compatible } from "vfile";
import rehypeShiki from "@shikijs/rehype";

export async function compileMarkdown(content: Readonly<Compatible>) {
  let toc: { depth: number; text: string; id: string }[] = [];

  function rehypeExtractTocAndAddIds() {
    return (tree: any) => {
      let idCounter = 0;
      const visit = (node: any) => {
        if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
          const text = node.children
            .filter((c: any) => c.type === "text")
            .map((c: any) => c.value)
            .join("");

          const id =
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${idCounter++}`;

          node.properties = node.properties || {};
          node.properties.id = id;
          node.properties.className = node.properties.className
            ? `${node.properties.className} scroll-mt-24`
            : "scroll-mt-24";

          toc.push({
            depth: parseInt(node.tagName.charAt(1), 10),
            text,
            id,
          });
        }
        if (node.children) {
          node.children.forEach(visit);
        }
      };

      visit(tree);
    };
  }
  const code = await compile(content, {
    outputFormat: "function-body",
    rehypePlugins: [
      [
        rehypeExtractTocAndAddIds,
        rehypeShiki,
        {
          // or `theme` for a single theme
          themes: {
            light: "vitesse-light",
            dark: "vitesse-dark",
          },
        },
      ],
    ],
  });
  return { code: String(code), toc };
}
