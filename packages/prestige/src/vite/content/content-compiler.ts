import { compile } from "@mdx-js/mdx";
import { Compatible } from "vfile";
import rehypeShiki, { RehypeShikiOptions } from "@shikijs/rehype";
import { PluggableList } from "unified";
import { PrestigeConfig } from "../config/config.types";
import rehypeSlug from "rehype-slug";
import remarkFlexibleToc, { TocItem } from "remark-flexible-toc";

export async function compileMarkdown(
  content: Readonly<Compatible>,
  options?: PrestigeConfig["markdown"],
) {
  const toc: TocItem[] = [];

  const shikiOptions: RehypeShikiOptions = {
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    ...options?.shikiOptions,
  };

  const rehypePlugins: PluggableList = [
    ...(options?.rehypePlugins ?? []),
    [rehypeShiki, shikiOptions],
    rehypeSlug,
  ];

  const remarkPlugins: PluggableList = [
    ...(options?.remarkPlugins ?? []),
    [remarkFlexibleToc, { tocRef: toc }],
  ];

  const code = await compile(content, {
    outputFormat: "program",
    rehypePlugins,
    remarkPlugins,
  });
  return { code: String(code), toc };
}
