import { compile } from "@mdx-js/mdx";
import { Compatible } from "vfile";
import rehypeShiki, { RehypeShikiOptions } from "@shikijs/rehype";
import { PluggableList } from "unified";
import { PrestigeConfig } from "../config/config.types";

export async function compileMarkdown(
  content: Readonly<Compatible>,
  options?: PrestigeConfig["markdown"],
) {
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

  const shikiOptions: RehypeShikiOptions = {
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    ...options?.shikiOptions,
  };

  const rehypePlugins: PluggableList = [
    ...(options?.rehypePlugins ?? []),
    rehypeExtractTocAndAddIds,
    [rehypeShiki, shikiOptions],
  ];

  const remarkPlugins: PluggableList = [...(options?.remarkPlugins ?? [])];

  const code = await compile(content, {
    outputFormat: "function-body",
    rehypePlugins,
    remarkPlugins,
  });
  return { code: String(code), toc };
}
